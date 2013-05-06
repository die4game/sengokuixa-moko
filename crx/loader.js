// 外部ファイルをロードする。ロードするファイルのURLには、manifestによる許可が必要。
// css、js、JSONを<head>にロードする。ロードするファイルをfileArray、JSONArrayに書式にならって列挙する。
var fileArray = [
      {
        fileURL: chrome.extension.getURL( "css/mokoStyle.css"),
        tagName: "style",
        eventName: "DOMContentLoaded"
      },
      {
        fileURL: chrome.extension.getURL( "plugin/TableSorter.js"),
        tagName: "script"
      },
      {
        fileURL: chrome.extension.getURL( "moko/sengokuixa-moko.js"),
        tagName: "script"
        //eventName: "DOMContentLoaded"
      }
    ],

    JSONArray = [
      {
        fileURL: chrome.extension.getURL( "JSON/data.json"),
        objectName: "CRXMOKODATA"
      }
    ];
fileArray.forEach( function ( el) {
  loadFileToHead ( el);
});

JSONArray.forEach( function ( el) {
  loadJSONToHead ( el);
});


// fileURLで指定したファイルを読み込み、tagNameに指定したhtmltagを作成し、
// ファイルの内容をtextContentに代入し、<head>に挿入する。
// eventNameを指定した場合、そのイベントでリスナーに登録する。
// 対象ファイルはcssとjsを想定している。
function loadFileToHead ( el) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if ( xhr.readyState == 4 && xhr.status == 200) {
      if ( el.eventName) {
        window.addEventListener( el.eventName, function () {
          createTagAndInsertHead( el.tagName, xhr.responseText);
        });
      } else {
          createTagAndInsertHead( el.tagName, xhr.responseText);
      }
    }
  };
  xhr.open( "GET", el.fileURL, true);
  xhr.send();
}


// fileURLからJSONファイルを読み込みobjectNameに指定した名前のオブジェクトに代入する。
// 上記の<script>を<head>へ挿入。
function loadJSONToHead ( el) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if ( xhr.readyState == 4 && xhr.status == 200) {
      var textContent = 'var ' + el.objectName + '=' + xhr.responseText;
      createTagAndInsertHead( "script", textContent);
    }
  };
  xhr.open( "GET", el.fileURL, true);
  xhr.send();
}


// tagNameに指定したhtmltagにtextContentをセットして<head>に挿入
function createTagAndInsertHead ( tagName, textContent) {
  var s = document.createElement( tagName);
  s.textContent = textContent;
  document.head.appendChild( s);
}