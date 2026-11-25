import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import ts from "typescript";
import vm from "node:vm";

function loadTs(path, mocks = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const exports = {};
  vm.runInNewContext(
    transpiled,
    {
      exports,
      process,
      URL,
      require: (name) => mocks[name] ?? {},
    },
    { filename: path },
  );
  return exports;
}

const iconStub = new Proxy({}, { get: () => () => null });
const data = loadTs("../data/data.ts", { "lucide-react": iconStub });
const siteConfig = loadTs("../lib/site.ts");

test("site config points to Milan Patel and has no leftover template author references", () => {
  assert.equal(siteConfig.site.name, "Milan Patel");
  assert.equal(siteConfig.site.githubUsername, "MilanPatel2003");
  assert.match(siteConfig.site.url.href, /milanpatel\.vercel\.app/);
});

test("hero, experience, projects, skills, education and certificates reflect resume details", () => {
  assert.equal(data.hero.name, "Milan Patel");
  assert.equal(data.hero.email, "milanpatel6454@gmail.com");
  assert.equal(data.hero.phone, "+91 9157770634");

  assert.equal(data.workExperience.length, 2);
  assert.equal(data.workExperience[0].company, "eSparkbiz Technologies Pvt. Ltd.");
  assert.equal(data.workExperience[0].deliverables.length, 2);
  assert.equal(data.workExperience[1].company, "Webcreta Technologies");
  assert.equal(data.workExperience[1].deliverables.length, 1);

  assert.equal(data.projects.length, 8);
  assert.deepEqual(
    Array.from(data.projects, (p) => p.title),
    [
      "Innovate Accounting Solutions",
      "PrepOnyx",
      "React ScreenFlow",
      "Logic Ledger AI MathNotes",
      "Tawkist",
      "Mini Ecom",
      "Sci-Fi 3D Avatar Customization",
      "Tin Dog",
    ],
  );
  assert.equal(
    data.projects[0].liveUrl,
    "https://innovateaccountingsolutions.com/",
  );

  assert.equal(data.skillGroups.length, 7);
  assert.equal(data.education.length, 2);
  assert.equal(data.certificates.length, 3);

  const logoPaths = [
    data.hero.currentCompanyLogo,
    ...data.workExperience.flatMap((job) => [
      job.logo,
      ...job.deliverables.map((d) => d.logo),
    ]),
    ...data.education.map((edu) => edu.logo),
    ...data.projects.map((p) => p.previewImage),
    "/avatar/milan-avatar-v3.png",
    "/avatar/milan-avatar-nav-v4.png",
    "/avatar/milan-avatar-interactive-v3.png",
  ].filter(Boolean);

  for (const assetPath of logoPaths) {
    const fileUrl = new URL(`../public${assetPath}`, import.meta.url);
    assert.ok(existsSync(fileUrl), `Expected asset file to exist: public${assetPath}`);
  }
});
