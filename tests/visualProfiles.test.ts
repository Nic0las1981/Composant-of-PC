import test from "node:test";
import assert from "node:assert/strict";
import { catalog, getComponent } from "../src/data/catalog.ts";
import {
  MM,
  visualProfiles,
  caseProfiles,
  gpuProfiles,
  coolerProfiles,
  ramProfiles,
  boardProfiles,
  psuProfiles,
  getVisualProfile,
  getCaseProfile,
  getGpuProfile,
  getCoolerProfile,
} from "../src/data/visualProfiles.ts";

test("every selected catalog model has a matching visual profile, and no orphan model exists", () => {
  assert.equal(Object.keys(visualProfiles).length, catalog.length);
  for (const component of catalog) {
    const profile = getVisualProfile(component);
    assert.ok(profile, `Missing visual profile for ${component.id}`);
    assert.equal(profile.id, component.id);
    assert.equal(profile.category, component.category);
    assert.ok(profile.name.length > 3);
  }
});

test("visible GPU lengths and cooler heights agree with compatibility dimensions", () => {
  for (const component of catalog.filter((c) => c.category === "gpu")) {
    assert.equal(getGpuProfile(component)?.lengthMm, component.lengthMm);
  }
  for (const component of catalog.filter((c) => c.category === "cooler")) {
    assert.equal(getCoolerProfile(component)?.heightMm, component.heightMm);
  }
});

test("case choices materially change silhouette, panel construction and supplied fans", () => {
  const cases = Object.values(caseProfiles);
  assert.equal(new Set(cases.map((p) => p.kind)).size, 5);
  assert.ok(
    new Set(cases.map((p) => `${p.widthMm}:${p.heightMm}:${p.depthMm}`)).size >=
      10,
  );
  assert.equal(caseProfiles["case-north"].kind, "wood-front");
  assert.notEqual(
    caseProfiles["case-4000d"].color,
    caseProfiles["case-4000d-white"].color,
  );
  const terra = caseProfiles["case-terra"];
  const tower = caseProfiles["case-h6"];
  assert.ok(terra.heightMm < tower.heightMm * 0.6);
  assert.ok(
    terra.widthMm * terra.heightMm * terra.depthMm <
      tower.widthMm * tower.heightMm * tower.depthMm * 0.3,
  );
  assert.equal(terra.woodAccent, true);
  assert.equal(terra.sidePanel, "vented");
  assert.equal(terra.fanCount, 0);
  assert.equal(caseProfiles["case-q300l"].sidePanel, "acrylic");
  assert.equal(tower.fanCount, 3);
  assert.equal(
    tower.fanRgb,
    false,
    "The catalog H6 Flow is not the RGB variant",
  );
});

test("hardware geometry changes with GPU model and air cooler type", () => {
  const smallGpu = gpuProfiles["gpu-4060"];
  const largeGpu = gpuProfiles["gpu-4080s"];
  assert.ok(largeGpu.lengthMm > smallGpu.lengthMm * 1.6);
  assert.equal(smallGpu.fanCount, 2);
  assert.equal(largeGpu.fanCount, 3);
  assert.ok(largeGpu.thicknessMm > smallGpu.thicknessMm);
  assert.equal(coolerProfiles["cooler-l9a"].kind, "low-profile");
  assert.equal(coolerProfiles["cooler-l9a"].fanSizeMm, 92);
  assert.equal(coolerProfiles["cooler-nhd15"].kind, "dual-tower");
  assert.notEqual(
    coolerProfiles["cooler-nhd15"].finColor,
    coolerProfiles["cooler-phantom"].finColor,
  );
  assert.equal(coolerProfiles["cooler-phantom"].heatpipes, 7);
});

test("lighting follows selected products instead of adding RGB to every component", () => {
  const rgbRam = Object.values(ramProfiles).filter((p) => p.rgb);
  assert.ok(rgbRam.length >= 4);
  assert.ok(rgbRam.every((p) => getComponent(p.id)?.name.includes("RGB")));
  assert.equal(ramProfiles["ram-ddr5-64"].rgb, false);
  assert.equal(gpuProfiles["gpu-4070s"].rgb, false);
  assert.equal(gpuProfiles["gpu-4080s"].rgb, true);
  assert.ok(
    Object.values(coolerProfiles)
      .filter((p) => p.kind !== "aio")
      .every((p) => !p.rgb),
  );
});

test("motherboard and PSU profiles keep physical form-factor differences", () => {
  for (const component of catalog.filter((c) => c.category === "motherboard")) {
    const profile = boardProfiles[component.id];
    assert.equal(profile.formFactor, component.formFactor);
    assert.equal(profile.slots, component.memorySlots);
  }
  assert.equal(boardProfiles["mb-b650"].heightMm, 305);
  assert.equal(boardProfiles["mb-a620i"].heightMm, 170);
  assert.equal(boardProfiles["mb-a620i"].slots, 2);
  assert.ok(
    psuProfiles["psu-sf750"].widthMm < psuProfiles["psu-rm750e"].widthMm,
  );
  assert.ok(
    psuProfiles["psu-sf750"].heightMm < psuProfiles["psu-rm750e"].heightMm,
  );
  assert.equal(psuProfiles["psu-sf750"].format, "SFX");
});

test("absent or unrelated selected parts do not silently restore a default visual model", () => {
  assert.equal(getCaseProfile(), undefined);
  assert.equal(getCaseProfile(null), undefined);
  assert.equal(getGpuProfile("missing-model"), undefined);
  assert.equal(getVisualProfile("__proto__"), undefined);
  assert.equal(getCaseProfile(getComponent("gpu-4070s")), undefined);
  assert.equal(getVisualProfile(null), undefined);
  assert.equal(MM, 0.008);
});

test("AIO radiators retain their actual length, width, thickness and fan layout", () => {
  const aios = catalog.filter((c) => c.coolingType === "aio");
  assert.equal(aios.length, 9);
  assert.deepEqual(
    new Set(aios.map((c) => c.radiatorSizeMm)),
    new Set([240, 280, 360]),
  );
  for (const component of aios) {
    const profile = getCoolerProfile(component)!;
    assert.equal(profile.kind, "aio");
    assert.equal(profile.radiatorSizeMm, component.radiatorSizeMm);
    assert.equal(profile.radiatorThicknessMm, component.radiatorThicknessMm);
    assert.ok(profile.radiatorLengthMm! > profile.radiatorSizeMm!);
    // Arctic's 140 mm fan frames overhang its 138 mm radiator by 1 mm per side.
    assert.ok(profile.radiatorWidthMm! + 2 >= profile.fanSizeMm);
    assert.equal(profile.fanCount, component.radiatorSizeMm === 360 ? 3 : 2);
    assert.equal(profile.heatpipes, 0);
    assert.ok(profile.tubeColor && profile.pumpColor);
  }
  assert.equal(coolerProfiles["cooler-lfiii360"].radiatorThicknessMm, 38);
  assert.equal(coolerProfiles["cooler-kraken240"].pumpDisplay, "lcd");
  assert.equal(coolerProfiles["cooler-h150i360"].fanRgb, true);
  assert.equal(coolerProfiles["cooler-lfiii280"].fanRgb, false);
});

test("case dimensional envelopes and radiator positions are explicit for every model", () => {
  const cases = catalog.filter((c) => c.category === "case");
  assert.equal(cases.length, 12);
  for (const component of cases) {
    const profile = getCaseProfile(component)!;
    for (const axis of ["widthMm", "heightMm", "depthMm"] as const) {
      assert.equal(profile[axis], component[axis]);
      assert.ok(profile[axis] > 0);
    }
    assert.ok(component.radiatorSupport);
    assert.ok(Array.isArray(component.radiatorSupport.top));
    assert.ok(Array.isArray(component.radiatorSupport.front));
  }
  assert.deepEqual(getComponent("case-terra")!.radiatorSupport, {
    top: [],
    front: [],
    side: [],
  });
  assert.ok(getComponent("case-h9")!.radiatorSupport!.side!.includes(360));
  assert.ok(!getComponent("case-north")!.radiatorSupport!.top.includes(360));
});

test("catalog expansion covers diverse platforms without orphan IDs or invalid physical values", () => {
  assert.ok(catalog.length >= 100);
  assert.equal(new Set(catalog.map((c) => c.id)).size, catalog.length);
  for (const component of catalog) {
    assert.ok(component.price > 0);
    const profile = getVisualProfile(component)!;
    for (const [key, value] of Object.entries(profile)) {
      if (key.endsWith("Mm"))
        assert.ok(
          typeof value === "number" && value > 0,
          `${component.id}: invalid ${key}`,
        );
    }
  }
  assert.equal(gpuProfiles["gpu-5070-fe"].fanLayout, "flow-through");
  assert.equal(gpuProfiles["gpu-7800xt"].fanLayout ?? "inline", "inline");
});
