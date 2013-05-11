// backgroundページからオブジェクトをロード
var objectArray = [
      "CRXMOKODATA",
      "Moko_main",
      "tableSorter_",
      "tablesorter_pager_plugin"
];
objectArray.forEach( function (objName) {
  chrome.runtime.sendMessage( "send " + objName, function ( obj) {
  createTagAndInsertHead( "script", "var " + objName + " = " + obj + ";");
  });
});

// cssをロード。
var fileURL = chrome.extension.getURL( "moko/mokoStyle.css");
loadFileToHead ( fileURL);

function loadFileToHead ( fileURL) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if ( xhr.readyState == 4 && xhr.status == 200) {
      window.addEventListener( "DOMContentLoaded", function () {
        createTagAndInsertHead( "style", xhr.responseText);
      });
    }
  };
  xhr.open( "GET", fileURL, true);
  xhr.send();
}

function createTagAndInsertHead ( tagName, textContent) {
  var s = document.createElement( tagName);
  s.textContent = textContent;
  document.head.appendChild( s);
}