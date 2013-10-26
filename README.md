# MokoLight.crx

Chrome用 sengokuixa-moko.user.js の派生版です。軽量・低機能を目指します。今のところ、ヤフー鯖でのみ動作します。ミクシィでは動きません。ハンゲームでは未確認です。

## 機能
* 空地必要戦力表示
* 全カード一括兵0・騎馬兵1・精鋭騎馬1セットリンク
* 市資源交換支援
* 武将カードデッキ・兵士セット支援拡張ページ
* くじ一括10枚引き
* 取引補助

等々

## インストール
### .crxファイルからインストールする場合
MokoLight.crxを拡張のページにドラッグ&ドロップ。

### crx(ソース)フォルダからインストールする場合
Chrome拡張機能のページ右上にあるデベロッパーモードをチェック。「パッケージ化されていない拡張機能を読み込む…」からフォルダMokoLightを選択して読み込む。ドラッグ&ドロップできないので注意。

## ZIPでくれ！
1. Codeタブをクリック  
    まず右サイドバーのトップにあるCodeタブをクリックします。
    ボタンの位置がわからない場合、Codeでページ内検索。
2. バージョンを選択  
    「branch: master」などと書いてあるボタンからバージョンの選択ができます。
    ボタンの位置がわからない場合、branchでページ内検索。変更の履歴はCommitsから確認できます。
    Tagsにはアーカイヴが登録されています。古いバージョン等はここにあるかも知れません。
3. ZIPボタンをクリック  
    バージョンを選択したら右サイドバー最下部にある「Download ZIP」と書いてあるボタンをクリックするとダウンロードできます.
    ボタンの位置が(ry。

## 開発の手引き
Chrome Extensionの基本に関しては「[Getting Started: Building a Chrome Extension](http://developer.chrome.com/extensions/index.html)」を参照。gitについては[wiki](https://github.com/die4game/sengokuixa-moko/wiki/Git-GitHub)を書いてみました。

### crx作成
Chrome拡張ページのデベロッパーモードから、拡張機能のパッケージ化を行なうとcrxを作成できます。秘密鍵ファイルとしてMokoLight.pemを使用するとアップデート版として作成できます。

## ライセンス
┐(´～`；)┌ 。商用利用しない限りトラブルにはならないでしょうたぶん。

## 最後に
これまでも、これからも、moko は Stand Alone Complex 現象により発展していくでしょう。

***
Google analytics by [githalytics.com](http://githalytics.com/)
[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/75c1d6e384e20eeb64760642830a5a4e "githalytics.com")](http://githalytics.com/die4game/sengokuixa-moko)
