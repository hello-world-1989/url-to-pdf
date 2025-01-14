import puppeteer from 'puppeteer';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let browser = null;

export async function keywordToPDF(keyword) {
  try {
    browser = await puppeteer.launch({
      timeout: 30_000,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'zh-CN,zh;q=0.9',
    });

    try {
      if (
        keyword?.startsWith('http://') ||
        keyword?.startsWith('https://') ||
        keyword?.startsWith('www.')
      ) {
        await page.goto(`${keyword}`);
      } else {
        await page.goto(`https://www.google.com/search?q=${keyword}`);
      }
    } catch (err) {
      console.log(`Error  ${keyword}`, err);
    }

    // const searchResultSelector = '.max-w-full';
    // await page.waitForSelector(searchResultSelector);

    const pdfBuffer = await page.pdf({
      // path: `./search/${keyword}.pdf`,
      width: 1440,
      height: 1200,
    });

    return pdfBuffer;
  } catch (error) {
    console.log('PuppeteerHTMLPDF error', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
