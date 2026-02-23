import { CustomIcon } from "@/components/ui/custom-icon";
import { SOCIAL_LINKS } from "@/config/socialLinks";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Footer() {
  const tMenu = useTranslations("menu");
  const tFooter = useTranslations("footer");
  return (
    <footer className="relative bg-gray-section pt-10 overflow-hidden">
      <div className="top-0 -right-8 z-0 absolute sm:size-50 md:size-60 lg:size-85">
        <Image src="/assets/svg/footer_bg.svg" alt="footer-bg" fill priority />
      </div>
      <div className="mb-5 container-inner">
        <div className="z-10 relative justify-between items-start gap-10 grid grid-cols-12 container-inner">
          {/* Left Section - Logo and Certifications */}
          <div className="flex flex-col justify-between gap-8 col-span-12 lg:col-span-3 h-full">
            <Image
              src="/logo.png"
              alt="Avid Organics Logo"
              width={220}
              height={50}
              className="max-md:w-55 object-contain"
              unoptimized
              preload
            />
          </div>
          <div className="flex flex-col flex-wrap items-start gap-3 col-span-12 sm:col-span-4 lg:col-span-3 h-full">
            <h2 className="font-extrabold text-primary text-lg">{tMenu("about")}</h2>
            <ul className="space-y-1 font-medium text-medium-dark [&_a]:hover:text-secondary text-sm [&_a]:hover:underline">
              <li>
                <Link href="/about-us">{tMenu("submenu.our_company")}</Link>
              </li>
              <li>
                <Link href="/about-us#history">{tMenu("submenu.history")}</Link>
              </li>
              <li>
                <Link href="/about-us/manufacturing-excellence">
                  {tMenu("submenu.manufacturing")}
                </Link>
              </li>
              <li>
                <Link href="/about-us/executive-leadership">{tMenu("submenu.leadership")}</Link>
              </li>
              <li>
                <Link href="/sustainability">{tMenu("sustainability")}</Link>
              </li>
              <li>
                <Link href="/careers/life">{tMenu("careers")}</Link>
              </li>
              <li>
                <Link href="/contact-us">{tMenu("contact_us")}</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col flex-wrap items-start gap-3 col-span-12 sm:col-span-4 lg:col-span-3 h-full">
            <h2 className="font-extrabold text-primary text-lg">{tFooter("markets_we_serve")}</h2>
            <ul className="space-y-1 font-medium text-medium-dark [&_a]:hover:text-secondary text-sm [&_a]:hover:underline">
              <li>
                <Link href="/market/animal-nutrition">{tMenu("submenu.animal_nutrition")}</Link>
              </li>
              <li>
                <Link href="/market/food-and-beverages">{tMenu("submenu.food_beverage")}</Link>
              </li>
              <li>
                <Link href="/market/industrial-and-specialty-applications">
                  {tMenu("submenu.industrial")}
                </Link>
              </li>
              <li>
                <Link href="/market/personal-care-and-cosmetics">
                  {tMenu("submenu.personal_care")}
                </Link>
              </li>

              <li>
                <Link href="/market/pharmaceuticals">{tMenu("submenu.pharma")}</Link>
              </li>
            </ul>
          </div>
          {/* Right Section - Links and Social */}
          <div className="flex flex-col flex-wrap items-start gap-3 col-span-12 sm:col-span-4 lg:col-span-3 h-full">
            <h2 className="font-extrabold text-primary text-lg">{tFooter("media_resources")}</h2>
            <ul className="space-y-1 font-medium text-medium-dark [&_a]:hover:text-secondary text-sm [&_a]:hover:underline">
              <li>
                <Link href="/media/news">{tMenu("submenu.news")}</Link>
              </li>
              <li>
                <Link href="/media/events">{tMenu("submenu.events")}</Link>
              </li>
              <li>
                <Link href="/media/blog">{tMenu("submenu.blogs")}</Link>
              </li>
              <li>
                <Link href="/media/downloads">{tMenu("submenu.downloads")}</Link>
              </li>
            </ul>
            {/* Social Icons */}
          </div>
        </div>
        <div className="flex flex-wrap justify-end items-end gap-3 mt-8 lg:mt-20 w-full">
          <Link
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center bg-light-dark hover:bg-secondary w-10 h-7.5 text-white skew-x-14 transition-all duration-300 transform"
          >
            <CustomIcon name="linkedin" className="w-4 h-4 -skew-x-14 transform" />
          </Link>
          <Link
            href={SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center bg-light-dark hover:bg-secondary w-10 h-7.5 text-white skew-x-14 transition-all duration-300 transform"
          >
            <CustomIcon name="twitter" className="w-4 h-4 -skew-x-14 transform" />
          </Link>
          <Link
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center bg-light-dark hover:bg-secondary w-10 h-7.5 text-white skew-x-14 transition-all duration-300 transform"
          >
            <CustomIcon name="facebook" className="w-4 h-4 -skew-x-14 transform" />
          </Link>
          <Link
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center bg-light-dark hover:bg-secondary w-10 h-7.5 text-white skew-x-14 transition-all duration-300 transform"
          >
            <CustomIcon name="instagram" className="w-4 h-4 -skew-x-14 transform" />
          </Link>
          <Link
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center bg-light-dark hover:bg-secondary w-10 h-7.5 text-white skew-x-14 transition-all duration-300 transform"
          >
            <CustomIcon name="youtube" className="w-4 h-4 -skew-x-14 transform" />
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="z-10 relative bg-primary py-3 text-white text-sm">
        <div className="justify-between items-start gap-4 sm:gap-10 grid grid-cols-1 sm:grid-cols-[2fr_1fr] xl:grid-cols-[3fr_1fr] container-inner">
          <div className="flex flex-wrap gap-4">
            <p className="w-max">© {new Date().getFullYear()} Avid Organics Pvt. Ltd.</p>
          </div>
          <div className="flex gap-4 text-white/90">
            <Link href="/privacy-policy" className="whitespace-nowrap">
              {tMenu("privacy_policy")}
            </Link>
            <span>|</span>
            <Link href="/terms-and-conditions" className="whitespace-nowrap">
              {tMenu("terms_of_use")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
