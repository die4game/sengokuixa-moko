( function () {
  var world, tabId, options = {}, ssID, groups, group_setting, groups_img, IMAGES = CRXMOKODATA.images,
    column = localStorage.column? JSON.parse( localStorage.column): [],
    villageIds = localStorage.villageIds? JSON.parse( localStorage.villageIds): {};

  // カレントタブ取得
  chrome.tabs.getCurrent( function ( tab) {
    arg = tab.url.split( '?')[1].split( '&');
    world = arg[0], tabId = arg[1];
    //console.log( world, tabId, tab);

    // options、set_squad_id、グループ設定の取得
    chrome.storage.sync.get( world, function ( store) {
      var storeWorld = JSON.parse( store[world]);
      //console.log( storeWorld);
      options = storeWorld.crx_ixa_moko_options;
      group_setting = storeWorld.crx_ixamoko_group_set;
      groups = storeWorld.crx_ixamoko_init_groups;
      chrome.storage.local.get( world, function ( store) {
        var storeWorld = JSON.parse( store[world]);
        //console.log( storeWorld);
        groups_img = storeWorld.crx_ixamoko_init_groups_img;
        ssID = storeWorld.crx_ssID || {};
        $(unitListDialog);
      });
    });
  });
  tableSorter_($);
  tablesorter_pager_plugin($);

  function unitListDialog () {

    // imgのロード
    $( '#mokotool>div.Loading').append( '<img src="' + IMAGES.unitListDialog.Loading + '">');
    $( '#unitlistdialog>div.pager>select').before(
        '<img src="' + IMAGES.unitListDialog.first + '" class="first"/>' +
        '<img src="' + IMAGES.unitListDialog.prev + '" class="prev"/>' +
        '<span class="pagedisplay"></span> <!-- this can be any element, including an input -->' +
        '<img src="' + IMAGES.unitListDialog.next + '" class="next"/>' +
        '<img src="' + IMAGES.unitListDialog.last + '" class="last"/>'
    );

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

    // デッキセットボタン
    $('#v_head').on('click', 'button.set_unitlist', function() {
      unit_set($(this).parent().parent());
    });

    // 総攻防力
    $('#energy').on('click', function() {
      cal_energy($(this).next());
    });

    // 武将リスト取得実行
    $( function () {
      $('div.pager').hide();
      $('#unitlistdialog').css({'opacity': '0.3'});
      $('div.Loading').show();
      unitListLoad(1, 0);
    });

    // 秘境
    $( '#dungeon').on( 'click', 'button', function () {
      var url = 'http://'+world+'.sengokuixa.jp/facility/dungeon.php',
        village = {},
        data = {
          dungeon_select: $( this).nextAll().find( ':checked').val(),
          unit_select: [],
          btn_send: true
        }, key;
      $( '#v_head button.set_unitlist').each( function ( i, el) {
        var base = $( el).parent().prev( 'span.base').text().match(/\S+/g);
        if ( base[1] === '未設定') {
          console.log( base[1]);
          return false;
        } else {
          if ( !villageIds[ base[ 1]]) get_villageId();
          village[ base[ 1]] = 'http://' + world + '.sengokuixa.jp/village_change.php?village_id=' + villageIds[ base[ 1]];
          data.unit_select.push( $( el).val());
        }
      });
      for ( key in village) {
        $.ajax({
          url: village[ key],
          async: false,
          success: function ( html, textStatus, jqXHR) {
            $.ajax({
              url: url,
              type: 'POST',
              async: false,
              data: data,
              success: function ( html, textStatus, jqXHR) {
                var obj = $( $.parseHTML( html)).find( 'td.radio_frame');
                if ( obj.length && obj.has('input').length) {
                  alert( textStatus + '\n' + '秘境へ送れませんでした。');
                } else if ( obj.length > 0) {
                  alert( textStatus + '\n' + '秘境へ送りました。');
                } else {
                  alert( textStatus + '\n' + '秘境のページを確認してください。');
                }
              }
            });
          }
        });
      }
    });
  }


  //////////////////
  // function定義 //
  //////////////////

  // 武将リスト取得
  function unitListLoad( p, ano) {
    if (p === 1 && $('#v_head span.deckcost').text()) {
      $('div.Loading').hide();
      $('#unitlistdialog').css({'opacity': '1.0'});
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
            set_squad_id: '',
            deck_mode: 'nomal',
            p: p,
            myselect_2: ''
          },
      rank = {'SSS': 120,'SS': 115,'S': 110,'A': 105,'B': 100,'C': 95,'D': 90,'E': 85,'F': 80},
      drank = {240: 'SSS',235: 'SS+',230: 'SS',225: 'S+',220: 'S',215: 'A+',210: 'A',205: 'B+',200: 'B',195: 'C+',190: 'C',185: 'D+',180: 'D',175: 'E+',170: 'E',165: 'F+',160: 'F'};
    $.ajax({
      type: "POST",
      url: 'http://'+world+'.sengokuixa.jp/card/deck.php',
      data: data,
      cache: false,
      success: function(html) {
        //部隊情報の取得
        if (ano === 0) {
          //コストを取得
          $('#v_head span.deckcost').prepend($(html).find('#ig_deckcost > span.ig_deckcostdata').text()).css({'margin-right': '1em'});
          //部隊を取得
          var unitLeader = '';
          $(html).find('#ig_unitchoice > li').each(function(i) {
            var leader = $(this).text();
            unitLeader = '<span value="' + i + '" class="ano' + i + '">' + leader + '</span><br/>';
            $('#v_head div.ano:eq(' + i + ')').empty().append(unitLeader);
            if (leader.match(/新規部隊を作成/)) {
              return false;
            }
          });
        }
        if (ano !== '') {
          //部隊のIDを取得、DOMオブジェクトを取得
          var set_assign_id = $(html).find('#set_assign_id').val();
          var $ig_deck_unitdetailbox = $(html).find('#ig_deck_unitdetailbox');
          var $v_head_span_ano = $('#v_head div.ano:eq(' + ano + ')');//.hide();
          var base = $ig_deck_unitdetailbox.parent().find('div.ig_deck_unitdata_assign.deck_wide_select').html()
               || $(html).find('#select_village').parent().html();
          if (set_assign_id) {
            $v_head_span_ano.append(
              '<span class="subleader"></span><br/><span class="subleader"></span><br/><span class="subleader"></span><br/>' +
              '<span class=condition></span><br/>' +
              '<span class=base style="margin-right: 1em;"></span>' +
              '<span class="set_button"><br/><button class="set_unitlist" style="padding: 0 4px;" value="' + set_assign_id + '">配置</button></span>'
            );
            $( '#v_head div.ano' + ano).val( set_assign_id);
            //部隊副長を取得
            $ig_deck_unitdetailbox.find('span.ig_deck_unitdata_subleader').each(function(i) {
              $v_head_span_ano.find('span.subleader:eq(' + i + ')').text('[' + $(this).text().match(/[\S]+/)[0] + ']');
            });
            //部隊の状態を取得
            var unit_condition_text = $ig_deck_unitdetailbox.find('span.ig_deck_unitdata_condition').text().trim();
            $v_head_span_ano.find('span.condition').text('(' + unit_condition_text + ')');
//            if (!unit_condition_text.match(/待機/) || !$v_head_span_ano.text().match(/\[\-\-\-\-\-\]/)) {
//              $v_head_span_ano.find('span.set_button').hide();
//            }
          } else {
            base = $($.parseHTML(base)).removeAttr('onchange');
            $v_head_span_ano.append(
              '<span class=base style="margin-right: 1em;"></span>' +
              '<span class="set_button"><br/><button class="set_unitlist" style="padding: 0 4px;" value="">配置</button></span>'
            );
          }

          //部隊の拠点を取得
          $v_head_span_ano.find('span.base').append('拠点：' ,base);
          $('#v_head div.ano:eq('+ano+')').append($v_head_span_ano);
        }

        //武将情報の取得
        if (p) {
          $(html).find('div.ig_deck_smallcardarea').each(function() {
            var $this = $(this);
            
            var cid = $this.find('a[href^="#TB_inline"]').attr('href').match(/\d+/g)[2];
            var no = $(html).find('#cardWindow_' + cid ).find('span.ig_card_cardno').text();
            var grps = $this.find('div[id^="unit_group_type_"]').attr('class').replace('unit_brigade', '');  //グループ
              if( grps == '5' ) {
                grps = '未設定';
              }
              else{
                grps = '第' + grps + '組';
              }
            var rr = $this.find('span.ig_deck_smallcard_cardrarety').text();  //レアリティ
            var hi = $(html).find('#cardWindow_' + cid ).find('span.ig_card_hiragana').text();//ひらがな
            var nm = $this.find('span.ig_deck_smallcard_cardname').text();  //名前
            var ct = $this.find('table.ig_deck_smallcarddata:eq(0)').find('td:eq(0)').text();
            var lv = $this.find('table.ig_deck_smallcarddata:eq(0)').find('td:eq(1)').text().match(/\d+/g);
            var hp = $this.find('table.ig_deck_smallcarddata:eq(0)').find('td:eq(2)').text().match(/\d+/);
            var uc = $this.find('table.ig_deck_smallcarddata:eq(0)').find('td:eq(3)').text().match(/\d+/g);
            var bg = $this.find('span.ig_deck_battlepoint2').text();
            var hs = $this.find('table.ig_deck_smallcarddata:eq(0)').find('td:eq(4)').text();
            var at = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(0)').text();
            var df = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(2)').text();
            var hy = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(1)').text();
            var ya = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(4)').text();
            var um = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(5)').text();
            var yu = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(6)').text();
            var ki = $this.find('table.ig_deck_smallcarddata:eq(1)').find('td:eq(7)').text();
            var $tmp = $this.find('table.ig_deck_smallcarddata:eq(2)');
            var sk = [$tmp.find('td:eq(0)').text(), $tmp.find('td:eq(1)').text(), $tmp.find('td:eq(2)').text()];
            var id = $this.find('a[href^="#TB_inline"]').attr('href');
              id = id.split('=');
              id = id[3].replace('cardWindow_', '');
              id = id.split('&')[0];
            
            var gp_1 = '',
              gp_2 = '';
            if (options.unit_list_group && group_setting[id]) {
              gp_1 = 'style="background-color:' + groups[group_setting[id]] + '"';
              gp_2 = (options.unit_list_group? '<img src="' + groups_img[group_setting[id]] + '" style="height:24px; width:24px;">': group_setting[id]) + '<input name="grp" value="' + group_setting[id] + '" hidden>';
            }
            var set_squad_id = $this.find('a[id^="btn_gounit_"]').attr('onClick');
            set_squad_id = set_squad_id? set_squad_id.match(/'.*?'/g): false;
            if (set_squad_id) {
              set_squad_id = set_squad_id[1].replace(/\'/g, '');
              if ( set_squad_id) ssID[id] = set_squad_id;
            }
            var tmp = '<tr>' +
            '<td class="選択"><input type=checkbox name="id" value="' + id + '"><input name="page" value="' + p + '"  hidden><input class="set_squad_id" value="' + ssID[id] + '" hidden></td>' +
            '<td class="No">' + no + '</td>' +
            '<td class="組">' + grps + '</td>' +
            '<td class="grp"' + gp_1 + '>' + gp_2 + '</td>' +
            '<td class="ﾚｱ">' + rr + '</td>' +
            '<td class="名前"><span id="kana" style="display: inline-block;text-indent: -9999px;">' + hi + '</span><span id="kanji">' + nm + '</span></td>' +
            '<td class="ｺｽﾄ">' + ct + '</td>' +
            '<td class="★">' + lv[0] + '</td>' +
            '<td class="Lv">' + lv[1] + '</td>' +
            '<td class="HP">' + hp + '</td>' +
            '<td class="討伐">' + bg + '</td>' +
            '<td class="指揮力">' + uc[1] + '</td>' +
            '<td class="兵数">' + uc[0] + '</td>' +
            '<td class="兵種">' + hs + '</td>' +
            '<td class="攻撃">' + at + '</td>' +
            '<td class="防御">' + df + '</td>' +
            '<td class="兵法">' + hy + '</td>' +
            '<td class="槍">' + ya + '</td>' +
            '<td class="槍 実指揮">' + Math.round(uc[1] * rank[ya] / 100) + '</td>' +
            '<td class="槍 ｺｽﾄ比">' + Math.round(uc[1] * rank[ya] / ct / 100) + '</td>' +
            '<td class="馬">' + um + '</td>' +
            '<td class="馬 実指揮">' + Math.round(uc[1] * rank[um] / 100) + '</td>' +
            '<td class="馬 ｺｽﾄ比">' + Math.round(uc[1] * rank[um] / ct / 100) + '</td>' +
            '<td class="弓">' + yu + '</td>' +
            '<td class="弓 実指揮">' + Math.round(uc[1] * rank[yu] / 100) + '</td>' +
            '<td class="弓 ｺｽﾄ比">' + Math.round(uc[1] * rank[yu] / ct / 100) + '</td>' +
            '<td class="器">' + ki + '</td>' +
            '<td class="器 実指揮">' + Math.round(uc[1] * rank[ki] / 100) + '</td>' +
            '<td class="器 ｺｽﾄ比">' + Math.round(uc[1] * rank[ki] / ct / 100) + '</td>' +
            '<td class="技1">' + sk[0] + '</td>' +
            '<td class="技2">' + sk[1] + '</td>' +
            '<td class="技3">' + sk[2] + '</td>' +
            '<td class="槍馬">' + drank[rank[ya] + rank[um]] + '</td>' +
            '<td class="槍馬 実指揮">' + Math.round(uc[1] * (rank[ya] + rank[um]) / 2 / 100) + '</td>' +
            '<td class="槍馬 ｺｽﾄ比">' + Math.round(uc[1] * (rank[ya] + rank[um]) / 2 / ct / 100) + '</td>' +
            '<td class="槍弓">' + drank[rank[ya] + rank[yu]] + '</td>' +
            '<td class="槍弓 実指揮">' + Math.round(uc[1] * (rank[ya] + rank[yu]) / 2 / 100) + '</td>' +
            '<td class="槍弓 ｺｽﾄ比">' + Math.round(uc[1] * (rank[ya] + rank[yu]) / 2 / ct / 100) + '</td>' +
            '<td class="弓馬">' + drank[rank[yu] + rank[um]] + '</td>' +
            '<td class="弓馬 実指揮">' + Math.round(uc[1] * (rank[yu] + rank[um]) / 2 / 100) + '</td>' +
            '<td class="弓馬 ｺｽﾄ比">' + Math.round(uc[1] * (rank[yu] + rank[um]) / 2 / ct / 100) + '</td>' +
            '<td class="槍器">' + drank[rank[ya] + rank[ki]] + '</td>' +
            '<td class="槍器 実指揮">' + Math.round(uc[1] * (rank[ya] + rank[ki]) / 2 / 100) + '</td>' +
            '<td class="槍器 ｺｽﾄ比">' + Math.round(uc[1] * (rank[ya] + rank[ki]) / 2 / ct / 100) + '</td>' +
            '<td class="馬器">' + drank[rank[um] + rank[ki]] + '</td>' +
            '<td class="馬器 実指揮">' + Math.round(uc[1] * (rank[um] + rank[ki]) / 2 / 100) + '</td>' +
            '<td class="馬器 ｺｽﾄ比">' + Math.round(uc[1] * (rank[um] + rank[ki]) / 2 / ct / 100) + '</td>' +
            '<td class="弓器">' + drank[rank[yu] + rank[ki]] + '</td>' +
            '<td class="弓器 実指揮">' + Math.round(uc[1] * (rank[yu] + rank[ki]) / 2 / 100) + '</td>' +
            '<td class="弓器 ｺｽﾄ比">' + Math.round(uc[1] * (rank[yu] + rank[ki]) / 2 / ct / 100) + '</td>' +
            '</tr>';
            $('#tb_unitlist').append(tmp);
          });
        }

        //次ページ取得の判断
        var p2 = !$(html).find('ul.pager.cardstock:eq(0) > li.last > a:eq(1)')[0] ? '' : p + 1,
          ano2 = (ano === 4 || ano === '' ) ? '' : ano + 1;

        if ( ( p && p2 > p) || ( ano2 > ano && !$('#v_head > select.unit_ano').find('option:eq(' + ano + ')').text().match(/新規部隊を作成/))) {

          // 次ページ取得
          setTimeout(unitListLoad, 100, (p? p2: p), ano2);
        } else {

          //取得終了後の処理
          $('#v_head > span.' + $('#v_head > select.unit_ano').find('option:selected').attr('class')).show();
          $('div.Loading').hide();
          $('#unitlistdialog').css({'opacity': '1.0'});
          $('#tb_unit').ready( setupTableSorter);
          $( '#unitSet').append( $( html).find( '[id^=unit_id_select_]:eq(0)').removeAttr( 'onchange')).append( '<input type="text" id="unit_cnt_text" value="max"><input type="button" value="兵士セット">').on( 'click', 'input:eq(1)', setHeishi);
          $('ul.uldoption').find('input').each(function() {
            if (!$(this).prop('checked')) {
              $('#tb_unit .' + $(this).parent().text().match(/ : ([\S]+)/)[1]).hide();
            }
          });
          setStorage( 'crx_ssID', ssID, false, world);
          return;
        }
      }
    });
  }

  // set_squad_idのchrome.storage.localへの読み書き
  function setStorage (  key, obj, toggle, world) {
    chrome.storage.local.get( world, function ( store) {
      allSettings = store[world]? JSON.parse(store[world]): {};
      allSettings[key] = obj;
      allSettings.toggle ^= toggle;
      store[world] = JSON.stringify(allSettings);
      chrome.storage.local.set( store, function(){
        //console.log(allSettings)
      });
    });
  }

  //兵士一括セット
  function setHeishi() {
    var $tb_unitlist = $( '#tb_unitlist'), dataArray = [],
      unitID = $( '[id^="unit_id_select_"]').val(), unitCnt = $( '#unit_cnt_text').val(),
      max = $( '#unitSet>select[id^="unit_id_select_"] option:selected').text().match(/\d+/)[0];
    $tb_unitlist.find('td.選択>input:checked').each( function () {
      var cnt = unitCnt;
      if ( unitCnt.match(/max/i)) {
        cnt = Math.min( $(this).parent().siblings( 'td.指揮力').text(), max);
        max -= cnt;
        //console.log(unitCnt,cnt,max);
      }
      dataArray.push( { card_id: $( this).val(), unit_type: unitID, unit_count: cnt});
    });
    $('div.Loading').show();
    $( '#unitlistdialog').css( 'opacity', '0.3');
    postSetHeishi( dataArray);
  }

  function postSetHeishi(dataArray) {
    if ( dataArray[0]) {
      $.post(
        'http://' + world + '.sengokuixa.jp/facility/set_unit_list_if.php',
        dataArray.shift(), // { card_id: data0, unit_type: data1, unit_count: data2 },
        function () {
          setTimeout( postSetHeishi, 100, dataArray);
        }
      );
    } else {
      var url = ['http://'+world+'.sengokuixa.jp/facility/set_unit_list.php?show_num=100&p=1', 'http://'+world+'.sengokuixa.jp/facility/set_unit_list.php?show_num=100&p=2'];
      $.get(
        url[0],
        function ( data) {
          var $parseData = $( $.parseHTML( data));
          $parseData.find( '#busho_info tr.tr_gradient').each( function () {
            var id = $(this.firstElementChild.firstElementChild).prop('id'), tr;
            if( id) {
              tr = $('#tb_unitlist>tr:has(td.選択>input[value="'+id.match( /\d+/)[0]+'"])');
              tr.find( 'td.兵種').text( $(this).find( '[id^="now_unit_img_"]').prop('alt'));
              tr.find( 'td.兵数').text( $(this).find( '[id^="now_unit_cnt_"]').text());
            }
          });
          $( '#unitSet>select').after( $parseData.find( '#unit_id_select_0').removeAttr( 'onchange')).remove();
          $( '#tb_unit').trigger( 'update');
          if ( $parseData.is( 'bar_card .pager')) {
            $.get(
              url[1],
              function ( data) {
                $( $.parseHTML( data)).find( '#busho_info tr.tr_gradient').each( function () {
                  var id = $(this.firstElementChild.firstElementChild).prop('id'), tr;
                  if( id) {
                    tr = $('#tb_unitlist>tr:has(td.選択>input[value="'+id.match( /\d+/)[0]+'"])');
                    tr.find( 'td.兵種').text( $(this).find( '[id^="now_unit_img_"]').prop('alt'));
                    tr.find( 'td.兵数').text( $(this).find( '[id^="now_unit_cnt_"]').text());
                  }
                });
                $( 'div.Loading').hide();
                $( '#unitlistdialog').css( 'opacity', '1');
                $( '#tb_unit').trigger( 'update');
              }
            );
          } else {
            $( 'div.Loading').hide();
            $( '#unitlistdialog').css( 'opacity', '1');
          }
        }
      );
    }
  }

  // 部隊セット
  function unit_set($this) {

    //選択された部隊の番号とIDを取得
    var select_assign_no = $this.children().first().attr( 'value'),
      set_village_id = $this.find('#select_village').find('option:selected').val(),
      set_assign_id = $this.find('button').val(),
      set_squad_id = [],
      busho_list = [];

    //チェックされた武将のset_squad_idを取得
    $('#tb_unitlist input[name^="id"]:checked').each( function() {
      var busho_chk = $(this).parent();
      if ( busho_chk.find('.set_squad_id').val() === 'undefined') {
        get_squad_id(select_assign_no, busho_chk.find('input[name=page]').val(), busho_chk.parent(), set_squad_id, busho_list);
      } else {
        set_squad_id.push( $( this).next().next().val());
        busho_list.push( $( this).parent().parent());
      }
    });

    if (set_squad_id.length == 0) {
      alert('セット可能な武将がいません。');
    } else if (confirm(set_squad_id.length+'人がセット可能です。リスト順に配置します。')) {
      //武将をセット
      set_card_to_deck( select_assign_no, set_village_id, set_assign_id, set_squad_id, busho_list, 0);
    }

    //カードを部隊にセットする関数
    function set_card_to_deck( select_assign_no, set_village_id, set_assign_id, set_squad_id, busho_list, i) {

      //POSTデータ
      var data = {
        target_card: '',
        select_assign_no: select_assign_no,
        mode: 'assign_insert',
        btn_change_flg: '',
        set_village_id: set_village_id,
        set_assign_id: set_assign_id,
        set_squad_id: set_squad_id[i],
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
          var bushoname = busho_list[i].find('#kanji').text(),
            regexpname = new RegExp(bushoname);
          if ( $(html).find('#ig_deckboxInner').find('div.common_box1')[0] ) {
            alert( busho_list[ i].find( '#kanji').text() + 'をセットできませんでした。');
            getButai( $( html), select_assign_no);
            $( '#tb_unit').trigger( 'update');
          } else {
            busho_list[i].find('td.選択').css({'background-color':'#BA8BE5'}).find( ':checked').prop( 'checked', false);
            $('#v_head > span.deckcost').text($(html).find('#ig_deckcost > span.ig_deckcostdata').text());
            if (i < set_squad_id.length - 1) {
              if ( (!set_assign_id && $(html).find('#ig_unitchoice > li.now').text().match(regexpname)) || (set_assign_id && !$(html).find('#ig_unitchoice > li.now').text().match(regexpname)) ) {
                if ( !set_assign_id ) {
                  set_assign_id = $(html).find('#set_assign_id').val();
                }
//                console.log( select_assign_no, set_village_id, set_assign_id, set_squad_id, busho_list, i);
                setTimeout(set_card_to_deck, 100, select_assign_no, set_village_id, set_assign_id, set_squad_id, busho_list, i + 1);
              } else {
                alert(busho_list[i+1].find('#kanji').text() + 'をセットできませんでした。');
//                console.log( select_assign_no, set_village_id, set_assign_id, set_squad_id, busho_list, i);
                getButai( $( html), select_assign_no);
                $( '#tb_unit').trigger( 'update');
              }
            } else {
//              alert('完了');
              getButai( $( html), select_assign_no);
              $( '#tb_unit').trigger( 'update');
            }
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          //console.log(textStatus);
        }
      });
    }

    function getButai( $html, ano) {

      //コストを取得
      $('#v_head span.deckcost').empty()
        .append( $html.find( '#ig_deckcost > span.ig_deckcostdata').text()).css( { 'margin-right': '1em'});

      //部隊を取得
      var unitLeader = '<span value="' + ano + '" class="ano' + ano + '">' +
        $html.find('#ig_unitchoice > li:eq(' + ano + ')').text() + '</span><br/>';
      $('#v_head div.ano:eq(' + ano + ')').empty().append( unitLeader);

      //部隊のIDを取得、DOMオブジェクトを取得
      var set_assign_id = $html.find('#set_assign_id').val();
      var $ig_deck_unitdetailbox = $html.find('#ig_deck_unitdetailbox');
      var $v_head_span_ano = $('#v_head div.ano:eq(' + ano + ')');
      var base = $ig_deck_unitdetailbox.parent().find('div.ig_deck_unitdata_assign.deck_wide_select').html()
           || $html.find('#select_village').parent().html();
      if (set_assign_id) {
        $v_head_span_ano.append(
          '<span class="subleader"></span><br/><span class="subleader"></span><br/><span class="subleader"></span><br/>' +
          '<span class=condition></span><br/>' +
          '<span class=base style="margin-right: 1em;"></span>' +
          '<span class="set_button"><br/><button class="set_unitlist" style="padding: 0 4px;" value="' + set_assign_id + '">配置</button></span>'
        );
        $( '#v_head div.ano' + ano).val( set_assign_id);

        //部隊副長を取得
        $ig_deck_unitdetailbox.find('span.ig_deck_unitdata_subleader').each( function( i) {
          $v_head_span_ano.find('span.subleader:eq(' + i + ')').text('[' + $(this).text().match(/[\S]+/)[0] + ']');
        });

        //部隊の状態を取得
        var unit_condition_text = $ig_deck_unitdetailbox.find( 'span.ig_deck_unitdata_condition').text().trim();
        $v_head_span_ano.find('span.condition').text('(' + unit_condition_text + ')');
      } else {
        base = $( $.parseHTML( base)).removeAttr( 'onchange');
        $v_head_span_ano.append(
          '<span class=base style="margin-right: 1em;"></span>' +
          '<span class="set_button"><br/><button class="set_unitlist" style="padding: 0 4px;" value="">配置</button></span>'
        );
      }

      //部隊の拠点を取得
      $v_head_span_ano.find('span.base').append('拠点：' ,base);
      $('#v_head div.ano:eq('+ano+')').append($v_head_span_ano);
    }

    //set_squad_idを取得する関数
    function get_squad_id( select_assign_no, p, busho, set_squad_id_list, busho_list) {

      var data =  {  target_card: '',
              select_assign_no: select_assign_no,
              mode: '',
              btn_change_flg: '1',
              set_village_id: '',
              set_assign_id: '',
              set_squad_id: '',
              deck_mode: 'nomal',
              p: p,
              myselect_2: ''
            },
        set_squad_id;

      $.ajax({
        type: "POST",
        url: 'http://'+world+'.sengokuixa.jp/card/deck.php',
        data: data,
        cache: false,
        async: false,
        success: function(html) {

          //ページ内の全カード
          var cards = $(html).find('#ig_deck_smallcardarea_out');
          var list = $('#tb_unitlist');

          //カードのidと一致するリストの武将データを取得
          cards.find('div.ig_deck_smallcardarea').each(function() {
            var $this = $(this);
            if ($this.find('a[href^="/facility/set_unit.php"]').attr('href') == undefined) {
              return true;
            }

            var id = $this.find('a[href^="/facility/set_unit.php"]').attr('href').split('=');
            id = id[1].replace('&ano', '');

            var busho = list.find('input[value="'+id+'"]');
            if (busho[0]) {
              busho.parent().find('input[name="page"]').val(p);
              var set_squad_id = $this.find('a[id^="btn_gounit_"]').attr('onClick').match(/'.*?'/g);
              if (set_squad_id) {
                set_squad_id = set_squad_id[1].replace(/'/g, '');
                ssID[id] = set_squad_id;
                busho.parent().find('input.set_squad_id').val(set_squad_id);
              }
            }
          });

          //カードIDが一致するカードを取得
          var card_sameID = cards.find('div.ig_deck_smallcardarea:has(div.ig_deck_smallcardbox a[href*=' + busho.find('input[name=id]').val() + '])');
          var busho_p = parseInt(busho.find('input[name=page]').val());
          if (card_sameID[0]) {
            //カードがあった場合
            set_squad_id = card_sameID.find('a[id^="btn_gounit_"]').attr('onClick').match(/'.*?'/g);
            if (set_squad_id) {
              set_squad_id = set_squad_id[1].replace(/'/g, '');
              set_squad_id_list.push(set_squad_id);
              busho_list.push(busho);
            }
            //カードがあるページを更新
            busho.find('input[name="page"]').val(p);
          } else {
            //カードが無かった場合
            //カードNo.が一致するカードを取得し次ページ移動の判断
            var cards_sameNo = cards.find('div.ig_deck_smallcardarea:contains(' + busho.find('td.No').text() + ')');
            if (parseInt(p,10) >= busho_p && (!cards_sameNo[0] || cards.find('div.ig_deck_smallcardarea').index(cards_sameNo[cards_sameNo.length-1]) === 14)) {
              p++;
              if ($(html).find('ul.pager.cardstock > li.last:eq(0) > a:eq(1)')[0] && p - 2 <= busho_p) {
                get_squad_id(select_assign_no, p, busho, set_squad_id_list, busho_list);
              }
            } else if (parseInt(p,10) <= busho_p && (!cards_sameNo[0] || cards.find('div.ig_deck_smallcardarea').index(cards_sameNo[0]) === 0)) {
              p--;
              if (p > 0 && p + 2 >= busho_p) {
                get_squad_id(select_assign_no, p, busho, set_squad_id_list, busho_list);
              }
            }
          }
        }
      });
    }
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
    console.log( villageIds);
  }

  function cal_energy($power) {
    var UnitData = {
        "足軽": {off: 11,def: 11,mov: 15,tp1: "t1",tp2: "t1"},"長槍足軽": {off: 16,def: 16,mov: 16,tp1: "t1",tp2: "t1"},"武士": {off: 18,def: 18,mov: 18,tp1: "t1",tp2: "t3"},"国人衆": {off: 17,def: 13,mov: 17,tp1: "t1",tp2: "t3"},
        "弓足軽": {off: 10,def: 12,mov: 16,tp1: "t3",tp2: "t3"},"長弓兵": {off: 15,def: 17,mov: 18,tp1: "t3",tp2: "t3"},"弓騎馬": {off: 17,def: 19,mov: 23,tp1: "t2",tp2: "t3"},"海賊衆": {off: 16,def: 17,mov: 20,tp1: "t2",tp2: "t3"},
        "騎馬兵": {off: 12,def: 10,mov: 22,tp1: "t2",tp2: "t2"},"精鋭騎馬": {off: 17,def: 15,mov: 23,tp1: "t2",tp2: "t2"},"赤備え": {off: 21,def: 20,mov: 25,tp1: "t1",tp2: "t2"},"母衣衆": {off: 19,def: 16,mov: 24,tp1: "t1",tp2: "t2"},
        "破城鎚": {off: 3,def: 8,mov: 8,tp1: "t4",tp2: "t4"},"攻城櫓": {off: 14,def: 5,mov: 10,tp1: "t4",tp2: "t4"},"大筒兵": {off: 10,def: 12,mov: 8,tp1: "t3",tp2: "t4"},
        "鉄砲足軽": {off: 18,def: 26,mov: 15,tp1: "t1",tp2: "t4"},"騎馬鉄砲": {off: 26,def: 18,mov: 21,tp1: "t2",tp2: "t4"},"雑賀衆": {off: 23,def: 17,mov: 18,tp1: "t1",tp2: "t4"},
      },
      rank = {SSS: 1.20,SS: 1.15,S: 1.10,A: 1.05,B: 1,C: 0.95,D: 0.9,E: 0.85,F: 0.80}, check_list = [], tmp;
    $('input[name^="id"]:checked').each(function() {
      var $tr = $(this).parent().parent();
      var num = $tr.find('td.兵数').text();
      var unit = $tr.find('td.兵種').text();
      var off = $tr.find('td.攻撃').text();
      var def = $tr.find('td.防御').text();
      var t1 = $tr.find('td.槍:eq(0)').text();
      var t2 = $tr.find('td.馬:eq(0)').text();
      var t3 = $tr.find('td.弓:eq(0)').text();
      var t4 = $tr.find('td.器:eq(0)').text();
      //t1:槍,t2:馬,t3:弓,t4:器
      check_list.push({unit: unit,off: off,def: def,num: num,t1: t1,t2: t2,t3: t3,t4: t4});
    });
    if (check_list.length == 0) {
      tmp = '武将が選択されていません';
    } else {
      var o_power = 0;
      var d_power = 0;
      for (var i = 0; i < check_list.length; i++) {
        var r1 = rank[(check_list[i])[UnitData[check_list[i].unit].tp1]];
        var r2 = rank[(check_list[i])[UnitData[check_list[i].unit].tp2]];
        o_power += (parseInt(check_list[i].num * UnitData[check_list[i].unit].off) + parseInt(check_list[i].off)) * ((r1 + r2) / 2);
        d_power += (parseInt(check_list[i].num * UnitData[check_list[i].unit].def) + parseInt(check_list[i].def)) * ((r1 + r2) / 2);
      }
      tmp = '攻撃力:' + o_power.toFixed(1) + '/防御力:' + d_power.toFixed(1);
    }
    $power.text(tmp);
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
            .replace(/鉄砲足軽/, 50).replace(/騎馬鉄砲/, 51).replace(/雑賀衆/, 52);
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
        return s.replace(/第1組/, 1).replace(/第2組/, 2).replace(/第3組/, 3).replace(/第4組/, 4)
            .replace(/未設定/, 5);
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
        3: {sorter: 'grp'},
        4: {sorter: 'rarerity'},
        13: {sorter: 'soltype'},
        17: {sorter: 'ability'},
        20: {sorter: 'ability'},
        23: {sorter: 'ability'},
        26: {sorter: 'ability'},
        32: {sorter: 'ability'},
        35: {sorter: 'ability'},
        38: {sorter: 'ability'},
        41: {sorter: 'ability'},
        44: {sorter: 'ability'},
        47: {sorter: 'ability'},
      },
      sortForce: [[0,1]]
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
})();