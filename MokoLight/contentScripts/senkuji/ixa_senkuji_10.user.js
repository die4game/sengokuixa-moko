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

$( function kuji10_main()
{
  if( location.pathname == '/senkuji/senkuji.php' )
  {
    //jQuery.event.special.ready.setup();
    $( '#cardmachineContainer').append(
      '<div id="kuji_result"'+
        'style="'+
          'display: none;'+
          'position: absolute;'+
          'z-index: 100;'+
          'color: white;'+
          'background: black;'+
          'width: 80px;'+
          'top: 20%;'+
          'left: 50%;'+
          'margin-left: -40px;'+
          'border: solid 2px goldenrod;'+
          'text-align: center;'+
          'padding: 2px;'+
      '"></div>' );

    $("span.money_b_txt"      ).replaceWith( '<a href="javascript:void(0)" class="white">銅銭　100 x10</a>' );
    $("span.money_c_txt:first").replaceWith( '<a href="javascript:void(0)" class="silver">金　300 x10</a>' );
    $("span.money_c_txt:last" ).replaceWith( '<a href="javascript:void(0)" class="gold">金　600 x10</a>' );

    // 白くじ
    $("a.white").click( function() {
      $('#kuji_result').show().children().remove();

      var _data = "send=send&got_type=0";

      for( var i = 0; i < 10; i++ )
      {
        post_senkuji( _data );
      }
    } );

    // 銀くじ
    $("a.silver").click( function() {
      $('#kuji_result').show().children().remove();

      var _data = "send=send&got_type=200";

      for( var i = 0; i < 10; i++ )
      {
        post_senkuji( _data );
      }
    } );

    // 金くじ
    $("a.gold").click( function() {
      $('#kuji_result').show().children().remove();

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
      $('#kuji_result').append( '<span>' +result.text() + '</span><br/>' ).click( function () { $('#kuji_result').hide();});
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      //console.log(textStatus);
    }
    } );
  }
});
