// ==UserScript==
// @name           IXA_TradeSupport
// @namespace      nobody.gameswf.ixa.tool
// @include        http://*.sengokuixa.jp/*
// @description    戦国IXA トレード補助ツール
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @version        1.0.0.0 20140609hs
// ==/UserScript==

// このツールを使って意図しない動作をしたり利用者に不都合が発生しても、作者は一切責任を負いません。
// ご利用は自己の責任でお願いします
//

// ブラウザ三国志のトレード補助ツールを基にさせていただきましたmm

$( function(){

  var version = "20140609hs";

  var host = location.hostname;
  var path = location.pathname;


  // 「トレード」「カード出品画面」で実行
  // 「出品中」「入札中」で実行
  if( path.search(/\/card\/trade\w*?\.php/) != -1 || path.indexOf("/card/exhibit_list.php") != -1 || path.indexOf("/card/bid_list.php") != -1) {
  	favorite_trade();
  }


  function favorite_trade(){
  	var l_length = 9;

    var ul = document.evaluate('//div[@id=\"ig_trademenu\"]/ul',document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);

  	// ig_trademenu li の margin-left: 205px を -(87px+2px) したいね
  	var li = document.createElement("li");
  	var fav = document.createElement("a");
  	fav.href = "javascript:void(0)";
  	fav.id = "favorite";
  	fav.innerHTML = "お気に入り";
  	var data = 'data:image/png;base64,'+
  		'iVBORw0KGgoAAAANSUhEUgAAAFcAAAAgCAIAAADojXNCAAAJGElEQVR42sWYR29WWRKGvYIlK7Ys'+
  		'+QFtu/kBbBAMQkJCrAARhcgwiDAi50yTozEm59CAmmRs0ySD2ziAbdoWOQywgg0LBvc833n7FnWD'+
  		'P0Aja17B5dxz69Speiuc81Fwt/yX6mu/3Clf/3NRcVFRUXFx7tl56Gz9CRQWFqYM6GU24Dju86dA'+
  		'/xQXFv0V0N7+n9zzr/8P2tvbM8f/i8K0TnuHiLsVG3MswAfcMNUW0Nra+meADQyPHj3681t45JD4'+
  		'1BqQuao1gh+n0ZF8W4T8q9Je4DUVcLd8Q0Fx0U+8tLS0yHQGzc3NLRGaIzQ1NTXnRVMHMAGv02v2'+
  		'n/LDhG2JzZjxHt6jTPtbmprJDhgoKCzO1YIZ/fBvND90ePDggZ6ZaGxs1DMTaXlT6GFbmxn2tJnE'+
  		'Kj/pLE+qNTFJNj584PXgO6VQQG0wamhoCDY/5G9DHPUR/PiH4PU0ZKHxO9DRwkw9frvE8oQZ6g6w'+
  		'kKuI2rr7dQH19+vu19fd/w7U1tbq+aNIq6r7DuSRT893pD+81dfW1pgLxkIuF/7I4V4wsoZRTU1N'+
  		'mIkNNOZ5L8AG3wkvX5PCH99CWjjPqkz9NvZW/c2CDoi7AbJPA8Hm/ZhndXU1g+oAvXowcyfAXrUQ'+
  		'U3LpVl/PwAsbjKNcyOrrczEJY2UyAy+WSbG31mz2e/E0w0AsF27evHnr1q3bAQjdjsDkzQCNTcZ/'+
  		'tbEJdypsd2/nnQi3s3ArgrdTg68scFr8HuHGjRu23/v37xH68uWL1vD0X29E0CqAMEs4gX7vTBDA'+
  		'TMZt8n0AZ2TC1LTZAN+/5kJVVVVlZWVFRUVlAK/v3r0bNGhQQUFB165dIeL69euskViVg155ogRh'+
  		'lhw7dizzGlfp8C6Ag6rqB0EpPXny5PXr1x8/fuQIZAbD9JSF+N+/f3/M2LVrFwLswtZ+L+8mg1hF'+
  		'XAu4cuXKtQgcqvhjLLx9+/bTp0/yhzFfKxxMOA9YKGGWm6EJPfmBBup/x44dY8aM4QdCWVkZvjGP'+
  		'tcavuiDbDRs2DJMUyMRely9fLi8vl5ux7oj/Z8+eXb169aFDhxj/O0DhhQXUDRw4sEePHvIHpTt3'+
  		'7qRjoevq1asMeNV+ea70CJ8/f54tSEtRxhIYuRpA82Ps5TWvLYCM8dByPJFMeQDGQBNfu3XrxhOy'+
  		'LEnxCDG5eeTIkSsBsVw4efLk4sWL58+fv3DhwqdPn/4jwIcXLUePHkWSyb59+/KVzWj4ly5dQvuA'+
  		'AQN69eqVPxHOnDmzcuVK9O/evVvhwsQPHz6gga979+4Vj37JpQhET2KCBLAE7sSRXMJDzpHhw4d3'+
  		'795dYmSNyTM4ffr0kiVLFgbs27fv4sWLMRZKSkr+FeHChQtbtmwxm8gFHyLuYRs2bOjXrx9EvHnz'+
  		'5reAb/62O3HiRGlp6dy5c9EPHQoXJj5//lxWwsjQoUOZhyAtwcnfHEyD94r5iwFwdOrUKRx79eoV'+
  		'qmBBMij08miYM2fO3AC8wNNYd4RFFkyfPn11AOoeP35sFZHIw/Xr1xMEBNBy7ty5dK5m5sKiRYso'+
  		'Tlhg7ahRo1BLHTGWhpcvX1LStLfNmzevW7duzZo1M2fOJGu0BQk8a9YsNBB2y1AGlABfKTTGCxYs'+
  		'WLFihYwxFsSp2bBs2TJ0oootfg2I5cKpAJwnaadMmTJ58mRos/2s8/Ps06cPr6tWraI5QdzBgwdn'+
  		'zJiRJwvMAnQSAeSpIMLVpUsXbjVEWBqmTp1qApj4zwi2hQTIREtSBpTk9u3bEcAxZCCOfsm8WJCA'+
  		't4EwQ+Xhw4fx/0xAjAUKBoPWrl1LnMePH0/QoMNOSpyHwqVLlxIZa2xUIKwdP3589uzZEyZMYJV6'+
  		'OPSph1u2ywIEsIA8tBT7/PkzPejFixe4IQ0S2LRp08SJE3nFbb8FNiROIl45/HgigDBM4YhPFkJl'+
  		'BnMTRe3y5cvRj04FPsYCojSMESNGTJo0CZ4QZZkansxVRxk7dqx37HgA6QrHNm9tMpELHFQ8TYPI'+
  		'ZRdazNatWwka3XfevHkIoI10wO09e/b4LdDgTyL5BokIEF7SYUmA3xSWtYS94FoCcIEw2xH4WF/g'+
  		'28iRI2GBBotBWmks6D8gsHXbtm1G7bNnz9j7SMCBAwfIFO+2NkZGqmhjCQes3SAGEZw7eE5XpmWM'+
  		'Hj162rRp+/fvPxygLbgU2dZ0EE5Ec48rI2I4SV+AxHHjxmkXLoi2hMRECQlOno4NIH1U5l9Z4KBi'+
  		'8ZAhQ2CBUsR6u3LIXLUG0Lt3b8aYi1k4j61cMTBCNxbPgsRkR8+ePS0+tAM+mVrChVjfAH/vRPOB'+
  		'AAZ0TckgD91YSF/UQcYk4cFhzCD/ySBiiZMcnLaEAQIYiTaSHQG4oDezJPY7gvX0AhZv3LixLIB6'+
  		'0zaDBw82Rsw3fC6LQOnqrLWLmviSY1x4mfEscKr50tUd3J/NJin9dkkBlDR20hFxwKgx+nASM2go'+
  		'bGGfGCBJpohT2hZEqKeCWC5QgazfEwfXMnxoa2vj1slAIWLAK7mDOoklDnzaii6qSHKaooTDzzxU'+
  		'3vnSRQOqtJc/XLSFSaIBPYghD+8kCE8Y9PRpFY6gShSwRNYqWjzRuS9gf0Dsf9zkUkkAY5YZLzxp'+
  		'zhqbWGmA5EUEP2NaWlq4HXP8lMRB9ur2oZQREq95IEk0oIdXylteAQbkETUlGU3K/icBUCBTbYle'+
  		'LZGTfcF7JVGFWvMiwpw3RkzGYGx2Esz/sjgUajmiKJamoHnQIQs+/gn3jB0jhYH26wgmr7XkHicT'+
  		'1YutItTD1Ppk9ALUM8tV9hZYy3P5b9gbQSFJGGa5nMGCrff+W/At7Am7EyljvHg2rax2RdgdoPwy'+
  		'RjzdXqdpSKShZb6x4HNeY8+C8WL2SyaDBSsbHxyzxmasOowyP5PJmsDhJCJMSZpQY83PGzs+X8xb'+
  		'a5Y+F3xQExXhMy6bBePM02Fxtmbps1qv8i0zTSzylhGJ5YnS834am16JT1LfF+wUSCRmulq1qfp6'+
  		'si/4jPCEJcoskfCCseCJSJS3WWDCYtCbm04E++rTxwsk2qQlgtlsBZLu3zEWMo+TzIJP2JrOhbTb'+
  		'adjR2xERiTT2zTuPgJ0U/sgQ9JpIOvbV74j/AjqjENfy1PelAAAAAElFTkSuQmCC';
  	fav.style.backgroundImage = "url( " + data + " )";

  	fav.addEventListener("click",function(){seach_trade();},false);
  	ul.appendChild(li);
  	li.appendChild(fav);

  	var header = document.getElementById( "ig_deckheadmenubox" );
  	var set1 = document.createElement("a");
  	set1.href = "javascript:void(0)";
  	set1.id   = "setting";
  	set1.innerHTML = "<div class='rightF'>トレード補助設定</div>";
  	set1.addEventListener("click",function(){set_favorite();},false);
  	header.appendChild(set1);

  	function set_favorite(){
  		// 「取引」ボタンでリロードするように(他のボタンは平気っぽい)
  		var link = document.evaluate("//li[@class=\"t_menu1on\"]/a",document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
  		if( link != null ) {
  			link.addEventListener("click",function(){;location.reload();},false);
  		}

  		var table = document.getElementsByClassName("ig_decksection_mid").item(0);
  		var html = "";

  		html += "<table class='tradeTables'><tr><td>";
  		html += "<b>IXA　FavoriteTrade　ver." + version + "</b><br>";
  		html += "　<br>";


  		html += "　・お気に入りトレード<br>";

  				for(var i=0;i<l_length;i++){

  					html += "　　　検索条件:&nbsp;&nbsp;";
  					html += "<select name='t"+i+"' id='t"+i+"' class='combo'>";
  					html += "<option value='name'>武将名</option><option value='lv'>レベル</option><option value='no'>カードNo</option><option value='skill'>所持スキル</option>";
  					html += "</select>&nbsp;";
  					html += "<input type='text' name='k"+i+"' id='k"+i+"' class='text' value='' size=15 />&nbsp;";
  					html += "<br>\n";
  				}

  		html += "<br>　　　<input type=button id=save_set value=設定を保存 /><br>\n";
  	  html += bushoCheckbox(bushoArray());
  		html += "</td></tr></table>\n";

  		table.innerHTML = html;

  		document.getElementById("save_set").addEventListener("click",function(){save_setting();},false);

  		function save_setting(){
  			var t = 1;
  			var f = 0;

  			save_list();
  			alert("保存しました");
  		}

  	  var list,
  	      i=0;
  	  if (localStorage.IXA_FAV_TRADE) {
  	    list = JSON.parse(localStorage.IXA_FAV_TRADE);
    		for(i=0;i<l_length;i++){ // 検索条件の設定

    			if(list[i].t != ""){
    				var sel = document.getElementById("t"+i);
    			  sel.value = list[i].t;
    			}
    			document.getElementById("k"+i).value= list[i].k;

    		}
  	    bushoChecked(list.slice(l_length));
  	  }

  		function save_list(){
  		  var list = [],
  		      i=0,
  		      j=0,
  		      b = bushoCheck();
  			for(i=0;i<l_length;i++){
  				var sel 	= document.getElementById("t"+i);
  			  list[i] 	= {"t":sel.value, "k":document.getElementById("k"+i).value};
  			}
  		  for(i,j=0;j<b.length;j++,i++){
  		    list[i] = {"t":"name", "k":b[j]}
  		  }
  		  localStorage.IXA_FAV_TRADE = JSON.stringify(list);
  		}

  	}

  	function seach_trade(){
  		// 「取引」ボタンでリロードするように(他のボタンは平気っぽい)
  		var link = document.evaluate("//li[@class=\"t_menu1on\"]/a",document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
  		if( link != null ) {
  			link.addEventListener("click",function(){;location.reload();},false);
  		}

  		var decksection_top = document.getElementsByClassName("ig_decksection_top").item(0);
  		decksection_top.innerHTML = "お気に入り";

  		var decksection_mid = document.getElementsByClassName("ig_decksection_mid").item(0);
  		var mid_html = "";
  		mid_html += "<div class='clearfix'><div class='t_cardstock rightF'></div></div>";
  		mid_html += "<div class='ig_decksection_innertop'>&nbsp;</div>";
  		mid_html += "<div class='ig_decksection_innermid'>";
  		mid_html += "<table class='common_table1 center mt10' id='ftrade'></table></div>";
  		mid_html += "<div class='ig_decksection_innerbottom'>&nbsp;</div>";

  		decksection_mid.innerHTML = mid_html;

  		var trade = document.getElementById("ftrade");

  		var status = document.getElementsByClassName("t_cardstock").item(0);
  		var status_html = "";
  		status_html += "<span id=read>取得中...";
  		status_html += "<span id=count>0</span>/"+l_length;
  		status_html += ":&nbsp;<span id=nowpage>1</span>/<span id=lastpage>1</span>頁";
  		status_html += "</span>";
  		
  		status.innerHTML = status_html;

  		var cnt = 0;
  		var now  = document.getElementById("nowpage");
  		var last = document.getElementById("lastpage");

  	  var list,
  	      list_t,
  	      list_k,
  	      i;
  	  if (localStorage.IXA_FAV_TRADE) {
  	    list = JSON.parse(localStorage.IXA_FAV_TRADE);
    		for (i=0; i <= list.length; i++) {

    		  if (list[i]) {
      			list_t 	= list[i].t;
      			list_k 	= list[i].k;
    		  } else {
    		    list_t = "";
    		    list_k = "";
    		  }

    			if(list_k != ""){
    				var dom = document.createElement("div");
    				var t_url = "http://"+location.host+"/card/trade.php?&t="+list_t+"&k="+list_k+"&s=price&o=a";

    				//GM_log( t_url );

    				dom.innerHTML = getContentFromURL(t_url);

    				dom.id = 'TempDOM' + i + '_1';
    				dom.style.display = "none";
    				document.body.appendChild(dom);

    				var area    = "//div[@id=\"TempDOM"+i+"_1\"]//*[@class=\"ig_decksection_innermid\"]";
    				comment = document.evaluate(area, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).innerHTML;

    				var lastpage = 0;
    				if( dom.innerHTML.indexOf("pager") == -1 ) {
    					if(comment.indexOf("現在入札可能な出品はありません") == -1 ){
    						lastpage = 1;
    						last.innerHTML = lastpage ;
    						var profile = "//div[@id=\"TempDOM"+i+"_1\"]//*[@class=\"ig_decksection_innermid\"]//*[@class=\"common_table1 center mt10\"]";
    						trade.innerHTML += document.evaluate(profile, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).innerHTML;
    					}
    				} else {
    					var prof = "//div[@id=\"TempDOM"+i+"_1\"]//*[@class=\"ig_decksection_innermid\"]//*[@class=\"pager\"]//*[@title=\"last page\"]/@href";
    					var address = document.evaluate(prof, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
    					address.match(/trade.php\?.*\&p=([0-9]*)/);
    					lastpage = parseInt(RegExp.$1);

    					last.innerHTML = lastpage ;

    					for(var p = 1; p <= lastpage; p++){
    						now.innerHTML = p ;
    						var dom2 = document.createElement("div");
    						var url2 = "http://"+location.host+"/card/trade.php?&t="+list_t+"&k="+list_k+"&s=price&o=a&p="+p;

    						dom2.innerHTML = getContentFromURL(url2);
    						dom2.id = 'TempDOM' + i + '_' + p;
    						dom2.style.display = "none";
    						document.body.appendChild(dom2);
    						var profile = "//div[@id=\"TempDOM"+i+"_" + p + "\"]//*[@class=\"ig_decksection_innermid\"]//*[@class=\"common_table1 center mt10\"]";
    						trade.innerHTML += document.evaluate(profile, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).innerHTML;
    						break;//1pのみ取得

    					}
    				}
    			}
    			cnt += 1;
    			document.getElementById("count").innerHTML = cnt;
    		}
  	  }
  		document.getElementById("read").innerHTML = "完了";

  	}


    // レスポンスの取得
    //
    function getContentFromURL(url) {
    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.open('GET', url, false);
    	xmlhttp.send();

    	if (xmlhttp.status == 200){
    		return xmlhttp.responseText;
    	}
    	else {
    		return "";
    	}
    }

    //プリセット用武将名配列
    function bushoArray () {
      var a = [
        '森好之',
        '椿姫',
        '一柳直盛',
        '明石全登',
        '山名豊国',
        '大友義統',
        '織田有楽斎',
        '平野長泰',
        '古田織部',
        '有馬晴信',
        '朝比奈泰朝',
        '角隈石宗',
        '平手政秀',
        '小島弥太郎',
        '京極マリア',
        '筒井順慶',
        '片桐且元',
        '猿飛佐助',
        '富田重政',
        '村上武吉',
        '九鬼嘉隆',
        '丸目長恵',
        '種子島時尭',
        '塚原卜伝',
        '中野宗時',
        '安国寺恵瓊',
        '吉乃',
        '五郎八姫',
        'ねね',
        '江',
        '初',
        '風魔小太郎',
        '草薙かさね',
        'お市',
        '斎藤義龍',
        '宝蔵院胤栄',
        '鶴姫',
        '服部半蔵',
        '千利休',
        '濃姫',
        '茶々',
        '竹中半兵衛',
        '徳川家康',
        '足利義昭'
      ];
      return a;
    }
    //チェックボックス生成
    function bushoCheckbox (b) {
      var a='', i;
      for (i=0;i<b.length;i++) {
        a += ((i-Math.floor(i/4)*4)==0?'<br />':'')+
          '<label style="margin:0.2em 1em"><input type="checkbox" name="preset" value="'+b[i]+'" style="margin-right:1em" />'+
          '<span style="display:inline-block; width:8em">'+b[i]+'</span>'+'</label>';
      }
      return a;
    }
    //チェックボックスのチェックドリスト取得
    function bushoCheck () {
      var a = document.getElementsByName("preset"),
          b=[];
      for (i=0;i<a.length;i++) {
        if (a[i].checked) b.push(a[i].value);
      }
      return b
    }
    //チェックボックスをチェック
    function bushoChecked (list) {
      var a = document.getElementsByName("preset"),
          i,
          j;
      for (i=0;i<list.length;i++) {
        for (j=0;j<a.length;j++) {
          if (a[j].value == list[i].k) a[j].checked = true;
        }
      }
    }

  }

});