(function() {

  if (location.pathname === '/world/select_world.php') {

    //ワールド選択でログイン時間のクッキー登録のみ実行
    var time = new Date() / 1000;
    document.cookie = 'im_st=' + time + '; domain=.sengokuixa.jp; path=/;';

  } else if (location.pathname !== '/false/login_sessionout.php') {

    // セッションタイムアウト画面以外

    // backgroundページからオブジェクトをロード
    var objectArray = [
          'CRXMOKODATA',
          'Moko_main',
          'tableSorter_',
          'tablesorter_pager_plugin'
    ];
    objectArray.forEach( function (objName) {
      chrome.runtime.sendMessage( 'send ' + objName, function ( obj) {
      createTagAndInsertHead( 'script', 'var ' + objName + ' = ' + obj + ';');
      });
    });

    // cssをロード。Moko_mainの実行をheadに挿入
    var fileURL = chrome.extension.getURL( 'moko/mokoStyle.css'),
        xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if ( xhr.readyState == 4 && xhr.status == 200) {
        window.addEventListener( 'DOMContentLoaded', function () {
          createTagAndInsertHead( 'style', xhr.responseText);
          createTagAndInsertHead( 'script', 'setTimeout( queMoko_main, 1);\n' + queMoko_main.toString());
        });
      }
    };
    xhr.open( 'GET', fileURL, true);
    xhr.send();
  }

  // worldをゲット
  var world = location.host.match(/^\w+/)[0];
  //console.log( world);

  // pageAction起動
  chrome.runtime.sendMessage( 'fire');

  // localStorageのgroup設定のやりとり
  chrome.runtime.onMessage.addListener( function ( msg, sender, callBack) {
    //console.log( msg);
    if ( msg === 'send groupSetting') {
      var obj = ( localStorage.crx_ixamoko_init_groups && localStorage.crx_ixamoko_init_groups_img && localStorage.crx_ixamoko_group_set)? {
        crx_ixamoko_init_groups: JSON.parse( localStorage.crx_ixamoko_init_groups),
        crx_ixamoko_init_groups_img: JSON.parse( localStorage.crx_ixamoko_init_groups_img),
        crx_ixamoko_group_set: JSON.parse( localStorage.crx_ixamoko_group_set)
      }: false;
      callBack( obj);
    } else if ( msg === 'save localStorage') {
      chrome.storage.sync.get( world, saveSettings);
    }
  });

  // moko設定のセーブ(storageが変化したとき)
  chrome.storage.onChanged.addListener( function ( obj, areaName) {
    console.log( obj, areaName, obj[world]);
    if ( obj[world])
      saveSettings( obj[world].newValue? JSON.parse( obj[world].newValue): false);
  });



  //////////////////
  // function定義 //
  //////////////////

  // localStorageにmoko設定を保存
  function saveSettings( obj) {
    if ( obj) {
      for ( var key in obj) {
        localStorage[ key] = JSON.stringify( obj[ key]);
      }
    } else {
      localStorage.removeItem( 'crx_ixamoko_optio');
    }
  }

  // scriptやstyleタグを生成してheadに挿入
  function createTagAndInsertHead ( tagName, textContent) {
    var s = document.createElement( tagName);
    s.textContent = textContent;
    document.head.appendChild( s);
  }

  // ロード完了を確認してからMoko_mainを実行する再帰ループ。
  function queMoko_main () {
    if ( window.Moko_main && window.CRXMOKODATA) {
      Moko_main( j$);
    } else {
      setTimeout( queMoko_main, 1);
    }
  }
})();