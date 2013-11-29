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
                } else {
                  cnt++;
                  ano = Math.floor( cnt/4);
                  deckset();
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
});
