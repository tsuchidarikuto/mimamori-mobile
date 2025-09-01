# iPhone実機テスト手順

## 前提条件
- Expo Goアプリがインストールされていること
- 開発マシンとiPhoneが同じWiFiネットワークに接続されていること

## 手順

### 1. 開発サーバーを起動
```bash
npm start
```
または
```bash
npx expo start
```

### 2. QRコードをスキャン
- ターミナルに表示されるQRコードをiPhoneのカメラでスキャン
- またはExpo Goアプリを開いて「Scan QR code」をタップしてスキャン

### 3. アプリを開く
- QRコードをスキャンすると、Expo Goアプリが自動的に開く
- アプリのビルドが開始され、数秒後にアプリが表示される

## トラブルシューティング

### QRコードが読み取れない場合
- 開発マシンのIPアドレスを確認
```bash
ifconfig | grep inet
```
- Expo GoアプリでURLを直接入力: `exp://[IPアドレス]:8081`

### 接続できない場合
- ファイアウォールの設定を確認
- 同じWiFiネットワークに接続されているか確認
- 開発サーバーを再起動してみる

### リロード方法
- iPhoneを振る（Shake gesture）
- Developer menuが表示されるので「Reload」をタップ

## ビルド済みアプリのインストール（オプション）

### EAS Buildを使用する場合
```bash
# EAS CLIをインストール
npm install -g eas-cli

# ログイン
eas login

# ビルド設定
eas build:configure

# 開発用ビルド
eas build --platform ios --profile development
```

### TestFlightを使用する場合
1. Apple Developer Programに登録
2. `eas build --platform ios`でプロダクションビルド
3. App Store Connectにアップロード
4. TestFlightで配信

## 注意事項
- 開発中はExpo Goアプリで十分テスト可能
- カスタムネイティブモジュールを使用する場合はEAS Buildが必要
- APIエンドポイントは実機からアクセス可能なURLに設定すること