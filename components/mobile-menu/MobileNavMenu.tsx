"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { NavItemType } from "../layout/OldHeader";
import { SheetClose } from "../ui/sheet";

export default function MobileNavMenu({
  navItems,
  onNavigate,
}: {
  navItems: NavItemType[];
  onNavigate?: () => void;
}) {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <Accordion
      type="single"
      value={openItem}
      onValueChange={(value) => setOpenItem(value || undefined)}
      className="space-y-1 mt-4 w-full max-w-full"
      collapsible
    >
      {navItems.map((item, idx) => {
        const hasSub = item.submenu && item.submenu.length > 0;
        const clickable = item.isMenuClickable || !hasSub;
        const itemValue = `item-${idx}`;

        return (
          <AccordionItem key={idx} value={itemValue} className="py-1 border-b w-full">
            {/* ---------- TOP LEVEL NAME ---------- */}
            {hasSub ? (
              <div className="grid grid-cols-[1fr_40px] items-center w-full">
                {item.isMenuClickable ? (
                  <Link
                    href={item.href}
                    prefetch
                    onClick={() => {
                      onNavigate?.();
                    }}
                    className="inline-block py-3 font-medium hover:text-secondary text-base cursor-pointer"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="inline-block py-3 font-medium text-base">{item.name}</span>
                )}
                <AccordionTrigger
                  aria-label={`Toggle ${item.name}`}
                  className="!px-0 !py-0 w-10 h-10 !items-center !justify-center !gap-0 hover:text-secondary hover:no-underline cursor-pointer touch-manipulation [&>svg]:translate-y-0 [&>svg]:size-4"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : clickable ? (
              <SheetClose asChild>
                <Link
                  href={item.href}
                  prefetch
                  className="inline-block py-3 font-medium hover:text-secondary text-base cursor-pointer"
                >
                  {item.name}
                </Link>
              </SheetClose>
            ) : (
              <AccordionTrigger
                className="py-3 w-full font-medium hover:text-secondary text-base hover:no-underline cursor-pointer touch-manipulation"
                onClick={(e) => e.stopPropagation()}
              >
                {item.name}
              </AccordionTrigger>
            )}

            {/* ---------- SUBMENU ---------- */}
            {hasSub && (
              <AccordionContent>
                <Accordion type="single" className="w-auto max-w-full" collapsible>
                  <div className="flex flex-col gap-2 mt-2 ml-4 pl-3 border-l">
                    {item.submenu!.map((sub, subIdx) => {
                      const hasChild = sub.children && sub.children.length > 0;

                      if (hasChild) {
                        return (
                          <AccordionItem
                            key={sub.name}
                            value={`child-${idx}-${subIdx}`}
                            className="border-0"
                          >
                            <AccordionTrigger
                              className="py-2 pr-1 w-auto hover:text-secondary hover:no-underline cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {sub.name}
                            </AccordionTrigger>

                            {/* ---------- CHILDREN ---------- */}
                            <AccordionContent>
                              <div className="flex flex-col gap-2 mt-1 ml-4 pl-3 border-l">
                                {sub.children!.map((child) => (
                                  <SheetClose key={child.name} asChild>
                                    <Link
                                      href={child.href}
                                      prefetch
                                      className="py-2 text-gray-600 hover:text-secondary text-sm"
                                    >
                                      {child.name}
                                    </Link>
                                  </SheetClose>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      }

                      return (
                        <SheetClose key={sub.name} asChild>
                          <Link href={sub.href} prefetch className="py-2 hover:text-secondary text-sm">
                            {sub.name}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>
                </Accordion>
              </AccordionContent>
            )}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
