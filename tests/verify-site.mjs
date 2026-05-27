import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(join(root, "index.html"), "utf8");

const expectedYearly = [
  { year: "2022", incidents: 77, costWon: 18890000, repairHours: 199.5 },
  { year: "2023", incidents: 79, costWon: 22283000, repairHours: 222 },
  { year: "2024", incidents: 73, costWon: 27060000, repairHours: 250 },
];

const match = html.match(/const yearlyData = (\[[\s\S]*?\]);/);
assert.ok(match, "index.html should define yearlyData as a JavaScript array");

const yearlyData = Function(`"use strict"; return (${match[1]});`)();
assert.deepEqual(yearlyData, expectedYearly, "embedded yearly data should match the CSV aggregation");

assert.match(html, /유지보수 비용은 증가/, "page should state the main insight");
assert.match(html, /2024년/, "page should call out 2024");
assert.match(html, /장비유지보수_2022-2024\.csv/, "page should cite the source CSV");
assert.match(html, /<svg[^>]+role="img"/, "chart should render as an accessible SVG image");
assert.match(html, /@media \(max-width: 720px\)/, "page should include a mobile layout rule");
assert.match(html, /비용_원/, "page should explain the cost field");
