const esbuild = require("esbuild");
const { default: copy } = require("esbuild-plugin-copy");

esbuild.build({
  entryPoints: {
    content: "src/content.ts",
    background: "src/background.ts",
  },
  bundle: true,
  outdir: "dist",
  format: "iife",
  platform: "browser",
  sourcemap: true,
  target: ["chrome109"],
  minify: false,
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: {
        from : ["./public/*"],
        to: ["./dist"],
      }
    })
  ]
}).catch(() => process.exit(1));
