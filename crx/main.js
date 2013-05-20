(function() {

  // ワールド選択
  if (location.pathname === '/world/select_world.php') {

    // ログイン時間のクッキー登録
    var time = new Date() / 1000;
    document.cookie = 'im_st=' + time + '; domain=.sengokuixa.jp; path=/;';

  // セッションタイムアウト画面以外
  } else if (location.pathname !== '/false/login_sessionout.php') {

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
//        window.addEventListener( 'DOMContentLoaded', function () {
        $( function () {
          createTagAndInsertHead( 'style', xhr.responseText);
          createTagAndInsertHead( 'script', 'j$( function () { queMoko_main();});\n' + queMoko_main.toString());
        });
      }
    };
    xhr.open( 'GET', fileURL, true);
    xhr.send();

    //mokoツールリストにリンクをセット
    addLink();
  }

  // worldをゲット
  var world = location.host.match(/^\w+/)[0];
  //console.log( world);

  // pageAction起動
  chrome.runtime.sendMessage( 'fire');

  // localStorageのmoko設定をchrome.storageにセーブ
  chrome.storage.sync.get( world, function ( store) {
    //console.log( store);
    var storeWorld = store[world]? JSON.parse( store[world]): {};
    storeWorld.crx_ixamoko_init_groups =
      localStorage.crx_ixamoko_init_groups? JSON.parse( localStorage.crx_ixamoko_init_groups): {};
    storeWorld.crx_ixamoko_group_set =
      localStorage.crx_ixamoko_group_set? JSON.parse( localStorage.crx_ixamoko_group_set): {};
    store[world] = JSON.stringify( storeWorld);
    chrome.storage.sync.set( store);
    //console.log( store);
    chrome.storage.local.get( world, function ( store) {
      var storeWorld = store[world]? JSON.parse( store[world]): {};
      storeWorld.crx_ixamoko_init_groups_img =
        localStorage.crx_ixamoko_init_groups_img? JSON.parse( localStorage.crx_ixamoko_init_groups_img): {};
      storeWorld.crx_ssID =
        localStorage.crx_ssID? JSON.parse( localStorage.crx_ssID): {};
      store[world] = JSON.stringify( storeWorld);
      chrome.storage.local.set( store);
      //console.log( store);
    });
  });

  // moko設定のセーブ(storageが変化したとき)
  chrome.storage.onChanged.addListener( function ( obj, areaName) {
    //console.log( obj, areaName, obj[world]);
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
        if ( obj[key] === 'remove') {
          localStorage.removeItem( key);
        } else {
          localStorage[ key] = JSON.stringify( obj[ key]);
        }
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

  // tool listにリンクを追加
  function addLink() {
    var $toollist = $( '#toollist');
    if ( $toollist[0]) {
      $toollist.append(
        '<li class="list_img">' +
          '<a href="'+chrome.extension.getURL( 'moko/deck/unitListDialog.html')+'?'+world+'" target="_new">武将カード</a>' +
        '</li>'
      );
    } else {
      setTimeout( addLink, 1);
    }
  }
})();