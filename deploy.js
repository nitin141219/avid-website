#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * AVID App Deployment Script
 * Uses SSH2 library for reliable SFTP deployment to Hostinger
 * Usage: node deploy.js <password>
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

const config = {
  host: '89.116.133.94',
  port: 65002,
  username: 'u296044710', 
  password: process.argv[2] || '',
};

const LOCAL_BUILD_PATH = path.join(__dirname, '.next');
const LOCAL_PUBLIC_PATH = path.join(__dirname, 'public');
const LOCAL_ROOT = path.join(__dirname);
const REMOTE_BASE = '/home/u296044710/domains/avidorganics.net/public_html';

console.log('\n✓ AVID Deployment via SFTP');
console.log('============================\n');

if (!config.password) {
  console.error('❌ Please provide SSH password as argument');
  console.error('Usage: node deploy.js <password>');
  process.exit(1);
}

if (!fs.existsSync(LOCAL_BUILD_PATH)) {
  console.error('❌ .next folder not found. Run "npm run build" first');
  process.exit(1);
}

console.log('Deployment config:');
console.log(`  Host: ${config.host}:${config.port}`);
console.log(`  User: ${config.username}`);
console.log(`  Remote: ${REMOTE_BASE}`);
console.log();

const conn = new Client();

conn.on('ready', () => {
  console.log('✓ SSH connection established');
  
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('❌ SFTP connection failed:', err.message);
      conn.end();
      process.exit(1);
    }
    
    console.log('✓ SFTP session started\n');
    console.log('📤 Uploading files...\n');
    
    // Create remote directories
    const mkdirRecursive = (remotePath, callback) => {
      sftp.mkdir(remotePath, (err) => {
        if (!err) {
          callback(null);
          return;
        }

        // Some SFTP servers return generic "Failure" when folder already exists.
        sftp.stat(remotePath, (statErr, stats) => {
          if (!statErr && stats) {
            callback(null);
            return;
          }
          callback(err);
        });
      });
    };
    
    // Upload directory recursively
    let uploadedCount = 0;
    
    const uploadDir = (localDir, remoteDir, callback) => {
      fs.readdir(localDir, (err, files) => {
        if (err) return callback(err);
        
        if (files.length === 0) return callback(null);
        
        let completed = 0;
        let hadError = false;
        
        files.forEach((file) => {
          const localPath = path.join(localDir, file);
          const remotePath = remoteDir + '/' + file;
          
          fs.stat(localPath, (err, stats) => {
            if (err) {
              hadError = true;
              return completed++, (completed === files.length) && callback(hadError ? err : null);
            }
            
            if (stats.isDirectory()) {
              mkdirRecursive(remotePath, (err) => {
                if (err) {
                  hadError = true;
                  return completed++, (completed === files.length) && callback(hadError ? err : null);
                }
                
                uploadDir(localPath, remotePath, (err) => {
                  if (err) hadError = true;
                  completed++;
                  if (completed === files.length) callback(hadError ? err : null);
                });
              });
            } else {
              const readStream = fs.createReadStream(localPath);
              const writeStream = sftp.createWriteStream(remotePath);
              
              writeStream.on('error', (err) => {
                hadError = true;
                readStream.destroy();
              });
              
              readStream.on('error', (err) => {
                hadError = true;
                writeStream.destroy();
              });
              
              writeStream.on('finish', () => {
                uploadedCount++;
                process.stdout.write(`  ✓ ${remotePath}\n`);
                completed++;
                if (completed === files.length) callback(hadError ? new Error('Upload failed') : null);
              });
              
              readStream.pipe(writeStream);
            }
          });
        });
      });
    };
    
    // Start deployment
    mkdirRecursive(REMOTE_BASE, (err) => {
      if (err) {
        console.error('❌ Failed to create base directory:', err.message);
        sftp.end();
        conn.end();
        process.exit(1);
      }
      
      mkdirRecursive(REMOTE_BASE + '/.next', (err) => {
        if (err) {
          console.error('❌ Failed to create .next directory:', err.message);
          sftp.end();
          conn.end();
          process.exit(1);
        }
        
        uploadDir(LOCAL_BUILD_PATH, REMOTE_BASE + '/.next', (err) => {
          if (err) {
            console.error('❌ Upload failed:', err.message);
            sftp.end();
            conn.end();
            process.exit(1);
          }
          
          console.log('\n✓ .next folder uploaded\n');

          const uploadCoreFiles = () => {
            // Upload package.json and package-lock.json
            const filesToUpload = ['package.json', 'package-lock.json'];
            let fileCompleted = 0;

            filesToUpload.forEach((file) => {
              const localPath = path.join(LOCAL_ROOT, file);
              const remotePath = REMOTE_BASE + '/' + file;

              if (fs.existsSync(localPath)) {
                const readStream = fs.createReadStream(localPath);
                const writeStream = sftp.createWriteStream(remotePath);

                writeStream.on('finish', () => {
                  console.log(`  ✓ ${remotePath}`);
                  fileCompleted++;

                  if (fileCompleted === filesToUpload.length) {
                    console.log('\n✅ All files uploaded successfully!\n');
                    console.log('Next steps:');
                    console.log('1. SSH into server: ssh -p 65002 u296044710@89.116.133.94');
                    console.log('2. Navigate: cd ~/public_html');
                    console.log('3. Install deps: npm install --production --omit=dev');
                    console.log('4. Start app: npm start (or pm2 start)');
                    console.log();

                    sftp.end();
                    conn.end();
                  }
                });

                writeStream.on('error', (err) => {
                  console.error(`❌ Failed to upload ${file}:`, err.message);
                  sftp.end();
                  conn.end();
                  process.exit(1);
                });

                readStream.pipe(writeStream);
              } else {
                fileCompleted++;
                if (fileCompleted === filesToUpload.length) {
                  console.log('\n✅ Core files uploaded!\n');
                  sftp.end();
                  conn.end();
                }
              }
            });
          };

          if (!fs.existsSync(LOCAL_PUBLIC_PATH)) {
            console.warn('⚠️ public folder not found locally, skipping static assets upload');
            uploadCoreFiles();
            return;
          }

          mkdirRecursive(REMOTE_BASE + '/public', (err) => {
            if (err) {
              console.error('❌ Failed to create public directory:', err.message);
              sftp.end();
              conn.end();
              process.exit(1);
            }

            uploadDir(LOCAL_PUBLIC_PATH, REMOTE_BASE + '/public', (err) => {
              if (err) {
                console.error('❌ Failed to upload public folder:', err.message);
                sftp.end();
                conn.end();
                process.exit(1);
              }

              console.log('✓ public folder uploaded\n');
              uploadCoreFiles();
            });
          });
        });
      });
    });
  });
}).on('error', (err) => {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
});

// Handle missing ssh2 module
try {
  conn.connect(config);
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.log('Installing required dependency: ssh2');
    require('child_process').execSync('npm install ssh2', { stdio: 'inherit' });
    conn.connect(config);
  } else {
    throw err;
  }
}

process.on('SIGINT', () => {
  console.log('\n\nDeployment cancelled');
  conn.end();
  process.exit(0);
});
