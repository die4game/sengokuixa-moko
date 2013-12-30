$( function () {
  var world,
    column = localStorage.column? JSON.parse( localStorage.column): [ true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true ],
    villageIds = localStorage.villageIds? JSON.parse( localStorage.villageIds): {},
    favorite = [],
    UnitCode = {
      "足軽" : 321, "長槍足軽": 322, "武士" : 323, "国人衆" : 324, "弓足軽" : 325, "長弓兵" : 326, "弓騎馬" : 327,
      "海賊衆" : 328, "騎馬兵" : 329, "精鋭騎馬": 330, "赤備え" : 331, "母衣衆" : 332, "破城鎚" : 333, "攻城櫓" : 334,
      "大筒兵" : 335, "鉄砲足軽": 336, "騎馬鉄砲": 337, "雑賀衆" : 338, "焙烙火矢": 345,
      getKey: function ( val) {
        var returnKey = '';
        for ( var key in this)
          if ( this[key] === parseInt( val, 10)) returnKey = key;
        return returnKey;
      }
    };

  // カレントタブ取得
  chrome.tabs.getCurrent( function ( tab) {
    world = tab.url.split( '?')[1];
    $(cardList);
    chrome.storage.local.get( world, function ( store) {
      if ( !store[ world])
        store[ world] = {};
      if ( !store[ world].cardList)
        store[ world].cardList = {};
      if ( !store[ world].cardList.favorite)
        store[ world].cardList.favorite = [];
      else
        favorite = store[ world].cardList.favorite;
      if ( !store[ world].xyc)
        store[ world].xyc = [ '', '', ''];
      chrome.storage.local.set( store, function () {
        var no = favorite.length,
            xyc = store[ world].xyc;
        for ( no; no > 0; no--) {
          $( '#checkPage').after( '<button class="favo" value=' + no + '>favo' + no + '</button>');
          $( '#favoriteDelete').prev().prepend( '<option value=' + no + '>favo' + no + '</option>');
        }
        $( '#attack input').each( function ( idx, obj) {
          obj.value = xyc[idx];
        });
      });
    });
  });


  //////////////////
  // function定義 //
  //////////////////

  // 初期設定、イベント設定
  function cardList () {

    // 表示列チェックボックスのtoggle
    $('button.uldoption').click(function() {
      $('ul.uldoption').toggle();
    });

    // 列の表示初期設定
    $('ul.uldoption input').click(function() {
      var $this = $(this),
      $this_tag = $this.parent().text().match(/ : ([\S]+)/)[1];
      if ($this.prop('checked')) {
        if ($this_tag.match(/(?:実指揮)|(?:ｺｽﾄ比)/)) {
          $this.parent().parent().parent().next().find('input').each(function() {
            var $this = $(this);
            if ($this.prop('checked')) {
              $('#tb_unit .' + $(this).parent().text().match(/ : ([\S]+)/)[1] + '.' + $this_tag).show();
            }
          });
        } else {
          $('#tb_unit .' + $(this).parent().text().match(/ : ([\S]+)/)[1]).show();
          if ($this_tag.match(/[槍馬弓器]/)) {
            $this.parent().parent().parent().prev().find('li:contains("実指揮") input, li:contains("ｺｽﾄ比") input').each(function() {
              var $this = $(this);
              if (!$this.prop('checked')) {
                $('#tb_unit .' + $(this).parent().text().match(/ : ([\S]+)/)[1] + '.' + $this_tag).hide();
              }
            });
          }
        }
      } else {
        $('#tb_unit .' + $(this).parent().text().match(/ : ([\S]+)/)[1]).hide();
      }
      $( 'ul.uldoption input').each( function ( idx, elm) {
        column[ idx] = elm.checked;
      });
      localStorage.column = JSON.stringify( column);
    }).each( function ( idx, elm) {
      elm.checked = column[idx];
    });

    // 配置
    $('#v_head').on('click', 'button.set_unitlist', function() {
      unit_set( $(this).parent().parent());
    });

    // 総攻防力
    $('#energy').on('click', 'button', function () {
      $(this).next().text( cal_energy( $('tr:has( input[name^="id"]:checked)')));
    });

    // 武将リスト取得実行
    $( function () {
      $('div.pager').hide();
      $('#cardList').css({'opacity': '0.3'});
      $('div.Loading').show();
      unitListLoad(1, 0);
    });

    // 出陣
    $( '#attack').on( 'click', 'button', function ( e) {
      var $attack = $( '#attack'),
        msg = $attack.find( 'span').text( ''),
        x = $attack.find( 'input[name="village_x_value"]').val(),
        y = $attack.find( 'input[name="village_y_value"]').val(),
        url = 'http://'+world+'.sengokuixa.jp/facility/send_troop.php?x='+x+'&y='+y,
        unit_select = [],
        data = {
          village_name: '',
          village_x_value: x,
          village_y_value: y,
          country_id: '',
          unit_assign_card_id: '',
          radio_move_type: 302,
          show_beat_bandit_flg: '',
          unit_select: '',
          x: '',
          y: '',
          card_id: 204,
          btn_send: true
        },
        village = {},
        key;
      $('#cardList').css({'opacity': '0.3'});
      $('div.Loading').show();
      if ( confirm( '全部隊を( '+x+', '+y+')へ出陣')) {
        $( '#v_head button.set_unitlist').each( function ( i, el) {
          var base = $( el).parent().prev( 'span.base').text().match(/\S+/g),
              val = $( el).val();
          if ( base[1] === '未設定') {
            return false;
          } else if ( $( el).parent().prevAll( 'span.condition').text() === '(待機)') {
            if ( !villageIds[ base[ 1]]) get_villageId();
            village[ val] = 'http://' + world + '.sengokuixa.jp/village_change.php?village_id=' + villageIds[ base[ 1]];
            unit_select.push( [ val, $( el).parent().parent().attr( 'select_assign_no')]);
          }
        });
        unit_select.map( function ( elm) {
          data.unit_select = elm[0];
          $.ajax({
            url: village[ elm[0]],
            async: false,
            success: function ( html, textStatus, jqXHR) {
              $.ajax({
                url: url,
                async: false,
                type: 'POST',
                data: data,
                success: function ( html, textStatus, jqXHR) {
                  //console.log(html);
                  if ( html.match( 'ano='+elm[1]) && html.match( 'mode_attack')) {
                    msg.append( ' ano'+elm[1]+':完了');
                    $( 'div.ano[unit_assign_id='+elm[0]+'] span.condition').text( '(攻撃)');
                  } else {
                    msg.append( ' ano'+elm[1]+':失敗');
                  }
                }
              });
            }
          });
        });
      }
      $('#cardList').css({'opacity': '1.0'});
      $('div.Loading').hide();
    }).on( 'change', 'input', function ( e) {
      var xyc = [];
      $( '#attack input').each( function ( idx, elm) {
        xyc.push( elm.value);
      });
      chrome.storage.local.get( world, function ( store) {
        store[ world].xyc = xyc;
        chrome.storage.local.set( store);
      })
    });

    // 解散、外す
    $( '#v_head').on( 'click', 'div.ano>button', function () {
      //console.log( 'click', $(this).val());
      var div_ano = $( this).parent(), btn = $( this);
      if ( !$( this).val()) return;
      $('#cardList').css({'opacity': '0.3'});
      $('div.Loading').show();
      if ( confirm( btn.next().text() + 'を' + btn.text())) {
        $.post( 'http://' + world + '.sengokuixa.jp/card/deck.php',
          { select_assign_no: div_ano.attr( 'select_assign_no'),
            unit_assign_id: div_ano.attr( 'unit_assign_id'),
            unset_card_id: btn.val(),
            change_unit_squad_id: '',
            p: 1,
            select_card_group: 0
          },
          function ( html) {
            var $html = $( html), tag = btn.text();
            if ( tag === '解散')
              location.reload();
            else {
              var busho = $( '#tb_unitlist>tr>td.選択>input[value="' + btn.val() + '"]').parent();
              busho.toggleClass( '隊');
              busho.parent().find( 'td.組').text('');
              btn.val( '').next().text( '[-----]');
              $( '#tb_unit').trigger( 'update');
            }
          }
        );
      }
      $('#cardList').css({'opacity': '1.0'});
      $('div.Loading').hide();
    });
  }

  //選択
  $( '#checkAll').on( 'click', function ( e) {
    $(this).toggleClass( 'checked');
    bool = $(this).hasClass( 'checked');
    $( '#tb_unitlist .選択 [name=id]').prop( 'checked', bool);
    $( '#tb_unit').trigger( 'update');
  });

  $( '#checkDeck').on( 'click', function ( e) {
    $(this).toggleClass( 'checked');
    bool = $(this).hasClass( 'checked');
    $( '#tb_unitlist .選択.隊 [name=id]').prop( 'checked', bool);
    $( '#tb_unit').trigger( 'update');
  });

  $( '#checkToggle').on( 'click', function ( e) {
    $( '#tb_unitlist .選択 [name=id]').each( function ( i, elm) {
      $( elm).prop( 'checked', !$( elm).prop( 'checked'));
    });
    $( '#tb_unit').trigger( 'update');
  });

  $( '#checkPage').on( 'click', function ( e) {
    $(this).toggleClass( 'checked');
    bool = $(this).hasClass( 'checked');
    $( '#tb_unitlist .選択:visible [name=id]').prop( 'checked', bool);
    $( '#tb_unit').trigger( 'update');
  });

  //お気に入り
  $( '#onTable').on( 'click', 'button.favo', function ( e) {
    var idx = $( this).val() - 1, bool;
    $(this).toggleClass( 'checked');
    bool = $(this).hasClass( 'checked');
    console.log( idx, bool, favorite[idx]);
    $.each( favorite[idx], function ( idx, elm) {
      $( '#tb_unitlist td.選択 input[value=' + elm + ']').prop( 'checked', bool);
    });
    $( '#tb_unit').trigger( 'update');
  });

  $( '#favoriteWrite').on( 'click', function ( e) {
    var idList = [];
    $( '#tb_unitlist .選択 [name=id]:checked').each( function ( i, elm) {
      idList.push( $(elm).val());
    });
    if ( idList.length === 0)
      return;
    chrome.storage.local.get( world, function ( store) {
      favorite.push( idList);
      store[ world].cardList.favorite = favorite;
      chrome.storage.local.set( store, function () {
        var no = favorite.length;
        $( e.target).prev().before( '<button class="favo" value=' + no + '>favo' + no + '</button>');
        $( '#favoriteDelete').prev().append( '<option value=' + no + '>favo' + no + '</option>');
        //console.log(e.target);
      });
    });
  });

  $( '#favoriteDelete').on( 'click', function ( e) {
    var no = $( this).prev().val();
    if ( !no)
      return;
    chrome.storage.local.get( world, function ( store) {
      favorite.splice( no - 1, 1);
      store[ world].cardList.favorite = favorite;
      chrome.storage.local.set( store, function () {
        var no = favorite.length;
        $( '#onTable > button.favo:last').remove();
        $( '#favoriteDelete').prev().children( 'option:last').remove();
        //console.log(e.target);
      });
    });
  });

  // 武将リスト取得
  function unitListLoad( p, ano) {
//    console.log( p, ano);
    if (p === 1 && $('#v_head span.deckcost').text()) {
      $('div.Loading').hide();
      $('#cardList').css({'opacity': '1.0'});
      $('div.pager').show();
      return;
    }
    var data = {
        target_card: '',
        select_assign_no: ano,
        mode: '',
        btn_change_flg: '1',
        set_village_id: '',
        set_assign_id: '',
        deck_mode: 'nomal',
        p: p,
        myselect_2: ''
      },
      rank = {'SSS': 120,'SS': 115,'S': 110,'A': 105,'B': 100,'C': 95,'D': 90,'E': 85,'F': 80},
      drank = {240: 'SSS',235: 'SS+',230: 'SS',225: 'S+',220: 'S',215: 'A+',210: 'A',205: 'B+',200: 'B',195: 'C+',190: 'C',185: 'D+',180: 'D',175: 'E+',170: 'E',165: 'F+',160: 'F'};
    //console.log('2');
    $.ajax({
      type: "POST",
      url: 'http://'+world+'.sengokuixa.jp/card/deck.php',
      data: data,
      cache: false,
      success: function( html) {
        var $html = $( html);
        //部隊情報の取得
        if (ano === 0) {

          //コストを取得
          $('#v_head span.deckcost').prepend( $html.find('#ig_deckcost > span.ig_deckcostdata').text()).css({'margin-right': '1em'});
        }

        if (ano !== '') {
          getButai( $html, ano);
        }

        //武将情報の取得
        if ( p) {
          $html.find( 'div.ig_deck_smallcardarea').each( function() {
            var $this, cid, no, grps, rr, hi, nm, ct, lv, hp, uc, bg, hs, at, df, hy, ya, um, yu, ki, $tmp, sk, id, gp_1, gp_2;

            $this = $(this);
            cid = $this.find('div:nth-child(3) a[href^="#TB_inline"]').attr('href');
            if ( !cid)
              return true;
            cid = cid.match(/\d+/g)[2];
            no = $html.find('#cardWindow_' + cid ).find('span.ig_card_cardno').text();
            grps = $this.find('div[id^="unit_group_type_"]').attr('class').replace('unit_brigade', '');  //グループ
            if( grps == '5' ) {
              grps = '未設定';
            }
            else{
              grps = '第' + grps + '組';
            }
            rr = $this.find('span.ig_deck_smallcard_cardrarety').text();  //レアリティ
            hi = $html.find('#cardWindow_' + cid ).find('span.ig_card_hiragana').text();//ひらがな
            nm = $this.find('span.ig_deck_smallcard_cardname').text();  //名前
            ct = $this.find('table.ig_deck_smallcarddata:eq(0)').find('td:eq(0)').text();
            lv = $this.find('table.ig_deck_smallcarddata:eq(0)').find('td:eq(1)').text().match(/\d+/g);
            hp = $this.find('table.ig_deck_smallcarddata:eq(0)').find('td:eq(2)').text().match(/\d+/);
            uc = $this.find('table.ig_deck_smallcarddata:eq(0)').find('td:eq(3)').text().match(/\d+/g);
            bg = $this.find('span.ig_deck_battlepoint2').text();
            hs = $this.find('table.ig_deck_smallcarddata:eq(0)').find('td:eq(4)').text();
            at = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(0)').text();
            df = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(2)').text();
            hy = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(1)').text();
            ya = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(4)').text();
            um = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(5)').text();
            yu = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(6)').text();
            ki = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(7)').text();
            $tmp = $this.find('table.ig_deck_smallcarddata:eq(2)');
            sk = [$tmp.find('td:eq(0)').text(), $tmp.find('td:eq(1)').text(), $tmp.find('td:eq(2)').text()];
            gp_1 = '',
            gp_2 = '';
            setBushoToList( cid, no, grps, gp_1, gp_2, rr, hi, nm, ct, lv, hp, bg, uc, hs, at, df, hy, ya, um, yu, ki, rank, drank, sk);
          });
        }

        //次ページ取得の判断
        var p2 = !$html.find('ul.pager.cardstock:eq(0) > li.last > a:eq(1)')[0] ? '' : p + 1,
          ano2 = (ano === 4 || ano === '' ) ? '' : ano + 1;

        if ( ( p && p2 > p) || ( ano2 > ano && !$('#v_head > select.unit_ano').find('option:eq(' + ano + ')').text().match(/新規部隊を作成/))) {

          // 次ページ取得
          setTimeout(unitListLoad, 100, (p? p2: p), ano2);
        } else {

          //取得終了後の処理
          $('#v_head > span.' + $('#v_head > select.unit_ano').find('option:selected').attr('class')).show();
          $( '#unitSet')
            .prepend( '<input type="text" id="unit_cnt_text" value="max"><input type="button" value="兵士セット">')
              .on( 'click', 'input:eq(1)', setHeishi);
          $.get( 'http://' + world + '.sengokuixa.jp/facility/set_unit_list.php', function ( data) {
            var html = $.parseHTML( data),
                select_unit = $( '<select></select>'),
                unit;
            $( '#unitSet').prepend( select_unit);
            select_unit.append( '<option label="なし" value="">なし</option>');
            $( html).find( '#soldiers_catalog img[alt]').each( function ( idx, elm) {
              if ( UnitCode[elm.alt]) {
                unit = { name: elm.alt, code: UnitCode[elm.alt], num: $(elm).parent().next().text()};
                select_unit.append( '<option label="'+unit.name+'('+unit.num+')" value="'+unit.code+'">'+unit.name+'('+unit.num+')</option>');
              }
            });
            $('div.Loading').hide();
            $( '#cardList').css( 'opacity', '1.0');
          });
          $('#tb_unit').ready( setupTableSorter);
          $('ul.uldoption').find('input').each(function() {
            if (!$(this).prop('checked')) {
              $('#tb_unit .' + $(this).parent().text().match(/ : ([\S]+)/)[1]).hide();
            }
          });
          return;
        }
      }
    });
  }

  function setBushoToList( id, no, grps, gp_1, gp_2, rr, hi, nm, ct, lv, hp, bg, uc, hs, at, df, hy, ya, um, yu, ki, rank, drank, sk, butai, select_assign_no, unit_assign_id) {

    $( '#tb_unitlist').find( 'td.選択>input[value="' + id + '"]').parent().parent().remove();
    var tmp = '<tr>' +
    '<td class="選択"><input type=checkbox name="id" value="' + id + '">' +
      '<input class="select_assign_no" value="' + select_assign_no + '" hidden>' +
      '<input class="unit_assign_id" value="' + unit_assign_id + '" hidden>'+
    '<td class="No">' + no  +
    '<td class="組">' + grps  +
    '<td class="ﾚｱ">' + rr  +
    '<td class="名前"><span id="kana" style="display: inline-block;text-indent: -9999px;">' + hi + '</span><span id="kanji">' + nm + '</span></td>' +
    '<td class="ｺｽﾄ">' + ct  +
    '<td class="★">' + lv[0]  +
    '<td class="Lv">' + lv[1]  +
    '<td class="HP">' + hp  +
    '<td class="討伐">' + bg  +
    '<td class="指揮力">' + uc[1]  +
    '<td class="兵数">' + uc[0]  +
    '<td class="兵種">' + hs  +
    '<td class="攻撃">' + at  +
    '<td class="防御">' + df  +
    '<td class="兵法">' + hy  +
    '<td class="小隊攻">' +
    '<td class="小隊防">' +
    '<td class="槍">' + ya  +
    '<td class="槍 実指揮">' + Math.floor(uc[1] * rank[ya] / 100)  +
    '<td class="槍 ｺｽﾄ比">' + Math.floor(uc[1] * rank[ya] / ct / 100)  +
    '<td class="馬">' + um  +
    '<td class="馬 実指揮">' + Math.floor(uc[1] * rank[um] / 100)  +
    '<td class="馬 ｺｽﾄ比">' + Math.floor(uc[1] * rank[um] / ct / 100)  +
    '<td class="弓">' + yu  +
    '<td class="弓 実指揮">' + Math.floor(uc[1] * rank[yu] / 100)  +
    '<td class="弓 ｺｽﾄ比">' + Math.floor(uc[1] * rank[yu] / ct / 100)  +
    '<td class="器">' + ki  +
    '<td class="器 実指揮">' + Math.floor(uc[1] * rank[ki] / 100)  +
    '<td class="器 ｺｽﾄ比">' + Math.floor(uc[1] * rank[ki] / ct / 100)  +
    '<td class="槍馬">' + drank[rank[ya] + rank[um]]  +
    '<td class="槍馬 実指揮">' + Math.floor(uc[1] * (rank[ya] + rank[um]) / 2 / 100)  +
    '<td class="槍馬 ｺｽﾄ比">' + Math.floor(uc[1] * (rank[ya] + rank[um]) / 2 / ct / 100)  +
    '<td class="槍弓">' + drank[rank[ya] + rank[yu]]  +
    '<td class="槍弓 実指揮">' + Math.floor(uc[1] * (rank[ya] + rank[yu]) / 2 / 100)  +
    '<td class="槍弓 ｺｽﾄ比">' + Math.floor(uc[1] * (rank[ya] + rank[yu]) / 2 / ct / 100)  +
    '<td class="弓馬">' + drank[rank[yu] + rank[um]]  +
    '<td class="弓馬 実指揮">' + Math.floor(uc[1] * (rank[yu] + rank[um]) / 2 / 100)  +
    '<td class="弓馬 ｺｽﾄ比">' + Math.floor(uc[1] * (rank[yu] + rank[um]) / 2 / ct / 100)  +
    '<td class="槍器">' + drank[rank[ya] + rank[ki]]  +
    '<td class="槍器 実指揮">' + Math.floor(uc[1] * (rank[ya] + rank[ki]) / 2 / 100)  +
    '<td class="槍器 ｺｽﾄ比">' + Math.floor(uc[1] * (rank[ya] + rank[ki]) / 2 / ct / 100)  +
    '<td class="馬器">' + drank[rank[um] + rank[ki]]  +
    '<td class="馬器 実指揮">' + Math.floor(uc[1] * (rank[um] + rank[ki]) / 2 / 100)  +
    '<td class="馬器 ｺｽﾄ比">' + Math.floor(uc[1] * (rank[um] + rank[ki]) / 2 / ct / 100)  +
    '<td class="弓器">' + drank[rank[yu] + rank[ki]]  +
    '<td class="弓器 実指揮">' + Math.floor(uc[1] * (rank[yu] + rank[ki]) / 2 / 100)  +
    '<td class="弓器 ｺｽﾄ比">' + Math.floor(uc[1] * (rank[yu] + rank[ki]) / 2 / ct / 100) +
    '<td class="技1">' + sk[0]  +
    '<td class="技2">' + sk[1]  +
    '<td class="技3">' + sk[2]  +
    '</tr>',
    $tmp = $( tmp),
    power = cal_energy( $tmp);
    $tmp.find( '.小隊攻').text( power.replace( /^.+?(\d+).+$/, '$1'));
    $tmp.find( '.小隊防').text( power.replace( /^.+:(\d+).+$/, '$1'));
    if ( butai) $tmp.find( 'td.選択').toggleClass( '隊');
    $('ul.uldoption').find('input').each(function() {
      if (!$(this).prop('checked')) {
        $tmp.find('td.' + $(this).parent().text().match(/ : ([\S]+)/)[1]).hide();
      }
    });
    $('#tb_unitlist').append( $tmp);
  }

  //兵士一括セット
  function setHeishi( ) {
    var $tb_unitlist = $( '#tb_unitlist'), dataArray = [],
      unitID = $( '#unitSet > select').val(),
      unitCnt = $( '#unit_cnt_text').val(),
      max, selectedCards = [];
    max = $( '#unitSet > select > option:selected').text().match(/\d+/);
    max = max? max[0]: max;
    $tb_unitlist.find('td.選択>input:checked').each( function () {
      var cnt = unitCnt, key, tmp;
      if ( unitCnt.match('max')) {
        cnt = Math.min( $(this).parent().siblings( 'td.指揮力').text(), max);
        if ( cnt > 0)
          max -= cnt;
        else
          return false;
      }
      dataArray.push( { card_id: $( this).val(), unit_type: unitID, unit_count: cnt});
      selectedCards.push( $( this).parent().parent());
    });
    $('div.Loading').show();
    $( '#cardList').css( 'opacity', '0.3');
    postSetHeishi( dataArray, selectedCards);
  }

  function postSetHeishi(dataArray, selectedCards) {
    var postData, card;
    if ( dataArray[0]) {
      postData = dataArray.shift();
      card = selectedCards.shift();
      $.post(
        'http://' + world + '.sengokuixa.jp/facility/set_unit_list_if.php',
        postData, // { card_id: data0, unit_type: data1, unit_count: data2 },
        function (data) {
          var result = JSON.parse(data).result, power;
          if ( result === 'ok') {
            card.find( '.兵数').text( postData.unit_count)
            .next().text( UnitCode.getKey( postData.unit_type));
            power = cal_energy( card);
            card.find( '.小隊攻').text( power.replace( /^.+?(\d+).+$/, '$1'));
            card.find( '.小隊防').text( power.replace( /^.+:(\d+).+$/, '$1'));
          }
          if ( result !== 'ipu')
            setTimeout( postSetHeishi, 100, dataArray, selectedCards);
          else {
            $( '#tb_unit').trigger( 'update');
            $('div.Loading').hide();
            $( '#cardList').css( 'opacity', '1.0');
          }
        }
      );
    } else {
      $.get( 'http://' + world + '.sengokuixa.jp/facility/set_unit_list.php', function ( data) {
        var html = $.parseHTML( data),
            select_unit = $( '#unitSet select').empty(),
            unit;
        select_unit.append( '<option label="なし" value="">なし</option>');
        $( html).find( '#soldiers_catalog img[alt]').each( function ( idx, elm) {
          if ( UnitCode[elm.alt]) {
            unit = { name: elm.alt, code: UnitCode[elm.alt], num: $(elm).parent().next().text()};
            select_unit.append( '<option label="'+unit.name+'('+unit.num+')" value="'+unit.code+'">'+unit.name+'('+unit.num+')</option>');
          }
        });
        $( '#tb_unit').trigger( 'update');
        $('div.Loading').hide();
        $( '#cardList').css( 'opacity', '1.0');
      });
    }
  }

  // 部隊セット
  function unit_set($this) {

    //選択された部隊の番号とIDを取得
    var select_assign_no = $this.children().eq(1).attr( 'value'),
      set_village_id = $this.find('#select_village').find('option:selected').val(),
      set_assign_id = $this.find('button.set_unitlist').val(),
      set_card_id = [],
      busho_list = [];

    //チェックされた武将のset_card_idを取得
    $('#tb_unitlist input[name^="id"]:checked').each( function() {
      var busho_chk = $(this).parent(),
        cid = busho_chk.find('[name="id"]').val();
      set_card_id.push( cid);
      busho_list.push( busho_chk.parent());
    });

    if (set_card_id.length == 0) {
      alert('セット可能な武将がいません。');
      return;
    } else if ( !set_village_id && !set_assign_id) {
      alert('拠点が選択されていません。');
      return;
    }
    $('#cardList').css({'opacity': '0.3'});
    $('div.Loading').show();
    if (confirm(set_card_id.length+'人が選択されています。リスト順に配置します。')) {
      //武将をセット
      set_card_to_deck( select_assign_no, set_village_id, set_assign_id, set_card_id, busho_list, 0);
    } else {
      $('#cardList').css({'opacity': '1.0'});
      $('div.Loading').hide();
    }

    //カードを部隊にセットする関数
    function set_card_to_deck( select_assign_no, set_village_id, set_assign_id, set_card_id, busho_list, i) {
      //console.log( select_assign_no, set_village_id, set_assign_id, set_card_id, busho_list, i);
      //POSTデータ
      var data = {
        target_card: '',
        select_assign_no: select_assign_no,
        mode: 'assign_insert',
        btn_change_flg: '',
        set_village_id: set_village_id,
        set_assign_id: set_assign_id,
        set_card_id: set_card_id[i],
        deck_mode: 'nomal',
        p: '1',
        myselect_2: ''
      };

      //POST
      $.ajax({
        type: "POST",
        url: 'http://'+world+'.sengokuixa.jp/card/deck.php',
        data: data,
        cache: false,
        success: function(html) {
          var bushoname = busho_list[i].find('#kanji').text(), regexpname = new RegExp(bushoname), $html = $( html);
          if ( $html.find('#ig_deckboxInner').find('div.common_box1')[0] ) {
            alert( busho_list[ i].find( '#kanji').text() + 'をセットできませんでした。');
            getButai( $html, select_assign_no);
            $( '#tb_unit').trigger( 'update');
            $('#cardList').css({'opacity': '1.0'});
            $('div.Loading').hide();
          } else {
            $('#v_head > span.deckcost').text($html.find('#ig_deckcost > span.ig_deckcostdata').text());
            if (i < set_card_id.length - 1) {
              if ( (!set_assign_id && $html.find('#ig_unitchoice > li.now').text().match(regexpname)) || (set_assign_id && !$html.find('#ig_unitchoice > li.now').text().match(regexpname)) ) {
                if ( !set_assign_id ) {
                  set_assign_id = $html.find('#set_assign_id').val();
                }
                //console.log( select_assign_no, set_village_id, set_assign_id, set_card_id, busho_list, i);
                setTimeout(set_card_to_deck, 100, select_assign_no, set_village_id, set_assign_id, set_card_id, busho_list, i + 1);
              } else {
                alert(busho_list[i+1].find('#kanji').text() + 'をセットできませんでした。');
                //console.log( select_assign_no, set_village_id, set_assign_id, set_card_id, busho_list, i);
                getButai( $html, select_assign_no);
                $( '#tb_unit').trigger( 'update');
                $('#cardList').css({'opacity': '1.0'});
                $('div.Loading').hide();
              }
            } else {
              getButai( $html, select_assign_no);
              $( '#tb_unit').trigger( 'update');
              $('#cardList').css({'opacity': '1.0'});
              $('div.Loading').hide();
            }
          }
          //コストを取得
          $('#v_head span.deckcost').empty()
            .append( $html.find( '#ig_deckcost > span.ig_deckcostdata').text()).css( { 'margin-right': '1em'});
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          //console.log(textStatus);
        }
      });
    }
  }

  function getButai( $html, ano) {

    var rank = {'SSS': 120,'SS': 115,'S': 110,'A': 105,'B': 100,'C': 95,'D': 90,'E': 85,'F': 80},
      drank = {240: 'SSS',235: 'SS+',230: 'SS',225: 'S+',220: 'S',215: 'A+',210: 'A',205: 'B+',200: 'B',195: 'C+',190: 'C',185: 'D+',180: 'D',175: 'E+',170: 'E',165: 'F+',160: 'F'};

    //部隊を取得
    var unitLeader = '<button>解散</button><span value="' + ano + '" class="ano' + ano + '">' +
      $html.find('#ig_unitchoice > li:eq(' + ano + ')').text() + '</span><br/>';
    $('#v_head div.ano:eq(' + ano + ')').empty().append( unitLeader);

    //部隊のIDを取得、DOMオブジェクトを取得
    var set_assign_id = $html.find('#set_assign_id').val();
    var $ig_deck_unitdetailbox = $html.find('#ig_deck_unitdetailbox');
    var $v_head_div_ano = $('#v_head div.ano:eq(' + ano + ')');
    var base = $ig_deck_unitdetailbox.parent().find('div.ig_deck_unitdata_assign.deck_wide_select').html()
         || $html.find('#select_village').parent().html();
    if (set_assign_id) {
      $v_head_div_ano.append(
        '<button>外す</button><span class="subleader"></span><br/>' +
        '<button>外す</button><span class="subleader"></span><br/>' +
        '<button>外す</button><span class="subleader"></span><br/>' +
        '<span class=condition></span><br/>' +
        '<span class=base style="margin-right: 1em;"></span>' +
        '<span class="set_button"><br/><button class="set_unitlist" style="padding: 0 4px;" value="' + set_assign_id + '">配置</button></span>'
      );
      $v_head_div_ano.attr( { select_assign_no: ano, unit_assign_id: set_assign_id});

      //部隊副長を取得
      $ig_deck_unitdetailbox.find('span.ig_deck_unitdata_subleader').each( function( i) {
        $v_head_div_ano.find('span.subleader:eq(' + i + ')').text('[' + $(this).text().match(/[\S]+/)[0] + ']');
      });

      //部隊の状態を取得
      var unit_condition_text = $ig_deck_unitdetailbox.find( 'span.ig_deck_unitdata_condition').text().trim();
      $v_head_div_ano.find('span.condition').text('(' + unit_condition_text + ')');
      $( function () {
        var unset_unit_squad_id = [],
          sols = { commandsol_yari1: '足軽', commandsol_yari2: '長槍足軽', commandsol_yari3: '武士', commandsol_yari4: '国人衆', commandsol_yumi1: '弓足軽', commandsol_yumi2: '長弓兵', commandsol_yumi3: '弓騎馬', commandsol_yumi4: '海賊衆', commandsol_kiba1: '騎馬兵', commandsol_kiba2: '精鋭騎馬', commandsol_kiba3: '赤備え', commandsol_kiba4: '母衣衆', commandsol_heiki1: '破城鎚', commandsol_heiki2: '攻城櫓', commandsol_heiki3: '大筒兵', commandsol_heiki4: '鉄砲足軽', commandsol_heiki5: '騎馬鉄砲', commandsol_heiki6: '雑賀衆', commandsol_heiki7: '焙烙火矢'},
          rarerity = [ 0, '序', '上', '特', '極', '天'],
          tai = [ '一番隊', '二番隊', '三番隊', '四番隊', '五番隊'];
        unset_unit_squad_id.push( $html.find( '#ig_deckunitdetail div.deck_navi a:eq(0)').attr( 'onclick'));
        unset_unit_squad_id.push( $html.find( '#id_deck_card2 div.ig_cardarea_btn a:eq(0)').attr( 'onclick'));
        unset_unit_squad_id.push( $html.find( '#id_deck_card3 div.ig_cardarea_btn a:eq(0)').attr( 'onclick'));
        unset_unit_squad_id.push( $html.find( '#id_deck_card4 div.ig_cardarea_btn a:eq(0)').attr( 'onclick'));
        unset_unit_squad_id.forEach( function ( elm, idx, arr) {
          if ( !elm) return false;
          var card = $html.find( '#id_deck_card' + (idx + 1));
          //console.log( card);
          var id = card.find( 'span[id^="card_commandsol_"]').prop( 'id').match( /\d+/)[0],
            no = card.find( 'span.ig_card_cardno').text(),
            grps = tai[ano],
            gp_1 = '',
            gp_2 = '',
            rr = rarerity[ card.find( 'span[class^="rarerity_"]').prop( 'class').replace( 'rarerity_', '')],
            hi = card.find( 'span.ig_card_name').attr( 'title'),
            nm = card.find( 'span.ig_card_name').text(),
            ct = card.find( 'span.ig_card_cost_over').text(),
            lv = [ card.find( 'span.level_star img').prop( 'width') / 20, card.find( 'span.ig_card_level').text()],
            hp = card.find( 'span.ig_card_status_hp').text().replace( '/100', ''),
            bg = card.find( 'span.ig_deck_battlepoint').text(),
            uc = card.find( 'span.commandsol_no').text().split( '/'),
            hs = sols[ card.find( 'span[class^=commandsol_]:eq(0)').prop( 'class')],
            at = card.find( 'span.ig_card_status_att').text(),
            df = card.find( 'span.ig_card_status_def').text(),
            hy = card.find( 'span.ig_card_status_int').text(),
            ya = card.find( 'span.yari').prop( 'class').match( /lv_(.)/)[1].toUpperCase(),
            um = card.find( 'span.kiba').prop( 'class').match( /lv_(.)/)[1].toUpperCase(),
            yu = card.find( 'span.yumi').prop( 'class').match( /lv_(.)/)[1].toUpperCase(),
            ki = card.find( 'span.heiki').prop( 'class').match( /lv_(.)/)[1].toUpperCase(),
            sk = [ card.find( 'span.ig_skill_name:eq(0)').text(), card.find( 'span.ig_skill_name:eq(1)').text(), card.find( 'span.ig_skill_name:eq(2)').text(),],
            select_assign_no = ano,
            unit_assign_id = set_assign_id,
            unset_unit_squad_id = elm.match( /\d+/g)[1];
          setBushoToList( id, no, grps, gp_1, gp_2, rr, hi, nm, ct, lv, hp, bg, uc, hs, at, df, hy, ya, um, yu, ki, rank, drank, sk, true, select_assign_no, unit_assign_id);
          $v_head_div_ano.find( 'button:eq(' + idx + ')').val( unset_unit_squad_id);
        });
      });
    } else {
      base = $( $.parseHTML( base)).removeAttr( 'onchange');
      $v_head_div_ano.append(
        '<span class=base style="margin-right: 1em;"></span>' +
        '<span class="set_button"><br/><button class="set_unitlist" style="padding: 0 4px;" value="">配置</button></span>'
      );
    }

    //部隊の拠点を取得
    $v_head_div_ano.find('span.base').append('拠点：' ,base);
    $('#v_head div.ano:eq('+ano+')').append($v_head_div_ano);
  }

  // 拠点IDを取得
  function get_villageId() {
    // 拠点名と拠点IDの対応表を作成
    $.ajax({
      url: 'http://' + world + '.sengokuixa.jp/user/',
      cache: true,
      async: false,
      timeout: 2000,
      dataType: "text",
      success: function(html) {
        $( $.parseHTML( html)).find('table.common_table1.center').find('.fs14').each(function() {
          var anc = $(this).find('td').eq(1).find('a');
          villageIds[ anc.prop( 'innerText').replace( /^\s+|\s+$/g, '')] = anc.prop( 'href').match( /village_change\.php\?village_id=(\d+)$/)[1];
        });
      }
    });
    localStorage.villageIds = JSON.stringify( villageIds);
    //console.log( villageIds);
  }

  function cal_energy($force) {
    var UnitData = {
        "足軽": {off: 11,def: 11,mov: 15,tp1: "t1",tp2: "t1"},"長槍足軽": {off: 16,def: 16,mov: 16,tp1: "t1",tp2: "t1"},"武士": {off: 18,def: 18,mov: 18,tp1: "t1",tp2: "t3"},"国人衆": {off: 17,def: 13,mov: 17,tp1: "t1",tp2: "t3"},
        "弓足軽": {off: 10,def: 12,mov: 16,tp1: "t3",tp2: "t3"},"長弓兵": {off: 15,def: 17,mov: 18,tp1: "t3",tp2: "t3"},"弓騎馬": {off: 17,def: 19,mov: 23,tp1: "t2",tp2: "t3"},"海賊衆": {off: 16,def: 17,mov: 20,tp1: "t2",tp2: "t3"},
        "騎馬兵": {off: 12,def: 10,mov: 22,tp1: "t2",tp2: "t2"},"精鋭騎馬": {off: 17,def: 15,mov: 23,tp1: "t2",tp2: "t2"},"赤備え": {off: 21,def: 20,mov: 25,tp1: "t1",tp2: "t2"},"母衣衆": {off: 19,def: 16,mov: 24,tp1: "t1",tp2: "t2"},
        "破城鎚": {off: 3,def: 8,mov: 8,tp1: "t4",tp2: "t4"},"攻城櫓": {off: 14,def: 5,mov: 10,tp1: "t4",tp2: "t4"},"大筒兵": {off: 10,def: 12,mov: 8,tp1: "t3",tp2: "t4"},
        "鉄砲足軽": {off: 18,def: 26,mov: 15,tp1: "t1",tp2: "t4"},"騎馬鉄砲": {off: 26,def: 18,mov: 21,tp1: "t2",tp2: "t4"},"焙烙火矢": {off: 23,def: 23,mov: 19,tp1: "t3",tp2: "t4"},"雑賀衆": {off: 23,def: 17,mov: 18,tp1: "t1",tp2: "t4"},
        "": { off: 0, def: 0, mov: 0, tp1: 0,tp2: 0}
      },
      rank = {SSS: 1.20,SS: 1.15,S: 1.10,A: 1.05,B: 1,C: 0.95,D: 0.9,E: 0.85,F: 0.80,0: 0}, check_list = [], tmp;
    $force.each(function() {
      var $tr = $(this),
        num = $tr.find('td.兵数').text(),
        unit = $tr.find('td.兵種').text(),
        off = $tr.find('td.攻撃').text(),
        def = $tr.find('td.防御').text(),
        t1 = $tr.find('td.槍:eq(0)').text(),
        t2 = $tr.find('td.馬:eq(0)').text(),
        t3 = $tr.find('td.弓:eq(0)').text(),
        t4 = $tr.find('td.器:eq(0)').text();
      //t1:槍,t2:馬,t3:弓,t4:器
      check_list.push({unit: unit,off: off,def: def,num: num,t1: t1,t2: t2,t3: t3,t4: t4,0: 0});
    });
    if (check_list.length == 0) {
      tmp = '武将が選択されていません';
    } else {
      var o_power = 0;
      var d_power = 0;
      for (var i = 0; i < check_list.length; i++) {
        var r1 = rank[ check_list[i][ UnitData[ check_list[i].unit].tp1]];
        var r2 = rank[ check_list[i][ UnitData[ check_list[i].unit].tp2]];
        o_power += (parseInt(check_list[i].num * UnitData[check_list[i].unit].off) + parseInt(check_list[i].off)) * ((r1 + r2) / 2);
        d_power += (parseInt(check_list[i].num * UnitData[check_list[i].unit].def) + parseInt(check_list[i].def)) * ((r1 + r2) / 2);
      }
      tmp = '攻撃力:' + o_power.toFixed(1) + '/防御力:' + d_power.toFixed(1);
    }
    return tmp;
  }

  // TableSorterのセッティング
  function setupTableSorter() {
    $.tablesorter.addParser({
      // set a unique id
      id: 'rarerity',
      is: function(s) {
        // return false so this parser is not auto detected
        return false;
      },
      format: function(s) {
        // format your data for normalization
        return s.replace(/[^天極特上序]/, 0).replace(/天/, 5).replace(/極/, 4).replace(/特/, 3).replace(/上/, 2).replace(/序/, 1);
      },
      // set type, either numeric or text
      type: 'numeric'
    });
    $.tablesorter.addParser({
      // set a unique id
      id: 'ability',
      is: function(s) {
        // return false so this parser is not auto detected
        return false;
      },
      format: function(s) {
        // format your data for normalization
        return s.replace(/SSS/, 8).replace(/SS\+/, 7).replace(/SS/, 6).replace(/S\+/, 5).replace(/S/, 4)
        .replace(/A\+/, 3).replace(/A/, 2).replace(/B\+/, 1).replace(/B/, 0).replace(/C\+/, -1).replace(/C/, -2)
        .replace(/D\+/, -3).replace(/D/, -4).replace(/E\+/, -5).replace(/E/, -6).replace(/F\+/, -7).replace(/F/, -8);
      },
      // set type, either numeric or text
      type: 'numeric'
    });
    $.tablesorter.addParser({
      id: 'checkbox',
      is: function(s) {
        return false;
      },
      format: function(s, table, cell) {
        //console.log( s, table, cell);
        return $(cell).find('input').prop('checked') ? 1 : 0;
      },
      type: 'numeric'
    });
    $.tablesorter.addParser({
      // set a unique id
      id: 'soltype',
      is: function(s) {
        // return false so this parser is not auto detected
        return false;
      },
      format: function(s) {
        // format your data for normalization
        return s.replace(/^足軽$/, 10).replace(/長槍足軽/, 11).replace(/武士/, 12).replace(/国人衆/, 13)
            .replace(/弓足軽/, 20).replace(/長弓兵/, 21).replace(/弓騎馬/, 22).replace(/海賊衆/, 23)
            .replace(/騎馬兵/, 30).replace(/精鋭騎馬/, 31).replace(/赤備え/, 32).replace(/母衣衆/, 33)
            .replace(/破城鎚/, 40).replace(/攻城櫓/, 41).replace(/大筒兵/, 42)
            .replace(/鉄砲足軽/, 50).replace(/騎馬鉄砲/, 51).replace(/焙烙火矢/, 52).replace(/雑賀衆/, 53);
      },
      // set type, either numeric or text
      type: 'numeric'
    });
    $.tablesorter.addParser({
      // set a unique id
      id: 'grp',
      is: function(s) {
        // return false so this parser is not auto detected
        return false;
      },
      format: function(s, table, cell) {
        // format your data for normalization
        var gp = $(cell).find('input').val();
        return gp? gp: 999;
      },
      // set type, either numeric or text
      type: 'numeric'
    });
    $.tablesorter.addParser({
      // set a unique id
      id: 'grouping',
      is: function(s) {
        // return false so this parser is not auto detected
        return false;
      },
      format: function(s) {
        // format your data for normalization
        return s.replace(/一番隊/, 1).replace(/二番隊/, 2).replace(/三番隊/, 3).replace(/四番隊/, 4).replace(/五番隊/, 5).replace(/第1組/, 10).replace(/第2組/, 20).replace(/第3組/, 30).replace(/第4組/, 40)
            .replace(/未設定/, 50);
      },
      // set type, either numeric or text
      type: 'numeric'
    });
    $('#tb_unit')
    .tablesorter({
      widthFixed: true,
      widgets: ['zebra'],
      headers: {0: {sorter: 'checkbox'},
        2: {sorter: 'grouping'},
        //3: {sorter: 'grp'},
        3: {sorter: 'rarerity'},
        12: {sorter: 'soltype'},
        18: {sorter: 'ability'},
        21: {sorter: 'ability'},
        24: {sorter: 'ability'},
        27: {sorter: 'ability'},
        33: {sorter: 'ability'},
        36: {sorter: 'ability'},
        39: {sorter: 'ability'},
        42: {sorter: 'ability'},
        45: {sorter: 'ability'},
        48: {sorter: 'ability'},
      }
      //sortForce: [[0,1]]
    })
    .tablesorterPager({

      // **********************************
      //  Description of ALL pager options
      // **********************************

      // target the pager markup - see the HTML block below
      container: $(".pager"),

      // use this url format "http:/mydatabase.com?page={page}&size={size}"
      ajaxUrl: null,

      // process ajax so that the data object is returned along with the total number of rows
      // example: { "data" : [{ "ID": 1, "Name": "Foo", "Last": "Bar" }], "total_rows" : 100 }
      ajaxProcessing: function(ajax) {
        if (ajax && ajax.hasOwnProperty('data')) {
          // return [ "data", "total_rows" ];
          return [ajax.data, ajax.total_rows];
        }
      },

      // output string - default is '{page}/{totalPages}'; possible variables: {page}, {totalPages}, {startRow}, {endRow} and {totalRows}
      output: '{startRow} to {endRow} ({totalRows})',

      // apply disabled classname to the pager arrows when the rows at either extreme is visible - default is true
      updateArrows: true,

      // starting page of the pager (zero based index)
      page: 0,

      // Number of visible rows - default is 10
      size: 8,

      // if true, the table will remain the same height no matter how many records are displayed. The space is made up by an empty
      // table row set to a height to compensate; default is false
      fixedHeight: false,

      // remove rows from the table to speed up the sort of large tables.
      // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
      removeRows: false,

      // css class names of pager arrows
      cssNext: '.next', // next page arrow
      cssPrev: '.prev', // previous page arrow
      cssFirst: '.first', // go to first page arrow
      cssLast: '.last', // go to last page arrow
      cssPageDisplay: '.pagedisplay', // location of where the "output" is displayed
      cssPageSize: '.pagesize', // page size selector - select dropdown that sets the "size" option

      // class added to arrows when at the extremes (i.e. prev/first arrows are "disabled" when on the first page)
      cssDisabled: 'disabled' // Note there is no period "." in front of this class name
    });
    $('#tb_unitlist').find('input').click(function() {
      $('#tb_unit').trigger('updateCell', [this.parentNode]);
    });
  }
});