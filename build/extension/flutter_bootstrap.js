// Flutter bootstrap for Chrome Extension (MV3)
// - disables Flutter PWA service worker
// - forces local CanvasKit (no gstatic)
// - supports both loader APIs: load() and loadEntrypoint()

(() => {
  if (!window._flutter) window._flutter = {};

  // Keep buildConfig consistent with your build output
  window._flutter.buildConfig = {
    engineRevision: "cf56914b326edb0ccb123ffdc60f00060bd513fa",
    builds: [
      {
        compileTarget: "dart2js",
        renderer: "canvaskit",
        mainJsPath: "main.dart.js",
      },
    ],
  };

  function fail(msg, err) {
    console.error("[flutter_bootstrap]", msg, err || "");
  }

  function runWithEntrypointApi() {
    // Newer loader API
    return window._flutter.loader.loadEntrypoint({
      entrypointUrl: "main.dart.js",
      // NOTE: we intentionally do NOT register SW in MV3
      onEntrypointLoaded: (engineInitializer) => {
        return engineInitializer
          .initializeEngine({
            renderer: "canvaskit",
            canvasKitBaseUrl: "canvaskit/",
            useLocalCanvasKit: true,
          })
          .then((appRunner) => appRunner.runApp());
      },
    });
  }

  function runWithLegacyLoadApi() {
    // Older loader API
    return window._flutter.loader.load({
      // serviceWorkerSettings intentionally omitted (disables SW)
      config: {
        renderer: "canvaskit",
        canvasKitBaseUrl: "canvaskit/",
        useLocalCanvasKit: true,
      },
    });
  }

  // Wait until flutter.js has executed and attached loader
  if (!window._flutter.loader) {
    fail("window._flutter.loader is missing. Is flutter.js loaded before this file?");
    return;
  }

  try {
    if (typeof window._flutter.loader.loadEntrypoint === "function") {
      runWithEntrypointApi().catch((e) => fail("loadEntrypoint failed", e));
      return;
    }

    if (typeof window._flutter.loader.load === "function") {
      runWithLegacyLoadApi().catch((e) => fail("load() failed", e));
      return;
    }

    fail(
      "No supported loader API found. Available keys:",
      Object.keys(window._flutter.loader || {})
    );
  } catch (e) {
    fail("Bootstrap crashed", e);
  }
})();