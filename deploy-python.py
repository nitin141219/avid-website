#!/usr/bin/env python3
"""
AVID Application Deployment Script
Uses paramiko for reliable SFTP deployment to Hostinger
"""

import os
import sys
import getpass
from pathlib import Path
import argparse

try:
    import paramiko
    from paramiko import SSHClient, SFTP_OK, sftp_client
except ImportError:
    print("❌ paramiko not installed. Installing...")
    os.system(f"{sys.executable} -m pip install paramiko --quiet")
    import paramiko
    from paramiko import SSHClient, SFTP_OK, sftp_client


class AVIDDeployer:
    def __init__(self, host, port, username, password):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.ssh_client = None
        self.sftp_client = None
        
    def connect(self):
        """Establish SSH connection"""
        print(f"🔌 Connecting to {self.host}:{self.port}...")
        self.ssh_client = SSHClient()
        self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        try:
            self.ssh_client.connect(
                hostname=self.host,
                port=self.port,
                username=self.username,
                password=self.password,
                timeout=10,
                look_for_keys=False,
                allow_agent=False
            )
            print("✅ SSH connection established")
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            sys.exit(1)
    
    def get_sftp(self):
        """Get SFTP client"""
        if not self.sftp_client:
            try:
                self.sftp_client = self.ssh_client.open_sftp()
                print("✅ SFTP session started")
            except Exception as e:
                print(f"❌ SFTP connection failed: {e}")
                sys.exit(1)
        return self.sftp_client
    
    def mkdir_recursive(self, remote_path):
        """Create directory and parents recursively"""
        sftp = self.get_sftp()
        try:
            sftp.stat(remote_path)
        except IOError:
            # Directory doesn't exist, create it
            parent = str(Path(remote_path).parent)
            if parent != remote_path:
                self.mkdir_recursive(parent)
            try:
                sftp.mkdir(remote_path)
            except IOError:
                pass  # Directory might exist from another process
    
    def upload_file(self, local_path, remote_path):
        """Upload a single file"""
        sftp = self.get_sftp()
        try:
            remote_dir = str(Path(remote_path).parent)
            self.mkdir_recursive(remote_dir)
            sftp.put(local_path, remote_path)
            size = os.path.getsize(local_path) / 1024 / 1024
            print(f"  ✓ {remote_path} ({size:.2f} MB)")
            return True
        except Exception as e:
            print(f"  ❌ Failed to upload {remote_path}: {e}")
            return False
    
    def upload_directory(self, local_dir, remote_dir, exclude_patterns=None):
        """Upload a directory recursively"""
        if exclude_patterns is None:
            exclude_patterns = ['node_modules', '.git', '.next/dev']
        
        sftp = self.get_sftp()
        self.mkdir_recursive(remote_dir)
        
        for root, dirs, files in os.walk(local_dir):
            # Filter directories
            dirs[:] = [d for d in dirs if not any(p in d for p in exclude_patterns)]
            
            for file in files:
                # Skip excluded patterns
                if any(p in root for p in exclude_patterns):
                    continue
                
                local_path = os.path.join(root, file)
                rel_path = os.path.relpath(local_path, local_dir)
                remote_path = remote_dir + '/' + rel_path.replace(os.sep, '/')
                
                try:
                    remote_file_dir = str(Path(remote_path).parent)
                    self.mkdir_recursive(remote_file_dir)
                    sftp.put(local_path, remote_path)
                    print(f"  ✓ {rel_path}")
                except Exception as e:
                    print(f"  ❌ {rel_path}: {e}")
    
    def execute_command(self, command):
        """Execute command on remote server"""
        try:
            stdin, stdout, stderr = self.ssh_client.exec_command(command)
            output = stdout.read().decode('utf-8')
            error = stderr.read().decode('utf-8')
            return output, error, stdout.channel.recv_exit_status()
        except Exception as e:
            print(f"❌ Command execution failed: {e}")
            return None, str(e), 1
    
    def deploy(self, local_root):
        """Execute full deployment"""
        print("\n" + "="*50)
        print("AVID Application Deployment")
        print("="*50 + "\n")
        
        # Verify build exists
        next_path = os.path.join(local_root, '.next')
        if not os.path.exists(next_path):
            print("❌ .next folder not found. Run 'npm run build' first")
            sys.exit(1)
        
        self.connect()
        
        remote_base = f"/home/{self.username}/domains/avidorganics.net/public_html"
        
        print(f"\n📤 Uploading to {remote_base}...\n")
        
        # Create base directory
        self.mkdir_recursive(remote_base)

        # Clean previous build to avoid stale artifacts
        print("🧹 Cleaning previous .next build...")
        self.execute_command(f"rm -rf {remote_base}/.next")
        
        # Upload .next directory
        print("📁 Uploading Next.js build...")
        self.upload_directory(
            next_path,
            remote_base + '/.next',
            exclude_patterns=['dev', 'cache']
        )

        # Upload public assets
        public_path = os.path.join(local_root, 'public')
        if os.path.exists(public_path):
            print("\n📁 Uploading public assets...")
            self.upload_directory(public_path, remote_base + '/public')
        
        # Upload package files
        print("\n📄 Uploading package files...")
        for filename in ['package.json', 'package-lock.json']:
            local_file = os.path.join(local_root, filename)
            if os.path.exists(local_file):
                self.upload_file(local_file, remote_base + '/' + filename)

        # Install production dependencies with Hostinger absolute npm path fallback
        print("\n📦 Installing production dependencies...")
        install_cmd = (
            f"cd {remote_base} && "
            "(/opt/alt/alt-nodejs22/root/usr/bin/npm install --production --omit=dev || "
            "/opt/alt/alt-nodejs20/root/usr/bin/npm install --production --omit=dev || "
            "/opt/alt/alt-nodejs18/root/usr/bin/npm install --production --omit=dev)"
        )
        install_out, install_err, install_code = self.execute_command(install_cmd)
        if install_code != 0:
            print("❌ Dependency installation failed")
            if install_err:
                print(install_err)
            self.cleanup()
            sys.exit(1)

        # Restart Passenger app
        print("\n🔁 Restarting Passenger app...")
        restart_out, restart_err, restart_code = self.execute_command(
            f"cd {remote_base} && mkdir -p tmp && touch tmp/restart.txt"
        )
        if restart_code != 0:
            print("❌ Passenger restart trigger failed")
            if restart_err:
                print(restart_err)
            self.cleanup()
            sys.exit(1)
        
        # Verify files
        print("\n✅ Verifying uploaded files...")
        output, error, code = self.execute_command(f"ls -lah {remote_base} | head -20")
        if output:
            print(output)
        
        # Installation instructions
        print("\n" + "="*50)
        print("✅ Deployment Complete!")
        print("="*50 + "\n")
        print("Next steps on the server:")
        print(f"  ssh -p {self.port} {self.username}@{self.host}")
        print(f"  cd {remote_base}")
        print("  ls -la .next")
        print("  ls -la tmp/restart.txt\n")
        
        self.cleanup()
    
    def cleanup(self):
        """Close connections"""
        if self.sftp_client:
            self.sftp_client.close()
        if self.ssh_client:
            self.ssh_client.close()


def main():
    parser = argparse.ArgumentParser(description='Deploy AVID app to Hostinger')
    parser.add_argument('--host', default='89.116.133.94', help='Server hostname')
    parser.add_argument('--port', type=int, default=65002, help='SSH port')
    parser.add_argument('--user', default='u296044710', help='SSH username')
    parser.add_argument('--password', help='SSH password (will prompt if not provided)')
    parser.add_argument('--root', default='.', help='Project root directory')
    
    args = parser.parse_args()
    
    # Get password if not provided
    password = args.password
    if not password:
        password = getpass.getpass("Enter SSH password: ")
    
    if not password:
        print("❌ Password required")
        sys.exit(1)
    
    # Create deployer and deploy
    deployer = AVIDDeployer(args.host, args.port, args.user, password)
    deployer.deploy(args.root)


if __name__ == '__main__':
    main()
