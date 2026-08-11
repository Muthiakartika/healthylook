import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";

// eslint-config-next 15.x still ships only legacy (eslintrc-style) configs:
// importing "eslint-config-next/core-web-vitals" gives you a plain
// `{ extends: [...] }` object, not the array of flat-config blocks that
// ESLint 9 expects. Spreading it directly — which is what this file did
// before — throws "nextVitals is not iterable" and `npm run lint` never
// runs at all.
//
// FlatCompat is the official bridge for exactly this: it takes a legacy
// config name and returns real flat-config objects. This is the same
// shape `create-next-app` generates for ESLint 9 projects, and it can be
// simplified back to plain imports once the project moves to a version of
// eslint-config-next that exports flat config natively.
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  // The build helpers in scripts/ are genuinely CommonJS: one of them is
  // preloaded with `node --require` before any bundler or ESM loader is in
  // play, so it cannot use `import`. The TypeScript rule banning require()
  // is right for src/ and wrong here.
  {
    files: ["scripts/**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
]);

export default eslintConfig;
