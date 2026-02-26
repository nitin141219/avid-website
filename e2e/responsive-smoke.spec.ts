import { expect, test } from "@playwright/test";

const locales = ["en", "de", "fr", "es"] as const;
const routes = ["/", "/about-us", "/contact-us", "/sustainability"] as const;

for (const locale of locales) {
  for (const route of routes) {
    test(`${locale}${route} renders without responsive overflow`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));

      await page.goto(`/${locale}${route}`, { waitUntil: "networkidle" });

      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page).toHaveURL(new RegExp(`/${locale}(/|$)`));
      await expect(page.locator("text=404")).toHaveCount(0);

      const hasHorizontalOverflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth - window.innerWidth > 1;
      });

      expect(
        hasHorizontalOverflow,
        `Detected horizontal overflow on /${locale}${route} for viewport ${page.viewportSize()?.width}x${page.viewportSize()?.height}`
      ).toBeFalsy();

      expect(pageErrors, `Runtime page errors on /${locale}${route}`).toEqual([]);
    });
  }
}
