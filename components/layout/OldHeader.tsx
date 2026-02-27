"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ChevronRight, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MobileNavMenu from "../mobile-menu/MobileNavMenu";
import { Button } from "../ui/button";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../ui/menubar";

export interface NavItemType {
  name: string;
  href: string;
  isMenuClickable?: boolean;
  submenu?: {
    name: string;
    href: string;
    children?: {
      name: string;
      href: string;
    }[];
  }[];
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    setScrolled(latest > 100);

    // scroll down → hide
    if (latest > previous && latest > 10) {
      setHidden(true);
    }
    // scroll up → show
    else {
      setHidden(false);
    }
  });

  const navItems: NavItemType[] = [
    {
      name: "Our Company",
      href: "#",
      submenu: [
        { name: "About Avid", href: "/about-us" },
        { name: "Our Story", href: "/about-us#history" },
        { name: "Manufacturing Excellence", href: "/manufacturing-excellence" },
        { name: "Leadership", href: "/leadership" },
      ],
    },
    {
      name: "Markets",
      href: "/market",
      submenu: [
        { name: "Animal Nutrition", href: "/market/animal-nutrition" },
        { name: "Food & Beverages", href: "/market/food-and-beverages" },
        { name: "Industrial & Specialty", href: "/market/industrial-and-specialty-applications" },
        { name: "Personal Care & Cosmetics", href: "/market/personal-care-and-cosmetics" },
        { name: "Pharmaceuticals", href: "/market/pharmaceuticals" },
      ],
    },
    {
      name: "Products",
      href: "#",
      submenu: [
        {
          name: "Alpha Hydroxy Acids",
          href: "#",
          children: [
            { name: "AviGa™ HP70", href: "/product/alpha-hydroxy-acids/aviga-hp-70" },
            { name: "AviGa™ T", href: "/product/alpha-hydroxy-acids/aviga-t" },
          ],
        },
        {
          name: "Amino Acids",
          href: "#",
          children: [
            { name: "AviGly™ HP", href: "/product/amino-acids/avigly-hp" },
            { name: "AviGly™ T", href: "/product/amino-acids/avigly-t" },
            { name: "AviTau™", href: "/product/amino-acids/avitau" },
          ],
        },
        {
          name: "Aromatic & Fine Chemicals",
          href: "#",
          children: [
            { name: "Guaiacol", href: "/product/aromatic-and-fine-chemicals/guaiacol" },
          ],
        },
        {
          name: "Specialty Chemicals & Intermediates",
          href: "#",
          children: [
            {
              name: "Chlorhexidine Base",
              href: "/product/specialty-chemicals-and-intermediates/chlorhexidine-base",
            },
            { name: "MEHQ", href: "/product/specialty-chemicals-and-intermediates/mehq" },
          ],
        },
      ],
    },
    {
      name: "Sustainability",
      href: "/sustainability",
      isMenuClickable: true,
      submenu: [
        { name: "Environmental Stewardship", href: "/sustainability#environmental-stewardship" },
        { name: "Social Responsibility", href: "/sustainability#social-responsibility" },
        {
          name: "Governance & Product Stewardship",
          href: "/sustainability#governance-product-stewardship",
        },
      ],
    },
    {
      name: "Media",
      href: "#",
      submenu: [
        { name: "News & Announcements", href: "/media/news" },
        { name: "Events", href: "/media/events" },
        { name: "Blogs", href: "/media/blog" },
        { name: "Downloads", href: "/media/downloads" },
      ],
    },
    {
      name: "Careers",
      href: "#",
      submenu: [
        { name: "Life", href: "#" },
        { name: "Jobs", href: "#" },
      ],
    },
    // { name: "Languages", href: "#" },
    { name: "Contact Us", href: "/contact-us" },
  ];
  return (
    <motion.header
      animate={hidden ? { y: -100 } : { y: 0 }}
      transition={{ duration: 0.25 }}
      className={`fixed inset-x-0 top-0 z-50 bg-transparent ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container-inner flex h-24 items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="Home" className="flex items-center">
          <Image
            src={scrolled ? "/logo.png" : "/white-logo.png"}
            alt="Logo"
            width={160}
            height={40}
            priority
            className="transition-all duration-300 w-30 min-w-30 lg:min-w-40"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="flex items-center gap-0 lg:gap-1 xl:gap-5">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");

                return item?.submenu ? (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuTrigger
                      className={cn(
                        scrolled ? "text-medium-dark" : "text-white",
                        isActive ? "text-secondary" : "",
                        "p-2 bg-transparent text-xs lg:text-sm font-medium underline-offset-4 uppercase hover:underline cursor-pointer"
                      )}
                    >
                      {item.isMenuClickable ? <Link href={item.href}>{item.name}</Link> : item.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white/95 p-3 shadow-lg w-60! ml-2">
                      <Menubar>
                        {item.submenu.map(
                          (m: {
                            name: string;
                            href: string;
                            children?: {
                              name: string;
                              href: string;
                            }[];
                          }) => {
                            const isChildActive =
                              pathname === m.href ||
                              (pathname.startsWith(m.href) && m.href !== "/");
                            if (m.children) {
                              return (
                                <MenubarMenu key={m?.name}>
                                  <MenubarTrigger asChild>
                                    <div
                                      className={cn(
                                        "block! px-3 py-2 text-xs lg:text-sm font-medium text-medium-dark hover:text-secondary group/item cursor-pointer",
                                        isChildActive ? "text-secondary" : ""
                                      )}
                                    >
                                      <div className="flex items-center justify-between">
                                        {m.name}{" "}
                                        <ChevronRight className="transition-opacity duration-100 opacity-0 group-hover/item:opacity-100 size-4 min-w-4" />
                                      </div>
                                      <div className="w-20 h-px bg-gray-600/50 mt-2" />
                                    </div>
                                  </MenubarTrigger>
                                  <MenubarContent side="right">
                                    {m?.children?.map((child) => (
                                      <MenubarItem asChild key={child.name}>
                                        <Link
                                          href={child.href}
                                          className={cn(
                                            "block! px-3 py-2 text-xs lg:text-sm font-medium text-medium-dark hover:text-secondary group/item cursor-pointer",
                                            isChildActive ? "text-secondary" : ""
                                          )}
                                        >
                                          <div className="flex items-center justify-between">
                                            {child.name}{" "}
                                            <ChevronRight className="transition-opacity duration-100 opacity-0 group-hover/item:opacity-100 min-w-4" />
                                          </div>
                                          <div className="w-20 h-px bg-gray-600/50 mt-2" />
                                        </Link>
                                      </MenubarItem>
                                    ))}
                                  </MenubarContent>
                                </MenubarMenu>
                              );
                            }
                            return (
                              <NavigationMenuLink asChild key={m.name}>
                                <Link
                                  href={m.href}
                                  className={cn(
                                    "block px-3 py-2 text-xs lg:text-sm font-medium text-medium-dark hover:text-primary group/item",
                                    isChildActive ? "text-secondary" : ""
                                  )}
                                >
                                  <div className="flex items-center justify-between">
                                    {m.name}{" "}
                                    <ChevronRight className="transition-opacity duration-100 opacity-0 group-hover/item:opacity-100 group-hover/item:text-secondary min-w-4" />
                                  </div>
                                  <div className="w-20 h-px bg-gray-600/50 mt-2" />
                                </Link>
                              </NavigationMenuLink>
                            );
                          }
                        )}
                      </Menubar>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link
                        className={cn(
                          "block px-3 py-2 rounded-md text-xs lg:text-sm hover:text-primary underline-offset-4 hover:underline font-medium uppercase",
                          scrolled ? "text-medium-dark" : "text-white",
                          isActive ? "text-secondary" : ""
                        )}
                        href={item.href}
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile (hamburger) */}
        <div className="md:hidden">
          <Sheet modal={false}>
            <SheetTrigger asChild>
              <Button
                className={
                  (scrolled ? "rounded-md bg-white/0" : "rounded-md") + " p-0! cursor-pointer"
                }
                variant="link"
              >
                <Menu className={"size-6! " + (scrolled ? "text-gray-800" : "text-white")} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-4">
              <SheetTitle>
                <Link href="/" aria-label="Home" className="flex items-center">
                  <Image src="/logo.png" alt="Logo" width={120} height={36} />
                </Link>
              </SheetTitle>
              <MobileNavMenu navItems={navItems} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
