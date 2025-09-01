# みまもりダッシュボード - React Native モバイルアプリ

高齢者の健康状態と日々の様子を見守るモバイルアプリケーションです。

## 機能

- 健康データの可視化
- 会話記録の管理
- リアルタイム通知
- 感情状態のグラフ表示

## セットアップ

### 前提条件

- Node.js (v16以上)
- npm または yarn
- Expo CLI
- iOS: Xcode (Mac)
- Android: Android Studio

### インストール

```bash
# 依存関係のインストール
npm install

# iOS向けの追加セットアップ（Macのみ）
cd ios && pod install && cd ..
```

### 開発サーバーの起動

```bash
# Expoで起動
npm start

# iOSシミュレーターで起動
npm run ios

# Androidエミュレーターで起動
npm run android

# Webブラウザで起動（開発用）
npm run web
```

## プロジェクト構造

```
mimamori-mobile/
├── App.tsx                 # アプリケーションのエントリーポイント
├── src/
│   ├── screens/           # 画面コンポーネント
│   │   ├── HomeScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── WelcomeScreen.tsx
│   ├── components/        # 再利用可能なコンポーネント
│   │   ├── Card.tsx
│   │   ├── CustomButton.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── index.ts
│   ├── navigation/        # ナビゲーション設定
│   │   └── types.ts
│   ├── constants/         # アプリ定数
│   │   ├── colors.ts
│   │   ├── dimensions.ts
│   │   └── index.ts
│   └── utils/            # ユーティリティ関数
│       ├── apiUtils.ts
│       ├── dateUtils.ts
│       └── index.ts
├── assets/               # 画像、フォントなどのアセット
└── package.json
```

## API連携

現在はモックデータを使用していますが、実際のAPIエンドポイントに接続する場合は、`src/utils/apiUtils.ts`の設定を更新してください：

```typescript
export const API_CONFIG = {
  baseUrl: 'YOUR_API_BASE_URL',
  timeout: 10000,
};
```

または環境変数を使用：

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-api.com
```

## ビルド

### iOS向けビルド

```bash
expo build:ios
```

### Android向けビルド

```bash
expo build:android
```

## 技術スタック

- React Native (Expo)
- TypeScript
- React Navigation
- React Native Safe Area Context
- React Native SVG

## ライセンス

© 2025 みまもりダッシュボード. All rights reserved.