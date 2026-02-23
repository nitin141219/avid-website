// components/ImageUpload.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, RotateCw, X } from "lucide-react";
import React, { useRef, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import FileInput from "../file-input";
import { getCroppedImg } from "../MultilineText";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface ImageUploadProps {
  width: number; // 1280
  height: number; // 720
  maxSizeMB: number;
  accept?: string;
  label?: string;
  inputId?: string;
  required?: boolean;
  error?: string;
  onUploadSuccess: (croppedImage: string) => void;
  onClear?: () => void;
}

export default function ImageUpload({
  width,
  height,
  maxSizeMB,
  accept = "image/png, image/jpeg, image/webp",
  label = "Image",
  inputId = "file",
  required = true,
  onUploadSuccess,
  error,
  onClear,
}: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const fileInputRef = useRef<any>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    const file = e?.target.files?.[0];

    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File too large. Max limit is ${maxSizeMB}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setIsOpen(true);
      setZoom(1);
      setRotation(0);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!image || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const cropped = await getCroppedImg(image, croppedAreaPixels, rotation);
      onUploadSuccess(cropped);
      setIsOpen(false);
      setIsReady(false);
    } catch (e) {
      console.error("Error cropping image:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    fileInputRef.current?.();
  };

  const onExitComplete = () => {
    setIsReady(false);
    setImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
  };

  return (
    <div className="w-full">
      <div>
        <Label required={required} className="mb-2 w-max font-medium md:text-sm cursor-pointer" htmlFor={inputId}>
          {label}
        </Label>
        <FileInput
          resetRef={fileInputRef}
          onChange={onFileChange}
          id={inputId}
          accept={accept}
          className="hidden"
          onClear={() => {
            setImage(null);
            setIsOpen(false);
            setIsReady(false);
            onUploadSuccess("");
            onClear?.();
          }}
        />
        {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
      </div>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <AnimatePresence onExitComplete={onExitComplete}>
          {isOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="z-100 fixed inset-0 bg-slate-900/80 backdrop-blur-md"
                />
              </Dialog.Overlay>

              <Dialog.Content
                asChild
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
              >
                <div className="z-101 fixed inset-0 flex justify-center items-center p-4 md:p-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onAnimationComplete={() => setIsReady(true)}
                    className="flex flex-col bg-white shadow-2xl rounded-3xl w-full max-w-4xl h-fit overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center bg-slate-50 px-6 py-4 border-b">
                      <div>
                        <Dialog.Title className="font-bold text-slate-800 text-lg">
                          Adjust Your Image
                        </Dialog.Title>
                        <p className="text-slate-500 text-xs">Drag to move, use slider to zoom</p>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={handleClose}
                        className="hover:bg-slate-200 p-2 rounded-full transition-colors"
                      >
                        <X size={20} className="text-slate-600" />
                      </Button>
                    </div>

                    {/* Improved Crop Container */}
                    <div className="relative bg-slate-200 w-full h-[450px] overflow-hidden cursor-move">
                      {isReady && (
                        <Cropper
                          key={image}
                          image={image!}
                          crop={crop}
                          zoom={zoom}
                          rotation={rotation}
                          aspect={width / height}
                          onCropChange={setCrop}
                          onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                          onZoomChange={setZoom}
                        />
                      )}
                    </div>

                    {/* Enhanced Controls */}
                    <div className="space-y-6 bg-white p-6">
                      <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
                        {/* Zoom Control */}
                        <div className="space-y-3">
                          <div className="flex justify-between font-bold text-slate-500 text-xs uppercase tracking-wider">
                            <span>Zoom</span>
                            <span>{Math.round(zoom * 100)}%</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Minus size={16} className="text-slate-400" />
                            <input
                              type="range"
                              min={1}
                              max={3}
                              step={0.1}
                              value={zoom}
                              onChange={(e) => setZoom(Number(e.target.value))}
                              className="bg-slate-100 rounded-lg w-full h-1.5 accent-blue-600 appearance-none cursor-pointer"
                            />
                            <Plus size={16} className="text-slate-400" />
                          </div>
                        </div>

                        {/* Rotation Control */}
                        <div className="space-y-3">
                          <div className="flex justify-between font-bold text-slate-500 text-xs uppercase tracking-wider">
                            <span>Rotation</span>
                            <button
                              onClick={() => setRotation((r) => (r + 90) % 360)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            >
                              <RotateCw size={12} /> +90°
                            </button>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={360}
                            step={1}
                            value={rotation}
                            onChange={(e) => setRotation(Number(e.target.value))}
                            className="bg-slate-100 rounded-lg w-full h-1.5 accent-blue-600 appearance-none cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end items-center gap-4 pt-4 border-slate-100 border-t">
                        <Button
                          variant="ghost"
                          onClick={handleClose}
                          className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700 text-sm"
                        >
                          Discard
                        </Button>
                        <Button disabled={isProcessing} onClick={handleSave}>
                          {isProcessing ? (
                            "Processing..."
                          ) : (
                            <>
                              <Check size={18} /> Finish & Save
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}
