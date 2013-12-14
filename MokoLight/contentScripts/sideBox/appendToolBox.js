chrome.storage.local.get( 'world', function ( item) {
  var mokoToolBox = $( '<div id="mokoToolBox"></div>'),
      ul = $('<ul></ul>'),
      flg = '2',
      w = location.host.replace( '.sengokuixa.jp', '');

  if ( item.world && item.world[w])
    flg = item.world[w];


  $( '#sideboxTop').prepend( mokoToolBox);
  mokoToolBox.append( ul);

  ul.append(
    $( '<li><a href="javascript:void(0)">武将リスト</a></li>')
    .on( 'click', function ( e) {
      chrome.runtime.sendMessage( chrome.extension.getURL( 'moko/cardList/cardList.html') + '?' + location.host.match(/^\w+/)[0]);
    })
  );

  ul.append(
    $(
      '<li>' +
        '<a href="javascript:void(0);" id="set_unit_1">兵0全セット</a>' +
      '</li>'
    ).on( 'click', function ( e) {
      $.post(
        'http://' + location.host + '/facility/set_unit_list.php',
        { show_deck_card_count: '',
          show_num: '',
          select_card_group: '',
          p: '',
          now_unit_type: 'all_unit',
          now_group_type: 0,
          edit_unit_type: 'not_unit',
          edit_unit_count: 0,
          btnlumpsum: true }
      )
    })
  );

  if ( flg === '0' || flg === '2')
    ul.append(
      $(
        '<li>' +
          '<a href="javascript:void(0);" id="set_unit_1">騎馬兵1全セット</a>' +
        '</li>'
      ).on( 'click', function ( e) {
        $.post(
          'http://' + location.host + '/facility/set_unit_list.php',
          { show_deck_card_count: '',
            show_num: '',
            select_card_group: '',
            p: '',
            now_unit_type: 'all_unit',
            now_group_type: 0,
            edit_unit_type: 329,
            edit_unit_count: 1,
            btnlumpsum: true }
        )
      })
    );

  if ( flg === '1' || flg === '2')
    ul.append(
      $(
        '<li>' +
          '<a href="javascript:void(0);" id="set_unit_1">精鋭騎馬1全セット</a>' +
        '</li>'
      ).on( 'click', function ( e) {
        $.post(
          'http://' + location.host + '/facility/set_unit_list.php',
          { show_deck_card_count: '',
            show_num: '',
            select_card_group: '',
            p: '',
            now_unit_type: 'all_unit',
            now_group_type: 0,
            edit_unit_type: 330,
            edit_unit_count: 1,
            btnlumpsum: true }
        )
      })
    );

  ul.append(
    $(
      '<li>' +
        '<a href="javascript:void(0);" id="deck_unregist_all">全解散</a>' +
      '</li>'
    ).on( 'click', function ( e) {
      $.get( 'http://'+location.host+'/card/deck.php')
      .done( function ( data) {
        var html = $.parseHTML( data),
            a = $( html).find( 'div.deck_navi>a[onclick^=confirmUnregist]'),
            a_onclick = a.attr( 'onclick'),
            formdata = a_onclick? a_onclick.match( /\d+/g): false,
            li = $( e.target).parent(),
            span = $( '<span></span>').css( 'color', 'white');
        li.find( 'span').remove();
        $( e.target).after( span);
        span.text( ' 解散中..');
        ( function kaisan( formdata, cnt) {
          if ( formdata) {
            $.post( 'http://'+location.host+'/card/deck.php',
              { select_assign_no: '0',
                unit_assign_id: formdata[0],
                unset_card_id: formdata[1],
                change_unit_squad_id: '',
                p: 1,
                select_card_group: '' }
            ).done( function ( data) {
              var html = $.parseHTML( data),
                  a = $( html).find( 'div.deck_navi>a[onclick^=confirmUnregist]'),
                  a_onclick = a.attr( 'onclick'),
                  formdata = a_onclick? a_onclick.match( /\d+/g): false;
              kaisan( formdata, ++cnt);
              span.text( ' 解散中..'+cnt);
            });
          } else {
            span.remove();
            $( e.target).after( $( '<span> 完了</span>').css( 'color', 'white'));
          }
        })( formdata, 0);
      });
    })
  );

  ul.append(
    $(
      '<li>' +
        '<a href="javascript:void(0);" id="deck_regist_all">全配置</a>' +
      '</li>'
    ).on( 'click', function ( e) {
      var ano = $( '#select_assign_no').val(),
          p = '1',
          cnt = ano*4,
          shoryo = $( '#select_village').val(),
          li = $( e.target).parent(),
          span = $( '<span></span>').css( 'color', 'white');
      li.find( 'span').remove();
      $( e.target).after( span);
      if ( shoryo) {
        span.text( ' 配置中..');
        ( function deckset() {
          $.get( 'http://'+location.host+'/card/deck.php?ano='+ano+'&p='+p)
          .done( function ( data) {
            var html = $.parseHTML( data),
                a = $(html).find( 'a[style=""][onclick^=confirmRegist2]'),
                a_onclick = a.attr('onclick'),
                formdata = a_onclick? a_onclick.match(/\d+/g): false,
                p_max, cost, cost_zan;
            if ( formdata) {
              formdata.shift();
              span.text( ' 配置中..(ano:'+ano+', p:'+p+', cnt:'+cnt+')');
              $.post(
                'http://'+location.host+'/card/deck.php',
                { target_card: '',
                  select_assign_no: ano,
                  mode: 'assign_insert',
                  btn_change_flg: '',
                  set_village_id: shoryo,
                  set_assign_id: formdata.length<5? '': formdata.shift(),
                  set_squad_id: '',
                  set_card_id: formdata.shift(),
                  p: p,
                  myselect_2: shoryo }
              ).done( function ( data) {
                var html = $.parseHTML( data),
                    p = $(html).find( 'p.red');
                if ( p.length) {
                  span.text( p.text());
                } else if ( cnt < 19 ) {
                  cnt++;
                  ano = Math.floor( cnt/4);
                  deckset();
                } else {
                  span.remove();
                  $( e.target).after( $( '<span> 完了</span>').css( 'color', 'white'));
                }
              });
            } else {
              p_max = $( html).find( 'ul.pager li.last');
              cost = $( html).find( '#ig_deckcost span.ig_deckcostdata').text().match( /[\d.]+/g);
              cost_zan = cost[1] - cost[0];
              if ( cnt < 20 && p_max.length > 0 && cost_zan >= 1) {
                p++;
                deckset();
              } else {
                span.remove();
                $( e.target).after( $( '<span> 完了</span>').css( 'color', 'white'));
              }
            }
          });
        })();
      } else
        span.text( ' 拠点未設定');
    })
  );

  //資源平滑化
  ul.append(
    $(
      '<li>' +
        '<a href="javascript:void(0);" id="source_flat">資源平滑化</a>' +
      '</li>'
    ).on( 'click', function ( e) {
      var quantity = [], item = [ '101', '102', '103', '104'], item_name = { 101: '木', 102: '綿', 103: '鉄', 104: '米'},
          reverce = {}, m, t, trade = [], world = w,
          shoryo = $( 'input[name="village_id"]').val(), x = $( 'input[name="x"]').val(), y = $( 'input[name="y"]').val(),
          r = parseFloat( $( 'tr:has(img[alt="取引相場"])>td:eq(0)>span').text())/100;
      $( 'span.normal').each( function ( idx, elm) {
        var num = parseInt( elm.innerText, 10);
        quantity.push( [ num, item[ idx]]);
      });
      quantity.sort( function ( a, b) { return b[0] - a[0];});
      m = ( r*quantity[ 0][ 0] + quantity[ 1][ 0] + quantity[ 2][ 0] + quantity[ 3][ 0])/( r + 3);
      t = [ quantity[ 0][ 0]-m, quantity[ 1][ 0]-m, quantity[ 2][ 0]-m, quantity[ 3][ 0]-m];
      if ( t[ 1] > 0) {
        m = ( r*( quantity[ 0][ 0] + quantity[ 1][ 0]) + quantity[ 2][ 0] + quantity[ 3][ 0])/( 2*r + 2);
        t = [ quantity[ 0][ 0]-m, quantity[ 1][ 0]-m, quantity[ 2][ 0]-m, quantity[ 3][ 0]-m];
        if ( t[ 2] > 0) {
          m = ( r*( quantity[ 0][ 0] + quantity[ 1][ 0] + quantity[ 2][ 0]) + quantity[ 3][ 0])/( 3*r + 1);
          t = [ quantity[ 0][ 0]-m, quantity[ 1][ 0]-m, quantity[ 2][ 0]-m, quantity[ 3][ 0]-m];
        }
      }
      if ( t[ 1] < 0) {
        trade.push( [ quantity[ 0][ 1], quantity[ 1][ 1], Math.floor( -t[ 1]/r/100)*100]);
        trade.push( [ quantity[ 0][ 1], quantity[ 2][ 1], Math.floor( -t[ 2]/r/100)*100]);
        trade.push( [ quantity[ 0][ 1], quantity[ 3][ 1], Math.floor( -t[ 3]/r/100)*100]);
      } else if ( t[ 2] < 0) {
        trade.push( [ quantity[ 0][ 1], quantity[ 2][ 1], Math.floor( -t[ 2]/r/100)*100]);
        trade.push( [ quantity[ 0][ 1], quantity[ 3][ 1], Math.floor( ( t[ 0]+t[ 2]/r)/100)*100]);
        trade.push( [ quantity[ 1][ 1], quantity[ 3][ 1], Math.floor( t[ 1]/100)*100]);
      } else if ( t[ 3] < 0) {
        trade.push( [ quantity[ 0][ 1], quantity[ 3][ 1], Math.floor( t[ 0]/100)*100]);
        trade.push( [ quantity[ 1][ 1], quantity[ 3][ 1], Math.floor( t[ 1]/100)*100]);
        trade.push( [ quantity[ 2][ 1], quantity[ 3][ 1], Math.floor( t[ 2]/100)*100]);
      }
      //console.log( trade);
      if ( confirm( '資源量を'+Math.floor(m/100)*100+'に揃えます。\n'+
        item_name[ trade[0][0]]+'→'+item_name[ trade[0][1]]+':'+trade[0][2]+'\n'+
        item_name[ trade[1][0]]+'→'+item_name[ trade[1][1]]+':'+trade[1][2]+'\n'+
        item_name[ trade[2][0]]+'→'+item_name[ trade[2][1]]+':'+trade[2][2]+'\n'+
        'よろしいですか？')) {
        for( i=0; i<3; i++) {
          if ( trade[i][2] === 0)
            continue;
          $.post( 'http://'+world+'.sengokuixa.jp/facility/facility.php',
            { x: x, y: y, village_id: shoryo, tf_id: trade[i][0], tt_id: trade[i][1], tc: trade[i][2], change_btn: true}
          );
        }
      }
    })
  );
});
