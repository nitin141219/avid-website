"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import { cn } from "@/lib/utils";

function Label({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-0.5 group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 font-medium text-off-black text-sm md:text-base leading-none peer-disabled:cursor-not-allowed group-data-[disabled=true]:pointer-events-none select-none",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500">*</span>}
    </LabelPrimitive.Root>
  );
}

export { Label };
