const { chromium } = require("playwright");

async function main() {
  const browser = await chromium
    .launch({ headless: true, channel: "msedge" })
    .catch(() => chromium.launch({ headless: true }));

  const page = await browser.newPage();

  await page.goto("http://localhost:3000/admin/login", {
    waitUntil: "networkidle",
  });

  await page.fill('input[name="email"]', "admin@alpinistiutilitari.ro");
  await page.fill('input[name="password"]', "Admin1234!");
  await page.click('button[type="submit"]');
  await page.waitForLoadState("networkidle");

  const url = page.url();
  const title = await page.title();
  const body = await page.locator("body").innerText();
  const hasAdminContent = /Dashboard|Cereri|Import|Firme|Servicii/i.test(body);

  console.log(`URL=${url}`);
  console.log(`TITLE=${title}`);
  console.log(`HAS_ADMIN_CONTENT=${hasAdminContent}`);

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
