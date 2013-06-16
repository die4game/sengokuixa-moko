# sengokuixa-moko.crx

Chrome用 sengokuixa-moko.user.js 開発の他力本願プロジェクトです。
crx化によって誰でも開発し易くなった！あとはよろしく！

## インストール
### .crxファイルからインストールする場合
　sengokuixa-moko.crxを拡張のページにドラッグ&ドロップ。

### crx(ソース)フォルダからインストールする場合
　Chrome拡張機能のページ右上にあるデベロッパーモードをチェック。「パッケージ化されていない拡張機能を読み込む…」からフォルダcrxを選択して読み込む。ドラッグ&ドロップできないので注意。

## ZIPでくれ！
1. Codeタブをクリック  
    まず上部のタブバーの左にあるCodeタブをクリックします。
    ボタンの位置がわからない場合、Codeでページ内検索。
2. バージョン(ブランチ)を選択  
    Codeタブの下方にある「branch: master」などと書いてあるボタンからバージョンの選択ができます。
    ボタンの位置がわからない場合、branchでページ内検索。Branchesのmasterが2chのixaツールスレで配布されているバージョンです。
    crxSpikeがこのcrx版です。oreSpikeは更新停止。変更の履歴はbranchボタン右のCommitsから確認できます。
    Tagsにはアーカイヴが登録されています。古いバージョン等はここにあるかも知れません。
3. ZIPボタンをクリック  
    バージョンを選択したらZIPと書いてあるボタンをクリックするとダウンロードできます.
    ボタンの位置が(ry。

## 開発の手引き
　Chrome Extensionの基本に関しては「[Getting Started: Building a Chrome Extension](http://developer.chrome.com/extensions/getstarted.html)」を参照。sengokuixa-moko-****.user.jsをデータ、css、js、htmlなどに分解することによって保守更新しやすくなっているはず。user.js版と部分的な差分を取ることも可能。以下内容物をざっくり。

### 実行の流れ
* まずbackgroundでmokoメイン関数やpluginなどが読み込まれる。
* そしてmain.jsが実行される。これによりmoko本体のMoko\_main()が実行され、さらにpageActionとしてpopup.htmlが呼び出される。
    * ここでlocalStorageとchrome.storageの間で保存データの交換を行うが、mixiのようにフレームでの実行だとセキュリティ上の制限により禁止されエラーになる。
* pageActionが呼び出されるとアドレスバーの端にmokoアイコンが表示され、クリックするとmoko設定が開く。
* 初回起動時はmoko設定を開き、グループタブの標準に戻すボタンを押すこと。ページをリロードすればmokoが適用される。

### 各ファイルの中身とポイント
　ざっくりざっくり。
#### manifest.json
　chrome extentionにとって最も大切なファイル。バージョン情報や読み込むファイルなどがここで定義される。
#### background.js
　backgroundに常駐しタブ間の橋渡し役を担う。今のところあまり役立ってない。
#### main.js
　Moko_mainの実行担当。さらにmoko設定をlocalStorageとchrome.storageの間でやりとりする役も担当。
#### mokoStyle.css
　スタイルシート。読み込まれる順番がものをいうのでmain.jsから最後に読み込む。cssも直接読み込み可能だがタイミングがうまくいかないので間接読み込み。
#### jquery-2.0.0.min.js
　jQueryの最新版。
#### TableSorter.js
　便利なプラグイン。「武将カードページ」で使用。jQueryが必要。古いので内部でevalを使っている。
#### sengokuixa-moko.js
　Moko_main関数。御本尊。定義のみで実行はmain.jsによる。loader.jsで読み込む。当然だが、main.jsより早く読み込まなければならない。公式の関数を書き替えたりしたいので間接。
#### data.js
　mokoで使用する画像、音、空地戦力等のデータの詰め合わせのオブジェクト定義。
#### deck
　武将カードページ用ファイルが入っている。武将カードページは待機武将一覧を拡張したページ。

## ライセンス
　┐(´～`；)┌ 。商用利用しない限りトラブルにはならないでしょうたぶん。

## 最後に
　戦国IXAがしたいんじゃない、sengokuixa-mokoの開発がしたいんだ！という人をお待ちしております。

***
Google analytics by [githalytics.com](http://githalytics.com/)
[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/75c1d6e384e20eeb64760642830a5a4e "githalytics.com")](http://githalytics.com/die4game/sengokuixa-moko)