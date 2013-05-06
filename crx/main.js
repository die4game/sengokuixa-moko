(function() {
  if (location.pathname === '/world/select_world.php') {
    //ワールド選択でログイン時間のクッキー登録のみ実行
    var time = new Date() / 1000;
    document.cookie = 'im_st=' + time + '; domain=.sengokuixa.jp; path=/;';
  } else if (location.pathname !== '/false/login_sessionout.php') {
    //セッションタイムアウト画面以外
    // load and execute Moko
    window.addEventListener("DOMContentLoaded", function() {
      var scriptMoko = document.createElement("script");
      scriptMoko.textContent =
        "setTimeout( queMoko_main, 1);\n" +
        queMoko_main.toString();
      document.head.appendChild(scriptMoko);

      // ロード完了を確認してからMoko_mainを実行する再帰ループ。
      function queMoko_main () {
        if ( window.Moko_main && window.CRXMOKODATA) {
          Moko_main( j$, CRXMOKODATA);
        } else {
          setTimeout( queMoko_main, 1);
        }
      }
      
    });
  }
})();

