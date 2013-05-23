// ==UserScript==
// @name           ixa_senkuji_10
// @namespace      ixa_senkuji_10
// @version        1.0.1
// @description    戦国IXA 戦国くじを10枚引く
// @include        http://*.sengokuixa.jp/senkuji/senkuji.php
// @match          http://*.sengokuixa.jp/senkuji/senkuji.php
// ==/UserScript==


// jQuery
//var j$ = unsafeWindow.jQuery;

// http://kingyo-bachi.blogspot.com/2010/12/chromegresemonkeyquery.html
//

function kuji10_main( $ )
{
	if( location.pathname == '/senkuji/senkuji.php' )
	{
		//jQuery.event.special.ready.setup();
		$(document.body).append( '<div id="kuji_result" style="display:none;"></div>' );
		
		$("span.money_b_txt"      ).replaceWith( '<a href="#TB_inline?height=200&amp;width=300&amp;inlineId=kuji_result" class="white" title="戦国くじ白を10回引く" onclick="return false;">銅銭　100 x10</a>' );
		$("span.money_c_txt:first").replaceWith( '<a href="#TB_inline?height=200&amp;width=300&amp;inlineId=kuji_result" class="silver" title="戦国くじ銀を10回引く" onclick="return false;">金　300 x10</a>' );
		$("span.money_c_txt:last" ).replaceWith( '<a href="#TB_inline?height=200&amp;width=300&amp;inlineId=kuji_result" class="gold" title="戦国くじ金を10回引く" onclick="return false;">金　600 x10</a>' );

		// 白くじ
		$("a.white").live("mousedown", function() {
			$('#kuji_result').children().remove();
			tb_init( 'a.white' );

			var _data = "send=send&got_type=0";

			for( var i = 0; i < 10; i++ )
			{
				post_senkuji( _data );
			}
		} );

		// 銀くじ
		$("a.silver").live("mousedown", function() {
			$('#kuji_result').children().remove();
			tb_init( 'a.silver' );

			var _data = "send=send&got_type=200";

			for( var i = 0; i < 10; i++ )
			{
				post_senkuji( _data );
			}
		} );

		// 金くじ
		$("a.gold").live("mousedown", function() {
			$('#kuji_result').children().remove();
			tb_init( 'a.gold' );

			var _data = "send=send&got_type=300";

			for( var i = 0; i < 10; i++ )
			{
				post_senkuji( _data );
			}
		} );
	}

	// くじ引きと結果
	function post_senkuji( _data ) {
		$.ajax( {
		type:"POST",
		url:"http://"+location.hostname+"/senkuji/senkuji.php",
		cache: false,
		dataType: "text",
		data: _data,
		success: function(x) {
			var result = $(x).find( 'strong.red' ).eq(0);
			$('#TB_ajaxContent').append( '<span>' +result.text() + '</span><br/>' );
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			//console.log(textStatus);
		}
		} );
	}
}
