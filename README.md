# sengokuixa-moko.crx

Chrome用 sengokuixa-moko.user.js の他力本願プロジェクトです。
crx化によって誰でも開発し易くなった！あとはよろしく！

## インストール
　Chrome拡張機能のページ右上にあるデベロッパーモードをチェック。「パッケージ化されていない拡張機能を読み込む…」からフォルダcrxを選択して読み込む。

## 開発の手引き
　Chrome Extensionの基本に関しては「[Getting Started: Building a Chrome Extension](http://developer.chrome.com/extensions/getstarted.html)」を参照。以下ざっくり。

### 実行の流れ
* まずloder.jsが実行される。これにより、mokoStyle.css, TableSorter.js, sengokuixa-moko.js, data.jsonが読み込まれる。
* そしてmain.jsが実行される。これによりmoko本体のMoko_main()が実行される。
* loder.js, main.jsは直接読み込み、他はloder.jsによる間接読み込みである。直接間接は使い分ける必要がある。

### 各ファイルの中身とポイント
　簡単に紹介
#### loader.js
　ここに記述された各ファイルを読み込み\<script>や\<style>\として<head>に挿入する。css, js, jsonを読み込むことを想定している。\<head>に読み込むとixa公式の関数等にアクセスできるが、chrome.extensionのメソッドが使えなくなる。
#### main.js
　Moko_mainの実行担当。ixa公式のj$とdata.jsonのオブジェクトを
#### mokoStyle.css
　スタイルシート。読み込まれる順番がものをいうのでloader.jsからDOMContentLoadedで最後に読み込む。cssも直接読み込み可能だがタイミングを選択できないので間接読み込み。
#### TableSorter.js
　便利なプラグイン。「待機武将一覧」で使用している。他は使ってないはず。Moko\_mainが間接なので間接でないとMoko\_mainから実行できない。ixa公式のjQueryを使用。
#### sengokuixa-moko.js
　Moko_main関数。御本尊。定義のみで実行はmain.jsによる。loader.jsで読み込む。当然だが、main.jsより早く読み込まなければならない。公式の関数を書き替えたりしたいので間接。
#### data.json
　mokoで使用する画像、音、空地戦力等のデータの詰め合わせJSON。loder.jsにより、指定した名前のオブジェクトに代入される\<script>として\<head>内に読み込まれる。もちろんこれもmain.jsより早く読み込まなければならない。Moko_mainとの順番は不同。後でも構わない。

## ライセンス
　┐(´～`；)┌ 。商用利用しない限りトラブルにはならないでしょうたぶん。

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

## 最後に
　戦国IXAがしたいんじゃない、sengokuixa-mokoの開発がしたいんだ！という人をお待ちしております。

***
Google analytics by [githalytics.com](http://githalytics.com/)
[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/75c1d6e384e20eeb64760642830a5a4e "githalytics.com")](http://githalytics.com/die4game/sengokuixa-moko)