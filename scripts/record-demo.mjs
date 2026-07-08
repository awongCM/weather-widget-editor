import { chromium } from 'playwright';
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const ARTIFACTS_DIR = '/opt/cursor/artifacts';
const VIDEO_DIR = path.join(ARTIFACTS_DIR, 'demo-video');
const BASE_URL = 'http://127.0.0.1:9090';

async function pause(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function runDemo() {
  await mkdir(VIDEO_DIR, { recursive: true });
  await mkdir(path.join(ARTIFACTS_DIR, 'screenshots'), { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 800 },
    },
    geolocation: { latitude: -33.8688, longitude: 151.2093 },
    permissions: ['geolocation'],
  });

  const page = await context.newPage();

  try {
    console.log('Opening editor...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Weather Widget Editor' }).waitFor();
    await page.getByText(/Using location:/).waitFor({ timeout: 20000 });
    await pause(1200);

    console.log('Creating widget...');
    await page.getByLabel('Widget title').fill('Sydney Weather Demo');
    await page.getByLabel('Units').selectOption('metric');
    await page.getByRole('checkbox', { name: 'Show wind details' }).check();
    await pause(600);
    await page.getByRole('button', { name: 'Get widget' }).click();

    await page.getByRole('button', { name: 'Copy embed code' }).first().waitFor({ timeout: 20000 });
    await page.getByText('Min / Max').first().waitFor({ timeout: 20000 });
    await pause(2000);

    console.log('Copying embed snippet...');
    await page.getByRole('button', { name: 'Copy embed code' }).first().click();
    await pause(1200);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'screenshots', 'widget-demo.png'),
      fullPage: true,
    });

    console.log('Opening embed demo page...');
    await page.goto(`${BASE_URL}/examples/embed-demo.html`, {
      waitUntil: 'networkidle',
    });
    await page.locator('.ww-widget').first().waitFor({ timeout: 25000 });
    await pause(3000);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'screenshots', 'embed-demo.png'),
      fullPage: true,
    });

    console.log('Demo complete.');
  } finally {
    await context.close();
    await browser.close();
  }
}

runDemo()
  .then(async () => {
    const files = await readdir(VIDEO_DIR);
    const webm = files.find((file) => file.endsWith('.webm'));

    if (webm) {
      const input = path.join(VIDEO_DIR, webm);
      const output = path.join(ARTIFACTS_DIR, 'weather-widget-demo.mp4');
      const { execFile } = await import('node:child_process');
      const { promisify } = await import('node:util');
      const execFileAsync = promisify(execFile);

      await execFileAsync('ffmpeg', [
        '-y',
        '-i',
        input,
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
        output,
      ]);

      console.log(`Saved demo video to ${output}`);
    }
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
