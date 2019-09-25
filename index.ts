import * as puppeteer from "puppeteer";
import * as fs from "fs";

(async () => {
  const items = new Set();

  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto("https://www.cotopaxi.com/products/taal-convertible-tote");

  const numReloads = 25;
  for (let i = 0; i < numReloads; i++) {
    const images = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("figure.choice-image:not(.soldout) img")
      ).map(x => x.outerHTML);
    });

    images.forEach(g => items.add(g));
    console.log(`Set has ${items.size} items`);

    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  }

  const output = Array.from(items).join("\n");

  console.log("writing output");
  fs.writeFileSync(`output/images-latest.html`, output);
  fs.writeFileSync(`output/images-${+new Date()}.html`, output);

  await browser.close();
})();
