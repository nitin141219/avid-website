"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { NavItemType } from "../layout/OldHeader";
import { SheetClose } from "../ui/sheet";

export default function MobileNavMenu({ navItems }: { navItems: NavItemType[] }) {
  return (
    <Accordion type="single" className="space-y-1 mt-4 w-full" collapsible>
      {navItems.map((item, idx) => {
        const hasSub = item.submenu && item.submenu.length > 0;
        // const clickable = item.isMenuClickable || !hasSub;
        const clickable = false;

        return (
          <AccordionItem key={idx} value={`item-${idx}`} className="py-1 border-b w-full">
            {/* ---------- TOP LEVEL NAME ---------- */}
            {clickable ? (
              <SheetClose asChild>
                <Link
                  href={item.href}
                  className="inline-block py-3 font-medium hover:text-secondary text-base cursor-pointer"
                >
                  {item.name}
                </Link>
              </SheetClose>
            ) : (
              <AccordionTrigger
                className="py-3 w-full font-medium hover:text-secondary text-base hover:no-underline cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                {item.name}
              </AccordionTrigger>
            )}

            {/* ---------- SUBMENU ---------- */}
            {hasSub && (
              <AccordionContent>
                <Accordion type="single" className="w-auto" collapsible>
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
                          <Link href={sub.href} className="py-2 hover:text-secondary text-sm">
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
