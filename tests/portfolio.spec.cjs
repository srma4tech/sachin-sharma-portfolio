const { test, expect } = require("@playwright/test");

test("compact navigation stays scrollable and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 520 });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Toggle menu" });
  const nav = page.locator("#primary-nav");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(nav).toHaveClass(/active/);

  const metrics = await nav.evaluate((element) => ({
    clientHeight: element.clientHeight,
    overflowY: getComputedStyle(element).overflowY,
  }));
  expect(metrics.overflowY).toBe("auto");
  expect(metrics.clientHeight).toBeLessThanOrEqual(520);

  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("invalid contact submission announces errors and focuses first invalid field", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#contact");

  await page.getByRole("button", { name: "Open in my email app" }).click();
  await expect(page.locator("#form-error-summary")).toBeVisible();
  await expect(page.locator("#name")).toBeFocused();
  await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
});

test("reset clears the form error summary and field error state", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Open in my email app" }).click();
  await expect(page.locator("#form-error-summary")).toBeVisible();

  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.locator("#form-error-summary")).toBeHidden();
  await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "false");
});

test("reduced-motion preference preserves the complete hero headline", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".typewriter")).toContainText(
    "Senior AEM & AEMaaCS Engineer"
  );
});

test("internal anchors resolve and HTML IDs are unique", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    const missingTargets = [...document.querySelectorAll('a[href^="#"]')]
      .map((anchor) => anchor.getAttribute("href").slice(1))
      .filter((id) => id && id !== "top" && !document.getElementById(id));
    return { duplicates: [...new Set(duplicates)], missingTargets: [...new Set(missingTargets)] };
  });

  expect(result.duplicates).toEqual([]);
  expect(result.missingTargets).toEqual([]);
});
