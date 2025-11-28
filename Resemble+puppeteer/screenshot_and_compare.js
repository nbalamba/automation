const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const resemble = require('resemblejs');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const urls = [
  'https://www.autodesk.com/autodesk-university/',
  'https://www.autodesk.com/autodesk-university/blog',
  'https://www.autodesk.com/autodesk-university/faq',
  'https://www.autodesk.com/autodesk-university/conference/sponsors',
  'https://www.autodesk.com/autodesk-university/contact-us',
];

const screenshotDir = path.join(__dirname, 'screenshots');
const baselinePath = path.join(__dirname, 'baseline.png'); // Adjust if you want to compare against specific baseline

if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  );
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      const filePath = path.join(screenshotDir, `page${i + 1}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`Screenshot saved: ${filePath}`);

      // Optional: compare only one of them to a baseline
      if (i === 1 && fs.existsSync(baselinePath)) {
        console.log(`Comparing page${i + 1}.png to baseline:`);

        const comparison = resemble(filePath).compareTo(baselinePath).ignoreAntialiasing();

        comparison.onComplete(data => {
  console.log(`Mismatch Percentage: ${data.misMatchPercentage}%`);

  const diffPath = path.join(screenshotDir, `diff_page${i + 1}.png`);
  data.getBuffer('image/png', (err, buffer) => {
    if (err) {
      console.error('Error generating diff image:', err);
      return;
    }
    fs.writeFileSync(diffPath, buffer);
    console.log(`Diff image saved: ${diffPath}`);
  });
});

      }
    } catch (err) {
      console.error(`Failed to capture ${url}:`, err.message);
    }
  }

  await browser.close();
})();
