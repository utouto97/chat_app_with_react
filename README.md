Chat App with React and express
==

以下の構成で簡単なチャットアプリを作りました。

#### Backend
- express Node.js フレームワーク
- mysql データベース
- passport 認証用
- sequelize ORM
- socket.io リアルタイム通信用

#### Frontend
- react フロント用フレームワーク
- socket.io リアルタイム通信用


### 使い方を簡単に
1. /loginページにアクセス
1. 「登録はこちら」から新規登録
パスワードは8文字以上
1. ログインページに戻って，登録した情報でログイン
1. マイページに飛ぶ
    - 名前やパスワードを変更できる
    - 「Go to Chat Page」でチャットページへ
1. チャットページでチャットを楽しんでください
