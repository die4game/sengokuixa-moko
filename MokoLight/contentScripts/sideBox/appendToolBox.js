var mokoToolBox = $( '<div id="mokoToolBox"></div>'),
  ul = $('<ul></ul>');

$( '#sideboxTop').prepend( mokoToolBox);
mokoToolBox.append( ul);

ul.append(
  '<li>' +
    '<a href="' + chrome.extension.getURL( 'moko/cardList/cardList.html') + '?' +
    location.host.match(/^\w+/)[0] + '" target="_new">武将リスト</a>' +
  '</li>'
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
          span = $( '<span></span>').css( 'color', 'white');
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
