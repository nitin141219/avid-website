"use client";

import { HTMLMotionProps } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

type FileInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  HTMLMotionProps<"input"> & {
    beforeText?: string;
    afterText?: string;
    resetRef?: React.MutableRefObject<(() => void) | null>;
    onClear?: () => void;
    extraElement?: React.ReactNode;
  };

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ beforeText = "Choose File", afterText, resetRef, onClear, extraElement, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setFileName(file.name);
      if (props.onChange) props.onChange(e);
    };

    const resetAll = (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setFileName("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      if (onClear) onClear();
    };

    useEffect(() => {
      if (resetRef) resetRef.current = resetAll;
    }, [resetRef]);

    const displayText = fileName && afterText ? afterText : beforeText;

    return (
      <div className="group relative flex items-stretch border border-border w-full min-w-0 overflow-hidden">
        {/* LEFT SECTION — bg primary */}
        <div className="bg-primary shrink-0 px-4 py-2 text-white text-sm whitespace-nowrap flex items-center">
          {displayText}
        </div>

        {/* RIGHT SECTION — file name */}
        <div
          className="flex-1 min-w-0 px-3 py-2 font-semibold text-gray-900 text-sm text-left whitespace-normal break-words"
          title={fileName}
        >
          {fileName}
        </div>

        {/* REMOVE BUTTON — Only visible when fileName exists */}
        {fileName && (
          <button
            type="button"
            onClick={resetAll}
            className="z-10 relative hover:bg-gray-100 mr-1 p-2 rounded-full transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}

        {/* Hidden actual file input */}
        <input
          ref={(e) => {
            inputRef.current = e;
            if (typeof ref === "function") ref(e);
            else if (ref) (ref as any).current = e;
          }}
          {...props}
          disabled={!!fileName || props.disabled}
          type="file"
          onChange={handleFileChange}
          // Note: Removed inset-0 so it doesn't overlap the remove button
          className="top-0 left-0 absolute opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed"
        />
        {extraElement}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export default FileInput;
