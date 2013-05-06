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
			scriptMoko.textContent = "Moko_main( j$, CRXMOKODATA);";
			document.head.appendChild(scriptMoko);
		});
	}
})();

