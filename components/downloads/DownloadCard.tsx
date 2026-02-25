"use client";

import { Loader2, MinusIcon, Plus } from "lucide-react";
import { useState } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";

interface DownloadCardProps {
  id: string;
  name: string;
  description: string;
  onDownload: () => Promise<void> | void;
  downloadLinks?: {
    id: string;
    label: string;
    onDownload: () => Promise<void> | void;
  }[];
}

export function DownloadCard({
  id,
  name,
  description,
  onDownload,
  downloadLinks,
}: DownloadCardProps) {
  const [activeDownloadId, setActiveDownloadId] = useState<string | null>(null);

  const handleDownload = async (downloadId: string, action: () => Promise<void> | void) => {
    setActiveDownloadId(downloadId);
    try {
      await action();
    } finally {
      setActiveDownloadId(null);
    }
  };

  return (
    <AccordionItem value={id} className="bg-white p-4 border-b-0">
      <div className="flex justify-between">
        <AccordionTrigger className="[&[data-state=closed]_.lucide-minus]:hidden [&[data-state=open]_.lucide-plus]:hidden [&>.lucide-chevron-down]:hidden p-0 text-off-black [&[data-state=open]>*]:text-primary hover:text-primary text-base hover:no-underline cursor-pointer">
          <div className="flex items-center gap-4 sm:gap-10 w-full sm:w-max min-w-0">
            <Plus className="bg-primary p-1 text-white" strokeWidth={3} />{" "}
            <MinusIcon className="bg-primary p-1 text-white" strokeWidth={3} />{" "}
            <p className="break-words whitespace-normal">{name}</p>
          </div>
        </AccordionTrigger>
        {!downloadLinks?.length ? (
          <Button
            variant="link"
            className="p-0 h-auto text-primary"
            onClick={() => handleDownload(`${id}-single`, onDownload)}
            disabled={activeDownloadId === `${id}-single`}
          >
            {activeDownloadId === `${id}-single` ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Download"
            )}
          </Button>
        ) : null}
      </div>

      <AccordionContent className="flex flex-col gap-4 pt-4 pb-0 text-balance">
        <p className="space-y-2 ml-16 text-medium-dark list-disc list-inside">
          {description || ""}
        </p>
        {downloadLinks?.length ? (
          <ul className="ml-20 space-y-2 list-disc text-primary">
            {downloadLinks.map((link) => (
              <li key={link.id}>
                <Button
                  variant="link"
                  className="justify-start p-0 h-auto text-primary"
                  onClick={() => handleDownload(link.id, link.onDownload)}
                  disabled={activeDownloadId === link.id}
                >
                  {activeDownloadId === link.id ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : null}
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}
