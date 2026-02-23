import { ComponentPropsWithoutRef, ElementType } from "react";

type MultilineTextProps<T extends ElementType = "span"> = {
  text: string;
  as?: T;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export function MultilineText<T extends ElementType = "span">({
  text,
  as,
  className,
  ...props
}: MultilineTextProps<T>) {
  const Component = as ?? "span";

  return (
    <Component className={className} {...props}>
      {text.split("\n").map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))}
    </Component>
  );
}

// utils/cropImage.ts
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any,
  rotation = 0
): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  // Calculate bounding box for rotation
  const rotRad = (rotation * Math.PI) / 180;
  const { width: bWidth, height: bHeight } = {
    width: Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
    height: Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
  };

  canvas.width = bWidth;
  canvas.height = bHeight;

  ctx.translate(bWidth / 2, bHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return canvas.toDataURL("image/jpeg", 0.9);
};

export const dataURLtoBlob = (dataUrl: string) => {
  const arr = dataUrl.split(",");
  const mime = /:(.*?);/.exec(arr[0])?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.codePointAt(n) ?? 0;
  }
  return new Blob([u8arr], { type: mime });
};

export const generateICS = (event: {
  title: string;
  description: string;
  start: Date;
  end: Date;
  location?: string;
}) => {
  const startDate = event.start.toISOString().replace(/[-:]|(\.\d{3})/g, "");
  const endDate = event.end.toISOString().replace(/[-:]|(\.\d{3})/g, "");

  return `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
DTSTART:${startDate}
DTEND:${endDate}
LOCATION:${event.location || ""}
END:VEVENT
END:VCALENDAR`;
};
