# ChatGPT Smart Export

ChatGPT の会話を JSON 形式で保存する Chrome 拡張です。拡張アイコンをクリックすると、表示中のチャットログをファイルとしてダウンロードします。

## 前提条件

- Node.js 18 以降
- npm (Node.js に同梱)

## セットアップ

```bash
npm install
npm run build
```

`dist/` ディレクトリにビルド済みファイルが生成されます。

## 拡張機能の読み込み

1. Chrome で `chrome://extensions` を開きます。
2. 右上の **デベロッパーモード** を有効にします。
3. **パッケージ化されていない拡張機能を読み込む** を選択し、`dist` フォルダを指定します。
4. ChatGPT のページを開き、拡張アイコンをクリックしてログをダウンロードします。

## ライセンス

本プロジェクトは [MIT License](LICENSE) の下で提供されています。
