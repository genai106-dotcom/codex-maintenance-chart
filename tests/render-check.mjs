import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const fileUrl = `file:///${root.replaceAll("\\", "/")}/index.html`;
const outputDir = join(root, "test-output");

mkdirSync(outputDir, { recursive: true });

function chromeArgs(extraArgs) {
  return [
    "--headless=new",
    "--no-sandbox",
    "--single-process",
    "--disable-gpu",
    "--disable-gpu-compositing",
    "--disable-software-rasterizer",
    "--disable-dev-shm-usage",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-extensions",
    "--force-device-scale-factor=1",
    "--no-first-run",
    "--no-default-browser-check",
    ...extraArgs,
    fileUrl,
  ];
}

function runChrome(extraArgs) {
  const result = spawnSync(chromePath, chromeArgs(extraArgs), {
    cwd: root,
    encoding: "utf8",
    timeout: 30000,
  });
  if (result.error) throw result.error;
  return result;
}

function pngDimensions(path) {
  const bytes = readFileSync(path);
  assert.equal(bytes.toString("ascii", 1, 4), "PNG", `${path} should be a PNG file`);
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    size: bytes.length,
  };
}

const dom = runChrome(["--dump-dom"]);
assert.equal(dom.status, 0, `Chrome DOM render should exit cleanly: ${dom.stderr}`);
assert.match(dom.stdout, /maintenanceChart/, "rendered DOM should include the SVG chart");
assert.match(dom.stdout, /class="bar highlight"/, "rendered DOM should include the highlighted 2024 bar");
assert.match(dom.stdout, /class="dot"/, "rendered DOM should include incident line dots");
assert.match(dom.stdout, /2024년: 건수는 감소/, "rendered DOM should include the 2024 callout");

const viewports = [
  { name: "desktop", width: 1366, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const results = viewports.map((viewport) => {
  const screenshotPath = join(outputDir, `${viewport.name}.png`);
  rmSync(screenshotPath, { force: true });
  const screenshot = runChrome([
    `--window-size=${viewport.width},${viewport.height}`,
    `--screenshot=${screenshotPath}`,
  ]);
  assert.equal(screenshot.status, 0, `${viewport.name}: Chrome screenshot should exit cleanly: ${screenshot.stderr}`);
  assert.ok(existsSync(screenshotPath), `${viewport.name}: screenshot should be written`);
  assert.ok(statSync(screenshotPath).size > 10000, `${viewport.name}: screenshot should not be blank`);

  const dimensions = pngDimensions(screenshotPath);
  assert.equal(dimensions.width, viewport.width, `${viewport.name}: screenshot width should match viewport`);
  assert.ok(dimensions.height >= Math.min(viewport.height, 600), `${viewport.name}: screenshot height should be usable`);
  return { ...viewport, screenshotPath, ...dimensions };
});

console.log(JSON.stringify(results, null, 2));
