import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // DOM構文を扱うため
    globals: true, // describe / it などをグローバルで使える
    setupFiles: [], // 初期化コードあればここに追加
  },
});
