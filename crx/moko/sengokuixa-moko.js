// Mokoメイン関数
// jQueryとdata.jsonを受け取る。
function Moko_main( $) {
  'use strict';
  var TOOL_NAME = "sengokuixa-moko.crx",
  i,
  options = {},
  OPTION_TAG = 'ixa_moko_options',
  OPTION_PREFIX = 'ixa_moko_',
  //グループ：デフォルト枠
  groups_def = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  //グループ：HP100未満の背景色(100枚表示まで)
  groupsx_def = ['#600', '#600', '#600', '#600', '#600', '#600', '#600', '#600', '#600', '#600', '#600', '#600', '#600', '#600', '#600', '#600'],
  //グループ：アイコン デフォルト
  groups_img_def = CRXMOKODATA.group[0],

  IMAGES = CRXMOKODATA.images,
  SOUND = CRXMOKODATA.sound,

  // NPC空地：必要攻撃力(理論値)
  //4章
  POTENTIAL_LIST_4 = CRXMOKODATA.POTENTIAL_LIST_4,
  //5章
  POTENTIAL_LIST_6_1 = CRXMOKODATA.POTENTIAL_LIST_6_1,
  POTENTIAL_LIST_6_2 = CRXMOKODATA.POTENTIAL_LIST_6_2,
  POTENTIAL_LIST_6_3 = CRXMOKODATA.POTENTIAL_LIST_6_3,
  POTENTIAL_LIST_6_4 = CRXMOKODATA.POTENTIAL_LIST_6_4,
  POTENTIAL_LIST_6_5 = CRXMOKODATA.POTENTIAL_LIST_6_5,
  POTENTIAL_LIST_6_6 = CRXMOKODATA.POTENTIAL_LIST_6_6,
  POTENTIAL_LIST_5_5 = CRXMOKODATA.POTENTIAL_LIST_5_5,
  POTENTIAL_LIST_5_4 = CRXMOKODATA.POTENTIAL_LIST_5_4,
  POTENTIAL_LIST_5_3 = CRXMOKODATA.POTENTIAL_LIST_5_3,
  POTENTIAL_LIST_5_2 = CRXMOKODATA.POTENTIAL_LIST_5_2,
  POTENTIAL_LIST_5_1 = CRXMOKODATA.POTENTIAL_LIST_5_1,
  //★★★11110は安全値で高い方の数値
  /*
  ☆1~3：(5期迄は)　全部同じ
  ☆4~6：1期と2期は同じ、3期は1.1倍、4期1.2倍、5期1.3倍
  ☆7~8：2期は1期の1.1倍、3期は1.2倍、4期は1.3倍、5期は1.4倍
  */
  // 豪族砦データ
  BASE_AREA_4 = [ [0, 0],[ 12, 28], [ 28, 12], [ 12, 52], [ 36, 36], [ 52, 12], [ 12, 76], [ 36, 60], [ 60, 36], [ 76, 12], [ 12,100],[ 36, 84], [ 60, 60], [ 84, 36], [100, 12], [ 12,124], [ 36,108], [ 60, 84], [ 84, 60], [108, 36], [124, 12],[ 12,148], [ 36,132], [ 60,108], [ 84, 84], [108, 60], [132, 36], [148, 12], [ 36,156], [ 60,132], [ 84,108],[108, 84], [132, 60], [156, 36], [ 60,156], [ 84,132], [108,108], [132, 84], [156, 60], [ 84,156], [108,132],[132,108], [156, 84], [108,156], [132,132], [156,108], [132,156], [156,132], [156,156] ],
  BASE_AREA_5 = [ [0, 0],[ 12, 28], [ 28, 12], [ 12, 52], [ 36, 36], [ 52, 12], [ 12, 76], [ 36, 60], [ 60, 36], [ 76, 12], [ 12,100],[ 36, 84], [ 60, 60], [ 84, 36], [100, 12], [ 12,124], [ 36,108], [ 60, 84], [ 84, 60], [108, 36], [124, 12],[ 36,132], [ 60,108], [ 84, 84], [108, 60], [132, 36], [ 60,132], [ 84,108], [108, 84], [132, 60], [ 84,132],[108,108], [132, 84], [108,132], [132,108], [132,132] ],

  group_setting = null,
  //cardname_setting = null,
  groups = groups_def,
  groupsx = groupsx_def,
  groups_img = groups_img_def,
  group_index = null;
  
  if (localStorage.getItem('crx_'+ OPTION_TAG)) {
    options = secureEvalJSON(localStorage.getItem("crx_ixa_moko_options"));
  }
  group_setting = {};
  //cardname_setting = {};
  group_index = [];
  if (localStorage.getItem("crx_ixamoko_group_set")) {
    group_setting = secureEvalJSON(localStorage.getItem("crx_ixamoko_group_set"));
  }
  if (localStorage.getItem("crx_ixakaizou_group_index")) {
    group_index = secureEvalJSON(localStorage.getItem("crx_ixakaizou_group_index"));
  }
  if (localStorage.getItem('crx_ixamoko_init_groups')) {
    groups = secureEvalJSON(localStorage.getItem('crx_ixamoko_init_groups'));
  } else {
    localStorage.setItem('crx_ixamoko_init_groups', ArraytoJSON(groups));
  }
  if (localStorage.getItem('crx_ixamoko_init_groups_img')) {
    groups_img = secureEvalJSON(localStorage.getItem('crx_ixamoko_init_groups_img'));
  } else {
    localStorage.setItem('crx_ixamoko_init_groups_img', ArraytoJSON(groups_img));
  }
  //nowLoading
  var setting_dialog_str = '<div id="nowLoadingContent" style="position:absolute;width:220px;height:20px;display:none;z-index:9999;padding:20px;color:white;background-color:black;border:3px solid #77692F;-webkit-border-radius:5px;" class="window"><p style="text-align:center;">しばらくお待ちください。 <span></span></p><img src="' + IMAGES.rel_interstitial_loading + '"></div>';
  setting_dialog_str += '<DIV style="position:absolute;z-index:9000;background-color:#000;display:none;" id="ixamoko_mask"></DIV><DIV style="position:absolute;z-index:9000;background-color:#000;display:none;" id="loading_mask"></DIV></DIV>';
  $('BODY').prepend(setting_dialog_str);

  //サイドバー：mokoツールリストの形成
  $('#sideboxTop').prepend('<DIV class="sideBox"><DIV class="sideBoxHead"><h3 id="moko_title">' + TOOL_NAME + '</h3></DIV><DIV class="sideBoxInner" id="mokotool"></DIV></DIV>');
  $('#mokotool').append('<ul id="toollist"></ul>');
  
  if ( options.chapter_change === '0' ) {
  //4章の場合
    var style = document.createElement("style");
    style.innerHTML = '#moko_title { padding: 5px 0 2px 0 !important; margin: 0 8px !important; border-bottom: 1px solid #505050 !important; }'
           + '#moko_title a:hover { color: yellow; }'
    document.head.appendChild(style);
  
  } else {
  //5章の場合
    var style = document.createElement("style");
    style.innerHTML = '#moko_title { background: url(' + IMAGES.moko_title_bg + ') no-repeat;'
           + 'padding: 7px 0 3px 11px !important; margin-top: -5px !important; color: #E9CB8B !important; font-size: 14px !important; font-family: MS PMincho !important; }'
           + '#moko_title a { color: inherit; }'
           + '#moko_title a:hover { color: yellow !important; }'
           + '#sideboxTop .sideBox:nth-child(1) .sideBoxHead { padding-bottom: 0; } '
    document.head.appendChild(style);
  
  }
  //クッキーに登録したログイン時間を取得
  if (getCookie('im_st')) {
    localStorage.setItem(OPTION_PREFIX + 'crx_starttime', getCookie('im_st'));
    document.cookie = 'im_st=0; expires=Fri, 31-Dec-1999 23:59:59 GMT; domain=.sengokuixa.jp; path=/;';
  }

//  alert($().jquery);
  AjaxLoader();
//  battle_mode_check();
  menu_reversal(); //tabArea
  mod_status_left(); //tabArea
  allpage_check();
  big_flt_action_log();
  unitList_preparation();
  unit_list_default();
  unit_list_200();
  unit_filter_branch();
  non_cardview();
  chat_check();
  chat_mapcood2();
  bbs_mapcood();
  chat_default_check();
  disp_ToubatsuRestTime(true);
  dungeon_check();
  message_check();
  map_check();
  map_rightclick();
  map_arrowclick();
  map_butai_status();
  bbs_check();
  reportlist_check();
  trade_default_check();
  user_check();
  village_check();
  facility_check();
  chat_log_check();
  delList_check();
  non_back();
  all_area_map();
  all_map_status();
  all_check_inbox();
  fightlist();
  merge_fight_info();
  facility_selecter();
  facility_panelreverse();
  hold_butai();
  unit_list_allset();
  send_troop_check();
  warreportlinkland();
  category_clone();
  firstcard_prepara();
  all_deck_setting();
  all_dissolution();
  deck_check();
  sort_village();
  ptop_check();
  war_detail_navi();
  facility_tool();
  card_tool();
  panelAttack();
  now_select_point();
  zoomMap();
  card_deck_layout();
  favoriteSort();
  deal_favorite();
  fall_check();
  lv_check();
  panel_func_change();
  map_tool();
  villageListView();
  deckGroupImgView();
  doumeiscore();
  hide_facility();
  prod_with_smalllot();
  levelup_check();
  confluence_select();
  raid_system();
  bbs_default_check();
  bbs_add_pager_value();
  bbs_no_display_delete();
  replace_ulpagercardstock();
  facilityStuffTextColor();
  map_history();
  map_quarters();
  MapPanels_move();
  barracks_link();
  LinkToMap();
  TotalProduction();
  select_check_inbox();
  deckFix();
  unit_list_pageup();
  UnitPowerView();
  ar_point_cmp();
  dungeon_soldiers();
  facility_favorites();
  funct_select_move();
  fall_Judgment();
  MapOverlay_FallMain();
  MapOverlay_Leader();
  EnemyPlacementPoint();
  set_unit_color();
  soldier_set_support();
  def_attack();
  enemy_mark();
  warskil_summary_init();
  ar_summary_init();
  record_mark();
  status_set_support();
  rank_up_support();
  alliance_report_link();
  bases_blind();
  profortunes();
  dungeon_troops();
  immediately_send_troop();
  all_send_troop();
  gofight_skill();
  leave_departure();
  cancel_confirmation();
  prohibiJin();
  country_change();
  union_deck_layout();
  deck_soldier_set();
  width_display();
  auto_union_check();
  fade_change();
  soldiers_blind();
  trade_auxiliary();
  alltroops_cancel();


//////////////////////
//プルダウンメニュー：
//////////////////////
  // メニュー：合戦「参加せよ」 を非表示
  $(function(){
    $('li.gMenu05 > a > img').remove();
  });
  //通常はプルダウンメニューは非表示
  $(function(){
    if (options.pulldown_menu)
      return;
    $('#menu').find('ul').remove();
  });

  var br3 = {
    closeTimer: null,
    makeMapMenu: function(arr, target) {
      var c = location.href.match(/c=\d+$/);
      if (c !== null) {
        c = "&" + c;
      } else {
        c = "";
      }
      var submenu = document.createElement('div');
      submenu.id = target;
      submenu.style.position = "absolute";
      submenu.style.zIndex = 200000;
      submenu.style.background = "rgba(0,0,0,0.8)";
      submenu.style.border = "1px solid #8e7425";
      submenu.style.display = "none";
      submenu.style.overflowY = "auto"
      submenu.style.overflowX = "hidden"
      submenu.style.maxHeight = "400px";
      submenu.style.minWidth = "235px";
      $("." + target).append(submenu);
      $(submenu).mouseover(function() {
        br3.closetimeC();

      });
      $(submenu).mouseout(function() {
        br3.closetime();
      });
      
      var newCountry = $('#sideboxBottom').find('.situationWorldTable').find('img[alt="合戦中"]').attr('title');
      var mapTextarea = $('#map_textarea').size();
      
      if(newCountry == '新合戦中' && mapTextarea == 0){
      
      $.ajax({
        'url': '/war/war_briefing.php',
        'cache': false,
        'dataType': "text",
        'success': function (html){
          var ULwestTeam =  $(html).find('ul.westTeam');
          var ULeastTeam =  $(html).find('ul.eastTeam');
          var WestTm1 = ULwestTeam.find('li:eq(0)').find('img').attr('alt').replace('我部', '').split('家',1);
          var WestTm2 = ULwestTeam.find('li:eq(1)').find('img').attr('alt').replace('我部', '').split('家',1);
          var WestTm3 = ULwestTeam.find('li:eq(2)').find('img').attr('alt').replace('我部', '').split('家',1);
          var EastTm1 = ULeastTeam.find('li:eq(0)').find('img').attr('alt').replace('我部', '').split('家',1);
          var EastTm2 = ULeastTeam.find('li:eq(1)').find('img').attr('alt').replace('我部', '').split('家',1);
          var EastTm3 = ULeastTeam.find('li:eq(2)').find('img').attr('alt').replace('我部', '').split('家',1);
          var toride = $(html).find('a:has(img.btIconFort)');
          var ootono = $(html).find('a:has(img.btIconNew)');
          var mapin = $(html).find('#ig_battle_status_map');
          
      var tmp = '<li>' +
          '<span>西軍[1]</span>' +
          '<a href="' + ootono.eq(0).attr('href') + '">' + WestTm1 + ' [大殿]</a>' +
          '<a href="' + toride.eq(0).attr('href') + '">' + WestTm1 + ' [砦1]</a>' +
          '<a href="' + toride.eq(1).attr('href') + '">' + WestTm1 + ' [砦2]</a>' +
          '<a href="' + toride.eq(2).attr('href') + '">' + WestTm1 + ' [砦3]</a>' +
          '<a href="' + toride.eq(3).attr('href') + '">' + WestTm1 + ' [砦4]</a>' +
          '<a href="' + toride.eq(4).attr('href') + '">' + WestTm1 + ' [砦5]</a>' +
          '</li>' +
          '<li>' +
          '<span>西軍[2]</span>' +
          '<a href="' + ootono.eq(1).attr('href') + '">' + WestTm2 + ' [大殿]</a>' +
          '<a href="' + toride.eq(5).attr('href') + '">' + WestTm2 + ' [砦1]</a>' +
          '<a href="' + toride.eq(6).attr('href') + '">' + WestTm2 + ' [砦2]</a>' +
          '<a href="' + toride.eq(7).attr('href') + '">' + WestTm2 + ' [砦3]</a>' +
          '<a href="' + toride.eq(8).attr('href') + '">' + WestTm2 + ' [砦4]</a>' +
          '<a href="' + toride.eq(9).attr('href') + '">' + WestTm2 + ' [砦5]</a>' +
          '</li>'+
          '<li>' +
          '<span>西軍[3]</span>' +
          '<a href="' + ootono.eq(2).attr('href') + '">' + WestTm3 + ' [大殿]</a>' +
          '<a href="' + toride.eq(10).attr('href') + '">' + WestTm3 + ' [砦1]</a>' +
          '<a href="' + toride.eq(11).attr('href') + '">' + WestTm3 + ' [砦2]</a>' +
          '<a href="' + toride.eq(12).attr('href') + '">' + WestTm3 + ' [砦3]</a>' +
          '<a href="' + toride.eq(13).attr('href') + '">' + WestTm3 + ' [砦4]</a>' +
          '<a href="' + toride.eq(14).attr('href') + '">' + WestTm3 + ' [砦5]</a>' +
          '</li>' +
          '<li>' +
          '<span>東軍[1]</span>' +
          '<a href="' + ootono.eq(3).attr('href') + '">' + EastTm1 + ' [大殿]</a>' +
          '<a href="' + toride.eq(15).attr('href') + '">' + EastTm1 + ' [砦1]</a>' +
          '<a href="' + toride.eq(16).attr('href') + '">' + EastTm1 + ' [砦2]</a>' +
          '<a href="' + toride.eq(17).attr('href') + '">' + EastTm1 + ' [砦3]</a>' +
          '<a href="' + toride.eq(18).attr('href') + '">' + EastTm1 + ' [砦4]</a>' +
          '<a href="' + toride.eq(19).attr('href') + '">' + EastTm1 + ' [砦5]</a>' +
          '</li>'+
          '<li>' +
          '<span>東軍[2]</span>' +
          '<a href="' + ootono.eq(4).attr('href') + '">' + EastTm2 + ' [大殿]</a>' +
          '<a href="' + toride.eq(20).attr('href') + '">' + EastTm2 + ' [砦1]</a>' +
          '<a href="' + toride.eq(21).attr('href') + '">' + EastTm2 + ' [砦2]</a>' +
          '<a href="' + toride.eq(22).attr('href') + '">' + EastTm2 + ' [砦3]</a>' +
          '<a href="' + toride.eq(23).attr('href') + '">' + EastTm2 + ' [砦4]</a>' +
          '<a href="' + toride.eq(24).attr('href') + '">' + EastTm2 + ' [砦5]</a>' +
          '</li>'+
          '<li>' +
          '<span>東軍[3]</span>' +
          '<a href="' + ootono.eq(5).attr('href') + '">' + EastTm3 + ' [大殿]</a>' +
          '<a href="' + toride.eq(25).attr('href') + '">' + EastTm3 + ' [砦1]</a>' +
          '<a href="' + toride.eq(26).attr('href') + '">' + EastTm3 + ' [砦2]</a>' +
          '<a href="' + toride.eq(27).attr('href') + '">' + EastTm3 + ' [砦3]</a>' +
          '<a href="' + toride.eq(28).attr('href') + '">' + EastTm3 + ' [砦4]</a>' +
          '<a href="' + toride.eq(29).attr('href') + '">' + EastTm3 + ' [砦5]</a>' +
          '</li>';
          
          if (options.toride_inbox && parseInt(options.toride_count) != 0){
            $('#toride_box').append('<div id="new_war"></div>');
            $('#new_war').append(tmp);
            $('#toride_list').find('a').hover(function() {
              $(this).css({'background-color': '#725E1E', 'color':'white'});
            },function() {
              $(this).css({'background-color':'', 'color':''});
            });

          } else {
            $(submenu).append(tmp);
            $(submenu).css('padding-top', '12px');
            $(submenu).find('li').css({'width':'78px','height':'180px', 'background':'black'})
              .find('a').css({ 'margin': '12px 10px','font-size':'100%', 'width':'65px', 'height':'14px', 'text-indent':'0', 'background':'black'});
            $(submenu).find('span').css({ 'display':'block', 'margin': '0 10px -5px','font-size':'100%', 'width':'65px', 'height':'14px', 'text-indent':'0', 'background':'black', 'color':'white'});
          }
        },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
        }
      });
      
      } else{
      
      for (var i = 0; i < 4; ++i) {
        var l = document.createElement('li');
        l.style.background = "transparent";
        l.style.height = arr.length * 27 + "px";
        l.style.width = "55px";
        var dir, x, y;
        switch (i) {
          case 0:
            dir = "北東";
            x = 1;
            y = 1;
            break;
          case 1:
            dir = "南東";
            x = 1;
            y = -1;
            break;
          case 2:
            dir = "南西";
            x = -1;
            y = -1;
            break;
          case 3:
            dir = "北西";
            x = -1;
            y = 1;
            break;
        }
        
        for (var j = 0; j < arr.length; ++j) {
          var a = document.createElement('a');
          a.href = "/map.php?x=" + arr[j][0] * x + "&y=" + arr[j][1] * y + c;
          a.innerHTML = dir + (j + 1);
          a.style.margin = "12px";
          a.style.fontSize = "100%";
          a.style.textIndent = "0px";
          a.style.height = "14px";
          a.style.width = "50px";
          a.style.background = "transparent";
          l.appendChild(a);
        }
        submenu.appendChild(l);
        }
      }

    if (options.toride_inbox && parseInt(options.toride_count) != 0) {
      var subchildLI = $(submenu).find('li').clone();
      var gnavi03_btn = $('<div class="map_tool_button" name="toride_list">砦座標</div>');
      var map_tool_button_grp = $('div.map_tool_button_grp');
      var map_tool_listbox = $('div.map_tool_window').children('div:eq(1)');
      map_tool_listbox.append('<div id="toride_list" class="map"><div id="toride_box"></div></div>');
      $('#toride_box').append( subchildLI );
      map_tool_button_grp.append( gnavi03_btn );
      $(submenu).remove();
      
      subchildLI.find('a').hover(function() {
        $(this).css('background-color', '#725E1E');
      },function() {
        $(this).css('background-color', '');
      });
    }

    },
    openMenu: function(obj) {
      br3.closeMenu();
      br3.closetimeC();
        //$("#" + obj).toggle();
      $("#" + obj).fadeIn(100);
      if (parseInt(options.toride_count) === 0){
        $('#gMenu03').css('display', "none");
      }
    
    },
    closeMenu: function() {
      $("#gMenu03").fadeOut(100);
    },
    closetime: function() {
      br3.closeTimer = window.setTimeout(br3.closeMenu, 30);
    },
    closetimeC: function() {
      if (br3.closeTimer) {
        window.clearTimeout(br3.closeTimer);
        br3.closeTimer = null;
      }
    }
  };
    initMenu();

  function initMenu() {
    if (!options.pulldown_menu)
      return;
    
    var menu02 = $('li.gMenu02'),
        menu07 = $('li.gMenu07');
    menu02.find('li').slice(0, 4).remove();
    menu02.find('ul')
    .prepend(
      '<li><a href="/card/deck.php?ano=0">部隊編成 [デッキ1]</a></li>' +
      '<li><a href="/card/deck.php?ano=1">部隊編成 [デッキ2]</a></li>' +
      '<li><a href="/card/deck.php?ano=2">部隊編成 [デッキ3]</a></li>' +
      '<li><a href="/card/deck.php?ano=3">部隊編成 [デッキ4]</a></li>' +
      '<li><a href="/card/deck.php?ano=4">部隊編成 [デッキ5]</a></li>'
       );
    menu02.find('a:contains("カード一括破棄")').attr('href', '/card/deck_card_delete.php?show_num=100');
    menu07.find('ul').append('<li><a href="/alliance/alliance_gold_mine_history.php">発掘履歴</a></li>');
    
    /*砦*/
    var menu = [];
    if ( options.chapter_change === '0' ) {
    //4章の場合
      menu = [[12, 28], [28, 12], [12, 52], [36, 36], [52, 12], [12, 76], [36, 60], [60, 36], [76, 12], [12, 100]];
      if (parseInt(options.toride_count) === 0)
        menu = [];
      if (parseInt(options.toride_count) === 20) {
        menu = [ [12, 28], [28, 12], [12, 52], [36, 36], [52, 12], [12, 76], [36, 60], [60, 36], [76, 12], [12, 100], [36, 84], [60, 60], [84, 36], [100, 12], [12, 124], [36, 108], [60, 84], [84, 60], [108, 36], [124, 12] ];
      }
      if (parseInt(options.toride_count) === 30) {
        menu = [ [12, 28], [28, 12], [12, 52], [36, 36], [52, 12], [12, 76], [36, 60], [60, 36], [76, 12], [12, 100], [36, 84], [60, 60], [84, 36], [100, 12], [12, 124], [36, 108], [60, 84], [84, 60], [108, 36], [124, 12], [12, 148], [36, 132], [60, 108], [84, 84], [108, 60], [132, 36], [148, 12], [36, 156], [60, 132], [84, 108] ];
      }
      if (parseInt(options.toride_count) === 40) {
        menu = [ [ 12, 28], [ 28, 12], [ 12, 52], [ 36, 36], [ 52, 12], [ 12, 76], [ 36, 60], [ 60, 36], [ 76, 12], [ 12,100], [ 36, 84], [ 60, 60], [ 84, 36], [100, 12], [ 12,124], [ 36,108], [ 60, 84], [ 84, 60], [108, 36], [124, 12], [ 12,148], [ 36,132], [ 60,108], [ 84, 84], [108, 60], [132, 36], [148, 12], [ 36,156], [ 60,132], [ 84,108], [108, 84], [132, 60], [156, 36], [ 60,156], [ 84,132], [108,108], [132, 84], [156, 60], [ 84,156], [108,132], [132,108], [156, 84], [108,156], [132,132], [156,108], [132,156], [156,132], [156,156] ];
      }
    }
    else {
    //5章の場合
      menu = [[12, 28], [28, 12], [12, 52], [36, 36], [52, 12], [12, 76], [36, 60], [60, 36], [76, 12], [12, 100]];
      if (parseInt(options.toride_count) === 0)
        menu = [];
      if (parseInt(options.toride_count) === 20) {
        menu = [ [12, 28], [28, 12], [12, 52], [36, 36], [52, 12], [12, 76], [36, 60], [60, 36], [76, 12], [12, 100], [36, 84], [60, 60], [84, 36], [100, 12], [12, 124], [36, 108], [60, 84], [84, 60], [108, 36], [124, 12] ];
      }
      if (parseInt(options.toride_count) === 30) {
        menu = [ [12, 28], [28, 12], [12, 52], [36, 36], [52, 12], [12, 76], [36, 60], [60, 36], [76, 12], [12, 100], [36, 84], [60, 60], [84, 36], [100, 12], [12, 124], [36, 108], [60, 84], [84, 60], [108, 36], [124, 12], [ 36,132], [ 60,108], [ 84, 84], [108, 60], [132, 36], [ 60,132], [ 84,108], [108, 84], [132, 60], [ 84,132] ];
      }
      if (parseInt(options.toride_count) === 40) {
        menu = [ [ 12, 28], [ 28, 12], [ 12, 52], [ 36, 36], [ 52, 12], [ 12, 76], [ 36, 60], [ 60, 36], [ 76, 12], [ 12,100], [ 36, 84], [ 60, 60], [ 84, 36], [100, 12], [ 12,124], [ 36,108], [ 60, 84], [ 84, 60], [108, 36], [124, 12], [ 36,132], [ 60,108], [ 84, 84], [108, 60], [132, 36], [ 60,132], [ 84,108], [108, 84], [132, 60], [ 84,132], [108,108], [132, 84], [108,132], [132,108], [132,132] ];
      }
    }

    br3.makeMapMenu(menu, 'gMenu03');
    $('.gMenu03 > a')
    .mouseover(function() { br3.openMenu('gMenu03'); })
    .mouseout(function() { br3.closetime(); });
  }

////////////////////
/////全ページ用：
////////////////////
  //全角数字での入力を半角に強制変換
  function after_tohankaku() {
    if (!options.tohankaku)
      return;
    $('input[type="text"]').change(function(e) {
      $(this).val( toHankaku($(this).val()) );
    });
  }
  function toHankaku(str) {
    str = str.replace(/[０-９]/g, function(str) {
      return String.fromCharCode(str.charCodeAt(0) - 65248);
    });
    str = str.replace(/[ー|－](\d+)/g, '-$1');
    str = str.replace(/[：]/g, ':');
    return str;
  }

  //Ajaxloading
  function AjaxLoader() {
    $('<div id="loader"><img src="' + IMAGES.ajax_loading + '" /></div>')
    .appendTo('body');
    $("#loader").hide();
    
    $("#loader").ajaxStart(function() {
       $(this).show();
    }).ajaxStop(function() {
       $(this).hide();
    });
   }

  //全ページ用:
  function allpage_check() {
    //合戦向けサイドボックス
    if (options.sidebox_change) {
      $('div.sideBox script').text('');
      
      if( options.chapter_change === '0' ) {
        $('div.sideBoxHead:has(h3>img[alt="状態"], h3>img[alt="生産"])')
        .remove();
        // 表示拠点選択は参照するため不可視に
        $('div.sideBoxHead:has(h3>img[alt="表示拠点選択"])')
        .hide();
      }
      
      $('div.sideBoxHead:has(h3>img[alt="報告"])').remove();
      var sideboxMoko = $('div.sideBox:has(#mokotool)'),
        sideboxMony = $('div.sideBox:has(span.money_b)'),
        sideboxStat = $('div.sideBox:has(table.stateTable)'),
        sideboxMake = $('div.sideBox:has(ul.side_make)'),
        sideboxBase = $('div.sideBox:has(div.sideBoxInner.basename)'),
        sideboxRept = $('div.sideBox:has(table.situationBtnTable)'),
        sideboxCard = $('div.sideBox:has(ul.sidebar_btn_card)'),
        sideboxBttm = $('#sideboxBottom'),
        situationWorldTable = $('table.situationWorldTable'),
        situationBtnTable_u = $('table.situationBtnTable:has(img[src$="btn_uranai.gif"])');
      
      if( situationBtnTable_u.length == 1 ){
        situationBtnTable_u.remove();
      }
      sideboxMony.children(':eq(0)')
        .before(situationWorldTable[0])
        .next().after(situationWorldTable[1]);
        $(situationWorldTable[0]).css('margin','3px auto 0');
        $(situationWorldTable[1]).css('margin','auto');
        $('img[alt="プレゼントボックス"]').css('top','0');
      $('#sideboxTop')
        .append(sideboxMoko)
        .append(sideboxStat)
        .append(sideboxRept.attr('class', 'sideBox'));
      $('#sideboxMain')
        .append(sideboxBttm);
      $('#sideboxBottom')
        .append(sideboxBase)
        .append(sideboxMake)
        .append(sideboxCard)
        .append(sideboxMony.attr('class', 'sideBox last'));
    }

    //ツールメニューの高さを固定する
    if (options.toolbox_fixing) {
      $('#mokotool').css('min-height', '12em');
    }

    //全角数字での入力を半角に強制変換
    after_tohankaku();

    //チャット欄の座標をリンクに
    if (options.chat_mapcood) {
      chat_mapcood();
    }

    //資源バーにリンクを追加
    $('#status_left').css('width', '100%');
    var sllink = {
      '敵襲': '/facility/unit_status.php?dmo=enemy',
      '全部隊': '/facility/unit_status.php?dmo=all',
      '全兵士編成': '/facility/set_unit_list.php?show_num=100'
    };
    for (var key in sllink){
      $('#status_left ul').append('<li id="' + key + '"><a href="' + sllink[key] + '">' + key + '</a></li>');
      $('#敵襲').css('margin-left', '3px');
    }
    if( options.raid_system ) { $('#敵襲 > a').css('color', 'yellow'); }
    
    $('<div style="display: none;">' + 
        '<a id="friendly" href="/facility/unit_status.php?dmo=help">友軍</a>' +
      '</div>'
    ).appendTo('#全部隊');
    
    var newBattle = $('#sideboxBottom').find('table.situationWorldTable').find('img[alt="合戦中"]').attr('title');
    if( newBattle == '新合戦中' ){ $('#friendly').remove(); }
    
    $('<div style="display: none; width: auto;">' + 
        '<a href="/facility/set_unit_list.php?show_num=100&select_card_group=1">【第一組】兵士編成</a>' +
        '<a href="/facility/set_unit_list.php?show_num=100&select_card_group=2">【第二組】兵士編成</a>' +
        '<a href="/facility/set_unit_list.php?show_num=100&select_card_group=3">【第三組】兵士編成</a>' +
        '<a href="/facility/set_unit_list.php?show_num=100&select_card_group=4">【第四組】兵士編成</a>' +
        '<a href="/facility/set_unit_list.php?show_num=100&select_card_group=5">【未設定】兵士編成</a>' +
        '<a href="/facility/unit_list.php">待機兵士一覧</a>' +
      '</div>'
    ).appendTo('#全兵士編成');
    
    $('#全部隊, #全兵士編成').hover(function(){
        $(this).css('background-color', 'darkred');
        $(this).height('22px').children('div').slideDown(200);
        $(this).prev().height('22px');
      },function(){
        $(this).css('background-color', '');
        $(this).height('').children('div').slideUp(200);
        $(this).prev().height('');
    })
    
    //チャット欄に敵襲タブを追加
    if (options.commentListEnemy || options.raid_system) {
      comBtnEnemy();
      commentListSelecter();
    }
    //敵襲の最上段表示。統合敵襲警報ONのときはOFF
      var $raid = $('IMG.fade[src$="state_enemy.gif"]');
    
    if (options.raid && !options.raid_system) {
      if ($raid.get().length > 0) {
        // 敵襲あり
        var href = '/facility/unit_status.php?dmo=enemy';
        $('BODY').prepend('<DIV id="ixamoko_raid" style="width:100%;position:fixed;bottom:0;padding:2px;background-color:#f00;z-index:9999;"><MARQUEE scrolldelay="100"><A href="' + href + '">敵襲あり</A></MARQUEE></DIV>');
        $('#ixamoko_raid').click(function(e) {
          $(this).hide();
        });
      }
    }
    //敵襲を枠内に表示。統合敵襲警報ONのときはOFF
    if (options.inside_attack_view || options.raid_system) {
      if ($raid.get().length > 0) {
        // 敵襲あり
        if ( options.chapter_change === '0' ) {
          $('div#status.clearfix').css('background-image', 'url(' + IMAGES.bg_status_red + ')');
        }
        else {
          $('div#status.clearfix').css('background-image', 'url(' + IMAGES.s5_bg_status_red + ')');
        }
      }
    }
    //チャット欄に敵襲表示。統合敵襲警報ONのときはOFF
    if (options.commentListEnemy && !options.raid_system) {
      if ($raid.get().length > 0) {
        enemyCheck();
      }
    }
    if (options.raid_sound) {
      var raid_sound = document.createElement('audio');
      raid_sound.id = 'raid_sound';
      raid_sound.preload = 'none';
      setTimeout(function() {
          raid_sound.src = options.raid_sound_src? options.raid_sound_src:SOUND.raid_sound;
      }, 300);
      document.body.appendChild(raid_sound);
      if (!options.raid_system && $raid.get().length > 0 ) {
        var raid_sound_load_and_play = function() {
          if (!raid_sound.buffered.length) {
            raid_sound.load();
            setTimeout(raid_sound_load_and_play,1000);
          } else {
            raid_sound.play();
          }
        };
        raid_sound_load_and_play();
      }
    }
    //IXAサーバータイムを表示
    if (options.ixa_time) {
      $('#sidebar')
      .css({'border-top':'none', 'padding-top':'3px'})
      .prepend('<div id="moko-ixatime" title="サーバータイム"><p></p></div>');
      
      setInterval( function() {
        var timetext = $('#server_time').text().replace(/^\d+-?/,'');
        $('#moko-ixatime > p').replaceWith('<p>' + timetext + '</p>');
      }, 1000 );
    }
    //ログイン・タイムアウトのカウントダウン
    if (options.timeout_countdown) {
      var totime = 0;
      var sec = 0;
      if (localStorage.getItem(OPTION_PREFIX + 'crx_starttime') !== null) {
        totime = (parseInt(localStorage.getItem( OPTION_PREFIX + 'crx_starttime'), 10) + 3 * 60 * 60);
        sec = totime - getUnixTime();
      }
      //console.log(totime);
      if (sec < 0)
        sec = 0;
      var timeText = formatTime(sec);
      var dayText = caddDate2(new Date(), timeText);
      var str = '<div title="ログアウト">タイムアウトまで<br />残り <span todo="d30m" totime="' + totime + '" class="ixamoko_countdown">' + timeText + '</span></div>';
      
      $('table.stateTable').after('<a href="/logout.php" id="ixamoko_sessout">' + str + '</a>'); //背景画像無し

      $('#ixamoko_sessout').click( function(e) {
        if ( confirm('ログアウトしますか？') ) { return; }
        return false;
      });

      var countdownTimer = null;
      var countDown = function(nowdate) {
        if (countdownTimer !== null)
          clearTimeout(countdownTimer);
        $('.ixamoko_countdown').each(function() {
          var totime = parseInt($(this).attr('totime'), 10);
          var todo = $(this).attr('todo');
          var sec = totime - getUnixTime();
          if (sec < 0)
            sec = 0;
          var timeText = formatTime(sec);
          $(this).html(timeText);
          //残り時間によるテキストの色変更
          if (sec < 600) {
            $('#ixamoko_sessout').css('color', 'red');
          } else if (sec < 1800) {
            $('#ixamoko_sessout').css('color', 'yellow');
          }
        });
        countdownTimer = setTimeout(function() {
          countDown(new Date());
        }, 1000 - new Date().getMilliseconds());
      };
      countDown(new Date());
    }
    //ログアウトurlの補正
    if ( options.logout_correction ) {
      $('a[href="/logout.php"]').attr('href', 'http://sengokuixa.jp/');
    }
    
  } //全ページ用:end

  //タイムアウトのカウントダウン用
  function caddDate2(baseDate, timetxt) {
    var tim = timetxt.match(/^(\d+):(\d+):(\d+)/);
    if (!tim)
    return "";
    var dt = new Date(baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    baseDate.getHours() + parseInt(tim[1], 10),
    baseDate.getMinutes() + parseInt(tim[2], 10),
    baseDate.getSeconds() + parseInt(tim[3], 10));
    
    return (dt.getHours() + 100).toString().substr(-2) + ":" +
    (dt.getMinutes() + 100).toString().substr(-2) + ":" +
    (dt.getSeconds() + 100).toString().substr(-2);
  }

  //チャット欄の座標をリンクに。更新・投稿クリックで実行
  (function() {
    if (!options.chat_mapcood)
      return;
    $('li.right, ul.commentclose').click(function() {
      var chtmpcd = setInterval(function() {
        if ($('td.msg > span').children('a'))
          clearInterval(chtmpcd);
        chat_mapcood();
      }, 1000);
    });
  })();
  //チャット欄の座標をリンクに。実行関数
  function chat_mapcood() {
    var coord = new RegExp(/[ー－‐―\-]?[０-９\d]+[,，、。.．]\s?[ー－‐―\-]?[０-９\d]+/g);
    $('td.msg > span').each(function() {
      var msg = $(this).text();
      var tmp = msg.match(coord);
      if (tmp) {
        for (var i = 0; i < tmp.length; i++) {
          var tmp2 = tmp[i].match(/[ー－‐―\-]?[０-９\d]+/g);
          for (var j = 0; j < 2; j++)
            tmp2[j] = toHankaku(tmp2[j]);
          var tmp3 = '<A style="display:inline;" href="/map.php?x=' + tmp2[0] + '&y=' + tmp2[1] + '">' + tmp[i] + '</A>';
          msg = msg.replace(tmp[i], tmp3);
        }
        $(this).html(msg);
      }
    });
  }

  //資源バーの位置を変更
  function menu_reversal() {
    if (!options.menu_reversal)
      return;
    
    if (options.reversal_mod == '0'){
      var tmp = $('#status').clone();
      $('#status').remove();
      $('#gnavi').css({'background-position-y':'31px', 'height': '65px'})
      .prepend(tmp);
    } else {
      var StatusBar = $('#status');
      StatusBar.remove();
      $('#header').css('background-position','0 30px').prepend(StatusBar);
      $('#gnavi').css('height','34px');
    }
  }

  //サイドボックスのカードを非表示
  function non_cardview() {
    if (!options.non_cardview)
      return;
    $('<li id="card_list">' +
      '<a href="/senkuji/senkuji.php">カード</a>' +
      '<div style="display: none;">' + 
        '<a href="/senkuji/senkuji.php">戦国くじ</a>' +
        '<a href="/card/trade.php?t=name&k=&s=no&o=a">取引</a>' +
        '<a href="/card/trade_card.php">出品</a>' +
        '<a href="/union/index.php">合成</a>' +
        '<a href="/card/card_album.php">カードアルバム</a>' +
      '</div>' +
      '<li>'
    ).hover(function(){
        $(this).css('background-color', 'darkred');
        $(this).height('22px').children('div').slideDown(200);
        $(this).prev().height('22px');
      },function(){
        $(this).css('background-color', '');
        $(this).height('').children('div').slideUp(200);
        $(this).prev().height('');
    }).appendTo($('#status_left > ul'));
    
    var sideboxToolHead = $('#sideboxTop').find('div.sideBoxHead:eq(0)');
    var ToolHeadh3 = sideboxToolHead.find('h3');
    var sideboxCard = $('div.sideBox:has(ul.sidebar_btn_card)');
    var sideboxCardInner = sideboxCard.find('div.sideBoxInner');
    var sideboxCardUl = $('div.sideBox').find('ul.sidebar_btn_card');
    
    sideboxToolHead.after(sideboxCard);
    sideboxCard.css({'overflow':'hidden','height':'0','padding': '0','background-image': 'none'});
    $('div.sideBoxHead:has(h3>img[alt="カード"])').hide();
    ToolHeadh3.replaceWith('<h3 id="moko_title"><a href="javascript:void(0);">戦国IXA用ツール</a></h3>');
    
    ToolHeadh3.find('a').click(function() {
        return false;
    });
    
    sideboxToolHead
      .toggle(function() {
        sideboxCard.animate({'overflow':'visible','height':'120px'});
      },
        function() {
        sideboxCard.animate({'overflow':'hidden','height':'0'});
      });
   }

  //サイドボックスの資源生産量の合計を表示
  function TotalProduction() {
    $('#sideboxBottom').find('ul.side_make > li').each(function() {
      var Total = parseInt($(this).text()) + parseInt($(this).find('.decrease, .increase').text());
      var DayTotal = Total * 24;
      $('<li class="hour_total nam">=' + Total + '</li><li class="day_total nam">=' + DayTotal + '(日計)</li>')
      .css({'margin': '-5px 0 3px 25px','color': 'darkSeaGreen'})
      .insertAfter( $(this) );
      $('li.day_total').hide();
    });
      $('#sideboxBottom').find('ul.side_make > li.last').css('margin-bottom','3px');
      var TotalPoint = $('#sideboxBottom').find('div.sideBox:has(ul.side_make)').css('cursor', 'pointer');
      
      TotalPoint.click(function() {
        $('li.nam').toggle();
      });
  }

  //他国拠点を選択中は自国を隠す
  function bases_blind(){
    if (!options.bases_blind)
      return;
    var area =  $('#sideboxBottom').find('div.sideBox:has(img[alt="表示拠点選択"])');
    var Country = area.find('div.sideBoxHead:eq(1)');
    var CountryBases = area.find('div.sideBoxInner.basename:eq(0)');
    var Foreign = area.find('div.sideBoxHead:eq(2)');
    var ForeignBases = area.find('div.sideBoxInner.basename:eq(1)');
    var ForeignOn =  ForeignBases.find('li.on').size();
    
    if(Foreign.size() > 0 && ForeignOn > 0){
    
      Country.css('cursor','pointer');
      Foreign.css('cursor','pointer');
      Country.hide();
      CountryBases.hide();
    
    Foreign.hover(function() {
      $(this).find('h4').css({color: 'yellow','border-color': '#707070'});
    }, function() {
      $(this).find('h4').css({color: '','border-color': ''});
    }).click(function() {
      Foreign.hide();
      ForeignBases.hide();
      Country.show();
      CountryBases.show();
    });
    
    Country.hover(function() {
      $(this).find('h4').css({color: 'yellow','border-color': '#707070'});
    }, function() {
      $(this).find('h4').css({color: '','border-color': ''});
    }).click(function() {
      Foreign.show();
      ForeignBases.show();
      Country.hide();
      CountryBases.hide();
    });
    
    }
  }

  //サイドボックスの所領ソート
  function sort_village() {
    if (!options.sort_village) {
      map_potential();
      return;
    }
    var pathname = location.pathname;
    var search = location.search;
    var page = pathname;
    if (search !== '') {
      page += encodeURIComponent(search);
    }
    var dejiro = $('div.sideBoxHead > h4:contains(他国)').text() || $('div.sideBoxHead > h4:contains(東西戦場)').text();
    $.ajax({
      type: "POST",
      url: '/user/',
      cache: false,
      success: function(html) {
        var village_list = [];
        var place_list = [];
        var tmp = '<div class="sideBoxInner basename"><ul>';
        var tmp2 = '<div class="sideBoxInner basename"><ul>';
        $(html).find('table.common_table1.center:eq(0)').find('tr.fs14').each(function() {
          if ($(this).find('td:eq(0)').text() == '領地')
            return true;
          var nm = $(this).find('a:eq(0)').text().replace(/^\s+|\s+$/g, "");
          var xy = '(' + $(this).find('a:eq(1)').text() + ')';
          var url = $(this).find('a:eq(0)').attr('href');
          var map_url = $(this).find('a:eq(1)').attr('href');
          if ($(this).find('td:eq(0)').text() == '本領') {
            if (nm == $('#lordSiteArea').text().replace("選択中の拠点:", "")) {
              tmp += '<li class="on"><span title="' + nm + ' ' + xy + '">' + nm + '</span></li>';
            } else {
              tmp += '<li><a href="' + url + '&from=menu&page=' + page + '" title="' + nm + ' ' + xy + '">' + nm + '</a></li>';
            }
          } else {
            village_list.push({a: nm,b: url,c: xy,d: map_url});
          }
        });
        if (dejiro === '') {
          tmp2 = '';
        }
        $(html).find('table.common_table1.center:eq(1)').find('tr.fs14').each(function() {
          if ($(this).find('td:eq(0)').text() == '領地')
            return true;
          var nm = $(this).find('a:eq(0)').text().replace(/^\s+|\s+$/g, "");
          var xy = '(' + $(this).find('a:eq(1)').text() + ')';
          var url = $(this).find('a:eq(0)').attr('href');
          var map_url = $(this).find('a:eq(1)').attr('href');
          if ((options.place_skip) && (options.place_skip_str !== '') && (nm != $('#lordSiteArea').text().replace("選択中の拠点:", ""))) {
            if (nm.indexOf(options.place_skip_str) >= 0)
              return true;
          }
          if ($(this).find('td:eq(0)').text() == '出城') {
            if (nm == $('#lordSiteArea').text().replace("選択中の拠点:", "")) {
              tmp2 += '<li class="on"><span title="' + nm + ' ' + xy + '">' + nm + '</span></li>';
            } else {
              tmp2 += '<li><a href="' + url + '&from=menu&page=' + page + '" title="' + nm + ' ' + xy + '">' + nm + '</a></li>';
            }
          } else {
            place_list.push({a: nm,b: url,c: xy,d: map_url});
          }
        });
        if (options.ad_sort == '1') {
          village_list = asort(village_list, 'a');
          place_list = asort(place_list, 'a');
        } else {
          village_list = dsort(village_list, 'a');
          place_list = dsort(place_list, 'a');
        }
        var kyoten;
        for (i = 0; i < village_list.length; i++) {
          if (village_list[i].a == $('#lordSiteArea').text().replace("選択中の拠点:", "")) {
            kyoten = '<input type="hidden" id="kyoten" value="' + village_list[i].d + '" />';
            $('#lordSiteArea').append(kyoten);
            tmp += '<li class="on"><span title="' + village_list[i].a + ' ' + village_list[i].c + '">' + village_list[i].a + '</span></li>';
          } else {
            tmp += '<li><a href="' + village_list[i].b + '&from=menu&page=' + page + '" title="' + village_list[i].a + ' ' + village_list[i].c + '">' + village_list[i].a + '</a></li>';
          }
        }
        for (i = 0; i < place_list.length; i++) {
          if (place_list[i].a == $('#lordSiteArea').text().replace("選択中の拠点:", "")) {
            kyoten = '<input type="hidden" id="kyoten" value="' + place_list[i].d + '" />';
            $('#lordSiteArea').append(kyoten);
            tmp2 += '<li class="on"><span title="' + place_list[i].a + ' ' + place_list[i].c + '">' + place_list[i].a + '</span></li>';
          } else {
            tmp2 += '<li><a href="' + place_list[i].b + '&from=menu&page=' + page + '" title="' + place_list[i].a + ' ' + place_list[i].c + '">' + place_list[i].a + '</a></li>';
          }
        }
        if (dejiro === '') {
          tmp2 += '</ul></div>';
          $('div.sideBoxInner.basename:eq(0)').replaceWith(tmp + tmp2);
        } else {
          tmp += '</ul></div>';
          tmp2 += '</ul></div>';
          $('div.sideBoxInner.basename:eq(0)').replaceWith(tmp);
          $('div.sideBoxInner.basename:eq(1)').replaceWith(tmp2);
        }
        map_potential();
        bases_blind();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      //console.log(textStatus);
      }
    });
  }

  //資源バーの表示アイテム変更
  function mod_status_left() {
    if (!options.mod_status_left)
      return;
    var i;
    var stuff = ['wood', 'stone', 'iron', 'rice'];

    //ステータス取得
    var status = $('#status_left').text().match(/\d+/g);
    status.push($('#output_wood').text());
    status.push($('#output_stone').text());
    status.push($('#output_iron').text());
    status.push($('#output_rice').text());
    var max_value = status[1];

    //コンマ区切り文字に変換
    for (i = 0; i < status.length; i++) {
      var tmp = status[i].match(/\d/g);
      tmp.reverse();
      var tmp2 = '';
      for (var j = 0; j < tmp.length; j++) {
        if (j % 3 === 0 && j !== 0)
          tmp2 = tmp[j] + ',' + tmp2;
        else
          tmp2 = tmp[j] + tmp2;
      }
      status[i] = tmp2;
    }
    //保有量％初期表示計算
    for (i = 0; i < 4; i++) {
      var tmp3 = $('#' + stuff[i]).text();
      status.push(Math.floor((tmp3 / max_value) * 100));
    }
    //資源バーのアイテム取得と削除・非表示化
    var img = $('#status_left').find('img');
    var normal = $('#status_left').find('span.normal').hide();
    $('#wood_max').hide();
    $('#stone_max').hide();
    $('#iron_max').hide();
    $('#rice_max').hide();
    $('#status_left > ul').find('li').hide();

    //アイテム付加
    var store = [];
    var rate = [];
    var slash = '&nbsp;/&nbsp;';
    var statusUL = $('#status_left > ul');
    for (i = 0; i < 4; i++) {
      store[i] = '<li><span class="normal" id="' + stuff[i] + '_store">' + status[i * 2] + '</span>' + slash +
          '<span class="normal" id="' + stuff[i] + '_rate">' + (options.kind_mod == '0' ? status[10 + i] : (status[14 + i] + '%')) + '</span></li>';
          statusUL.append( store[i] );
    }
      statusUL.find('li:eq(5)').prepend(img[0]);
      statusUL.find('li:eq(6)').prepend(img[1]);
      statusUL.find('li:eq(7)').prepend(img[2]);
      statusUL.find('li:eq(8)').prepend(img[3]);

    $('#status_left > ul').append('<li><span id="max_store" title="蔵容量">' + status[1] + '</span>&nbsp;<span class="normal" id="honor">' + status[8] + '&nbsp;/&nbsp;' + status[9] + '</span></li>');
    $('#max_store').after(img[4]);
    //保有量％によるテキスト色変え
    var $stuff_store, $stuff_rate;
    for (i = 0; i < 4; i++) {
      $stuff_store = $('#' + stuff[i] + '_store');
      $stuff_rate = $('#' + stuff[i] + '_rate');
      if (status[14 + i] > 90) {
        $stuff_store.css({'border-bottom': '2px solid red'});
        $stuff_rate.css({'border-bottom': '2px solid red'});
      } else if (status[14 + i] > 80) {
        $stuff_store.css({'border-bottom': '2px solid #FFF000'});
        $stuff_rate.css({'border-bottom': '2px solid #FFF000'});
      } else {
        $stuff_store.removeAttr('style');
        $stuff_rate.removeAttr('style');
      }
    }

    setTimeout(comma_sep, 1000);
    function comma_sep() {
      for (var i = 0; i < 4; i++) {
        $stuff_store = $('#' + stuff[i] + '_store');
        $stuff_rate = $('#' + stuff[i] + '_rate');
        //コンマ区切り文字に変換
        var tmp = $('#' + stuff[i]).text().match(/\d/g);
        tmp.reverse();
        var tmp2 = '';
        for (var j = 0; j < tmp.length; j++) {
          if (j % 3 === 0 && j !== 0)
            tmp2 = tmp[j] + ',' + tmp2;
          else
            tmp2 = tmp[j] + tmp2;
        }
        $stuff_store.text(tmp2);
        //保有量％更新表示分
        var tmp3 = $('#' + stuff[i]).text();
        tmp3 = Math.floor((tmp3 / max_value) * 100);
        if (options.kind_mod == '1') {
          $('#' + stuff[i] + '_rate').text(tmp3 + '%');
        }
        //保有量％によるテキスト色変え
        if (tmp3 > 90) {
          $stuff_store.css({'border-bottom': '2px solid red'});
          $stuff_rate.css({'border-bottom': '2px solid red'});
        } else if (tmp3 > 80) {
          $stuff_store.css({'border-bottom': '2px solid #FFF000'});
          $stuff_rate.css({'border-bottom': '2px solid #FFF000'});
        } else {
          $stuff_store.removeAttr('style');
          $stuff_rate.removeAttr('style');
        }
      }
      setTimeout(comma_sep, 1000);
    }
  }

  //(合戦中)同盟合戦報告書と敵襲状況リンクを表示
  function alliance_report_link() {
    if (!options.alliance_report_link )
      return;
    var Battlemode = $('.situationBtnTable:has(img[alt="合戦報告書"])').size();
    if ( Battlemode != 1 )
      return;
    
    var allianceID = $('#gnavi').find('li.gMenu07 > a:eq(0)').attr('href');
    $('table.situationBtnTable:has(img[alt="合戦報告書"])').after('<div id="alliance_link"></div>');
    var $img = $('#alliance_link').css({whiteSpace:'nowrap'}).append('<div><a id="lists" href="javascript:void(0);" title="合戦報告書(同盟)"><img src='+IMAGES.kassenhokokusho+'></a><a id="historys" href="javascript:void(0);" title="敵襲状況(同盟)"><img src='+IMAGES.tekishujokyo+'></a></div>').find('img').css({ 'height': '18px', 'border': 'solid 1px darkgoldenrod', 'border-radius': '4px'});
    $img.css({marginRight:'4px'});

    $('#lists').click(function(){
      $.post( allianceID, function(html) {
        var list_name = $(html).find('p.alli_inputtext.mb10:eq(1)').text().trim();
    //console.log('略称：list_name = ' + list_name);
        location.href = '/war/list.php?m=&s=1&name=alliance&word='+ list_name +'&coord=map&x=&y=';
      });
    });
    
    $('#historys').click(function(){
      $.post( allianceID, function(html) {
        var history_name = $(html).find('p.alli_inputtext.mb10:eq(0)').text().trim();
    //console.log('名称：history_name = ' + history_name);
        location.href = '/war/fight_history.php?type=1&find_name='+ history_name +'&find_x=&find_y=&find_length=&btn_search=true';
      });
    });
  
  }

  //IXA占い対応の表示調整
  $(function() {
    var divF = $('#status').find('div.rightF');
    if( divF.size() ){
      divF.children().wrapAll('<a id="uranai" href="/user/uranai/uranai.php"></a>');
      $('#lordSiteArea').hide();
      divF.css({'width':'225px', 'margin':'7px 3px 0 0'})  //(.rightF)は報告書のナビで使用しているのでfloatは変更しない。
      .appendTo('#lordNameBox');
      if ( options.chapter_change !== '0' ) {  
        $('#lordNameBox > div.rightF').css({'background-color':'black','padding-left':'15px'});
      }
    }
  });
  //IXA占い(城主プロフィール)の表示調整
  function profortunes() {
    if (location.pathname != "/user/")
      return;
    var Fortunes = $('div.ig_decksection_top:eq(2), div.ig_decksection_mid:eq(2), div.ig_decksection_bottom:eq(2)');
    
    if( Fortunes.size() ) {
        Fortunes.hide();
        $('div.ig_decksection_mid:eq(1)').append('<a href="javascript:void(0);" id="profortunes">占い結果を見る</a>');
        $('#profortunes').css({'cursor':'pointer', 'text-decoration':'underline'});
      $('#profortunes')
      .hover(function(){
        $(this).css('text-decoration', 'none');
      },function(){
        $(this).css('text-decoration', 'underline');
      }).click(function(){
        Fortunes.toggle();
        return false;
      });
    }
  }

  //お気に入りソート登録
  function favoriteSort() {
    if (!options.favoriteSort)
      return;
    if (location.pathname != "/card/deck.php" && location.pathname != "/facility/set_unit_list.php" && location.pathname != "/union/levelup.php" && location.pathname != "/union/additional.php" && location.pathname != "/union/remove.php" && location.pathname != "/card/deck_card_delete.php")
      return;
    if (location.pathname == "/facility/set_unit_list.php") {
      $('#moko_container').css({'height':'32px', 'width':'715px'});
      $('<div id="favoritearea" style="width: 465px; float: left;">' +
        '<div id="favoritebox"></div>' +
        '</div>'
      ).appendTo('#moko_container');
    }
    else if (location.pathname == "/card/deck_card_delete.php"){
      $('<div id="favoritearea">' +
        '<div id="favoritebox" style="height:34px; margin-top:-10px;"></div>' +
        '</div>'
      ).insertAfter('#deck_file');
    }
    else {
      if (location.pathname == "/union/levelup.php" || location.pathname == "/union/additional.php" || location.pathname == "/union/remove.php") {
        $('<div id="favoritearea">' +
          '<div id="favoritebox" style="background:url(/img/deck/box04_title.png) no-repeat left top; width:729px; height:34px; padding:4px 9px 0px 9px; margin-bottom:8px; margin-left:12px;"></div>' +
          '</div>'
        ).insertAfter('#ig_deck_cardlistmenu.clearfix');
      }
      else {
        $('#moko_container').height('30px').width('754px');
        $('<div id="favoritearea" style="width: 465px; float: left; padding-left: 15px;">' +
          '<div id="favoritebox"></div>' +
          '</div>'
        ).appendTo('#moko_container');
      }
    }
    
    $('<div style="float:left; margin-top: 6px;">' +
      '<select id="favoriteselect" style="width: 250px;"></select>' +
      '<input type=button value="変更する" id="favoriteupdate" style="margin-left: 5px;" />' +
      '</div>' +
      '<div style="float:right; margin-top: 6px;">' +
      '<input type="button" value="保存する" id="favoritesave" />' +
      '<input type="button" value="削除する" id="favoritedelete" style="margin-left: 5px;" />' +
      '</div>'
     ).appendTo('#favoritebox');

    $('#favoritesave').click(favoriteSave);
    $('#favoritedelete').click(favoriteDelete);
    $('#favoriteupdate').click(favoriteUpdate);
    favoriteView();
  }

  function favoriteView() {
    var favorite_list = {};
    if (localStorage.getItem("crx_ixakaizou_favorite_list")) {
      favorite_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_favorite_list"));
    }
    $('#favoriteselect').children().remove();
    $('#favoriteselect').append('<option>----お気に入りソート選択----</option>');
    for (var i in favorite_list) {
      var tmp = '<option value="' + favorite_list[i] + '">' + i + '</option>';
      $('#favoriteselect').append(tmp);
    }
  }

  function favoriteSave() {
    var favorite_list = {};
    var l_key = '';
    var l_val = [];
    if (localStorage.getItem("crx_ixakaizou_favorite_list")) {
      favorite_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_favorite_list"));
    }
    for (var i = 0; i < 3; i++) {
      l_key += $('#sort_order_' + i).children(':selected').text() + ':';
      l_key += $('#sort_order_type_' + i).children(':selected').text() + '　';
      l_val.push($('#sort_order_' + i).children(':selected').attr('value'));
      l_val.push($('#sort_order_type_' + i).children(':selected').attr('value'));
    }
    favorite_list[l_key] = l_val.join('/');
    localStorage.setItem('crx_ixakaizou_favorite_list', toJSON(favorite_list));
    favoriteView();
  }

  function favoriteDelete() {
    var favorite_list = {};
    var favorite_list_new = {};
    if (localStorage.getItem("crx_ixakaizou_favorite_list")) {
      favorite_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_favorite_list"));
    }
    var target = $('#favoriteselect').children(':selected').attr('value');
    if (target === undefined)
      return;
    for (var i in favorite_list) {
      if (favorite_list[i] != target) {
        favorite_list_new[i] = favorite_list[i];
      }
    }
    localStorage.setItem('crx_ixakaizou_favorite_list', toJSON(favorite_list_new));
    favoriteView();
  }

  function favoriteUpdate() {
    var target = $('#favoriteselect').children(':selected').attr('value');
    if (target === undefined)
      return;
    target = target.split('/');
    $('#sort_order_0').val(target[0]);
    $('#sort_order_type_0').val(target[1]);
    $('#sort_order_1').val(target[2]);
    $('#sort_order_type_1').val(target[3]);
    $('#sort_order_2').val(target[4]);
    $('#sort_order_type_2').val(target[5]);
    $('input.sortSubmit').trigger('click');
  }
  //取引：お気に入り検索・お気に入りソート
  function deal_favorite() {
    if (!options.deal_favorite)
      return;
    if (location.pathname != "/card/trade.php")
      return;
    var cardstock = $('div.t_cardstock.rightF').css({'margin-right':'16px', 'font-weight':'normal', 'font-size':'12px'});
    $('div.ig_decksection_top').append(cardstock);
    var LeftF = $('div.common_menu1').find('div.leftF').css({'float':'none', 'text-align':'left'});
      LeftF.find('br').remove();
    $('input[value="検索"]').css('margin-right', '20px');
    $('#k').width(145);
    //お気に入り検索
    $('<div id="favorite_container" style="margin-top: 10px;"></div>')
    .appendTo('div.common_menu1');
    $('<div id="deal_search_favoritearea" style="float:left; margin-right: 20px;">' +
      '<div style="float:left; margin-right: 30px;">' +
        '<select id="deal_search_favoriteselect"></select>' +
        '<input type=button value="変更" id="deal_search_favoriteupdate" style="margin-left: 5px;" />' +
      '</div>' +
      '<div style="float:left;">' +
        '<input type="button" value="保存" id="deal_search_favoritesave" />' +
        '<input type="button" value="削除" id="deal_search_favoritedelete" style="margin-left: 5px;" />' +
      '</div>' +
    '</div>'
    ).appendTo('#favorite_container');
    
    $('#deal_search_favoritesave').click(deal_search_favoriteSave);
    $('#deal_search_favoritedelete').click(deal_search_favoriteDelete);
    $('#deal_search_favoriteupdate').click(deal_search_favoriteUpdate);
    deal_search_favoriteView();
    
    function deal_search_favoriteView() {
      var deal_search_favorite_list = {};
      if (localStorage.getItem("crx_ixakaizou_deal_search_favorite_list")) {
        deal_search_favorite_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_deal_search_favorite_list"));
      }
      $('#deal_search_favoriteselect').children().remove();
      $('#deal_search_favoriteselect').append('<option>--お気に入り検索を選択--</option>');
      for (var i in deal_search_favorite_list) {
        var tmp = '<option value="' + deal_search_favorite_list[i] + '">' + i + '</option>';
        $('#deal_search_favoriteselect').append(tmp);
      }
    }

    function deal_search_favoriteSave() {
      var deal_search_favorite_list = {};
      var l_key = '';
      var l_val = [];
      if (localStorage.getItem("crx_ixakaizou_deal_search_favorite_list")) {
        deal_search_favorite_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_deal_search_favorite_list"));
      }
        l_key += $('#t').children(':selected').text() + '：';
        l_key += $('#k').val() + '　';
        l_val.push($('#t').children(':selected').attr('value'));
        l_val.push($('#k').val());
      deal_search_favorite_list[l_key] = l_val.join('/');
      localStorage.setItem('crx_ixakaizou_deal_search_favorite_list', toJSON(deal_search_favorite_list));
      deal_search_favoriteView();
    }
    
    function deal_search_favoriteDelete() {
      var deal_search_favorite_list = {};
      var deal_search_favorite_list_new = {};
      if (localStorage.getItem("crx_ixakaizou_deal_search_favorite_list")) {
        deal_search_favorite_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_deal_search_favorite_list"));
      }
      var target = $('#deal_search_favoriteselect').children(':selected').attr('value');
      if (target === undefined)
        return;
      for (var i in deal_search_favorite_list) {
        if (deal_search_favorite_list[i] != target) {
          deal_search_favorite_list_new[i] = deal_search_favorite_list[i];
        }
      }
      localStorage.setItem('crx_ixakaizou_deal_search_favorite_list', toJSON(deal_search_favorite_list_new));
      deal_search_favoriteView();
    }
    
    function deal_search_favoriteUpdate() {
      var target = $('#deal_search_favoriteselect').children(':selected').attr('value');
      if (target === undefined)
        return;
      target = target.split('/');
      $('#t').val(target[0]);
      $('#k').val(target[1]);
      $('#button').trigger('click');
    }
    //お気に入りソート
    $('<div id="deal_sort_favoritearea" style="">' +
      '<div style="float:left; margin-right: 30px;">' +
        '<select id="deal_sort_favoriteselect"></select>' +
        '<input type=button value="変更" id="deal_sort_favoriteupdate" style="margin-left: 5px;" />' +
      '</div>' +
      '<div style="float:left;">' +
        '<input type="button" value="保存" id="deal_sort_favoritesave" />' +
        '<input type="button" value="削除" id="deal_sort_favoritedelete" style="margin-left: 5px;" />' +
      '</div>' +
    '</div>'
    ).appendTo('#favorite_container');
    
    $('#deal_sort_favoritesave').click(deal_sort_favoriteSave);
    $('#deal_sort_favoritedelete').click(deal_sort_favoriteDelete);
    $('#deal_sort_favoriteupdate').click(deal_sort_favoriteUpdate);
    deal_sort_favoriteView();
    
    function deal_sort_favoriteView() {
      var deal_sort_favorite_list = {};
      if (localStorage.getItem("crx_ixakaizou_deal_sort_favorite_list")) {
        deal_sort_favorite_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_deal_sort_favorite_list"));
      }
      $('#deal_sort_favoriteselect').children().remove();
      $('#deal_sort_favoriteselect').append('<option>--お気に入りソート選択--</option>');
      for (var i in deal_sort_favorite_list) {
        var tmp = '<option value="' + deal_sort_favorite_list[i] + '">' + i + '</option>';
        $('#deal_sort_favoriteselect').append(tmp);
      }
    }
    
    function deal_sort_favoriteSave() {
      var deal_sort_favorite_list = {};
      var l_key = '';
      var l_val = [];
      if (localStorage.getItem("crx_ixakaizou_deal_sort_favorite_list")) {
        deal_sort_favorite_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_deal_sort_favorite_list"));
      }
        l_key += $('#s').children(':selected').text() + '：';
        l_key += $('#o').children(':selected').text() + '　';
        l_val.push($('#s').children(':selected').val());
        l_val.push($('#o').val());
      deal_sort_favorite_list[l_key] = l_val.join('/');
      localStorage.setItem('crx_ixakaizou_deal_sort_favorite_list', toJSON(deal_sort_favorite_list));
      deal_sort_favoriteView();
    }
    
    function deal_sort_favoriteDelete() {
      var deal_sort_favorite_list = {};
      var deal_sort_favorite_list_new = {};
      if (localStorage.getItem("crx_ixakaizou_deal_sort_favorite_list")) {
        deal_sort_favorite_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_deal_sort_favorite_list"));
      }
      var target = $('#deal_sort_favoriteselect').children(':selected').attr('value');
      if (target === undefined)
        return;
      for (var i in deal_sort_favorite_list) {
        if (deal_sort_favorite_list[i] != target) {
          deal_sort_favorite_list_new[i] = deal_sort_favorite_list[i];
        }
      }
      localStorage.setItem('crx_ixakaizou_deal_sort_favorite_list', toJSON(deal_sort_favorite_list_new));
      deal_sort_favoriteView();
    }
    
    function deal_sort_favoriteUpdate() {
      var target = $('#deal_sort_favoriteselect').children(':selected').attr('value');
      if (target === undefined)
        return;
      target = target.split('/');
      $('#s').val(target[0]);
      $('#o').val(target[1]);
      $('#button').trigger('click');
    }
  }
  //出品補助機能を使用する
  function trade_auxiliary() {
    if (!options.trade_auxiliary)
      return;
    if (location.pathname != "/card/trade_card.php")
      return;
    var btnBox = $('div.ig_deck_subcardarea').find('p.tradebtn');
    $('<div style="padding:4px 0;" class="btn_inner">'+
      '<div style="padding:4px 0; height:14px;"><a href="javascript:void(0);" class="immediate">即落最低額</a><span class="immed_val" style="color: red;margin-left: 1em;"></span></div>' +
      '<input type="text" class="price" style="width: 65px;" />' +
      '<input type="button" class="exhibit" value="出品する" />' +
      '<input type="button" class="commission" value="手数料" />' +
     '</div>'
    ).prependTo( btnBox );
    $('div.ig_deck_subcardarea').css('height', '394px');
    $('div.btn_inner > input').css('margin-right', '4px');
    
    $('input[class="price"]').change(function(e) {
      $(this).val( toHankaku($(this).val()) );
    });
    
    $('a.immediate').click(function(){
      var $this = $(this),
        cardNo = $this.closest('div[id^="id_deck_card"]').find('span.ig_card_cardno').text(),
        href = '/card/trade.php?t=no&k=' + cardNo + '&s=price&o=a';
        $.post( href, function(html){
          var immedPrice = $(html).find('tr.fs12:contains("---"):first').find('td:eq(4)').text();
          if(immedPrice == ''){
            $this.next().html( 'なし' );
          }
          else {
            $this.next().html( '銅銭 ' + immedPrice );
          }
        });
      return false;
    });
    
    $('input.exhibit').click(function(){
      var $this = $(this),
        cid_source = $this.closest('p').find('a:eq(1)').attr('onClick').match(/'.*?'/g),
        exhibit_cid = cid_source.toString().replace(/'/g, ''),
        exhibit_price = $this.parent().find('input.price').val();
      if( exhibit_price == '') { alert('最低落札額が入力されていません。'); return false; }
      else if(exhibit_price < 10) { alert('※ 最低落札額を正しく入力してください(最低価格 銅銭10)'); return false; }
      var data = {
          exhibit_cid: exhibit_cid,
          exhibit_price: exhibit_price,
          exhibit_btn: '出品する'
        };
      $.post(
        '/card/exhibit_confirm.php',
        data,
        function(data){
          $.get(
            '/card/trade_card.php',
            { p: 'ok' },
            function(html){
              if( $(html).find('p:contains("カードを出品しました")').length == 1 ){
                var cardarea = $('div.tradelist.clearfix').find('div.ig_deck_subcardarea:visible');
                if( cardarea.length == 1 ){
                  $this.closest('div.ig_deck_subcardarea').fadeOut(300);
                  location.href = location.pathname;
                }
                else {
                  $this.closest('div.ig_deck_subcardarea').fadeOut(300);
                }
              }
              else if( $(html).find('p:contains("これ以上の出品は出来ません")').length == 1 ){
                $this.closest('div.ig_deck_subcardarea').fadeOut(300);
                location.href = location.pathname;
              }
              else{
                $this.val('Error').css('color', '#C00');
              }
            }
          );
        }
      );
    });
    
    $('input.commission').click(function(){
      var amount = $(this).parent().find('input.price').val(),
        sellerCom = '',
        receipts = '';
      if( amount == '') { alert('最低落札額が入力されていません。'); return false; }
      else if(amount < 10) { alert('※ 最低落札額を正しく入力してください(最低価格 銅銭10)'); return false; }
      else if(amount <= 500) { sellerCom = Math.floor(amount * 0.1); receipts = amount - sellerCom; }
      else if(amount <= 1000) { sellerCom = Math.floor(amount * 0.2 - 50); receipts = amount - sellerCom; }
      else if(amount > 1000) { sellerCom = Math.floor(amount * 0.3 - 150); receipts = amount - sellerCom; }
        alert('最低落札額：銅銭 '　+　amount + '\n手数料　　：銅銭 ' + sellerCom + '\n受取額　　：銅銭 ' + receipts );
    });
  }
////////////////////
//地図：
////////////////////
  //影武者出現
  $( function () {
    if (location.pathname != "/map.php")
      return;
    $('#box').each(function () {
      var AagemushaList = $('#kagemusha_list');
      if( AagemushaList.size() > 0) {
        $('div.ig_mappanel_maindataarea')
        .after('<img src="/img/panel/aura_r_s.png" title="影武者出現中！" style="position: absolute;top: 390px;left: 40px;" / >');
      }
    });
  });

  //地図:国移動プルダウンメニュー
  function country_change() {
    if (location.pathname != "/map.php")
      return;
    var source = $('#ig_map_movepanel').find('li:eq(0) > a').attr('href').replace('&type=1', ''),
      source = source.match(/map\.php\?x=(-?\d+)&y=(-?\d+)&c=(\d+)/),
      center_code = 'map.php?x=' + source[1] + '&y=' + source[2] + '&c=',
      newBattle = $('#sideboxBottom').find('table.situationWorldTable').find('img[alt="合戦中"]').attr('title');
    var Otono = $('img.otono_name')
          .css({'cursor':'pointer', 'margin-top':'-6px', 'margin-left':'-5px'})
          .wrap('<span id="country_change"></span>');
    //4章
    if ( options.chapter_change === '0' ) {
      $('<div id="change_menu">' +
        '<a href="' + center_code + '12">最上家</a>' +
        '<a href="' + center_code + '7">浅井家</a>' +
        '<a href="' + center_code + '4">上杉家</a>' +
        '<a href="' + center_code + '8">北条家</a>' +
        '<a href="' + center_code + '3">武田家</a>' +
        '<a href="' + center_code + '5">徳川家</a>' +
        '<a href="' + center_code + '1">織田家</a>' +
        '<a href="' + center_code + '2">足利家</a>' +
        '<a href="' + center_code + '11">大友家</a>' +
        '<a href="' + center_code + '6">毛利家</a>' +
        '<a href="' + center_code + '9">長宗我部家</a>' +
        '<a href="' + center_code + '10">島津家</a>' +
        '</div>'
      ).appendTo('#country_change');
    }
    //6章
    else if ( options.chapter_change === '6' ) {
      $('<div id="change_menu">' +
        '<a href="' + center_code + '12">石田家</a>' +
        '<a href="' + center_code + '7">伊達家</a>' +
        '<a href="' + center_code + '4">上杉家</a>' +
        '<a href="' + center_code + '8">今川家</a>' +
        '<a href="' + center_code + '3">武田家</a>' +
        '<a href="' + center_code + '5">徳川家</a>' +
        '<a href="' + center_code + '1">織田家</a>' +
        '<a href="' + center_code + '2">黒田家</a>' +
        '<a href="' + center_code + '11">豊臣家</a>' +
        '<a href="' + center_code + '6">毛利家</a>' +
        '<a href="' + center_code + '9">長宗我部家</a>' +
        '<a href="' + center_code + '10">島津家</a>' +
        '</div>'
      ).appendTo('#country_change');
    }
    //5章
    else {
    $('<div id="change_menu">' +
        '<a href="' + center_code + '12">最上家</a>' +
        '<a href="' + center_code + '7">伊達家</a>' +
        '<a href="' + center_code + '4">上杉家</a>' +
        '<a href="' + center_code + '8">北条家</a>' +
        '<a href="' + center_code + '3">武田家</a>' +
        '<a href="' + center_code + '5">徳川家</a>' +
        '<a href="' + center_code + '1">織田家</a>' +
        '<a href="' + center_code + '2">足利家</a>' +
        '<a href="' + center_code + '11">豊臣家</a>' +
        '<a href="' + center_code + '6">毛利家</a>' +
        '<a href="' + center_code + '9">長宗我部家</a>' +
        '<a href="' + center_code + '10">島津家</a>' +
       '</div>'
      ).appendTo('#country_change');
    }

    if(newBattle == '新合戦中'){
      $('<a href="' + center_code + '20">東西戦場 1</a><a href="' + center_code + '21">東西戦場 2</a>')
      .appendTo('#change_menu');
    }
    
    $('#country_change').click(function() {
      $(this).find('div').slideDown(150);
      Otono.css('background-color', '#8F7124');
    }).hover(function() {
      Otono.css('background-color', 'rgba(143, 113, 36, 0.36)');
    },function() {
      $(this).find('div').slideUp(150);
      Otono.css('background-color', '');
    });
  }

  // 陣取り禁止区域
  function prohibiJin() {
    var newWar = $('div.ig_mappanel_maindataarea').find('img[src$="map_otono_name_war.png"]');
    if( !newWar.length == 0 ) return;
    
    var Imge_list = $('#ig_mapsAll').children('img');
    var Area_list = $('#mapOverlayMap').children('area');
    var img_list;
    img_list = prohibiJinImg( Imge_list );
    prohibiJinArea( Area_list, img_list );
    
  }
  function prohibiJinImg( Imge_list ) {
    var img_list = [];
    
    Imge_list.each(function() {
      var png = $(this).attr('src').split('/').pop(),
        classname = $(this).attr('class'),
        type;
        png = png.replace('.png', '').split('_');
        type = '';
        
      switch( png[0] ) {
        case 'field' : type = '空き地';
        break;
      }
      
      img_list.push({ img: $(this), type: type });
    });
    
    return img_list;
  }
  function prohibiJinArea( Area_list, img_list ) {
    var list = [];
    
    Area_list.each(function( idx ) {
      var source = ( $(this).attr('onMouseOver') || '' ).split('; overOperation')[0],
        array = source.match(/'.*?'/g),
        search = ( $(this).attr('onClick') || '' ).match(/land\.php\?x=(-?\d+)&y=(-?\d+)&c=(\d+)/) || [],
        img_data = img_list[ idx ],
        data = { idx: idx };
        
      if ( !img_data ) { return; }
      
      array.forEach(function( value, idx, ary ) {
        ary[ idx ] = value.replace(/'/g, '');
      });
      
      data.x = search[1];
      data.y = search[2];
      
      if ( img_data.type == '空き地' ) {
        
        var x = Math.abs( parseInt( data.x, 10 ) );
        var y = Math.abs( parseInt( data.y, 10 ) );
        
        if( options.chapter_change === '0' ) {
          var fortresses = BASE_AREA_4;
        } else {
           var fortresses = BASE_AREA_5;
        }
        
        var len = fortresses.length;
        
        for ( var i = 1; i < len; i++ ) {
          if ( !( fortresses[ i ][ 0 ] - 3 <= x && x <= fortresses[ i ][ 0 ] + 3 ) ) { continue; }
          if ( !( fortresses[ i ][ 1 ] - 3 <= y && y <= fortresses[ i ][ 1 ] + 3 ) ) { continue; }
          img_data.img.attr( 'src', IMAGES.prohibited_area );
          break;
        }
      }
    });
  }

  //マップに東西南北を表示
  function map_quarters() {
    if(!options['map_quarters']) return;
    if (location.pathname != "/map.php")
      return;
    $('p.areaDir').remove(); //新合戦の方向画像は非表示に
    $('#ig_mapbox_container')
    .append('<div class="moko-map-eswn moko-map-eswn-E">')
    .append('<div class="moko-map-eswn moko-map-eswn-S">')
    .append('<div class="moko-map-eswn moko-map-eswn-W">')
    .append('<div class="moko-map-eswn moko-map-eswn-N">');
    
    var style = document.createElement("style");
    style.setAttribute("type","text/css");
    style.innerHTML ='.moko-map-eswn { background-color: black; z-index: 99; position: absolute; width: 40px; height: 40px; background: url(' + IMAGES.mokoMapESWN + ') no-repeat;}' +
        '.moko-map-eswn-E { top:182px; left:596px; background-position:0;}' +
        '.moko-map-eswn-S { top:208px; left:210px; background-position:-40px 0;}' +
        '.moko-map-eswn-W { top:40px; left:160px; background-position:-80px 0;}' +
        '.moko-map-eswn-N { top:14px; left:485px; background-position:-120px 0;}';
    document.head.appendChild(style);
  }

  $(function() {
    if (location.pathname != "/map.php")
      return;
    $('div.map_tool_button_grp').each(function() {
      $(this).find('div.map_tool_button:first').addClass('map_button_select');
    });
    $('#map_tool_box').each(function() {
      $(this).children('div').slice(1).hide();
    });
    $('div.map_tool_button').click(function() {
      $('div.map_tool_button_grp').find('div.map_tool_button').removeClass('map_button_select');
      $(this).addClass('map_button_select');
      var btn_name = $(this).attr('name');
      $('#map_tool_box').children().each(function() {
        if (this.id === btn_name) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
  });

  //☆リスト表示、座標記録、ミニマップ
  function map_check() {
    if (location.pathname != "/map.php")
      return;
    // 選択中の所領を判断
    var basedata = $('div.basename').find('li.on > span').attr('title'),
      tmp = basedata.match(/^(.+)\((-?\d+),(-?\d+)\)$/),
      base_x = parseInt(tmp[2], 10),
      base_y = parseInt(tmp[3], 10);
      
    //マップツールウインドウ
    var map_tool_window = $('<div class="map_tool_window"></div>'),
      map_tool_listbox = $('<div id="map_tool_box" style="width: 430px; clear: both; overflow: hidden;">'),
      map_tool_button_grp = $('<div class="map_tool_button_grp"></div>');
    $('#ig_mapbox').prepend(map_tool_window.append(map_tool_button_grp).append(map_tool_listbox));
    
    //座標記録ウインドウ
    if (options.map_reg) {
      var maplist_box = $('<div id="ixamoko_maplist1" class="map list"></div>');
      var maplist_box_btn = $('<div class="map_tool_button" name="ixamoko_maplist1">座標記録</div>');
      var inTable = $('<table class="in_table"><thead><tr><th>拠点名称</th><th>距離</th><th>座標</th><th class="imk_border_right">国</th></tr></thead><tbody id="reg_box"></tbody></table>');
        inTable.appendTo( maplist_box );
      map_tool_listbox.append(maplist_box);
      map_tool_button_grp.append(maplist_box_btn);
      set_map_list( base_x, base_y );
    }

    //☆リストウインドウ
    if (options.map_starx > 0) {
      var status_box = $('<div id="ixamoko_maplist2" class="map list" />');
      var status_box_btn = $('<div class="map_tool_button" name="ixamoko_maplist2">空地リスト</div>');
      
      $('<table class="in_table stars">' +
        '<thead><tr><th style="width:125px;">価値</th><th>資源</th><th class="imk_border_right">距離</th></tr></thead>' +
        '<tbody id="star_box"><tr></tr></tbody>' +
        '</table>'
      ).appendTo( status_box );
      
      map_tool_listbox.prepend(status_box);
      map_tool_button_grp.prepend(status_box_btn);
      
      $('tr.ixamoko_regmap')
      .live('contextmenu', function(e) {
        e.preventDefault();
        location.href = $(this).attr('url');
      })
      .live('mouseover', function(e) {
        $('area[balloon="' + $(this).attr('alt') + '"]').trigger('mouseover');
      })
      .live('mouseout', function(e) {
        $('#ixamoko_zoommap').remove();
      })
      .live('click', function(event) {
        var ev = options.map_leftclick? 'click': (options.map_rightclick? 'contextmenu': false);
        if (!ev) return;
        event.preventDefault();
        $('area[balloon="' + $(this).attr('alt') + '"]').trigger(ev);
      });
      map_list2();
    }

    //ミニマップウインドウ
    if (options.map_minimap) {
      var minimap_box = $('<div id="ixamoko_maplist3" class="list" style="top: 100px; right: 0; z-index: 100; overflow: hidden;" />'),
        minimap_canvas = $('<canvas width="160" height="130" style="position: absolute; left: -5px; top: -5px; z-index: 110;"/>'),
        minimap_grid_x = $('<span style="position: absolute; left: 75px; border-right: 1px solid grey; height: 120px;"></span>'),
        minimap_grid_y = $('<span style="position: absolute; top: 60px; border-bottom: 1px solid grey; width: 150px;"></span>');
      minimap_box.append(minimap_grid_x).append(minimap_grid_y);
      $('#ig_mapbox').prepend(minimap_box.append(minimap_canvas));
      $('#map_view_text, #map_navi').hide();
      
      map_minimap();
    }

  }

  //ミニマップ
  function map_minimap() {
    var h = $('#ig_map_movepanel').find('li:eq(0) > a').attr('href').replace("&type=1","");
    if ( options.chapter_change === '0' ) {
      var x = (parseInt(h.match(/x=([\-\d]+)/)[1]) + 180)/360*150 - 5;
      var y = (parseInt(h.match(/y=([\-\d]+)/)[1]) + 180)/360*120 - 5;
    }
    else {
      var x = (parseInt(h.match(/x=([\-\d]+)/)[1]) + 150)/300*150 - 5;
      var y = (parseInt(h.match(/y=([\-\d]+)/)[1]) + 150)/300*120 - 5;
    }
    var c = h.match(/c=([\-\d]+)/)[1];
    $('#ixamoko_maplist3').append('<span class="cursor now" style="position: absolute; left:' + x + 'px; bottom:' + y + 'px; z-index: 100; cursor: default; font-family: MS PMincho, serif; font-size: 10px;">◆</span>');
    //クリックした座標へマップ移動
    $('#ixamoko_maplist3').click(function(e) {
      var xo = $(this).offset().left;
      var yo = $(this).offset().top;
      if ( options.chapter_change === '0' ) {
        var x = Math.floor((e.clientX-xo)/150*360 - 180 - 15);
        var y = - Math.floor((e.clientY-yo)/120*360 - 180 - 20);
      }
      else {
        var x = Math.floor((e.clientX-xo)/150*300 - 150 - 12.5);
        var y = - Math.floor((e.clientY-yo)/120*300 - 150 - 17.5);
      }
      var ajaxurl = '/map.php?x=' + x + '&y=' + y + '&c=' + c;
      map_Ajax_Move(ajaxurl);
    });
  }

  function map_minimap_cursormove (h) {
    if ( options.chapter_change === '0' ) {
      var l = ((parseInt(h.match(/x=([\-\d]+)/)[1]) + 180)/360*150 - 5) + 'px';
      var b = ((parseInt(h.match(/y=([\-\d]+)/)[1]) + 180)/360*120 - 5) + 'px';
    }
    else{
      var l = ((parseInt(h.match(/x=([\-\d]+)/)[1]) + 150)/300*150 - 5) + 'px';
      var b = ((parseInt(h.match(/y=([\-\d]+)/)[1]) + 150)/300*120 - 5) + 'px';
    }
    $('#ixamoko_maplist3 > span.cursor.now').css({left: l, bottom: b});
  }

  function set_map_list( base_x, base_y ) {
    $('#reg_box').empty().append('<tr id="reg_info"><td colspan="4" style="text-align: center;" class="imk_border_right">記録無し</td></tr>');
    var map_list = {};
    if (localStorage.getItem("crx_map_list")) {
      map_list = secureEvalJSON(localStorage.getItem("crx_map_list"));
    }
    
    var CountryCode = $('#ig_map_movepanel').find('li:eq(0) > a').attr('href').split('=')[4],
      dist = 0,
      tmp;
    for (var key in map_list) {
      tmp = key.match(/x=(\-?\d+)&y=(\-?\d+)&c=(\d+)/);
      if (!tmp) {
        tmp = key.match(/(-?\d+),(-?\d+)/);
      }
      dist = Math.sqrt(Math.pow(parseInt(tmp[1], 10) - base_x, 2) + Math.pow(parseInt(tmp[2], 10) - base_y, 2));
      dist = Math.round(dist * 100) / 100;

      if (tmp.length === 4 && parseInt(tmp[3]) !== parseInt(CountryCode) ) {
        dist = "-";
      }
      
      var x = tmp[1], y = tmp[2], c = tmp[3];
      //4章
      if ( options.chapter_change === '0' ) {
        var world = { 1:'織田家', 2:'足利家', 3: '武田家', 4: '上杉家', 5: '徳川家', 6: '毛利家', 7: '浅井家', 8: '北条家', 9: '長宗我部家', 10: '島津家', 11: '大友家', 12: '最上家', 20:'東西戦場1', 21:'東西戦場2' };
      }
      //6章
      else if ( options.chapter_change === '6' ) {
        var world = { 1:'織田家', 2:'黒田家', 3: '武田家', 4: '上杉家', 5: '徳川家', 6: '毛利家', 7: '伊達家', 8: '今川家', 9: '長宗我部家', 10: '島津家', 11: '大友家', 12: '石田家', 20:'東西戦場1', 21:'東西戦場2' };
      }
      //5章
      else {
        var world = { 1:'織田家', 2:'足利家', 3: '武田家', 4: '上杉家', 5: '徳川家', 6: '毛利家', 7: '伊達家', 8: '北条家', 9: '長宗我部家', 10: '島津家', 11: '豊臣家', 12: '最上家', 20:'東西戦場1', 21:'東西戦場2' };
      }
      
      var reg = $('<tr coord="' + key + '" style="cursor:pointer;">' +
            '<td>' + map_list[key] + '</td>' +
            '<td class="coorddist im_center">' + dist + '</td>' +
            '<td class="im_center"> (' + x + ',' + y + ')</td>' +
            '<td class="im_center imk_border_right">' + world[c] + '</td>' + 
            '</tr>'
          ).appendTo('#reg_box').click( mouseclick );
      
      if (dist !== "-") { reg.hover( mouseover, mouseout ); }
      
      $('#reg_info').remove();
    }

    $( '#reg_box>tr').live( 'contextmenu', function (e) {
      e.preventDefault();
      location.href = '/land.php?' + $(this).attr('coord');
    });

    function mouseover() {
      $(this).css('background-color', '#725E1E');
      $('area[href*="' + $(this).attr('coord') + '"]').trigger('mouseover');
      //console.log($('area[href*="' + $(this).attr('coord') + '"]'));
      if (options.map_minimap) {
        var ctx = $('#ixamoko_maplist3 > canvas')[0].getContext('2d');
        var coord = $(this).attr('coord').match(/(\-?\d+).+?(\-?\d+)/);
        ctx.fillStyle = "red";
        ctx.beginPath();  
        if ( options.chapter_change === '0' ) {
          ctx.arc((parseInt(coord[1]) + 180)/360*150 + 5, (180 - parseInt(coord[2]))/360*120 + 5, 3, 0, Math.PI*2, true);
        }
        else {
          ctx.arc((parseInt(coord[1]) + 150)/300*150 + 5, (150 - parseInt(coord[2]))/300*120 + 5, 3, 0, Math.PI*2, true);
        }
        ctx.fill();
      }
    }
    function mouseout() {
      $(this).css('background-color', '');
      $('#ixamoko_zoommap').remove();
      if (options.map_minimap) {
        var ctx = $('#ixamoko_maplist3 > canvas')[0].getContext('2d');
        var coord = $(this).attr('coord').match(/(\-?\d+).+?(\-?\d+)/);
        if ( options.chapter_change === '0' ) {
          coord = [(parseInt(coord[1]) + 180)/360*150 + 5, (180 - parseInt(coord[2]))/360*120 + 5];
        }
        else {
          coord = [(parseInt(coord[1]) + 150)/300*150 + 5, (150 - parseInt(coord[2]))/300*120 + 5];
        }
        ctx.clearRect(coord[0]-4, coord[1]-4, 8, 8);
      }
    }
    function mouseclick() {
      var ev = options.map_leftclick? 'click': (options.map_rightclick? 'contextmenu': false);
      if (!ev) return;
      event.preventDefault();
      $('area[href*="' + $(this).attr('coord') + '"]').trigger(ev);
    }
  }

  //☆リスト
  function map_list2() {
    $('#star_box').empty().append('<tr id="star_info"><td colspan="4" class="imk_border_right">該当無し</td></tr>');
    var HOSHI_SET = [], hoshi = '★', i;
    if (options.map_starx < 6) {
      for ( i = 0; i < options.map_starx; ++i ){ HOSHI_SET.push( hoshi ); hoshi += '★'; }
    }
    else if (options.map_starx == 6) { hoshi = '★★★★★★'; HOSHI_SET.push( hoshi ); }
    else if (options.map_starx == 7) { hoshi = '★★★★★★★'; HOSHI_SET.push( hoshi ); }
    else if (options.map_starx == 8) { hoshi = '★★★★★★★★'; HOSHI_SET.push( hoshi ); }
    
    function Tochi( land_value, dist, url, alt ) { this.land_value = land_value; this.dist = dist; this.url = url; this.alt = alt; }
    function cmp_dist(a, b) { return a.dist - b.dist; }
    
    for ( i = 0; i < HOSHI_SET.length; ++i ) {
      var hoshi = HOSHI_SET[i], count = 0, Tochis = [];
      
      $('area[onMouseOver*=", \'' + hoshi + '\',"]').each( area_mouseover );
      Tochis.sort( cmp_dist );
      
      for (var j = 0; j < Tochis.length; ++j) {
        $('<tr class="ixamoko_regmap" url="' + Tochis[j].url + '" alt="' + Tochis[j].alt + '" style="cursor: pointer;">' +
          '<td>' + hoshi + '</td>' +
          '<td style="padding: 3px;">' + Tochis[j].land_value + '</td>' +
          '<td class="imk_border_right">' + Tochis[j].dist + '</td>' +
           '</tr>'
        ).hover(function(){
          $(this).css('background-color', '#725E1E');
        },function(){
          $(this).css('background-color', '');
        }).appendTo('#star_box');
        
        $('#star_info').remove();
      }
    
    }
    function area_mouseover() {
      var source = $(this).attr('onMouseOver').match(/'.*?'/g),
        alt = $(this).attr('balloon'),
        url = $(this).attr('onClick').match(/land\.php\?x=(-?\d+)&y=(-?\d+)&c=(\d+)/)[0],
        country = url.split('=')[3],
        flag = alt.match(/^([^(]+) (-?\d+),(-?\d+)$/);
        
      if ( flag != null ){
        if( country >= 20){
          var land_value = '<img src="/img/common/ico_wood.gif" />' + source[10] + '<img src="/img/common/ico_wool.gif" />' +source[11] + '<img src="/img/common/ico_ingot.gif" />' + source[12] + '<img src="/img/common/ico_grain.gif" />' + source[13] + '<img src="/img/common/ico_pond.gif" />' + source[14],
              land_value = land_value.replace(/'/g, '');
          var dist = source[5].replace(/'/g, '');
        }
        else{
          var land_value = '<img src="/img/common/ico_wood.gif" />' + source[7] + '<img src="/img/common/ico_wool.gif" />' +source[8] + '<img src="/img/common/ico_ingot.gif" />' + source[9] + '<img src="/img/common/ico_grain.gif" />' + source[10] + '<img src="/img/common/ico_pond.gif" />' + source[11],
              land_value = land_value.replace(/'/g, '');
          var dist = source[6].replace(/'/g, '');
        }
          Tochis[count++] = new Tochi( land_value, dist, url, alt );
      }
    }
  }

  //地図: 右クリックで移動
  function map_rightclick() {
    if (location.pathname !== "/map.php")
      return;
    if (!options.map_rightclick)
      return;
    if ( options.rightclick_mode == '0' ) {
      map_tool();
    }
    else if ( options.rightclick_mode == '1' ) {
      if (this && typeof (this.ajflag) === 'undefined') { this.ajflag = true; }
      $('#mapOverlayMap > area').live('contextmenu', function(e) {
        if (map_rightclick.ajflag) { return false; }
        map_rightclick.ajflag = true;
        var urlmap = $(this).attr('onClick').match(/map\.php\?x=(-?\d+)&y=(-?\d+)&c=(\d+)/)[0],
          ajaxurl = urlmap;
        map_Ajax_Move(ajaxurl);
        return false;
      });
      map_rightclick.ajflag = false;
    }
  }

  //地図: Ajaxで移動
  function map_arrowclick() {
    if (location.pathname != '/map.php')
      return;
    //矢印をAjaxで移動
    $('a[id^="ig_cur"]').live('click', function(e) {
      var ajaxurl = $(this).attr('href');
      map_Ajax_Move( ajaxurl );
      return false;
    });
    // 部隊行動状況：拠点をAjaxで移動
    $('div.time_loc > a').live('click', function(e) {
      var CountryCode = $('#ig_map_movepanel').find('li:eq(0) > a').attr('href').split('=')[4],
        hc = parseInt( $(this).attr('href').split('=')[3].trim() ),
        url = $(this).attr('href').replace('../map', '/map'),
        ajaxurl = $(this).attr('href');
      
      if ( hc !== parseInt( CountryCode ) ) {
        location.href = url;
        return false;
      }
      else {
        map_Ajax_Move( ajaxurl );
        return false;
      }
      
    });
    //砦をAjaxで移動
    $('#toride_box li > a').live('click', function(e) {
      var ajaxurl = $(this).attr('href');
      map_Ajax_Move( ajaxurl );
      return false;
    });
    //チャット敵襲リンクをAjaxで移動
    $('#enemyLine td > a[href^="../map.php"]').live('click', function(e) {
      var ajaxurl = $(this).attr('href');
      map_Ajax_Move( ajaxurl );
      return false;
    });
    //所属拠点
    $('div.base > a').live('click', function(e) {
      $(this).closest('tbody').find('div.base > a').css('color', '');
      $(this).css('color', 'gold');
      var CountryCode = $('#ig_map_movepanel').find('li:eq(0) > a').attr('href').split('=')[4],
        hc = parseInt( $(this).attr('href').split('=')[3].trim() ),
        url = $(this).attr('href').replace('../map', '/map'),
        ajaxurl = $(this).attr('href');
        
      var affili_base = $(this).attr('title');
      $('#sideboxBottom').find('div.sideBoxInner.basename').find('li').children()
      .each(function(){
        var baseName = $(this).text();
        $(this).css('border-bottom', 'none');
        if( affili_base == baseName ){
          $(this).css({'text-decoration':'none', 'border-bottom':'2px solid coral'});
        }
      });
      
      if ( hc !== parseInt( CountryCode ) ) {
        location.href = url;
        return false;
      }
      else {
        map_Ajax_Move( ajaxurl );
        return false;
      }
      
    });
  }

  function map_Ajax_Move( ajaxurl, flag ) {
    $.ajax({
      url: ajaxurl,
      cache: false,
      dataType: "text",
      success: function(html) {
        var $new_map = $(html).find('#ig_mapbox_container'),
          $new_map_movepanel = $(html).find('#ig_map_movepanel');
        $('#ig_mapbox_container').replaceWith($new_map);
        $('#ig_map_movepanel').replaceWith($new_map_movepanel);

        if (options.map_starx > 0) {
          map_list2();
        }
        if (options.map_reg) {
          set_map_list( ajaxurl.match(/x=(\-?\d+)/)[1], ajaxurl.match(/y=(\-?\d+)/)[1] );
        }

        if (options.map_minimap) {
          map_minimap_cursormove(ajaxurl);
        }
        if (options.map_history && flag !== true) {
          history.pushState('', '', ajaxurl);
        }
        if (options.all_area_map) {
          var npl = parseInt(ajaxurl.match(/x=(\-?\d+)/)[1]) + 180;
          var npt = 180 - parseInt(ajaxurl.match(/y=(\-?\d+)/)[1]);
          $('#allareaMap_marker img[title="現在地"]').css({left: npl, top: npt}).parent().attr('href', ajaxurl);
        }
        map_rightclick.ajflag = false;
        record_mark();
        zoomMap();
        now_select_point();
        panelAttack();
        map_quarters();
        fall_Judgment();
        MapOverlay_Leader();
        enemy_mark();
        prohibiJin();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        map_rightclick.ajflag = false;
      //console.log(textStatus);
      }
    });
    return false;
  }

  //地図移動を履歴に記録
  function map_history() {
    if (location.pathname === "/map.php" && options.map_history) {
      //ローディングコールの回避
      setTimeout(function() {
        //履歴クリック時
        window.onpopstate = function(e) {
          if (location.pathname !== "/map.php") {
            location.reload();
          } else if (location.search.match(/x=\-?\d/) && location.search.match(/y=\-?\d/)) {
            map_Ajax_Move(location.href, true);
          } else {
            //現在地
            var now = $('#ig_map_movepanel').find('li:eq(0) > a').attr('href').match(/x=(\-?\d+)&y=(\-?\d+)/);
            // 選択中の所領を判断
            var basedata = $('div.basename').find('li.on > span').attr('title');
            var tmp = basedata.match(/^(.+)\((\-?\d+),(\-?\d+)\)$/);
            if (now[1] !== tmp[2] || now[2] !== tmp[3]) {
              var ajaxurl = '/map.php?' + 'x=' + tmp[2] + '&' + 'y=' + tmp[3];
              map_Ajax_Move(ajaxurl, true);
            }
          }
        }
      }, 10000);
    }
  }

  function get_map_status(k, i, x, y) {
    if (location.pathname != "/map.php")
      return;
  if ( options.chapter_change === '0' ) {
  //4章の場合
    var mp = new Array(48);
    mp[0] = new Array(12, 28);
    mp[1] = new Array(28, 12);
    mp[2] = new Array(12, 52);
    mp[3] = new Array(36, 36);
    mp[4] = new Array(52, 12);
    mp[5] = new Array(12, 76);
    mp[6] = new Array(36, 60);
    mp[7] = new Array(60, 36);
    mp[8] = new Array(76, 12);
    mp[9] = new Array(12, 100);
    mp[10] = new Array(36, 84);
    mp[11] = new Array(60, 60);
    mp[12] = new Array(84, 36);
    mp[13] = new Array(100, 12);
    mp[14] = new Array(12, 124);
    mp[15] = new Array(36, 108);
    mp[16] = new Array(60, 84);
    mp[17] = new Array(84, 60);
    mp[18] = new Array(108, 36);
    mp[19] = new Array(124, 12);
    mp[20] = new Array(12, 148);
    mp[21] = new Array(36, 132);
    mp[22] = new Array(60, 108);
    mp[23] = new Array(84, 84);
    mp[24] = new Array(108, 60);
    mp[25] = new Array(132, 36);
    mp[26] = new Array(148, 12);
    mp[27] = new Array(36, 156);
    mp[28] = new Array(60, 132);
    mp[29] = new Array(84, 108);
    mp[30] = new Array(108, 84);
    mp[31] = new Array(132, 60);
    mp[32] = new Array(156, 36);
    mp[33] = new Array(60, 156);
    mp[34] = new Array(84, 132);
    mp[35] = new Array(108, 108);
    mp[36] = new Array(132, 84);
    mp[37] = new Array(156, 60);
    mp[38] = new Array(84, 156);
    mp[39] = new Array(108, 132);
    mp[40] = new Array(132, 108);
    mp[41] = new Array(156, 84);
    mp[42] = new Array(108, 156);
    mp[43] = new Array(132, 132);
    mp[44] = new Array(156, 108);
    mp[45] = new Array(132, 156);
    mp[46] = new Array(156, 132);
    mp[47] = new Array(156, 156);

  } else {
  //5章の場合
    var mp = new Array(35);
    mp[0] = new Array(12, 28);
    mp[1] = new Array(28, 12);
    mp[2] = new Array(12, 52);
    mp[3] = new Array(36, 36);
    mp[4] = new Array(52, 12);
    mp[5] = new Array(12, 76);
    mp[6] = new Array(36, 60);
    mp[7] = new Array(60, 36);
    mp[8] = new Array(76, 12);
    mp[9] = new Array(12, 100);
    mp[10] = new Array(36, 84);
    mp[11] = new Array(60, 60);
    mp[12] = new Array(84, 36);
    mp[13] = new Array(100, 12);
    mp[14] = new Array(12, 124);
    mp[15] = new Array(36, 108);
    mp[16] = new Array(60, 84);
    mp[17] = new Array(84, 60);
    mp[18] = new Array(108, 36);
    mp[19] = new Array(124, 12);
    mp[20] = new Array(36, 132);
    mp[21] = new Array(60, 108);
    mp[22] = new Array(84, 84);
    mp[23] = new Array(108, 60);
    mp[24] = new Array(132, 36);
    mp[25] = new Array(60, 132);
    mp[26] = new Array(84, 108);
    mp[27] = new Array(108, 84);
    mp[28] = new Array(132, 60);
    mp[29] = new Array(84, 132);
    mp[30] = new Array(108, 108);
    mp[31] = new Array(132, 84);
    mp[32] = new Array(108, 132);
    mp[33] = new Array(132, 108);
    mp[34] = new Array(132, 132);

    }

    var p = new Array('hs', 'ht', 'ns', 'nt');
    var j = i;
    var c = k;
    var minus_x = '1';
    var minus_y = '1';
    if (p[c] == 'hs') {
      minus_x = '-1';
      minus_y = '1';
    } else if (p[c] == 'ht') {
      minus_x = '1';
      minus_y = '1';
    } else if (p[c] == 'ns') {
      minus_x = '-1';
      minus_y = '-1';
    } else {
      minus_x = '1';
      minus_y = '-1';
    }
    var t = $('select#target option:selected').val();
    $.ajax({
      url: '/map.php?x=' + (x * minus_x) + '&y=' + (y * minus_y) + '&type=1&c=' + t,
      cache: false,
      dataType: "text",
      success: function(html) {
        var num = 0;
        $(html).find('#ig_mapsAll').find('img').each(function() {
          var img = $(this).get()[0].src;
          if (img.indexOf("stronghold_r_l.png") > 0) {
            num++;
          }
          if (img.indexOf("stronghold_r_m.png") > 0) {
            num++;
          }
          if (img.indexOf("stronghold_r_s.png") > 0) {
            num++;
          }
          if (img.indexOf("stronghold_g_l.png") > 0) {
            num++;
          }
          if (img.indexOf("stronghold_g_m.png") > 0) {
            num++;
          }
          if (img.indexOf("stronghold_g_s.png") > 0) {
            num++;
          }
          if (img.indexOf("stronghold_ga_l.png") > 0) {
            num++;
          }
          if (img.indexOf("stronghold_ga_m.png") > 0) {
            num++;
          }
          if (img.indexOf("stronghold_ga_s.png") > 0) {
            num++;
          }
        });
        j++;
        if (num === 0) {
          $('table#all_map_status').find('td#' + p[c] + j).css('color', '#808080');
        } else if (num <= 4) {
          $('table#all_map_status').find('td#' + p[c] + j).css('color', '#ff9999');
        } else if (num <= 9) {
          $('table#all_map_status').find('td#' + p[c] + j).css('color', '#ff6666');
        } else if (num <= 14) {
          $('table#all_map_status').find('td#' + p[c] + j).css('color', '#ff4c4c');
        } else {
          $('table#all_map_status').find('td#' + p[c] + j).css('color', '#ff0000');
        }
        if ( options.chapter_change === '0' ) {
        //4章の場合
          if (j > 47) {
            j = 0;
            c++;
          }
        
        } else {
        //5章の場合
          if (j > 34) {
            j = 0;
            c++;
          }
        
        }
        
        if (c > 3) {
          $("input#update_map").attr("disabled", false);
          var Dt = new Date();
          var now = Dt.getFullYear() + '/' + (Dt.getMonth() + 1) + '/' + Dt.getDate() + '/ ' + Dt.getHours() + ':' + Dt.getMinutes() + ':' + Dt.getSeconds();
          $("#lastmodify").text('最終更新 ' + now);
          var map_status = $('.map_status').find('#all_map_status:eq(0)').html();
          localStorage.setItem('crx_ixakaizou_map_status', map_status);
          return;
        }
        get_map_status(c, j, (mp[j][0]), (mp[j][1]));
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        return false;
      }
    });
  }

  //広域マップ
  function all_area_map() {
    if (location.pathname != "/map.php")
      return;
    if (!options.all_area_map)
      return;
    //マップ描画のパーツ画像
    var bar = IMAGES.allAreaMap.bar,
    barV = IMAGES.allAreaMap.barV,
    longbar = IMAGES.allAreaMap.longbar,
    longbarV = IMAGES.allAreaMap.longbarV,
    basepoint = IMAGES.allAreaMap.basepoint,
    basepoint2 = IMAGES.allAreaMap.basepoint2,
    basepoint3 = IMAGES.allAreaMap.basepoint3,
    basepoint4 = IMAGES.allAreaMap.basepoint4,
    toridepoint = IMAGES.allAreaMap.toridepoint,
    raidpoint = IMAGES.allAreaMap.raidpoint,
    markpoint = IMAGES.allAreaMap.markpoint,
    nowplace = IMAGES.allAreaMap.nowplace;
    //mokoツールに広域マップを追加
    $('#toollist').append(
      '<li class="list_img">' +
        '<a id="allareaMap" class="thickbox" title="広域マップ" href="#TB_inline?height=400&amp;width=735&amp;inlineId=allareaMapThickBox" onload="return false;">広域マップ</a>' +
      '</li>'
    );
    $('#mokotool').append(
      '<div id="allareaMapThickBox" style="display: none;">' +
        '<span id="allareaMapTable"></span>' +
      '</div>'
    );
    //広域マップ表示
    $("#allareaMap").live('mousedown', function() {
      var $allareaMapTable = $('#allareaMapTable'),
      key;
      if (!$allareaMapTable.children()[0]) {
        //基礎DOMを配置
        tb_init('a.thickbox');
        var waite_TB_window =  function() {
                      var $TB_window = $('#TB_window');
                      if(!$TB_window[0]) {
                        setTimeout(waite_TB_window,1);
                      } else {
                        $TB_window.css({'position': 'absolute'});
                      }
                    }
        setTimeout(waite_TB_window,1);
        $allareaMapTable.append(
          '<div id="allareaMapimg" style="position:relative; float:left; height:360px; width:360px;background-color: white;">' +
          '<span id="pole"></span>' +
          '<span id="toridePointNo" style="color:grey;"></span>' +
          '<span id="toridePointImg"></span>' +
          '<span id="basePointImg"></span>' +
          '<span id="ally_basePointImg"></span>' +
          '<span id="allareaMap_marker"></span>' +
          '</div>' +
          '<div id="baselist" style="float:left; height:100%; width:160px; margin-left:8px; overflow: hidden; white-space:nowrap;"></div>' +
          '<div id="ally_baselist" style="float:left; height:100%; width:195px; margin-left:8px; overflow:hidden; white-space:nowrap;"></div>'
        );
        //DOM変数
        var $allareaMapimg = $allareaMapTable.find('#allareaMapimg'),
        $baselist = $allareaMapTable.find('#baselist'),
        $ally_baselist = $allareaMapTable.find('#ally_baselist'),
        $pole = $allareaMapTable.find('#pole'),
        $toridePointNo = $allareaMapTable.find('#toridePointNo'),
        $toridePointImg = $allareaMapTable.find('#toridePointImg'),
        $basePointImg = $allareaMapTable.find('#basePointImg'),
        $ally_basePointImg = $allareaMapTable.find('#ally_basePointImg'),
        $allareaMap_marker = $allareaMapTable.find('#allareaMap_marker');

        //マップの軸を配置
          for (var i = 0; i <= 6; i += 1) {
            $pole.append(
            '<img style="position:absolute; top:' + i * 60 + 'px;" src="' + longbar + '">' +
            '<img style="position:absolute; left:' + i * 60 + 'px;" src="' + longbarV + '">'
            );
            if (i < 6) {
              $pole.append(
              '<img style="position:absolute; left:175px; top:' + (i * 60 + 20) + 'px;" src="' + bar + '">' +
              '<img style="position:absolute; left:' + (i * 60 + 20) + 'px; top:175px;" src="' + barV + '">' +
              '<img style="position:absolute; left:175px; top:' + (i * 60 + 40) + 'px;" src="' + bar + '">' +
              '<img style="position:absolute; left:' + (i * 60 + 40) + 'px; top:175px;" src="' + barV + '">'
              );
            }
          }
        //マップの原点
        var x_zero = 180 - 2, y_zero = 180 - 2;
        //国選択
        $baselist.append(
          '<p>' +
          '<select id="country" style="margin-bottom:4px;">' +
          '<option value="0">自国</option>' +
          '<option value="1">他国</option>' +
          '</select>' +
          '</p>' +
          '<ul style="height: 100%; overflow-y:auto; overflow-x: hidden;"></ul>'
        );
        var $country = $baselist.find('#country');
        if (localStorage.getItem('crx_areamapcountry'))
          $country.val(localStorage.getItem('crx_areamapcountry'));
        //砦、番号表示選択
        var torideCheck = ['', ''];
        if (localStorage.getItem('crx_areamaptoride'))
          torideCheck = secureEvalJSON(localStorage.getItem('crx_areamaptoride'));
        $baselist.prepend(
        '<p>' +
        '<span>' +
        '<input type="checkbox" id="toride"' + torideCheck[0] + '> : 砦' +
        '</span>' +
        '<span style="margin-left: 1em;">' +
        '<input type="checkbox" id="torideNo"' + torideCheck[1] + '> : 番号' +
        '</span>' +
        '</p>'
        );
        var $torideNo = $baselist.find('#torideNo'),
        $toride = $baselist.find('#toride');

        //国番号、表示国取得
        var countrycode = get_country_code(),
        country = $country.val();

        //拠点リスト取得
        var base = get_base(x_zero, y_zero, basepoint);

        //砦タグ作成
        var toride = createtoridetag(countrycode, toridepoint, x_zero, y_zero);

        //拠点、砦表示
        append_base(countrycode, country, base);
        append_toride(toride, country);

        //部隊・敵襲マーカー表示
        append_marker(countrycode, country);

        //クリックした座標へマップ移動
        $allareaMapimg.click(function(e) {
          var xo = $allareaMapimg.offset().left;
          var yo = $allareaMapimg.offset().top;
          var x = Math.floor(e.clientX - xo - 180);
          var y = Math.floor(-e.clientY + yo + 180);
          location.href = '/map.php?x=' + x + '&y=' + y + '&' + countrycode[country];
        });

        //砦の表示チェック
        $toride.click(function() {
          var warIMG = $('img[alt="合戦中"]').attr('title');
          if ( options.chapter_change === '0' ) {
          //4章の場合
            $toridePointImg.children().remove();
            if ($(this).attr('checked')) {
              $toridePointImg.append(toride[0][country]);
              torideCheck[0] = 'checked';
            } else {
              $('#allareaMapimg').css('background-image','');
              torideCheck[0] = '';
            }
          }
          else if ( options.chapter_change !== '0' && warIMG == '新合戦中' ) {
          //5章の東西戦
            $toridePointImg.children().remove();
            if( $('#country').val() == 1 ){
              if ($(this).attr('checked')) {
                $('#allareaMapimg').css('background-image','');
                $toridePointImg.append(toride[0][country]);
                torideCheck[0] = 'checked';
              } else {
                $('#allareaMapimg').css('background-image','');
                torideCheck[0] = '';
              }
            }
            else if( $('#country').val() == 0 ){
              if ($(this).attr('checked')) {
                $('#allareaMapimg').css('background-image','url("' + IMAGES.toride_img + '")');
                torideCheck[0] = 'checked';
                $torideNo.attr('checked', '');
              } else {
                $('#allareaMapimg').css('background-image','');
                torideCheck[0] = '';
              }
            }
          }
          else {
          //5章の場合
            if ($(this).attr('checked')) {
              $('#allareaMapimg').css('background-image','url("' + IMAGES.toride_img + '")');
              torideCheck[0] = 'checked';
              $torideNo.attr('checked', '');
            } else {
              $('#allareaMapimg').css('background-image','');
              torideCheck[0] = '';
            }
          
          }

          localStorage.setItem('crx_areamaptoride', ArraytoJSON(torideCheck));
        });

        //砦番号の表示チェック
        $torideNo.click(function() {
          var warIMG = $('img[alt="合戦中"]').attr('title');
          if ( options.chapter_change === '0' ) {
          //4章の場合
            $toridePointNo.children().remove();
            if ($(this).attr('checked')) {
              $toridePointNo.append(toride[1][country]);
              torideCheck[1] = 'checked';
            } else {
              torideCheck[1] = '';
            }
          }
          else if ( options.chapter_change !== '0' && warIMG == '新合戦中' ) {
          //5章の東西戦
            $toridePointNo.children().remove();
            if( $('#country').val() == 1 ){
              if ($(this).attr('checked')) {
                $('#allareaMapimg').css('background-image','');
                $toridePointNo.append(toride[1][country]);
                torideCheck[1] = 'checked';
              } else {
                $('#allareaMapimg').css('background-image','');
                torideCheck[1] = '';
              }
            }
            else if( $('#country').val() == 0 ){
              if ($(this).attr('checked')) {
                $('#allareaMapimg').css('background-image','url("' + IMAGES.toride_no + '")');
                torideCheck[1] = 'checked';
                $toride.attr('checked', '');
              } else {
                $('#allareaMapimg').css('background-image','');
                torideCheck[1] = '';
              }
            }
          }
          else {
          //5章の場合
            if ($(this).attr('checked')) {
              $('#allareaMapimg').css('background-image','url("' + IMAGES.toride_no + '")');
              torideCheck[1] = 'checked';
              $toride.attr('checked', '');
            } else {
              $('#allareaMapimg').css('background-image','');
              torideCheck[1] = '';
            }
          }

          localStorage.setItem('crx_areamaptoride', ArraytoJSON(torideCheck));
        });

        //自国と他国の変更
        $country.change(function() {
          country = $country.val();
          localStorage.setItem('crx_areamapcountry', $country.val());
          $baselist.find('ul').children().remove();
          $basePointImg.children().remove();
          $ally_baselist.find('div').remove();
          $ally_basePointImg.children().remove();
          $toridePointImg.children().remove();
          $toridePointNo.children().remove();
          $allareaMap_marker.children().remove();
          append_base(countrycode, country, base);
          append_toride(toride, country);
          append_marker(countrycode, country);
          if (alliesObj)
            set_allyBases(allyBases, country);
        });

        //同盟オブジェクト取得
        var alliesObj = secureEvalJSON(localStorage.getItem('crx_alliesObj'));
        if (alliesObj) {
          //所属国選択
          $ally_baselist.append('<select id="ally_country" style="margin-top:4px;margin-bottom:4px;"></select><br/>');
          var $ally_country = $ally_baselist.find('#ally_country');
          for (key in alliesObj)
            $ally_country.append('<option value="' + key + '">' + key + '</option>');
          if (localStorage.getItem('crx_areamapAllyCountry'))
            $ally_country.val(localStorage.getItem('crx_areamapAllyCountry'));
          var ac = $ally_country.val();
          localStorage.setItem('crx_areamapAllyCountry', ac);
          //同盟選択
          $ally_baselist.append('<select id="ally_ID" style="margin-bottom:4px;width:100%"></select><br/>');
          var $ally_ID = $ally_baselist.find('#ally_ID');
          for (key in alliesObj[ac]['同盟ID'])
            $ally_ID.append('<option value="' + key + '">' + alliesObj[ac]['同盟ID'][key]['名称'] + '</option>');
          if (localStorage.getItem('crx_areamapAllyID'))
            $ally_ID.val(localStorage.getItem('crx_areamapAllyID'));
          var ai = $ally_ID.val();
          localStorage.setItem('crx_areamapAllyID', ai);
          //拠点分類・陥落表示選択
          var baseCheck = {'本領': 'checked','所領': 'checked','陥落': '','出城': 'checked','陣': 'checked','領地': ''};
          if (localStorage.getItem('crx_areamapbaseCheck'))
            baseCheck = secureEvalJSON(localStorage.getItem('crx_areamapbaseCheck'));
          $ally_baselist.append(
          '<span>' +
          '<input type="checkbox" class="base_check" id="本領"' + baseCheck['本領'] + '> : 本領' +
          '</span>' +
          '<span style="margin-left:0.4em;">' +
          '<input type="checkbox" class="base_check" id="所領"' + baseCheck['所領'] + '> : 所領' +
          '</span>' +
          '<span style="margin-left:0.4em;">' +
          '<input type="checkbox" class="base_check" id="陥落"' + baseCheck['陥落'] + '> : 陥落' +
          '</span>' +
          '<br/>' +
          '<span>' +
          '<input type="checkbox" class="base_check" id="出城"' + baseCheck['出城'] + '> : 出城' +
          '</span>' +
          '<span style="margin-left:0.4em;">' +
          '<input type="checkbox" class="base_check" id="陣"' + baseCheck['陣'] + '> : 陣' +
          '</span>' +
          '<span style="margin-left:1.4em;">' +
          '<input type="checkbox" class="base_check" id="領地"' + baseCheck['領地'] + '> : 領地' +
          '</span>'
          );
          //同盟拠点リスト・ポイント取得
          var allyBases = cleateAllyBases(x_zero, y_zero, basepoint3, countrycode, ac, ai, alliesObj, baseCheck);
          //同盟拠点リスト・ポイント表示
          set_allyBases(allyBases, country);
          //同盟拠点マウスホバー設定
          $ally_baselist.find('[title]').live('mouseover', function() {
            $ally_basePointImg.find('img[title*=' + $(this).attr('title') + ']').attr('src', basepoint4);
          });
          $ally_baselist.find('[title]').live('mouseout', function() {
            $ally_basePointImg.find('[title*=' + $(this).attr('title') + ']').attr('src', basepoint3);
          });
          $ally_basePointImg.find('[title]').live('mouseover', function() {
            $ally_basePointImg.find('[title*=' + $(this).attr('title') + ']').attr('src', basepoint4);
          });
          $ally_basePointImg.find('[title]').live('mouseout', function() {
            $ally_basePointImg.find('[title*=' + $(this).attr('title') + ']').attr('src', basepoint3);
          });

          //所属国選択変更
          $ally_country.change(function() {
            ac = $ally_baselist.find('#ally_country').val();
            localStorage.setItem('crx_areamapAllyCountry', ac);
            $ally_ID.children().remove();
            $ally_baselist.find('div').remove();
            $ally_basePointImg.children().remove();
            //同盟選択
            var tmp = '';
            for (var key in alliesObj[ac]['同盟ID'])
              tmp += '<option value="' + key + '">' + alliesObj[ac]['同盟ID'][key]['名称'] + '</option>';
            $ally_ID.append(tmp);
            ai = $ally_baselist.find('#ally_ID').val();
            localStorage.setItem('crx_areamapAllyID', ai);
            //同盟拠点リスト・ポイント取得、表示
            allyBases = cleateAllyBases(x_zero, y_zero, basepoint3, countrycode, ac, ai, alliesObj, baseCheck);
            set_allyBases(allyBases, country);
          });

          //同盟選択変更
          $ally_ID.live('change', function() {
            ai = $ally_ID.val();
            localStorage.setItem('crx_areamapAllyID', ai);
            $ally_baselist.find('div').remove();
            $ally_basePointImg.children().remove();
            allyBases = cleateAllyBases(x_zero, y_zero, basepoint3, countrycode, ac, ai, alliesObj, baseCheck);
            set_allyBases(allyBases, country);
          });

          //拠点分類・陥落表示選択のチェック
          $ally_baselist.find('input.base_check').click(function() {
            for (var key in baseCheck) {
              //console.log(key);
              if ($ally_baselist.find('#' + key).attr('checked')) {
                baseCheck[key] = 'checked';
              } else {
                baseCheck[key] = '';
              }
            }
            localStorage.setItem('crx_areamapbaseCheck', toJSON(baseCheck));
            //console.log('click');
            $ally_baselist.find('div').remove();
            $ally_basePointImg.children().remove();
            //console.log(baseCheck);
            allyBases = cleateAllyBases(x_zero, y_zero, basepoint3, countrycode, ac, ai, alliesObj, baseCheck);
            set_allyBases(allyBases, country);
          });
        //同盟オブジェクトなし
        } else {
          $('#ally_baselist').append(
          '<p>' +
          '<select id="ally_country" style="margin-bottom:4px;">' +
          '<option value="0">なし</option>' +
          '</select>' +
          '</p>'
          );
        }
      }

      //自国番号と合戦国番号を取得
      function get_country_code() {
        var countrycode = [], tmp = {}, date_now = [Date()];
        date_now[1] = Date.parse(date_now[0]);
        if (localStorage.getItem('crx_countrycode')) {
          tmp = secureEvalJSON(localStorage.getItem('crx_countrycode'));
          if ((date_now[1] - tmp.date) < 86400000)
            return tmp.countrycode;
        }
        tmp.date = Date.parse(date_now[0].replace(/\d+:\d+:\d+/, '10:00:00'));
        tmp.date -= tmp.date < date_now[1] ? 0 : 86400000;
        // 全国地図のページから自国と合戦場国の国番号を取得
        $.ajax({
          url: '/country/all.php',
          cache: true,
          async: false,
          timeout: 2000,
          dataType: "text",
          success: function(html) {
            $(html).find('.OwnWin a').each(function() {
              countrycode.push($(this).attr('href').match(/c=\d+/)[0]);
            });
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
          }
        });
        if (countrycode[1] === undefined)
          countrycode[1] = countrycode[0];
        tmp.countrycode = countrycode;
        localStorage.setItem('crx_countrycode', toJSON(tmp));
        return countrycode;
      }

      //拠点リストとポイントを生成
      function get_base(x_zero, y_zero, basepoint) {
        function elements_basename_each() {
          var $this = $(this);
          var baseTitle = $this.children().attr('title');
          var baseHref = $this.children().attr('href');
          var onbase = $this.attr('class');
          var tmp = baseTitle.split(' ');
          var basecoordinate = tmp[1].match(/-?\d+/g);
          if (onbase && onbase.match(/on/)) {
            base.list[i] += '<li>' +
            '<span title="' + baseTitle + '">' + baseTitle.split(' ', 1) + '</span>' +
            '</li>';
            base.point[i] += '<span>' +
            '<img title="' + baseTitle + '" style="position:absolute; left:' + (x_zero + parseFloat(basecoordinate[0])) + 'px; top:' + (y_zero - parseFloat(basecoordinate[1])) + 'px;" src="' + basepoint + '">' +
            '</span>';
          } else {
            base.list[i] += '<li>' +
            '<a href="' + baseHref + '" title="' + baseTitle + '">' + baseTitle.split(' ', 1) + '</a>' +
            '</li>';
            base.point[i] += '<a href="' + baseHref + '">' +
            '<img title="' + baseTitle + '" style="position:absolute; left:' + (x_zero + parseFloat(basecoordinate[0])) + 'px; top:' + (y_zero - parseFloat(basecoordinate[1])) + 'px;" src="' + basepoint + '">' +
            '</a>';
          }
        }
        var base = {list: {0: '',1: ''},point: {0: '',1: ''}},
        elements_basename = $('#sideboxBottom').find('div.sideBoxInner.basename');
        for (var i = 0; i < elements_basename.length; i++) {
          $(elements_basename[i]).find('li').each(elements_basename_each);
        }
        return base;
      }

      //各砦のaタグ生成
      function createtoridetag(countrycode, toridepoint, x_zero, y_zero) {
      
        var toride = [['', ''], ['', '']],
        d = [[1, 1, '北東'], [-1, 1, '北西'], [1, -1, '南東'], [-1, -1, '南西']],
        torideN = get_torideNo(x_zero, y_zero),
        a, c, i, j, k, l;
        for (k = 0; k <= 3; k++) {
          for (i = 1; i <= 48; i++) {
            var x_adj = i > 9 ? -4 : -1;
            var y_adj = -4;
            for (j = 0; j <= 1; j++) {
              for (c = 0; c < countrycode.length; c++) {
                a = '<a href="/map.php?x=' + torideN[i][0] * d[k][0] + '&y=' + torideN[i][1] * d[k][1] + '&' + countrycode[c] + '" style="position:absolute;';
                if (j == 1) {
                  a += 'left:' + (x_zero + x_adj + torideN[i][0] * d[k][0]) + 'px;top:' + (y_zero + y_adj - torideN[i][1] * d[k][1]) + 'px;">' + i + '</a>';
                } else {
                  a += 'left:' + (x_zero + torideN[i][0] * d[k][0]) + 'px;top:' + (y_zero - torideN[i][1] * d[k][1]) + 'px;">';
                  a += '<img title="' + d[k][2] + '砦' + i + ' (' + torideN[i][0] * d[k][0] + ',' + torideN[i][1] * d[k][1] + ')" src="' + toridepoint + '"></a>';
                }
                toride[j][c] += a;
              }
            }
          }
        }
        for (c = 0; c < countrycode.length; c++) {
          toride[0][c] += '<a href="/map.php?x=0&y=0&' + countrycode[c] + '" style="position:absolute;left:' + x_zero + 'px;top:' + y_zero + 'px;"><img title="大殿" src="' + toridepoint + '"></a>';
        }
        if (parseInt(countrycode[1].match(/\d+/)[0]) >= 20) {
          if ( options.chapter_change === '0' ) {
            var tozaisen = [[[-97,145], [-121,97], [-97,97], [-73,97], [-49,145], [-49,121]], [[-145,1], [-145,49], [-121,49], [-97,25], [-97,1], [-97,-23]], [[-145,-119], [-145,-47], [-121,-71], [-97,-95], [-97,-143], [-73,-119]], [[119,121], [71,121], [71,97], [95,145], [95,73], [119,169]], [[167,49], [119,49], [143,73], [143,25], [167,97], [167,25]], [[119,-95], [71,-71], [71,-119], [95,-143], [119,-47], [119,-143]]];
          }
          else {
            var tozaisen = [[[-81,121], [-101,81], [-81,81], [-61,81], [-41,121], [-41,101]], [[-121,1], [-121,41], [-101,41], [-81,21], [-81,1], [-81,-19]], [[-121,-99], [-121,-39], [-101,-59], [-81,-79], [-81,-119], [-61,-99]], [[99,101], [59,101], [59,81], [79,121], [79,61], [99,141]], [[139,41], [99,41], [119,61], [119,21], [139,81], [139,21]], [[99,-79], [59,-59], [59,-99], [79,-119], [99,-39], [99,-119]]];
          }
          toride[0][1] = '';
          toride[1][1] = '';
          for (j = 0; j <= 1; j++) {
            for (k = 0; k < 6; k++) {
              for (l = 0; l < 6; l++) {
                a = '<a href="/map.php?x=' + tozaisen[k][l][0] + '&y=' + tozaisen[k][l][1] + '&' + countrycode[1] + '" style="position:absolute;';
                if (j == 1) {
                  a += 'left:' + (x_zero + x_adj + tozaisen[k][l][0]) + 'px;top:' + (y_zero + y_adj - tozaisen[k][l][1]) + 'px;">' + ((l === 0)? '大殿': l) + '</a>';
                } else {
                  a += 'left:' + (x_zero + tozaisen[k][l][0]) + 'px;top:' + (y_zero - tozaisen[k][l][1]) + 'px;">';
                  a += '<img title="' + ((l === 0)? '大殿': (l + '砦')) + ' (' + tozaisen[k][l][0] + ',' + tozaisen[k][l][1] + ')" src="' + toridepoint + '"></a>';
                }
                toride[j][1] += a;
              }
            }
          }
        }
        return toride;
      }

      //砦番号と座標生成
      function get_torideNo(x_zero, y_zero) {
        var toride = [];
        for (var i = 0; i <= 5; i += 1) {
        
          var torideN = 2 + (5 + i) * i / 2;
          toride[torideN] = [];
          toride[torideN][0] = (28 + i * 24);
          toride[torideN][1] = 12;
          
          torideN = 1 + (3 + i) * i / 2;
          toride[torideN] = [];
          toride[torideN][0] = 12;
          toride[torideN][1] = (28 + i * 24);
          
          for (var j = 0; j <= 5; j += 1) {
            torideN = 4 + (5 + j) * j / 2 + i * (7 + i) / 2 + i * j;
            if (i + j > 4) {
              var l = i + j - 5;
              torideN -= 1 + (2 + l) * l;
            }
            toride[torideN] = [];
            toride[torideN][0] = (36 + i * 24);
            toride[torideN][1] = (36 + j * 24);
          }
        }
        return toride;
      }

      //拠点を表示
      function append_base(countrycode, country, base) {
        //拠点表示
        $baselist.find('ul').append(base.list[country]);
        $basePointImg.append(base.point[country]);
        $allareaMapTable.find('[title]').hover(function() {
          $basePointImg.find('img[title=' + $(this).attr('title') + ']').attr('src', basepoint2);
        }, function() {
          $basePointImg.find('img[title=' + $(this).attr('title') + ']').attr('src', basepoint);
        });
      }

      //砦を表示
      function append_toride(toride, country) {
        var warIMG = $('img[alt="合戦中"]').attr('title');
        if ( options.chapter_change === '0' ) {
        //4章の場合
          if ($toride.attr('checked'))
            $toridePointImg.append(toride[0][country]);
          if ($torideNo.attr('checked'))
            $toridePointNo.append(toride[1][country]);
        }
        else if ( options.chapter_change !== '0' && warIMG == '新合戦中') {
        //5章の東西戦
          if( $('#country').val() == 1 ){
            if ($toride.attr('checked'))
              $toridePointImg.append(toride[0][country]);
              $('#allareaMapimg').css('background-image','');
            if ($torideNo.attr('checked'))
              $toridePointNo.append(toride[1][country]);
              $('#allareaMapimg').css('background-image','');
          }
          else if( $('#country').val() == 0 ){
            if ($toride.attr('checked'))
            $('#allareaMapimg').css('background-image','url("' + IMAGES.toride_img + '")');
            if ($torideNo.attr('checked'))
            $('#allareaMapimg').css('background-image','url("' + IMAGES.toride_no + '")');  
          }
        }
        else {
        //5章の場合
          if ($toride.attr('checked'))
          $('#allareaMapimg').css('background-image','url("' + IMAGES.toride_img + '")');
          if ($torideNo.attr('checked'))
          $('#allareaMapimg').css('background-image','url("' + IMAGES.toride_no + '")');
        }

      }

      //マーカー表示
      function set_marker($this, pointimg, countrycode, country, imgtitle) {
        var mark_x = $this.attr('href').match(/x=([\-\d]+)/)[1],
        mark_y = $this.attr('href').match(/y=([\-\d]+)/)[1],
        mark_c = $this.attr('href').match(/c=\d+/);
        if (mark_c == countrycode[country]) {
          $('#allareaMap_marker').append(
          '<span>' +
          '<a href="' + $this.attr('href') + '">' +
          '<img title="' + (imgtitle? imgtitle: "") + '" style="position:absolute; left:' + (x_zero + parseFloat(mark_x) - 1) + 'px; top:' + (y_zero - parseFloat(mark_y) - 1) + 'px;" src="' + pointimg + '">' +
          '</a>' +
          '</span>'
          );
        }
      }

      //部隊・敵襲マーカー表示
      function append_marker(countrycode, country) {
        //部隊待機・目標座標表示
        $('#map_butai_data tr').each(function() {
          if ($(this).find('td div.fstatus').text().match(/[^探国][^索移]/))
            set_marker($(this).find('td div.time_loc a'), markpoint, countrycode, country);
        });

        //敵襲座標表示
        $('#enemyLine tr').each(function() {
          if ($(this).find('a').length)
            set_marker($(this).find('a:eq(2)'), raidpoint, countrycode, country);
        });

        //現在地表示
        (function() {
          var h = $('#ig_map_movepanel').find('li:eq(0) > a').attr('href').replace("&type=1","");
          set_marker($('<a href=' + h + '></a>'), nowplace, countrycode, country, "現在地");
        })();
      }

      //同盟データから拠点リストとポイントを生成（引数：x、y座標の基準、imgのsrc、所属国、同盟ID、同盟データ））
      function cleateAllyBases(x_zero, y_zero, basepoint, cc, ac, ai, alliesObj, baseCheck) {
        //console.log(cc,ac,alliesObj,mnbrData)
        var base = {};
        var mnbrData = alliesObj[ac]['同盟ID'][ai]['同盟員'];
        //同盟員ごとのループ
        $.each(mnbrData, function(mnbrName, mnbr) {
          //ポスト(盟主・盟主補佐)を名前に追加
          mnbrName += mnbr['ポスト'] ? '(' + mnbr['ポスト'] + ')' : '';
          base[mnbrName] = {};
          //拠点分類ごとのループ
          $.each(mnbr['拠点'], function(bc, bases) {
            function bases_loop(baseName, baseData) {
              //console.log(baseData);
              if (baseData[2] != '陥落中' || baseCheck['陥落']) {
                var baseCoordinate = baseData[0];
                var basecoordinate = baseData[0].match(/-?\d+/g);
                var pp = baseData[1];
                var baseStatus = baseData[2];
                var baseHref = baseData[3];
                var baseTitle1 = '(' + baseCoordinate + ') ' + ((bc == '本領' || bc == '所領') ? (pp + '人 ') : '') + baseStatus;
                var baseTitle2 = mnbrName + ' [' + bc + '] ' + baseName + ' ' + baseTitle1;
                base[mnbrName][bc].list[i] += '<li><a href="' + baseHref + '" title="' + baseTitle1 + '">' + bc + ':' + baseName + '</a></li>';
                base[mnbrName][bc].point[i] += '<a href="' + baseHref + '"><img title="' + baseTitle2 + '" style="position:absolute; left:' + (x_zero + parseFloat(basecoordinate[0])) + 'px; top:' + (y_zero - parseFloat(basecoordinate[1])) + 'px;" src="' + basepoint + '"></a>';
              }
            }
            if (baseCheck[bc]) {
              base[mnbrName][bc] = {list: {0: '',1: ''},point: {0: '',1: ''}};
              for (var i = 0; i < 2; i++) {
                if (i == 1 && cc[0] == cc[1])
                  break;
                if (((bc == '本領' || bc == '所領' || bc == '開拓地') && (alliesObj[ac]['国番号'] == cc[i].match(/\d+/))) || ((bc == '出城' || bc == '陣' || bc == '領地') && (alliesObj[ac]['同盟ID'][ai]['戦場'] == cc[i].match(/\d+/)))) {
                  //拠点ごとのループ
                  $.each(bases, bases_loop);
                }
              }
            }
          });
        });
        return base;
      }

      //同盟員拠点表示
      function set_allyBases(allyBases, country) {
        $ally_baselist.append(
        '<div style="margin-top:0.4em;height:25em; width:100%; overflow-x:hidden; overflow-y:auto; white-space:nowrap;">' +
        '<ul id="同盟員"></ul>' +
        '</div>'
        );
        var cnt = 0,
        list = '',
        pointImg = '';
        $.each(allyBases, function(mn) {
          var tmp1 = '<li>' + mn + '<ul class="拠点分類" id="同盟員' + cnt + '" style="margin-left:1em;">';
          var tmp2 = '';
          $.each(allyBases[mn], function(bc) {
            tmp1 += allyBases[mn][bc].list[country];
            tmp2 += allyBases[mn][bc].point[country];
          });
          tmp1 += '</ul></li>';
          if (tmp2) {
            list += tmp1;
            pointImg += tmp2;
            cnt++;
          }
        });
        $ally_baselist.find('#同盟員').append(list);
        $ally_basePointImg.append(pointImg);
      }
    });
  }

  store_allies_base();
  function store_allies_base() {
    if (!location.pathname.match(/alliance\/info.php?/))
      return;
    $('.alli_family.clearfix').after('<div id="sabButton" align="center" style="margin-bottom:1em;color:white;"><input style="padding:4px;" id="store_allies_base" type="button" value="同盟員の拠点を記録"></div>');
    $('#store_allies_base').click(function(e) {
      nowLoading();
      //コンファメーション
      if (!confirm('Ajaxによる同期通信を行います。100人規模で約2分かかります。よろしいですか?')) {
        nowLoading(true);
        return;
      }
      //同盟員aタグ取得
      var $tr = $('.common_table1').find('.fs12');
      var a = $tr.find('a').clone();
      //同盟名・ID取得
      var alnm = $('.alli_inputtext.mb10').eq(1).text();
      var allid = location.href.match(/id=\d+/)[0];
      var mnbrData = {};
      var alliesObj = {};
      var fmlynm = $('.family_name p.name').text();
      var cc = {'織田家': 1,'足利家': 2,'黒田家': 2,'武田家': 3,'上杉家': 4,'徳川家': 5,'毛利家': 6,'伊達家': 7,'浅井家': 7,'北条家': 8,'今川家': 8,'長宗我部家': 9,'島津家': 10,'豊臣家': 11,'大友家': 11,'最上家': 12,'石田家': 12};
      if (localStorage.getItem('crx_alliesObj'))
        alliesObj = secureEvalJSON(localStorage.getItem('crx_alliesObj'));
      if (!alliesObj[fmlynm])
        alliesObj[fmlynm] = {'国番号': cc[fmlynm],'同盟ID': {}};
      alliesObj[fmlynm]['同盟ID'][allid] = {'名称': alnm,'同盟員': mnbrData,'戦場': '','date': Date()};
//console.log(allid,mnbrData,alliesObj,toJSON(alliesObj),(new Date(alliesObj[fmlynm]['同盟ID'][allid].date)).getTime());
      //ポスト取得
      var post = [];
      var i = 0;
      var baseNumber = 0;
      $tr.each(function() {
        var tmp = $(this).find('td').eq(6).text().match(/\S+/);
        post[i++] = tmp ? tmp[0] : '';
      });
      //自分を除く
      for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML == $('#lordName').text()) {
          a.splice(i, 1);
          post.splice(i, 1);
          break;
        }
      }
      if (!a.length)
        return alert('同盟員がいません');
      //それぞれの同盟員ページから拠点を取得
      get_mnbrData(0);
      function get_mnbrData(i) {
        $('#nowLoadingContent > p > span').text((i + 1) + '/' + a.length + '人目');
        $.ajax({
          url: a[i].href,
          cache: true,
          async: false,
          timeout: 2000,
          dataType: "text",
          success: function(html) {
            mnbrData[a[i].innerHTML] = {'ポスト': post[i],'拠点': {'本領': {},'所領': {},'開拓地': {},'領地': {},'陣': {},'出城': {}}};
            var flg = true;
            var tr = $(html).find('.common_table1.center').find('.fs14');
            for (var j = 0; j < tr.length; j++) {
              var st = '-';
              var bc = $(tr[j]).find('td').eq(0).text();
              var nm = $(tr[j]).find('a').text().match(/\S+/g);
              var bf = $(tr[j]).find('a').eq(0).attr('href').match(/c=(\d+)/)[1];
              var pp = $(tr[j]).find('td').eq(3).text();
              var ad = '/map.php?' + $(tr[j]).find('a').eq(0).attr('href').match(/land\.php\?(.+)$/)[1];
              if (flg) {
                switch (bc) {
                  case '出城':
                  case '陣':
                    alliesObj[fmlynm]['同盟ID'][allid]['戦場'] = bf;
                    flg = false;
                }
              }
              mnbrData[a[i].innerHTML]['拠点'][bc][nm[0]] = [nm[1], pp, st, ad];
              switch (bc) {
                case '本領':
                case '所領':
                case '出城':
                  baseNumber++;
              }
            }
            if (++i < a.length)
              //再帰ループ処理
              setTimeout(get_mnbrData, 1000, i);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
          }
        });
      }

      //陥落チェック
      var intvl2 = setInterval(function() {
        //最後の同盟員データが取得できるまでループ待機
        if (mnbrData[a[a.length - 1].innerHTML]) {
          clearInterval(intvl2);
          if (!confirm('陥落チェックを行いますか？100人規模で約15分かかります。')) {
            nowLoading(true);
            //console.log('陥落チェックなし',toJSON(alliesObj));
            localStorage.setItem('crx_alliesObj', toJSON(alliesObj));
            return;
          }
          //必要なデータの配列を作成
          var i = 0;
          var mn = [];
          var bc = [];
          var bn = [];
          var ad = [];
          for (var key in mnbrData) {
            for (var key2 in mnbrData[key]['拠点']) {
              switch (key2) {
                case '本領':
                case '所領':
                case '出城':
                  for (var key3 in mnbrData[key]['拠点'][key2]) {
                    mn[i] = key;
                    bc[i] = key2;
                    bn[i] = key3;
                    ad[i] = mnbrData[key]['拠点'][key2][key3][3];
                    i++;
                  }
              }
            }
          }
          //陥落チェック実行
          fallCheck(0, mn, bc, bn, ad);
        }
      }, 100);

      function fallCheck(i, mn, bc, bn, ad) {
        $('#nowLoadingContent > p > span').text((i + 1) + '/' + baseNumber + '箇所');
        $.ajax({
          url: ad[i],
          cache: false,
          async: false,
          dataType: "text",
          success: function(html) {
            var areas = $(html).find('map#mapOverlayMap > area');
            var imgs = $(html).find('div#ig_mapsAll > img').filter(function() {
              if ($(this).attr('src').indexOf('outside') < 0)
                return $(this);
            });
            var index = areas.index(areas.filter('[balloon="' + bn[i] + '"]'));
            if (index >= 0 && imgs.eq(index).attr('src').indexOf('fall_capital') > 0) {
              mnbrData[mn[i]]['拠点'][bc[i]][bn[i]][2] = '陥落中';
              if (bc[i] == '本領') {
                //console.log(i,mn[i],bc[i],bn[i],ad[i],mnbrData[mn[i]]['拠点'][bc[i]][bn[i]][2]);
                while (bc[i + 1] != '本領' && i + 1 < ad.length) {
                  i++;
                  mnbrData[mn[i]]['拠点'][bc[i]][bn[i]][2] = '陥落中';
                }
              }
            }
            if (++i < ad.length)
              //再帰ループ処理
              setTimeout(fallCheck, 1000, i, mn, bc, bn, ad);
            else {
              //console.log('陥落チェック完了',toJSON(alliesObj));
              localStorage.setItem('crx_alliesObj', toJSON(alliesObj));
              nowLoading(true);
            }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
          //console.log(textStatus);
          }
        });
      }
    });
  }

  //戦況マップ
  function all_map_status() {
    function all_map_status_mousedown() {
      $('#all_map').children().remove();
      tb_init('a.thickbox');
      var waite_TB_window =  function() {
                    var $TB_window = $('#TB_window');
                    if(!$TB_window[0]) {
                      setTimeout(waite_TB_window,1);
                    } else {
                      $TB_window.css({'position': 'absolute'});
                    }
                  }
      setTimeout(waite_TB_window,1);
      var tmp = '<div class="map_status" style="border-collapse: collapse; background: transparent; width: 100%; height: 100%; color: white;"><table id="all_map_status" style="border-spacing: 1px; background: #B1912C;"><tbody>';
      tmp += '<tr><td colspan=14><select id="target"><option value="1">織田</option><option value="2">足利/黒田</option><option value="3">武田</option><option value="4">上杉</option><option value="5">徳川</option><option value="6">毛利</option><option value="7">浅井/伊達</option><option value="8">北条/今川</option><option value="9">長宗</option><option value="10">島津</option><option value="11">大友/豊臣</option><option value="12">最上/石田</option></select><div id="lastmodify" style="padding:2px;"></div></td></tr>';
      if ( options.chapter_change === '0' ) {
      //4章の場合
      var x = new Array(7);
      x[0] = new Array('', 2, 5, 9, 14, 20, 27);
      x[1] = new Array(1, 4, 8, 13, 19, 26, 33);
      x[2] = new Array(3, 7, 12, 18, 25, 32, 38);
      x[3] = new Array(6, 11, 17, 24, 31, 37, 42);
      x[4] = new Array(10, 16, 23, 30, 36, 41, 45);
      x[5] = new Array(15, 22, 29, 35, 40, 44, 47);
      x[6] = new Array(21, 28, 34, 39, 43, 46, 48);
      tmp += '<tr><th colspan=7 style="text-align: center;">北西</th><th colspan=7 style="text-align: center;">北東</th></tr>';
      var j;
      for (i = 6; i >= 0; i--) {
        tmp += '<tr>';
        for (j = 6; j >= 0; j--) {
          tmp += '<td id="hs' + x[i][j] + '" style="cursor: pointer;text-align: center;">' + x[i][j] + '</td>';
        }
        for (j = 0; j < 7; j++) {
          tmp += '<td id="ht' + x[i][j] + '" style="cursor: pointer;text-align: center;">' + x[i][j] + '</td>';
        }
        tmp += '</tr>';
      }
      tmp += '<tr><th colspan=7 style="text-align: center;">南西</th><th colspan=7 style="text-align: center;">南東</th></tr>';
      for (i = 0; i < 7; i++) {
        tmp += '<tr>';
        for (j = 6; j >= 0; j--) {
          tmp += '<td id="ns' + x[i][j] + '" style="cursor: pointer;text-align: center;">' + x[i][j] + '</td>';
        }
        for (j = 0; j < 7; j++) {
          tmp += '<td id="nt' + x[i][j] + '" style="cursor: pointer;text-align: center;">' + x[i][j] + '</td>';
        }
        tmp += '</tr>';
      }

      } else {
      //5章の場合
      var x = new Array(6);
      x[0] = new Array('', 2, 5, 9, 14, 20);
      x[1] = new Array(1, 4, 8, 13, 19, 25);
      x[2] = new Array(3, 7, 12, 18, 24, 29);
      x[3] = new Array(6, 11, 17, 23, 28, 32);
      x[4] = new Array(10, 16, 22, 27, 31, 34);
      x[5] = new Array(15, 21, 26, 30, 33, 35);
      tmp += '<tr><th colspan=6 style="text-align: center;">北西</th><th colspan=6 style="text-align: center;">北東</th></tr>';
      var j;
      for (i = 5; i >= 0; i--) {
        tmp += '<tr>';
        for (j = 5; j >= 0; j--) {
          tmp += '<td id="hs' + x[i][j] + '" style="cursor: pointer;text-align: center;">' + x[i][j] + '</td>';
        }
        for (j = 0; j < 6; j++) {
          tmp += '<td id="ht' + x[i][j] + '" style="cursor: pointer;text-align: center;">' + x[i][j] + '</td>';
        }
        tmp += '</tr>';
      }
      tmp += '<tr><th colspan=6 style="text-align: center;">南西</th><th colspan=6 style="text-align: center;">南東</th></tr>';
      for (i = 0; i < 6; i++) {
        tmp += '<tr>';
        for (j = 5; j >= 0; j--) {
          tmp += '<td id="ns' + x[i][j] + '" style="cursor: pointer;text-align: center;">' + x[i][j] + '</td>';
        }
        for (j = 0; j < 6; j++) {
          tmp += '<td id="nt' + x[i][j] + '" style="cursor: pointer;text-align: center;">' + x[i][j] + '</td>';
        }
        tmp += '</tr>';
      }

      }

      tmp +=  '<tr><td colspan=14>【消沈<<<<font color="#ff4c4c">激戦</font>】<input id="update_map" type=button value="　　現在の戦況を確認する　　"></td></tr>' +
          '</tbody></table><input id="clear_all_map_status2" type=button value="初期化"></div>';
      $('span#all_map').append(tmp);
      if (localStorage.getItem("crx_ixakaizou_map_status")) {
        var ixa_map_status = localStorage.getItem("crx_ixakaizou_map_status");
        $('.map_status').find('#all_map_status:eq(0)').html(ixa_map_status);
        $('select#target').val(localStorage.getItem("crx_ixakaizou_map_select_country"));
      }
      $('#all_map_status').find('th, td').css('background-color', 'black');
      $('#all_map_status').find('th').css('padding', '2px');
      $('#clear_all_map_status2').click(function(e) {
        localStorage.removeItem('crx_ixakaizou_map_status');
        all_map_status_mousedown();
      });
      $("input#update_map").live("click", function() {
        $(this).attr('disabled', true).parent().parent().parent().find('td[id]').css({'color': 'white'});
        get_map_status(0, 0, 12, 28);
        localStorage.setItem("crx_ixakaizou_map_select_country", $('select#target').val());
      });
      $("td").live("click", function() {
        if ( options.chapter_change === '0' ) {
        //4章の場合
          var mp = new Array(12, 28, 28, 12, 12, 52, 36, 36, 52, 12, 12, 76, 36, 60, 60, 36, 76, 12, 12, 100, 36, 84, 60, 60, 84, 36, 100, 12, 12, 124, 36, 108, 60, 84, 84, 60, 108, 36, 124, 12, 12, 148, 36, 132, 60, 108, 84, 84, 108, 60, 132, 36, 148, 12, 36, 156, 60, 132, 84, 108, 108, 84, 132, 60, 156, 36, 60, 156, 84, 132, 108, 108, 132, 84, 156, 60, 84, 156, 108, 132, 132, 108, 156, 84, 108, 156, 132, 132, 156, 108, 132, 156, 156, 132, 156, 156);
          var t = $('select#target option:selected').val();
          var fortname = event.target.id;
          var area = fortname.substr(0, 2);
          var fortnum = fortname.substr(2);
          if (isNaN(t))
            return;
          if (isNaN(fortnum))
            return;
          if (fortnum < 1 || fortnum > 48)
            return;
        
        } else {
        //5章の場合
          var mp = new Array(12, 28, 28, 12, 12, 52, 36, 36, 52, 12, 12, 76, 36, 60, 60, 36, 76, 12, 12, 100, 36, 84, 60, 60, 84, 36, 100, 12, 12,124, 36, 108, 60, 84, 84, 60, 108, 36, 124, 12, 36, 132, 60, 108, 84, 84, 108, 60, 132, 36, 60,132, 84, 108, 108, 84, 132, 60, 84, 132, 108, 108, 132, 84, 108 ,132, 132, 108, 132, 132);
        var t = $('select#target option:selected').val();
        var fortname = event.target.id;
        var area = fortname.substr(0, 2);
        var fortnum = fortname.substr(2);
        if (isNaN(t))
          return;
        if (isNaN(fortnum))
          return;
        if (fortnum < 1 || fortnum > 35)
          return;

        }

        var x, y;
        if (area == 'ht') {
          x = mp[(fortnum - 1) * 2];
          y = mp[(fortnum - 1) * 2 + 1];
        } else if (area == 'hs') {
          x = mp[(fortnum - 1) * 2] * -1;
          y = mp[(fortnum - 1) * 2 + 1];
        } else if (area == 'ns') {
          x = mp[(fortnum - 1) * 2] * -1;
          y = mp[(fortnum - 1) * 2 + 1] * -1;
        } else if (area == 'nt') {
          x = mp[(fortnum - 1) * 2];
          y = mp[(fortnum - 1) * 2 + 1] * -1;
        } else
          return;
        var url = '/map.php?x=' + x + '&y=' + y + '&c=' + t;
        location.href = url;
      });
    }
    if (location.pathname != "/map.php" || !options.all_map_status) {
      return;
    }
    $('#mokotool').append('<div id="allMapThicbox" style="display:none;"><span id="all_map"></span></div>');
    $('#toollist').append('<li class="list_img"><a id="map_status" href="#TB_inline?height=332&amp;width=236&amp;inlineId=allMapThicbox" class="thickbox" title="戦況マップ" onclick="return false;">戦況マップ</a></li>');
    $("a#map_status").live("mousedown", all_map_status_mousedown);
  }

  //地図のパネル類の整形
  function MapPanels_move() {
    if (!options.map_butai_status && !(options.map_starx > 0) && !options.map_reg && !(options.toride_inbox && parseInt(options.toride_count) != 0))
      return;
      $('#act_battle_data').remove();
  }

  //部隊行動状況
  function map_butai_status() {
    //オプションとURLのフラグチェック
    if (location.pathname != "/map.php")
      return;
    if (!options.map_butai_status)
      return;

    //表をリセット
    if ($('#map_butai_data'))
      $('#map_butai_data').remove();
    if ($('#map_butai_status'))
      $('#map_butai_status').remove();
    var map_tool_listbox = $('#ig_mapbox').find('div.map_tool_window').children('div:eq(1)');
    var butai_status_box_btn = $('<div class="map_tool_button" name="map_butai_status">部隊状況</div>');
    $(map_tool_listbox).prepend('<div id="map_butai_status" class="map"></div>');
    $('#ig_mapbox').find('div.map_tool_window').find('div.map_tool_button_grp').prepend(butai_status_box_btn);
    
    $('#map_butai_status').append(
    '<table id="map_butai_data" style="width:100%;border-collapse:collapse;color:white;">' +
    '<thead><tr style="white-space: nowrap;"><td class="invalid_all" title="全部隊解散">全</td><th style="width:11.5em;">部隊</th><th style="width:12.5em;">状況</th><th style="width:6.5em;" class="imk_border_right">時間</th></tr></thead>' +
    '<tbody></tbody>' +
    '</table>'
    );
    var butaiTbody = $('#map_butai_data').find('tbody');
    
    for (var i = 0; i < 5; i++) {
      butaiTbody.append(
      '<tr>' +
      '<td class="invalid_single"></td>' +
      '<th class="force_area"></th>' +
      '<td class="base_area"></td>' +
      '<td class="time_area imk_border_right"></td>' +
      '</tr>'
      );
    }
    
    butaiTbody.find('th.force_area').append('<div class="fighter" /><div class="base" />');
    butaiTbody.find('td.base_area').append('<div class="fstatus" /><div class="time_loc" />');
    butaiTbody.find('td.time_area').append('<span></span>');
    
    //マップ上から部隊解散
    for (var i = 0; i < 5; i++) {
      butaiTbody.find('tr:eq(' + i + ') > td:eq(0)').attr('id', + i ).append('<div style="float: left;">解散</div>');
    }
    
    $('td.all_diss').live('click', function() {
      if (( !confirm('全部隊を解散させてよろしいですか？') ))
        return;
        $.post(
          '/card/deck.php',
          function(html) {
            var p = $(html).find('#p').attr('value');
            deck_dissolution( 0, '', '', p );
          }
        );
      return false;
    });
    
    $('td.single_diss').live('click', function() {
      var ano = $(this).attr('id'),
          unitname = $(this).closest('tr').find('div.fighter').text().replace('[', '').replace(']', '');
      if (confirm('【' + unitname +'部隊】を解散させてよろしいですか？')) {
        $.post(
          '/card/deck.php?ano=' + ano,
          function(html) {
            var Unregist = ( $(html).find('img[alt="解散"]').parent().attr('onClick') || '').match(/'.*?'/g),
                unit_assign_id = Unregist[0].replace(/'/g, ''),
                unset_unit_squad_id = Unregist[1].replace(/'/g, ''),
                p = $(html).find('input[id="p"]').val(),
                select_card_group = $(html).find('input[id="select_card_group"]').val();
            var data = {
                select_assign_no: ano,
                unit_assign_id: unit_assign_id,
                unset_unit_squad_id: unset_unit_squad_id,
                deck_mode: 'nomal',
                p: p,
                select_card_group: select_card_group
              };
            $.post(
              '/card/deck.php', data,
              function(data) {
                location.href = location.pathname;
              }
            );
          }
        );
        return false;
      }
    });

    (function mbs_table() {
      //Ajax通信フラグセット
      if (typeof (mbs_table.ajflag) == 'undefined') {
        map_butai_status.ajflag = true;
      } else if (map_butai_status.ajflag) {
        return;
      } else {
        map_butai_status.ajflag = true;
      }

      //Ajax通信・行動状況を取得
      $.ajax({
        url: '/facility/unit_status.php?dmo=all',
        cache: false,
        dataType: "text",
        success: function(html) {
          map_butai_status.ajflag = false;
          var fighter = new Array(5);
          var bomtime = new Array(5);
          var affili_base = new Array(5);
          var affiliation = new Array(5);
          var returnword = new Array(5);
          var jinbari = new Array(5);
          var sd = new Array(5);
          var rtime = new Array(5);
          var loc = new Array(5);
          var fs = new Array(5);
          var tflg = false;
          var Troops_skill;
          for (var i = 0; i < 5; i++) {
            var k = -1,
              H3_text = $(html).find('div.ig_fight_statusarea').eq(i).find('h3:eq(0)').text(),
              PanelTable = $(html).find('div.ig_fight_statusarea').eq(i).find('table.paneltable.table_fightlist');
            
            fighter[i] = H3_text.split(' （')[0];
            Troops_skill = H3_text.split(' （')[1];
            bomtime[i] = PanelTable.find('tr:eq(0)').find('td:eq(0)').find('span').text();
            affili_base[i] = PanelTable.find('tr:eq(2)').find('td:eq(0)').find('span > a').text();
            affiliation[i] = PanelTable.find('tr:eq(2)').find('td:eq(0)').find('span > a').attr('href');
            if( affiliation[i] ){
              affiliation[i] = affiliation[i].replace('land', 'map');
            }
            returnword[i] = PanelTable.find('tr:eq(1)').find('td:eq(1)').find('div').find('a').text();
            jinbari[i] = PanelTable.find('tr:eq(0)').find('td:eq(2)').find('span').text();
            sd[i] = new Date();
            
            if (bomtime[i] === '' && fighter[i] !== '' && returnword[i] === '') {
              rtime[i] = '';
              fs[i] = '待機';
              $('div.fstatus').eq(i).css('color', 'limeGreen');
              k = 1;
            } else if (bomtime[i] === '' && fighter[i] !== '' && returnword[i] === '帰還する') {
              rtime[i] = '';
              fs[i] = '加待';
              $('div.fstatus').eq(i).css('color', 'limeGreen');
              k = 1;
            } else if (bomtime[i] === '' && fighter[i] === '') {
              rtime[i] = '';
              fighter[i] = '[編成]';
              fs[i] = '';
            } else {
              tflg = true;
              var a = PanelTable.find('tr.noborder:eq(0)').find('img').get()[1].src;
              if (a.indexOf('mode_return.png') != -1) {
                fs[i] = '帰還';
                $('div.fstatus').eq(i).css('color', 'darkgray');
                if (options.return_mode == '1') {
                  k = 0;
                } else {
                  k = 1;
                }
              }
              else if (a.indexOf('mode_meeting.png') != -1) {
                fs[i] = '合流';
                $('div.fstatus').eq(i).css('color', 'cornflowerBlue');
                k = 1;
              }
              else if (a.indexOf('icon_backup.png') != -1) {
                fs[i] = '加勢';
                $('div.fstatus').eq(i).css('color', 'lightSkyBlue');
                k = 1;
              }
              else if (a.indexOf('mode_develop.png') != -1) {
                fs[i] = '開拓';
                $('div.fstatus').eq(i).css('color', 'lawnGreen');
                k = 1;
              }
              else if (a.indexOf('mode_move.png') != -1) {
                fs[i] = '国移';
                $('div.fstatus').eq(i).css('color', 'mediumpurple');
                k = 1;
              }
              else if (a.indexOf('mode_attack.png') != -1 && jinbari[i] !== '-') {
                fs[i] = '攻撃';
                $('div.fstatus').eq(i).css('color', 'orangeRed');
                k = 1;
              }
              else if (a.indexOf('mode_attack.png') != -1 && jinbari[i] === '-') {
                fs[i] = '陣張';
                $('div.fstatus').eq(i).css('color', 'mediumVioletRed');
                k = 1;
              }
              else {
                fs[i] = '探索';
                $('div.fstatus').eq(i).css('color', 'orange');
                loc[i] = PanelTable.find('tr:eq(1)').find('td:eq(2)').find('span').text();
              }
              var tmp = bomtime[i].match(/\d+/g);
              rtime[i] = '(' + tmp[6] + ':' + tmp[7] + ':' + tmp[8] + ')';
            }
            if (k > -1) {
              var area = PanelTable.find('tr:eq(2)').find('td').eq(k).find('span'),
                ahref = area.find('a').attr('href').replace('land', 'map'),
                loc_name = area.find('a').text(),
                loc_cood = area.text().match(/\(.+\)/);
                
              if( loc_name == '空き地' ){
                loc[i] = '<a href="' + ahref + '" title="' + loc_name + ' '+ loc_cood + '">' + loc_name + ' ' + loc_cood + '</a>';
              }
              else{
                loc[i] = '<a href="' + ahref + '" title="' + loc_name + ' '+ loc_cood + '">' + loc_name + '</a>';
              }
              
              if (options.panelAttack) { // 攻撃目標マークONの時
                if (fs[i].match(/待機/)) {
                  new_overOperation(ahref.replace('../', '/'), IMAGES.panel_mode_wait);
                } else if (fs[i].match(/加待/)) {
                  new_overOperation(ahref.replace('../', '/'), IMAGES.panel_backup_wait);
                } else if (fs[i].match(/帰還/)) {
                  if (options.return_mode == '1') {
                  new_overOperation(ahref.replace('../', '/'), IMAGES.icon_return);
                  } else {
                  new_overOperation(ahref.replace('../', '/'), IMAGES.panel_return);
                  }
                } else if (fs[i].match(/合流/)) {
                  new_overOperation(ahref.replace('../', '/'), IMAGES.panel_meeting);
                } else if (fs[i].match(/加勢/)) {
                  new_overOperation(ahref.replace('../', '/'), IMAGES.panel_backup);
                } else if (fs[i].match(/開拓/)) {
                  new_overOperation(ahref.replace('../', '/'), IMAGES.panel_development);
                } else if (fs[i].match(/国移/)) {
                  new_overOperation(ahref.replace('../', '/'), IMAGES.panel_mode_move);
                } else if (fs[i].match(/攻撃/)) {
                  new_overOperation(ahref.replace('../', '/'), IMAGES.panel_attack);
                } else if (fs[i].match(/陣張/)) {
                  new_overOperation(ahref.replace('../', '/'), IMAGES.panel_jinbari);
                }
              }
            }
            var butaiTbody = $('#map_butai_data').find('tbody'),
              fighterDIV = butaiTbody.find('div.fighter').eq(i),
              baseDIV = butaiTbody.find('div.base').eq(i),
              fstatusDIV = butaiTbody.find('div.fstatus').eq(i),
              timelocDIV = butaiTbody.find('div.time_loc').eq(i),
              rtimeSPAN = butaiTbody.find('span').eq(i);
            
            fighterDIV.empty();
            fighterDIV.append('<a href="/card/deck.php?ano=' + i + '">' + fighter[i] + '</a>');
            baseDIV.empty();
            if( affiliation[i] ){ 
              baseDIV.append('<a href="' + affiliation[i] + '" title="' + affili_base[i] + '">[拠]</a>');
            }
            fstatusDIV.text(fs[i]);
            rtimeSPAN.replaceWith('<span class="r_time" id="bt' + i + '">' + rtime[i] + '</span>');
            timelocDIV.empty();
            timelocDIV.append(loc[i]);
            
            if(Troops_skill){
              fighterDIV.find('a').attr('title', Troops_skill.replace('）', '') ).css('color', '#cff');
            }
            
            if(fs[i].match(/待機/)) {
              $('td.invalid_single').eq(i).addClass('single_diss');
              $('td.invalid_all').addClass('all_diss');
              $('div.fstatus').eq(i).addClass('set_unit').attr('title', '部隊の兵士編成');
              
              $('div.set_unit').click(function(){
                var ano = $(this).closest('tr').find('td.invalid_single').attr('id'),
                  url = '/card/deck.php?ano=' + ano;
                $.post( url,
                  function(html){
                    var href = $(html).find('img[alt="兵編成"]').parent().attr('href');
                    location.href = href;
                  }
                );
              });
            }
            
            if(fs[i].match(/加待/)) {
              $('div.fstatus').eq(i).addClass('aid_back').attr('title', '帰還');
              
              $('div.aid_back').click(function(){
                var ano = $(this).closest('tr').find('td.invalid_single').attr('id'),
                  search = '/card/deck.php?ano=' + ano,
                  url = location.pathname + location.search;
                $.post( search,
                  function(html){
                    var href = $(html).find('span.ig_deck_unitdata_condition > a').attr('href');
                    $.post( href,function(html){ location.href = url; });
                  }
                );
              });
            }
            
            if( fs[i].match(/攻撃/) || fs[i].match(/陣張/) || fs[i].match(/加勢/) || fs[i].match(/合流/) || fs[i].match(/開拓/) || fs[i].match(/国移/) ){
              $('div.fstatus').eq(i).addClass('cancel_back').attr('title', 'キャンセル'); 
            }
            
            $('div.cancel_back').click(function(){
              var ano = $(this).closest('tr').find('td.invalid_single').attr('id'),
                search = '/facility/unit_status.php',
                url = location.pathname + location.search;
                
              $.post( search,
                function(html){
                  var tgIMG = $(html).find('div.ig_fight_dotbox').eq(ano).find('img[alt="キャンセル"]'),
                    href = tgIMG.parent().attr('href');
                  if( tgIMG.length == 0){ alert('キャンセル出来ませんでした。'); location.href = url; }
                  else { $.post( href, function(html){ location.href = url; }); }
                }
              );
            });
          
          }
          if (tflg) {
            var timer = setInterval(function() {
              var aflg = false;
              for (var i = 0; i < 5; i++) {
                if (bomtime[i] !== '') {
                  var tmp = bomtime[i].match(/\d+/g);
                  var nd = new Date();
                  var bt_toSec = tmp[6] * 3600 + tmp[7] * 60 + tmp[8] * 1 - Math.floor((nd.getTime() - sd[i].getTime()) / 1000);
                  var hh;
                  var mm;
                  var ss;
                  if (bt_toSec <= 0) {
                    aflg = true;
                    hh = '00';
                    mm = '00';
                    ss = '00';
                  } else {
                    hh = Math.floor(bt_toSec / 3600);
                    if (hh < 10)
                      hh = "0" + hh;
                    mm = Math.floor((bt_toSec - hh * 3600) / 60);
                    if (mm < 10)
                      mm = "0" + mm;
                    ss = bt_toSec - hh * 3600 - mm * 60;
                    if (ss < 10)
                      ss = "0" + ss;
                  }
                  rtime[i] = '(' + hh + ':' + mm + ':' + ss + ')';
                  $('#map_butai_data').find('span').eq(i).replaceWith('<span class="r_time" id="bt' + i + '">' + rtime[i] + '</span>');
                }
              }
              if (aflg) {
                clearInterval(timer);
                mbs_table();
                return;
              }
            }, 1000);
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
        }
      });
    })();
  }

  //座標記録
  function user_check() {
    if ((location.pathname != "/user/") && (location.pathname != "/land.php") && (location.pathname != "/war/fight_history.php") && (location.pathname != "/facility/facility.php"))
      return;
    if (!options.map_reg)
      return;
    var map_list = {};
    if (localStorage.getItem("crx_map_list")) {
      map_list = secureEvalJSON(localStorage.getItem("crx_map_list"));
    }
    if (location.pathname == "/user/") {
      $('table.common_table1.center').find('tr').find('a:eq(1)').each(function() {
        var mname = $(this).closest('tr').find('a:eq(0)').text().trim();
        var coord = $(this).attr('href').replace('/land.php?', '');
        if (typeof (map_list[coord]) == 'undefined') {
          $(this).attr('href', $(this).attr('href').replace('land', 'map') );
          $(this).after('&nbsp;<INPUT mname="' + mname + '" coord="' + coord + '" class="reg_map" type="button" value="座標記録" />');
        }
        else {
          $(this).attr('href', $(this).attr('href').replace('land', 'map') );
          $(this).after('&nbsp;<INPUT mname="' + mname + '" coord="' + coord + '" class="remove_map" type="button" value="座標削除" style="color: fireBrick;" />');
        }
        $(this).css({'display':'inline-block', 'width':'5em'});
      });
    }
    else if (location.pathname == "/land.php") {
      var mname = $('h3:eq(0)').text().trim();
      var coord = location.search.replace('?', '');
      if (typeof (map_list[coord]) == 'undefined') {
        $('div.ig_mappanel_maindataarea').find('h3').append('&nbsp;<INPUT mname="' + mname + '" coord="' + coord + '" class="reg_map" type="button" value="座標記録" />');
      }
      else {
        $('div.ig_mappanel_maindataarea').find('h3').append('&nbsp;<INPUT mname="' + mname + '" coord="' + coord + '" class="remove_map" type="button" value="座標削除" style="color: fireBrick;" />');
      }
    }
    else if ( location.pathname == "/war/fight_history.php" && $('td:contains("現在、表示できるデータがありません。")').size() == 0 && $('td:contains("現在は合戦中ではありません。")').size() == 0 ){
      $('#ig_battle_report_mid').css({'width':'700px', 'padding':'8px 30px'});
      $('table.ig_battle_table').css('width', '100%');
        var ground = $('li.gMenu05').find('a:eq(1)').attr('href').split('=')[3];
        var cnt = 0;
        $('table.ig_battle_table > tbody').find('th:eq(3)').after('<th>座標記録</th>');
        
        $('table.ig_battle_table > tbody').find('tr').slice(1)
        .each(function(){
          var mname = $(this).find('td:eq(3) > a').text().split('　(')[0],
            source = $(this).find('td:eq(3) > a').text().split('　(')[1].replace(')', ''),
            source1 = source.split(',')[0],
            source2 = source.split(',')[1];
            coord = 'x=' + source1 + '&y=' + source2 + '&c=' + ground;
            if ( typeof(map_list[coord]) == 'undefined' ) {
              $(this).find('td:eq(3)').after('<td><INPUT mname="' + mname + '" coord="' + coord + '" class="reg_map" type="button" value="座標記録" /></td>');
            }
            else {
              $(this).find('td:eq(3)').after('<td><INPUT mname="' + mname + '" coord="' + coord + '" class="remove_map" type="button" value="座標削除" style="color: fireBrick;" /</td>');
            }
            cnt++;
          $(this).find('td:eq(3) > a').attr ('href', '/map.php?' + coord);
        });
    }
    
    $('input.reg_map').click(function(e) {
      var map_list = {};
      if (localStorage.getItem("crx_map_list")) {
        map_list = secureEvalJSON(localStorage.getItem("crx_map_list"));
      }
      var coord = $(this).attr('coord');
      var mname = $(this).attr('mname').trim();
      map_list[coord] = mname;
      localStorage.setItem("crx_map_list", toJSON(map_list));
      $(this).val('記録完了').attr('disabled', true);
    });
    $('input.remove_map').click(function(e) {
      if (localStorage.getItem("crx_map_list")) {
        var map_list = secureEvalJSON(localStorage.getItem("crx_map_list"));
        var coord = $(this).attr('coord');
        var mname = $(this).attr('mname').trim();
        if (typeof (map_list[coord]) != 'undefined') {
          delete map_list[coord];
          localStorage.setItem("crx_map_list", toJSON(map_list));
        }
      }
      $(this).val('削除完了').attr('disabled', true);
    });
  
  }

  // 本領陥落中の所領にマーク表示のチェックボタンの表示
  function fall_Judgment(){
    if(location.pathname != "/map.php")
      return;
    if(!options['MapOverlay_FallMain'])
      return;
    
    $('<input id="fall_check" type="image" src="/img/panel/fall_capital_r_l.png" title="本領陥落チェック" />')
    .css({'position': 'absolute', 'top': '115px', 'left': '550px', 'opacity':'0.9', 'display':'none'})
    .hover(function() {
      $(this).css('opacity', '1');
    }, function() {
      $(this).css('opacity', '0.9');
    })
    .appendTo('#box');
    
    var fort_red = $('#ig_mapsAll').find('img[src*="/img/panel/fort_r"]').size();
    var village_red = $('#ig_mapsAll').find('img[src*="/img/panel/village_r"]').size();
    var branch_red = $('#ig_mapsAll').find('img[src*="/img/panel/branch_r"]').size();

    if( fort_red > 0 || village_red > 0 || branch_red > 0  ) {
      $('#fall_check').show();
    }
    else {
      $('#fall_check').hide();
    }
  }

  // 本領陥落中の所領にマーク表示
  function MapOverlay_FallMain(){
    $('#fall_check').live('click',function(){
      $('#mapOverlayMap > area').each(function(){
        var tmp2 = $(this).attr('onMouseOver').match(/'.*?'/g);
        var href = $(this).attr('href').replace('land', 'map');
        if( tmp2[13].match(/\/img\/panel\/fort_r/) || tmp2[13].match(/\/img\/panel\/village_r/) || tmp2[13].match(/\/img\/panel\/branch_r/) ) {
          overlayOperationFM( tmp2, href );
        }
        
      });
    });
  }

  function overlayOperationFM( tmp2, href ){
    var searchstr = tmp2[15]+ ', '  + tmp2[16] + ', ' + tmp2[17];
    $('area[onmouseover]').each(function(){
      var str = $(this).attr('onMouseOver');
      if( str.indexOf(searchstr) >= 0 ) {
        if( $(this).attr('balloon') != undefined ) {
          var url1 = $(this).attr('onClick').match(/\/land\.php\?x=(-?\d+)&y=(-?\d+)&c=(\d+)/)[0];
          $.post( url1, 
            function (html){
              var url2 = $(html).find('div.ig_mappanel_dataarea').find('a:eq(0)').attr('href');
            $.post( url2,
              function (html){
                var table1 = $(html).find('table.common_table1.center:eq(0)'),
                  url3 = table1.find('a:eq(1)').attr('href').replace('land', 'map'),
                  nm   = table1.find('a:eq(0)').attr('href');
              $.post( url3, 
                function (html){
                  var areas = $(html).find('#mapOverlayMap > area');
                  var imgs = $(html).find('#ig_mapsAll > img')
                  .filter(function(){
                    if( $(this).attr('src').indexOf('outside') < 0 )
                    return $(this);
                  });
                  var index = areas.index(areas.filter('[onclick*="' + nm + '"]'));
                  if ( imgs.eq( index ).attr('src').indexOf('fall_capital') > 0 ) {
                    flat_overOperation(href, IMAGES.panel_during_fall);
                    return true;
                  }
                }
              );
              }
            );
            }
          );
        }
      }
    });
  }

  // 盟主城にマーク表示
  function MapOverlay_Leader(){
    if(!options.MapOverlay_Leader)
      return;
    if(location.pathname != "/map.php")
      return;
    
    $('#mapOverlayMap > area').each(function(){
      var tmp2 = $(this).attr('onMouseOver').match(/'.*?'/g);
      var href = $(this).attr('href').replace('land', 'map');
      if ( tmp2[13].match(/\/img\/panel\/capital_r_/) || tmp2[13].match(/\/img\/panel\/castle_1_r/) || tmp2[13].match(/\/img\/panel\/castle_2_r/) || tmp2[13].match(/\/img\/panel\/castle_3_r/) || tmp2[13].match(/\/img\/panel\/castle_4_r/) ) {
        overlayOperationL( tmp2, href );
      }
    });
    
  }
  function overlayOperationL( tmp2, href ){
    var searchstr = tmp2[15]+ ', '  + tmp2[16] + ', ' + tmp2[17];
    $('area[onmouseover]').each(function(){
      var str = $(this).attr('onMouseOver');
      if( str.indexOf(searchstr) >= 0 ) {
        if( $(this).attr('balloon') != undefined ) {
          var url1 = $(this).attr('onClick').match(/\/land\.php\?x=(-?\d+)&y=(-?\d+)&c=(\d+)/)[0];
          $.post( url1, function (html){
            var url2 = $(html).find('div.ig_mappanel_dataarea').find('a:eq(0)').attr('href');
            $.post( url2, function (html){
              var Ptext = $(html).find('div.pro5 > p:eq(1)').text();
              if ( Ptext.indexOf("補佐") < 0 ) {
                var solo = $(html).find('div.pro6 > p:eq(1)').text().split('人',1)[0];
                if ( Ptext.indexOf("盟主") >= 0 && solo > 1 ) {
                  flat_overOperation(href, IMAGES.panel_meisyu);
                }
                if ( Ptext.indexOf("盟主") >= 0 && solo == 1 ) {
                  flat_overOperation(href, IMAGES.panel_solo);
                }
              }
            });
          });
        }
      }
    });
  }

  //カーソル対象の拡大表示と空地戦力表示：地図に必要攻撃力表示枠の形成
  $(function(){
    if(!options['zoomMap'])
      return;
    if(location.pathname != "/map.php")
      return;
    $('div.ig_mappanel_dataarea')
    .css({'background-image': 'url("' + IMAGES.dataarea_back + '")', 'height': '86px'});
    $('div.ig_map_panel_img').css('margin-top','8px');
    $('#ixamoko_maplist3').css('top','112px');

    $('<div id="required" style="margin-left: 85px;">' +
      '<div style="float: left; margin-right: 1em; color: yellow; padding: 0;">必要攻撃力</div>' +
      '<div id="required_value"></div></div>'
    ).appendTo('div.ig_mappanel_dataarea');
  });
  //カーソル対象の拡大表示と空地戦力表示
  function zoomMap() {
    if(!options.zoomMap)
      return;
    if(location.pathname != "/map.php")
      return;
    
    $('#ixamoko_zoommap, #zoombox').remove();
    
    $('<div id="zoombox" >' +
      '<div id="zoomboxInner"><img id="timg" / ></div>' +
      '</div>'
     ).prependTo('#ig_mapbox');
    
    $('area').each(function(){
      var balloonvalue = $(this).attr('balloon').split(' ')[0];
      var territory = $(this).attr('onMouseOver').toString().match(/\/img\/panel\/territory/);//領地
      var mapdata = ( $(this).attr('onMouseOver') || '' ).split('; overOperation')[0];
        mapdata = mapdata.match(/'.*?'/g);
      var world = $('img[src$="name_war.png"]').size();
      
      if ( balloonvalue == '空き地' || territory != null ) {
      
        $(this).hover(function(){
        
        if( world > 0 ) {
          var tiles_text = mapdata[4] + mapdata[10] + mapdata[11] + mapdata[12] + mapdata[13] + mapdata[14];
            tiles_text = tiles_text.replace(/'/g, '');
          var distance = mapdata[5].replace(/'/g, '');
        }
        else if( world == 0 ) {
          var tiles_text = mapdata[5] + mapdata[7] + mapdata[8] + mapdata[9] + mapdata[10] + mapdata[11];
            tiles_text = tiles_text.replace(/'/g, '');
          
          var distance = mapdata[6].replace(/'/g, '');
        }
        
        var Required_val = $('#required_value');
        if ( options.chapter_change === '0') {
        
          if (tiles_text in POTENTIAL_LIST_4) {
            $('<div id="ixamoko_zoommap">'+ POTENTIAL_LIST_4[tiles_text] +'</div>')
            .appendTo( Required_val );
          }
        
        } else if ( options.chapter_change === '11') {

          if (tiles_text in POTENTIAL_LIST_6_6) {
            $('<div id="ixamoko_zoommap">'+ POTENTIAL_LIST_6_6[tiles_text] +'</div>')
            .appendTo( Required_val );
          }
        } else if ( options.chapter_change === '10') {

          if (tiles_text in POTENTIAL_LIST_6_5) {
            $('<div id="ixamoko_zoommap">'+ POTENTIAL_LIST_6_5[tiles_text] +'</div>')
            .appendTo( Required_val );
          }
        } else if ( options.chapter_change === '9') {

          if (tiles_text in POTENTIAL_LIST_6_4) {
            $('<div id="ixamoko_zoommap">'+ POTENTIAL_LIST_6_4[tiles_text] +'</div>')
            .appendTo( Required_val );
          }
        } else if ( options.chapter_change === '8') {

          if (tiles_text in POTENTIAL_LIST_6_3) {
            $('<div id="ixamoko_zoommap">'+ POTENTIAL_LIST_6_3[tiles_text] +'</div>')
            .appendTo( Required_val );
          }
        } else if ( options.chapter_change === '7') {

          if (tiles_text in POTENTIAL_LIST_6_2) {
            $('<div id="ixamoko_zoommap">'+ POTENTIAL_LIST_6_2[tiles_text] +'</div>')
            .appendTo( Required_val );
          }
        } else if ( options.chapter_change === '6') {

          if (tiles_text in POTENTIAL_LIST_6_1) {
            $('<div id="ixamoko_zoommap">'+ POTENTIAL_LIST_6_1[tiles_text] +'</div>')
            .appendTo( Required_val );
          }
        } else if ( options.chapter_change === '5') {
        
          if (tiles_text in POTENTIAL_LIST_5_5) {
            $('<div id="ixamoko_zoommap">'+ POTENTIAL_LIST_5_5[tiles_text] +'</div>')
            .appendTo( Required_val );
            
          }
        } else if ( options.chapter_change === '4') {
        
          if (tiles_text in POTENTIAL_LIST_5_4) {
            $('<div id="ixamoko_zoommap">'+ POTENTIAL_LIST_5_4[tiles_text] +'</div>')
            .appendTo( Required_val );
            
          }
        } else if ( options.chapter_change === '3') {
        
          if (tiles_text in POTENTIAL_LIST_5_3) {
            $('<div id="ixamoko_zoommap">'+ POTENTIAL_LIST_5_3[tiles_text] +'</div>')
            .appendTo( Required_val );
            
          }
        } else if ( options.chapter_change === '2') {
        
          if (tiles_text in POTENTIAL_LIST_5_2) {
            $('<div id="ixamoko_zoommap">'+ POTENTIAL_LIST_5_2[tiles_text] +'</div>')
            .appendTo( Required_val );
            
          }
        } else if ( options.chapter_change === '1') {
        
          if (tiles_text in POTENTIAL_LIST_5_1) {
            $('<div id="ixamoko_zoommap">'+ POTENTIAL_LIST_5_1[tiles_text] +'</div>')
            .appendTo( Required_val );
            
          }
        }
        
        //有効兵科の色付け
        $('#ixamoko_zoommap li:contains("◎")').css('color','orange');
        
        if (distance > 10) {
          $('#ixamoko_zoommap > ul').append('<li id="decline" style="color: orangeRed;width: 8em;">※攻撃力減少有</li>');
        }
        
        },
          function(){
            $('#ixamoko_zoommap').remove();
        });
      
      } else {
        $(this).hover(function(){
          var left = $('img#rollover').css('left');
          var top = $('img#rollover').css('top');
          
          $('img[class^="mapAll"]').each(function(){
            var t_left = $(this).css('left');
            var t_top = $(this).css('top');
            var w_top = new Number(t_top.replace('px',''));
            w_top = w_top-2;
            w_top = w_top+'px';
            
            if( ( (left == t_left) && (top==t_top) ) || ( (left == t_left) && (top == w_top) ) ) {
              $('#timg').attr('src', $(this).attr('src') ).css('width','100%');
              return false;
            }
          });
        },
        function(){
            $('#timg').attr('src', '' ).css('width','0');
        });
      }
      
    });
  }


  // 座標記録にマーク ※座標記録と連動
  function record_mark(){
    if (location.pathname != "/map.php")
      return;
    if (!options.map_reg)
      return;
    $('#ixamoko_maplist1').each(function() {
      $('#reg_box').find('tr').each(function() {
        var coord = $(this).attr('coord');
        var href = coord;
        new_overOperation(href, IMAGES.panel_record);
        return true;
      });
    });
    
  }

  //攻撃目標をマーク表示
  function panelAttack() {
    if (!options.panelAttack)
      return;
    if (location.pathname != "/map.php")
      return;
    if (options.map_butai_status) {
      var fs = $('#map_butai_data > tbody').find('div.fstatus');
      var ahref = $('#map_butai_data > tbody').find('div.time_loc').find('a');
      for (var i = 0; i < fs.length; i++) {
         if (fs[i].innerText.match(/待機/)) {
          new_overOperation(ahref[i].href.replace(/^.+?\/map/, '/map'), IMAGES.panel_mode_wait);
        } else if (fs[i].innerText.match(/加待/)) {
          new_overOperation(ahref[i].href.replace(/^.+?\/map/, '/map'), IMAGES.panel_backup_wait);
        } else if (fs[i].innerText.match(/帰還/)) {
          if (options.state_change) {
          new_overOperation(ahref[i].href.replace(/^.+?\/map/, '/map'), IMAGES.icon_return);
          } else {
          new_overOperation(ahref[i].href.replace(/^.+?\/map/, '/map'), IMAGES.panel_return);
          }
        } else if (fs[i].innerText.match(/合流/)) {
          new_overOperation(ahref[i].href.replace(/^.+?\/map/, '/map'), IMAGES.panel_meeting);
        } else if (fs[i].innerText.match(/加勢/)) {
          new_overOperation(ahref[i].href.replace(/^.+?\/map/, '/map'), IMAGES.panel_backup);
        } else if (fs[i].innerText.match(/開拓/)) {
          new_overOperation(ahref[i].href.replace(/^.+?\/map/, '/map'), IMAGES.panel_development);
        } else if (fs[i].innerText.match(/国移/)) {
          new_overOperation(ahref[i].href.replace(/^.+?\/map/, '/map'), IMAGES.panel_mode_move);
        } else if (fs[i].innerText.match(/攻撃/)) {
          new_overOperation(ahref[i].href.replace(/^.+?\/map/, '/map'), IMAGES.panel_attack);
        } else if (fs[i].innerText.match(/陣張/)) {
          new_overOperation(ahref[i].href.replace(/^.+?\/map/, '/map'), IMAGES.panel_jinbari);
        }
      }
    } 
    else {
      $.ajax({
        url: '/facility/unit_status.php?dmo=all',
        cache: false,
        dataType: "text",
        success: function(html) {
          $(html).find('div.ig_fight_statusarea').each(function() {
            $(this).find('img').each(function() {
              var href;
              if ($(this).attr('src').indexOf('mode_attack.png') > 0) {
                href = $(this).closest('tbody').find('td.td_bggray:eq(1)').find('a:eq(0)').attr('href');
                href = href.replace('../map', '');
                new_overOperation(href, IMAGES.panel_attack);
                return false;
              }
              if ($(this).attr('src').indexOf('mode_meeting.png') > 0) {
                href = $(this).closest('tbody').find('td.td_bggray:eq(1)').find('a:eq(0)').attr('href');
                href = href.replace('..', '');
                new_overOperation(href, IMAGES.panel_meeting);
                return false;
              }
              if ($(this).attr('src').indexOf('icon_backup.png') > 0) {
                href = $(this).closest('tbody').find('td.td_bggray:eq(1)').find('a:eq(0)').attr('href');
                href = href.replace('..', '');
                new_overOperation(href, IMAGES.panel_backup);
                return false;
              }
              if ($(this).attr('src').indexOf('mode_develop.png') > 0) {
                href = $(this).closest('tbody').find('td.td_bggray:eq(1)').find('a:eq(0)').attr('href');
                href = href.replace('..', '');
                new_overOperation(href, IMAGES.panel_development);
                return false;
              }
              if ($(this).attr('src').indexOf('mode_move.png') > 0) {
                href = $(this).closest('tbody').find('td.td_bggray:eq(1)').find('a:eq(0)').attr('href');
                href = href.replace('..', '');
                new_overOperation(href, IMAGES.panel_mode_move);
                return false;
              }
              if ($(this).attr('src').indexOf('icon_back.png') > 0) {
                if (options.state_change) {
                  href = $(this).closest('tbody').find('td.td_bggray:eq(1)').find('a:eq(0)').attr('href');
                  href = href.replace('..', '');
                  new_overOperation(href, IMAGES.icon_return);
                  return false;
                }
                else {
                  href = $(this).closest('tbody').find('td.td_bggray:eq(1)').find('a:eq(0)').attr('href');
                  href = href.replace('..', '');
                  new_overOperation(href, IMAGES.panel_return);
                  return false;
                }
              }
            });
          });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
        }
      });
    }
  }

  // 敵襲マークを表示
  function enemy_mark(){
    if (!options.panelAttack)
      return;
    if (location.pathname != "/map.php")
      return;
    $.post('/facility/unit_status.php?dmo=enemy', function(html) {
      var Statusarea = $(html).find('.ig_fight_statusarea');
      var Raid = Statusarea.size();
      
      if( Raid > 0 ){
      
      Statusarea.each(function() {
        $(this).find('td.td_bggray:eq(0)').each(function() {
          var href = $(this).find('a:eq(0)').attr('href').replace('../land', '/map');
          new_overOperation(href, IMAGES.panel_enemy);// 出陣拠点
          return false;
        });
        $(this).find('td.td_bggray:eq(1)').each(function() {
          var href2 = $(this).find('a:eq(0)').attr('href').replace('../land', '/map');
          new_overOperation(href2, IMAGES.mode_enemy);// 着弾拠点
          return false;
        });
      });
      
      }
    });
  }

  // 選択中の拠点をマーク表示
  function now_select_point(){
    if (!options.now_select_point)
      return;
    if (location.pathname != "/map.php")
      return;
    $.post(
      '/user/',
      function(html) {
        var pointname = $('#sideboxBottom').find('div.basename').find('li.on').text();
        var searchTR = $(html).find('div.common_box3bottom').find('table.common_table1.center').find('tr:contains("' + pointname + '")');
        var pointhref = searchTR.find('a:eq(1)').attr('href').replace('land', 'map');
        new_overOperation(pointhref, IMAGES.panel_select);
        return false;
      }
    );
  }

  function new_overOperation( url, img ) {
    var marktile = $('area[onclick*="' + url + '"]');
    if ( marktile.attr('balloon') !== undefined ) {
      var imglen = $('#mapOverlayMap').find('area').length,
        i_index = marktile.attr('onClick').match(/'.*?'/g),
        i_index = i_index[0].replace(/'/g, ''),
        mapsAllimg = $('#ig_mapsAll').find('img[class="' + i_index + '"]');
        
      if( imglen == 400 ) {
        var Marktop = parseInt( mapsAllimg.css('top') ) -2;
      }
      else {
        var Marktop = mapsAllimg.css('top');
      }
      
      var Markleft = mapsAllimg.css('left'),
        Markindex = mapsAllimg.css('z-index'),
        
        tmp = $('img#rollover').clone()
          .removeAttr('id')
          .attr('src', img )
          .css({'left':Markleft, 'top':Marktop, 'z-index':Markindex});
      $('map#mapOverlayMap').append(tmp);
    }
  
  }

  function new_overOperation2( alt_name, url, img ) {
    var marktile = $('area[onclick*="' + url + '"]');
    if ( marktile.attr('balloon') !== undefined ) {
      var imglen = $('#mapOverlayMap').find('area').length,
        i_index = marktile.attr('onClick').match(/'.*?'/g),
        i_index = i_index[0].replace(/'/g, ''),
        mapsAllimg = $('#ig_mapsAll').find('img[class="' + i_index + '"]');
      
      if( imglen == 400 ) {
        var Marktop = parseInt( mapsAllimg.css('top') ) -2;
      }
      else {
        var Marktop = mapsAllimg.css('top');
      }
      
      var Markleft = mapsAllimg.css('left'),
        Markindex = mapsAllimg.css('z-index'),
        tmp = $('img#rollover').clone()
          .removeAttr('id')
          .attr('src', img )
          .attr('alt', alt_name )
          .css({'left':Markleft, 'top':Marktop, 'z-index':Markindex});
      $('#mapOverlayMap').append(tmp);
    }
  }

  function flat_overOperation( url, img ) {
    var marktile = $('area[onclick*="' + url + '"]');
    if ( marktile.attr('balloon') !== undefined ) {
      var imglen = $('#mapOverlayMap').find('area').length,
        i_index = marktile.attr('onClick').match(/'.*?'/g),
        i_index = i_index[0].replace(/'/g, ''),
        mapsAllimg = $('#ig_mapsAll').find('img[class="' + i_index + '"]');
        
      if( imglen == 400 ) {
        var Marktop = parseInt( mapsAllimg.css('top') ) -2;
      }
      else {
        var Marktop = mapsAllimg.css('top');
      }
      
      var Markleft = mapsAllimg.css('left'),
        tmp = $('img#rollover').clone()
          .removeAttr('id')
          .attr('src', img )
          .css({'left':Markleft, 'top':Marktop});
      $('map#mapOverlayMap').append(tmp);
    }
  }

//////////////////////
//施設：
//////////////////////
  $(function () {
    if ( location.pathname != "/facility/facility.php")
      return;
    $('<select id="menu_num">' +
      '<option value="">資源数を選択</option>' +
      '<option value="1000">1000</option>' +
      '<option value="2000">2000</option>' +
      '<option value="3000">3000</option>' +
      '<option value="4000">4000</option>' +
      '<option value="5000">5000</option>' +
      '<option value="6000">6000</option>' +
      '<option value="7000">7000</option>' +
      '<option value="8000">8000</option>' +
      '<option value="9000">9000</option>' +
      '<option value="10000">10000</option>' +
      '<option value="15000">15000</option>' +
      '<option value="20000">20000</option>' +
      '<option value="25000">25000</option>' +
      '<option value="30000">30000</option>' +
      '</select>'
    ).change(function(){
      var INPUTtc = $('input#tc');
      INPUTtc.val( $(this).val() );
    }).appendTo( $('table.paneltable_blue.table_tile_market').find('td:eq(1)') );
    $('table.table_tile_market').css({'width':'385px', 'margin':'0 auto 10px'});
  });
  //下位生産施設を非表示
  function hide_facility() {
    if (!options.hide_facility || location.pathname !== "/facility/select_facility.php") {
      return;
    }
    $('div#ig_mainareaboxInner').find('div.ig_tilesection_mid').find('div').each(function() {
      if ($(this).attr('class') === 'ig_tilesection_innermid') {
        var fname = $(this).find('a').attr('innerText');
        if (fname === '水田' || fname === '機織り場' || fname === '木工所' || fname === 'たたら場') {
          $(this).prev().remove();
          $(this).next().remove();
          $(this).remove();
        }
      }
    });
  }

  //施設建築に足りている資源のテキスト色変更
  function facilityStuffTextColor() {
    if (options.facilityStuffTextColor && (location.pathname === '/facility/facility.php' || location.pathname === '/facility/castle.php')) {
      $('#ig_mainareaboxInner').find('table.paneltable.table_tile tr:contains("レベル") td div[class^="icon_"]').each(function(i,o) {
        if (parseInt(o.innerText.match(/\d+/)[0], 10) <= parseInt($('#status_left').find('span.normal').eq(i).text(), 10)) {
          $(o).css('color','lime');
        }
      });
    }
  }

  function facility_check() {
    if (location.pathname != "/facility/facility.php")
      return;
    var fname = $('DIV.ig_tilesection_detailarea > H3:eq(0) > A').text();
    var wood, stone, iron, rice, key;
    var soldiertype = {};
    if (options.def_kind_soldier[1]) {
      soldiertype['足軽'] = [9, 14, 5, 5];
    }
    if (options.def_kind_soldier[2]) {
      soldiertype['長槍足軽'] = [14, 20, 7, 8];
    }
    if (options.def_kind_soldier[3]) {
      soldiertype['武士'] = [18, 27, 9, 11];
    }
    if (options.def_kind_soldier[4]) {
      soldiertype['弓足軽'] = [14, 9, 5, 5];
    }
    if (options.def_kind_soldier[5]) {
      soldiertype['長弓兵'] = [20, 14, 8, 7];
    }
    if (options.def_kind_soldier[6]) {
      soldiertype['弓騎馬'] = [27, 18, 11, 9];
    }
    if (options.def_kind_soldier[7]) {
      soldiertype['騎馬兵'] = [5, 5, 9, 14];
    }
    if (options.def_kind_soldier[8]) {
      soldiertype['精鋭騎馬'] = [7, 8, 14, 20];
    }
    if (options.def_kind_soldier[9]) {
      soldiertype['赤備え'] = [9, 11, 18, 27];
    }
    if (options.def_kind_soldier[10]) {
      soldiertype['鉄砲足軽'] = [72, 67, 90, 75];
    }
    if (options.def_kind_soldier[11]) {
      soldiertype['騎馬鉄砲'] = [67, 90, 72, 75];
    }
    if (options.def_kind_soldier[12]) {
      soldiertype['焙烙火矢'] = [77, 77, 77, 77];	//仮)焙烙火矢不明
    }
    if (options.def_kind_soldier[13]) {
      soldiertype['破城鎚'] = [14, 7, 11, 9];
    }
    if (options.def_kind_soldier[14]) {
      soldiertype['攻城櫓'] = [22, 16, 11, 14];
    }
    if (options.def_kind_soldier[15]) {
      soldiertype['大筒兵'] = [69, 81, 108, 45];
    }

    if ((options.market_desc) && (fname == '市')) {
      var top = $('div.ig_decksection_top'),
          mid = $('div.ig_tilesection_mid:eq(0)'),
          bottom = $('div.ig_tilesection_bottom:eq(0)'),
          newtop = $('div.ig_tilesection_bottom:eq(1)');
      newtop.after(top);
      top.after(mid);
      mid.after(bottom);
    }

    if ((fname == '厩舎') || (fname == '足軽兵舎') || (fname == '弓兵舎') || (fname == '兵器鍛冶')) {
      wood = parseInt($('#wood').text(), 10);
      stone = parseInt($('#stone').text(), 10);
      iron = parseInt($('#iron').text(), 10);
      rice = parseInt($('#rice').text(), 10);

      //上位兵を上段に表示
      if (options.desc_soldier) {
        var line = [];
        var count = 0;
        var $targetLoop = $('DIV.ig_tilesection_mid:eq(1) > DIV.ig_tilesection_innermid');
        if ($targetLoop.get().length > 0) {
          $targetLoop.each(function() {
            line[count++] = $(this);
          });

          $('DIV.ig_tilesection_mid:eq(1) > DIV.ig_tilesection_innertop').each(function() {
            $(this).after(line[--count]);
          });
        } else {
          $('DIV.ig_tilesection_mid:eq(1) > DIV.ig_tilesection_innermid2').each(function() {
            line[count++] = $(this);
          });

          $('DIV.ig_tilesection_mid:eq(1) > DIV.ig_tilesection_innertop2').each(function() {
            $(this).after(line[--count]);
          });
        }
      }

      $(function() {
        if (location.pathname != "/facility/facility.php")
          return;
          $('table.paneltable.table_tile').find('label').next('span').css('margin', '0 2px');
          $('form[name="createUnitForm"]').find('span:eq(0)').css('white-space', 'nowrap');
          $('input[id^="unit_value"]').each(function() {
            $('<select class="set_num" style="margin-right: 5px;">' +
              '<option value="" selected>兵数選択</option>' +
              '<option value="100">100</option>' +
              '<option value="200">200</option>' +
              '<option value="300">300</option>' +
              '<option value="400">400</option>' +
              '<option value="500">500</option>' +
              '<option value="600">600</option>' +
              '<option value="700">700</option>' +
              '<option value="800">800</option>' +
              '<option value="900">900</option>' +
              '<option value="1000">1000</option>' +
              '<option value="1200">1200</option>' +
              '<option value="1500">1500</option>' +
              '<option value="2000">2000</option>' +
              '<option value="2500">2500</option>' +
              '<option value="3000">3000</option>' +
            '</select>'
          ).insertBefore( $(this).closest('span').find('input[name="send"]') );
            $('select.set_num').change(function() {
              $(this).closest('span').find('input[id^="unit_value"]').val( $(this).val() );
            });
          });
      });

      //最大作成可能兵数リンク設置、デフォルトの訓練数、デフォルトの兵種のみを表示
      if ((options.facility_maxsoldier) || (options.def_num_of_soldier != '0')) {
        $('DIV.ig_tilesection_detailarea > H3').each(function() {
          var soltype = $(this).text().match(/\[([^\]]+)\]/)[1];
          //console.log(soltype);
          //デフォルトの訓練数をセット
          if (soltype == fname) { //操作無し
          } else if (typeof (soldiertype[soltype]) != 'undefined') {
            var $parent = $(this).parent();
            var maxsol = 150000;
            if ((wood / soldiertype[soltype][0]) < maxsol)
              maxsol = Math.floor(wood / soldiertype[soltype][0]);
            if ((stone / soldiertype[soltype][1]) < maxsol)
              maxsol = Math.floor(stone / soldiertype[soltype][1]);
            if ((iron / soldiertype[soltype][2]) < maxsol)
              maxsol = Math.floor(iron / soldiertype[soltype][2]);
            if ((rice / soldiertype[soltype][3]) < maxsol)
              maxsol = Math.floor(rice / soldiertype[soltype][3]);
            if (maxsol >= 100) {
              if (options.def_num_of_soldier != '0') {
                if (parseInt(options.def_num_of_soldier, 10, 10) > maxsol) {
                  $parent.find('input[id^="unit_value"]').val('' + maxsol);
                } else {
                  $parent.find('input[id^="unit_value"]').val(options.def_num_of_soldier);
                }
              }
              //最大作成可能兵数リンク設置
              if (options.facility_maxsoldier) {
                $parent.find('table:eq(1)').find('th:eq(0), th:eq(1)').width('80px');
                $parent.find('label').next().hide();
                $parent.find('label').next().after('<span value="' + maxsol + '" style="cursor:pointer;color: #8C8; margin: 0 2px;" class="ixamoko_maxsol">(' + maxsol + ')</span>');
                $('span.ixamoko_maxsol').click(function(e) {
                  $(this).parent().find('input[id^="unit_value"]').val( $(this).attr('value') );
                });
                $.post(
                  '/facility/unit_list.php',
                  function(html){
                    var source = $(html).find('div.ig_solder_commentarea:first').text(),
                        capacity = source.split(' / ')[1],
                        waits = source.split(' / ')[0],
                        vacancy = capacity - waits;
                        
                    $('form[name="createUnitForm"]').each(function() {
                      var ObjectSpan = $(this).find('span:eq(1)');
                      if(ObjectSpan.length){
                        var ObjectValue = ObjectSpan.attr('onClick'),
                            ObjectValue = ObjectValue.match(/'.*?'/g)[1].replace(/'/g, '');
                      }
                      var maxsol = $(this).find('span.ixamoko_maxsol').attr('value');
                      
                      if( vacancy <= maxsol ){
                        $(this).find('label').next().show();
                        $(this).find('span.ixamoko_maxsol').css('text-decoration', 'line-through')
                        .attr('value', ObjectValue );
                      }
                      
                    });
                  }
                );
              }
            }
          //デフォルトの兵種のみを表示
          } else if (options.hide_soldier) {
            var tilesection = $(this).closest('div.ig_tilesection_innerborder');
            $(this).addClass('view').css({'margin-bottom':'5px', 'cursor':'pointer'});
            $(this).css('display', 'inline-block');
            $(this).parent().find('p, table').hide();
            tilesection.find('div:eq(0)').hide();
            tilesection.css({'margin':'0', 'border':'none', 'padding':'0'});
          }
        });
        
        $('h3.view')
          .toggle(
            function() {
              var tilesection = $(this).closest('div.ig_tilesection_innerborder');
              $(this).css('margin-bottom', '');
              $(this).parent().find('p, table').show();
              tilesection.find('div:eq(0)').show();
              tilesection.css({'margin':'', 'border':'', 'padding':''});
            },
            function() {
              var tilesection = $(this).closest('div.ig_tilesection_innerborder');
              $(this).css('margin-bottom', '5px');
              $(this).parent().find('p, table').hide();
              tilesection.find('div:eq(0)').hide();
              tilesection.css({'margin':'0', 'border':'none', 'padding':'0'});
            }
          );
        
      }
    //取引後最大作成兵数表示
    } else if ((options.market_maxsoldier) && (fname == '市')) {
      wood = parseInt($('#wood').text(), 10);
      stone = parseInt($('#stone').text(), 10);
      iron = parseInt($('#iron').text(), 10);
      rice = parseInt($('#rice').text(), 10);
      var rate = parseInt($('DIV.ig_tilesection_detailarea IMG[alt="取引相場"]').parent().next().find('SPAN').text().substring(0, 2), 10) / 100;
      var all = new Array(wood, stone, iron, rice);
      var tmp = '<TABLE style="background-color:#F3F2DE;" class="common_table1 center" width="100%"><TR><TH>複合</TH><TH>兵士</TH><TH>不足</TH><TH>過剰</TH><TH>作成可能</TH></TR>';
      for (key in soldiertype) {
        var moko = maxsoldier(wood, stone, iron, rice, soldiertype[key][0], soldiertype[key][1], soldiertype[key][2], soldiertype[key][3], rate);
        if (moko.maxsoldier < 100) {
          tmp += '<TR><TD><input type="checkbox" id="' + key + '"></TD><TD>' + key + '</TD><TD>-</TD><TD>-</TD><TD>100未満</TD></TR>';
        } else {
          tmp += '<TR><TD><input type="checkbox" id="' + key + '"></TD><TD>' + key + '</TD><TD>' + moko.shortage + '</TD><TD>' + moko.excess + '</TD><TD>' + moko.maxsoldier + '</TD></TR>';
        }
      }
      tmp += '</br><TR id="maxsol_total"><TH colspan=2><div id="merge">-</div></TH><TD id="shortage">-</TD><TD id="excess">-</TD><TD id="maxsoldier">-</TD></TR>';
      tmp += '</TABLE>';
      $('div.ig_tilesection_btnarea').after(tmp);

      //チェック兵種をストレージから取得、複合の最大兵数を表示
      for (key in soldiertype) {
        if (localStorage.getItem('crx_checked_soldier' + key))
          $('input#' + key).attr('checked', secureEvalJSON(localStorage.getItem('crx_checked_soldier' + key)));
      }
      combo_soldier();
      for (key in soldiertype) {
        $('input#' + key).click(combo_soldier);
      }

      //ホバーで色変、クリックで取引資源と数をセット
      //不足
      $('SPAN.ixamoko_short').hover(function() {
        $(this).css({'cursor': 'default', 'background-color': '#F9DEA1', 'text-decoration': 'underline'});
      }, function() {
        $(this).css({'background-color': '', 'text-decoration': ''});
      }).live('click',function(e) {
        $('#select2').val($(this).attr('type')).trigger('change');
        var tc0 = $('#tc').val() * 1;
        var tc1 = $(this).attr('value') * 1;
        //console.log(tc0,tc1);
        if (!tc0 || tc0 > tc1) {
          tc1 = Math.floor(tc1/100) * 100;
          $('#tc').val(tc1);
        }
      });
      //過剰
      $('SPAN.ixamoko_excess').hover(function() {
        $(this).css({'cursor': 'default', 'background-color': '#F9DEA1', 'text-decoration': 'underline'});
      }, function() {
        $(this).css({'background-color': '', 'text-decoration': ''});
      }).live('click',function(e) {
        $('#select').val($(this).attr('type')).trigger('change');
        var tc0 = $('#tc').val() * 1;
        var tc1 = $(this).attr('value') * 1;
        //console.log(tc0,tc1);
        if (!tc0 || tc0 > tc1) {
          tc1 = Math.floor(tc1/100) * 100;
          $('#tc').val(tc1);
        }
      });

      //取引資源選択をラジオボタン化
      if (options.market_radiobutton) (function () {
        var $select = [$('#select').hide(), $('#select2').hide()],
            i;
        function linkage1 (e) {
          $(this).nextAll('label').find('[value="'+$(this).val()+'"]').attr('checked','checked');
        }
        function linkage2 (e) {
          $(this).parent().prevAll('select').val($(this).val());
        }
        for (i=0;i<2;i++) {
          $select[i].parent().append(
            '<label><input type="radio" name="selectstuff'+i+'" value="101">木</label>'+
            '<label><input type="radio" name="selectstuff'+i+'" value="102">綿</label>'+
            '<label><input type="radio" name="selectstuff'+i+'" value="103">鉄</label>'+
            '<label><input type="radio" name="selectstuff'+i+'" value="104">糧</label>'
          ).children().css({'margin-left':'1em','padding-right':'1em'}).children().change(linkage2);
        }
        for (i=0;i<2;i++) {
          $select[i].live('change',linkage1);
        }
      })();
    }

    //複合の最大兵数表示
    function combo_soldier() {
      var tmp2 = '';
      var wood2 = 0;
      var stone2 = 0;
      var iron2 = 0;
      var rice2 = 0;
      var checker = 0;
      for (var key in soldiertype) {
        localStorage.setItem('crx_checked_soldier' + key, toJSON($('input#' + key).attr('checked')));
        if ($('input#' + key).attr('checked')) {
          checker++;
          tmp2 += '<div>' + key + '</div>';
          wood2 += soldiertype[key][0];
          stone2 += soldiertype[key][1];
          iron2 += soldiertype[key][2];
          rice2 += soldiertype[key][3];
        }
      }
      var moko = maxsoldier(wood, stone, iron, rice, wood2, stone2, iron2, rice2, rate);
      if (checker === 0) {
        tmp2 = '-';
        moko.shortage = '-';
        moko.excess = '-';
        moko.maxsoldier = '-';
      }
      $('div#merge').replaceWith('<div id="merge">' + tmp2 + '</div>');
      $('td#shortage').replaceWith('<TD id="shortage">' + moko.shortage + '</TD>');
      $('td#excess').replaceWith('<TD id="excess">' + moko.excess + '</TD>');
      $('td#maxsoldier').replaceWith('<TD id="maxsoldier">' + moko.maxsoldier + '</TD');

      $('#shortage > span.ixamoko_short').hover(function() {
        $(this).css({'cursor': 'default', 'background-color': '#F9DEA1', 'text-decoration': 'underline'});
      }, function() {
        $(this).css({'background-color': '', 'text-decoration': ''});
      }).click(function(e) {
        $('#select2').val($(this).attr('type'));
        var tc0 = $('#tc').val() * 1;
        var tc1 = $(this).attr('value') * 1;
        //console.log(tc0,tc1);
        if (!tc0 || tc0 > tc1) {
          tc1 = Math.floor(tc1/100) * 100;
          $('#tc').val(tc1);
        }
      });
      $('#excess > span.ixamoko_excess').hover(function() {
        $(this).css({'cursor': 'default', 'background-color': '#F9DEA1', 'text-decoration': 'underline'});
      }, function() {
        $(this).css({'background-color': '', 'text-decoration': ''});
      }).click(function(e) {
        $('#select').val($(this).attr('type'));
        var tc0 = $('#tc').val() * 1;
        var tc1 = $(this).attr('value') * 1;
        //console.log(tc0,tc1);
        if (!tc0 || tc0 > tc1) {
          tc1 = Math.floor(tc1/100) * 100;
          $('#tc').val(tc1);
        }
      });
    }

    function maxsoldier(a, b, c, d, aa, bb, cc, dd, rate) {
      var cmax = 1500000;
      if ((a / aa) < cmax)
        cmax = Math.floor(a / aa);
      if ((b / bb) < cmax)
        cmax = Math.floor(b / bb);
      if ((c / cc) < cmax)
        cmax = Math.floor(c / cc);
      if ((d / dd) < cmax)
        cmax = Math.floor(d / dd);
      var i;
      for (i = (cmax + 1); i < 15000; ++i) {
        var shortage = 0;
        var excess = 0;
        if ((i * aa) > a) {
          shortage += i * aa - a;
        } else {
          excess += a - i * aa;
        }
        if ((i * bb) > b) {
          shortage += i * bb - b;
        } else {
          excess += b - i * bb;
        }
        if ((i * cc) > c) {
          shortage += i * cc - c;
        } else {
          excess += c - i * cc;
        }
        if ((i * dd) > d) {
          shortage += i * dd - d;
        } else {
          excess += d - i * dd;
        }
        if (excess * rate < shortage)
          break;
      }
      --i;
      var tmp1 = '[必要 ';
      var tmp1c = 0;
      var tmp1t = null;
      var tmp2 = '[余剰 ';
      var tmpx;
      if ((i * aa) < a) {
        tmpx = (a - i * aa);
        tmp2 += ' <SPAN class="ixamoko_excess" type="101" value="' + tmpx + '">木: ' + tmpx + '</SPAN>';
      } else {
        tmpx = Math.ceil((i * aa - a) / rate);
        tmp1 += ' <SPAN class="ixamoko_short" type="101" value="' + tmpx + '">木: ' + tmpx + '</SPAN>';
        tmp1c++;
        tmp1t = 101;
      }
      if ((i * bb) < b) {
        tmpx = (b - i * bb);
        tmp2 += ' <SPAN class="ixamoko_excess" type="102" value="' + tmpx + '">綿: ' + tmpx + '</SPAN>';
      } else {
        tmpx = Math.ceil((i * bb - b) / rate);
        tmp1 += ' <SPAN class="ixamoko_short" type="102" value="' + tmpx + '">綿: ' + tmpx + '</SPAN>';
        tmp1c++;
        tmp1t = 102;
      }
      if ((i * cc) < c) {
        tmpx = (c - i * cc);
        tmp2 += ' <SPAN class="ixamoko_excess" type="103" value="' + tmpx + '">鉄: ' + tmpx + '</SPAN>';
      } else {
        tmpx = Math.ceil((i * cc - c) / rate);
        tmp1 += ' <SPAN class="ixamoko_short" type="103" value="' + tmpx + '">鉄: ' + tmpx + '</SPAN>';
        tmp1c++;
        tmp1t = 103;
      }
      if ((i * dd) < d) {
        tmpx = (d - i * dd);
        tmp2 += ' <SPAN class="ixamoko_excess" type="104" value="' + tmpx + '">糧: ' + tmpx + '</SPAN>';
      } else {
        tmpx = Math.ceil((i * dd - d) / rate);
        tmp1 += ' <SPAN class="ixamoko_short" type="104" value="' + tmpx + '">糧: ' + tmpx + '</SPAN>';
        tmp1c++;
        tmp1t = 104;
      }
      tmp1 += ']';
      tmp2 += ']';
      var moko = {
        shortage: tmp1,
        excess: tmp2,
        maxsoldier: i,
        shortc: tmp1c,
        shortt: tmp1t
      };
      return moko;
    }
    after_tohankaku();
  }

  //小分け生産
  function prod_with_smalllot() {
    if (options.prod_with_smalllot <= 1)
      return;
    if (location.pathname != "/facility/unit_confirm.php")
      return;
    $('table.paneltable.table_tile')
    .after('<div style="clear: both;text-align: center;padding: 5px;">小分け生産を設定中です。訓練の分割よりも小分け生産の設定数 <b>'+ options.prod_with_smalllot + '</b> が優先されます。</div>');
    $('form#dataForm').find('div.ig_tilesection_btnarea').find('a').eq(0).removeAttr('onclick');
    $('form#dataForm').find('div.ig_tilesection_btnarea').find('a').live('click', function(event) {
      if (event.target.alt != "訓練開始")
        return; //eq(0)すると何故かliveできないので。
      var village_id = get_villageId();
      var undef;
      if (village_id === undef) {
        //console.log('can\'t get villageid ><');
        return;
      }
      var x, y, unit_id, count;
      $('form#dataForm').find('input').each(function() {
        switch ($(this).attr('name')) {
          case 'x':
            x = $(this).attr('value');
            break;
          case 'y':
            y = $(this).attr('value');
            break;
          case 'unit_id':
            unit_id = $(this).attr('value');
            break;
          case 'count':
            count = $(this).attr('value');
            break;
        }
      });
      var u = Number(options.prod_with_smalllot); // 一度に訓練する最低人数
      if (u < 100)
        v = 100; //以前のVer.との競合回避
      //      if(unit_id == 322 ||unit_id == 326 ||unit_id == 330) u = 100;  // 中級兵3種を50単位にしたいときはここを変更します

      var div = Math.floor(count / u);
      var mod = count % u;
      var i;
      nowLoading();
      var params = [];
      var len;
      var json;
      for (i = 1; i <= div + 1; i++) {
        var param = {};
        param.x = x;
        param.y = y;
        param.unit_id = unit_id;
        param.village_id = village_id;
        if (i < div) {
          param.finish = false;
          param.u = u;
        } else if (i == div) {
          if (mod < 100) {
            param.finish = true;
            param.u = u + mod;
            json = toJSON(param);
            params.push(json);
            break;
          } else {
            param.finish = false;
            param.u = u;
          }
        } else {
          param.finish = true;
          param.u = mod;
        }
        json = toJSON(param);
        params.push(json);
      }

      post_smalllot(params, 0);
      function post_smalllot(params, i) {
        var obj = secureEvalJSON(params[i++]);
        var sendurl = '/facility/facility.php?x=' + obj.x + '&y=' + obj.y;
        var data = 'x=' + obj.x + '&y=' + obj.y + '&unit_id=' + obj.unit_id + '&count=' + obj.u + '&btnsend=true';
        $.ajax({
          type: "POST",
          async: false,
          timeout: 2000,
          url: sendurl,
          cache: true,
          data: data,
          dataType: "text",
          beforeSend: function(xhr) {
            xhr.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");
          },
          success: function() {
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
          }
        });
        if (obj.finish) {
          location.href = sendurl; // 完了したら兵舎画面に戻す
        }
        setTimeout(post_smalllot, 1000, params, i);
      }

    });
  }
  // 現在の拠点IDを取得
  function get_villageId() {
    // 現在の拠点名を取得
    var currentname = $('div.sideBoxInner.basename').find('span').eq(0).attr('innerText').replace(/^\s+|\s+$/g, '');
    var currentid;
    // 拠点名と拠点IDの対応表を作成
    $.ajax({
      url: '/user/',
      cache: true,
      async: false,
      timeout: 2000,
      dataType: "text",
      success: function(html) {
        $(html).find('table.common_table1.center').find('.fs14').each(function() {
          var anc = $(this).find('td').eq(1).find('a');
          var village_name = anc.attr('innerText').replace(/^\s+|\s+$/g, '');
          var village_id = anc.attr('href').match(/village_change\.php\?village_id=(\d+)$/);
          if (currentname == village_name) {
            currentid = village_id[1];
          }
        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      }
    });
    return currentid;
  }

  //施設(兵舎)に他兵種の施設のリンクを追加
  function facility_selecter() {
    if (!options.facility_selecter)
      return;
    if (location.pathname != "/facility/facility.php")
      return;
    if (($('div.ig_decksection_top').text().indexOf('厩舎') == -1) && ($('div.ig_decksection_top').text().indexOf('弓兵舎') == -1) && ($('div.ig_decksection_top').text().indexOf('足軽兵舎') == -1) && ($('div.ig_decksection_top').text().indexOf('兵器鍛冶') == -1))
      return;
    $('div.ig_tilesection_detailarea').find('h3:has(span)').empty()
    .append('<span>施設:</span><div style="display:inline;">[<a class="yari_hut">足軽兵舎</a>]</div><div style="display:inline;">[<a class="yumi_hut">弓兵舎</a>]</div><div style="display:inline;">[<a class="kiba_hut">厩舎</a>]</div><div style="display:inline;">[<a class="kaji_hut">兵器鍛冶</a>]</div>');
    
    var basename = $('#sideboxBottom') .find('div.basename:eq(0)').find('li.on').text();
    $('div.ig_tilesection_detailarea:first').find('h3').before('<div style="padding-bottom:5px;font-size: 17px;font-weight: bold;">' + basename + '</div>');
    $.post('/village.php', function(html) {
      var Barracks_name = $('div.ig_decksection_top').text().split(' ')[0];
      var kiba;
      var yari;
      var yumi;
      var kaji;
      $(html).find('map#mapOverlayMap').find('area[title^="足軽兵舎"]').each(function() {
        if($('a.yari_hut:first').text() != Barracks_name){
          yari = '/' + $(this).attr('href');
          $('a.yari_hut').attr('href', yari );
        } else { $('a.yari_hut').replaceWith('<span class="yari_hut" style="font-weight: bold;">足軽兵舎</span>' ); }
      });
      $(html).find('map#mapOverlayMap').find('area[title^="弓兵舎"]').each(function() {
        if($('a.yumi_hut:first').text() != Barracks_name){
          yumi = '/' + $(this).attr('href');
          $('a.yumi_hut').attr('href', yumi );
        } else { $('a.yumi_hut').replaceWith('<span class="yumi_hut" style="font-weight: bold;">弓兵舎</span>' ); }
      });
      $(html).find('map#mapOverlayMap').find('area[title^="厩舎"]').each(function() {
        if($('a.kiba_hut:first').text() != Barracks_name){
          kiba = '/' + $(this).attr('href');
          $('a.kiba_hut').attr('href', kiba );
        } else { $('a.kiba_hut').replaceWith('<span class="kiba_hut" style="font-weight: bold;">厩舎</span>' ); }
      });
      $(html).find('map#mapOverlayMap').find('area[title^="兵器鍛冶"]').each(function() {
        if($('a.kaji_hut:first').text() != Barracks_name){
          kaji = '/' + $(this).attr('href');
          $('a.kaji_hut').attr('href', kaji );
        } else { $('a.kaji_hut').replaceWith('<span class="kaji_hut" style="font-weight: bold;">兵器鍛冶</span>' ); }
      });
    });
    
  }

  //施設:兵舎のパネルを下段に表示
  function facility_panelreverse() {
    if (location.pathname != "/facility/facility.php")
      return;
    if (!options.facility_panelreverse)
      return;
    if (($('div.ig_decksection_top').text().indexOf('厩舎') == -1) && ($('div.ig_decksection_top').text().indexOf('弓兵舎') == -1) && ($('div.ig_decksection_top').text().indexOf('足軽兵舎') == -1) && ($('div.ig_decksection_top').text().indexOf('兵器鍛冶') == -1))
      return;
    var tileheadmenu = $('#ig_tileheadmenu').css({'height':'94px', 'margin-bottom':'5px', 'background-color':'#F2F1DE'});
    var base = $('div.clearfix.ig_tilesection_innerborder:eq(0)').find('div:eq(3)').clone()
          .css({'float':'left', 'margin':'12px 25px 0'})
          .appendTo(tileheadmenu);
    var barracks = $('div.clearfix.ig_tilesection_innerborder:eq(0)').find('h3').clone()
          .css({'float':'left', 'margin-top':'12px', 'font-size':'17px', 'font-weight':'normal'})
          .appendTo(tileheadmenu);
          barracks.find('a').css('color', '#300');
          barracks.find('span').remove();
    $.post(
      '/facility/unit_list.php',
      function (html){
        var Allpool = $(html).find('div.ig_solder_commentarea:eq(0) > strong').clone()
              .css({'float':'right', 'margin':'14px 20px 0', 'font-size':'14px'})
              .appendTo(tileheadmenu);
      }
    );
    var SectionTop = $('div.ig_decksection_top');
    var SectionMid = $('div.ig_tilesection_mid:eq(0)');
    var SectionBottom = $('div.ig_tilesection_bottom:eq(0)');
    $('p.ig_top_alartbox').remove();
    $('div.ig_tilesection_bottom:eq(1)').after( SectionTop );
    SectionTop.after( SectionMid );
    SectionMid.after( SectionBottom );
    //訓練状況を各兵種覧に移動
    $('div.ig_tilesection_detailarea').each(function(){
      var solname = $(this).find('h3').find('b').text();
      $('table.paneltable_red.table_tile').each(function(){
        var now_training = $(this).find('td:eq(0)').text(),
            now_training = '[' + now_training + ']',
          th2 = $(this).find('th:eq(2)'), th3 = $(this).find('th:eq(3)'),
          td1 = $(this).find('td:eq(1)'), td2 = $(this).find('td:eq(2)'), td3 = $(this).find('td:eq(3)');
        td1.after(th2);
        th2.after(td2);
        td2.after(th3);
        th3.after(td3);
        $(this).find('tr:eq(0)').hide();
        $(this).find('tr:eq(2)').remove();
        var PanelTable = $(this).css('width' ,'100%'),
            innermid = $('div.ig_tilesection_mid:eq(0)').find('div.ig_tilesection_innermid:contains(' + now_training + ')'),
            innermid2 = $('div.ig_tilesection_mid:eq(0)').find('div.ig_tilesection_innermid2:contains(' + now_training + ')');
        if( now_training === solname ){
          if( innermid.length > 0 ){
            innermid.append( PanelTable );
          }
          else if( innermid2.length > 0 ){
            innermid2.append( PanelTable );
          }
        }
      });
    });
    
    if($('table.paneltable_red.table_tile').length > 0 ){
      $('div.ig_tilesection_mid:last').remove();
      $('img[src$="box_head.png"]:last').parent().remove();
      $('div.ig_tilesection_bottom:last').remove();
    }
  }

  //待機兵士一覧の拠点へのリンク修正
  function barracks_link() {
    if (location.pathname === '/facility/unit_list.php') {  //待機兵士一覧画面
    //村へのリンク検索
    var vlink=new Array();
    vlink[$("#sideboxBottom .basename .on").text()]="/village.php";  //現在の拠点

    for(var i=0;i<$("#sideboxBottom .basename a").length;i++){   //他の拠点　facility/unit_list.phpをvillage.phpに変更
        vlink[$("#sideboxBottom .basename a").eq(i).text()] = $("#sideboxBottom .basename a").eq(i).attr("href").replace("facility%2Funit_list.php","village.php");
    }
      if($("#ig_deckboxInner .ig_fight_statusarea").length>1){ //訓練中の兵士があれば
        for(var i=0;i<$("#ig_deckboxInner .ig_fight_statusarea").eq(1).find("a").length;i++){  //訓練拠点数ループ
        $("#ig_deckboxInner .ig_fight_statusarea").eq(1).find("a").eq(i)
        .attr("href",vlink[$("#ig_deckboxInner .ig_fight_statusarea").eq(1).find("a").eq(i).text()]); //linkを修正
        }
      }
    }
  }

  //お気に入り施設機能
  function facility_favorites() {
    if (!options.facility_favorites)
      return;
    $('li.gMenu01').find('li').each(function(){
      var beseID = $(this).find('a').attr('href').split('=')[1];
      $(this).wrap('<div id="' + beseID + '" class="same_base"></div>');
    });
    var facility_list = {};
    if (localStorage.getItem("crx_facility_list")) {
      facility_list = secureEvalJSON(localStorage.getItem("crx_facility_list"));
    }
    
    var moko_tmp = ''
    for (var code in facility_list) {
      var mname = facility_list[code];
      var tmp = code.match(/(\d+)\(([-]*\d+),([-]*\d+)\)/);
      var village_id = tmp[1];
      var x = tmp[2];
      var y = tmp[3];
      var code = village_id + '(' + x + ',' + y + ')';
      var url = '/village_change.php?village_id=' + village_id + '&from=menu&page=' + encodeURIComponent('/facility/facility.php?x=' + x + '&y=' + y);
      moko_tmp = '<li><a class="list_favo" href="' + url + '" cood="' + code + '" style="white-space: nowrap;">' + mname + '</a></li>';
      var baseName = mname.split(' [')[0];
      var blist =  $('li.gMenu01').find('#' + village_id );
      blist.append(moko_tmp);
    }
    
    if (location.pathname!="/facility/facility.php") return;
    var x;
    var y;
    var village_id;
    $('form#facilityPartForm').find('input').each(function() {
      var name = $(this).attr('name');
      var value = $(this).attr('value');
      if (name == 'x') {
        x = value;
      } else if (name == 'y') {
        y = value;
      } else if (name == 'village_id') {
        village_id = value;
      }
    });
    
    var village_name = $('#lordSiteArea').text().replace("選択中の拠点:","");
    var facility_name = $('DIV.ig_decksection_top').text().split(/\s|　/)[0];
    var mname = village_name + ' [' + facility_name + ']';
    var code = village_id + '(' + x + ',' + y + ')';
    if (typeof(facility_list[code])=='undefined') {
      $('DIV.ig_decksection_top').append('&nbsp;<INPUT mname="'+mname+'" code="'+code+'" class="reg_facility" type="button" value="お気に入りに登録" />');
    } else {
      $('DIV.ig_decksection_top').append('&nbsp;<INPUT mname="'+mname+'" code="'+code+'" class="remove_facility" type="button" value="お気に入りから削除" style="color:fireBrick;"/>');
    }
    $('a.list_favo').each(function() {
      var facilityInput = $('input[class="remove_facility"]');
      if( facilityInput.length == 1 ){
        var list_code = $(this).attr('cood').split('(')[0],
          base_code = facilityInput.attr('code').split('(')[0];
          
        if( list_code == base_code ){
          var facility_list = {};
          if (localStorage.getItem("crx_facility_list")) {
            facility_list = secureEvalJSON(localStorage.getItem("crx_facility_list"));
          }
          var code = facilityInput.attr('code');
          var mname = facilityInput.attr('mname');
          facility_list[code] = mname;
          localStorage.setItem("crx_facility_list", toJSON(facility_list));
        }
      }
    });
    $('INPUT.reg_facility').click(function(e) {
      if (confirm('お気に入り施設に登録してよろしいですか?')) {
        var facility_list = {};
        if (localStorage.getItem("crx_facility_list")) {
          facility_list = secureEvalJSON(localStorage.getItem("crx_facility_list"));
        }
        var code = $(this).attr('code');
        var mname = $(this).attr('mname');
        facility_list[code] = mname;
        localStorage.setItem("crx_facility_list", toJSON(facility_list));
      }
    });
    $('INPUT.remove_facility').click(function(e) {
      if (confirm('お気に入り施設から削除してよろしいですか?')) {
        if (localStorage.getItem("crx_facility_list")) {
          var facility_list = secureEvalJSON(localStorage.getItem("crx_facility_list"));
          var code = $(this).attr('code');
          var mname = $(this).attr('mname');
          if (typeof(facility_list[code])!='undefined') {
            delete facility_list[code];
            localStorage.setItem("crx_facility_list", toJSON(facility_list));
          }
        }
      }
    });
  }

//////////////////////
//内政：village
//////////////////////
  function village_check() {
    if (location.pathname != "/village.php")
      return;

    //レベル別施設＆建築中数表示
    if (options.faci_list) {
      var MAXLVL = 15;
      var tmp = '<div class="normal"><h5>Lv.別施設数</h5><table><tbody>';
      var j = 0;
      for (var i = 1; i < MAXLVL; ++i) {
        var $count = $('AREA[alt$="LV.' + i + '"]');
        if ($count.get().length > 0) {
          if (j % 2 === 0)
            tmp += '<tr>';
          tmp += '<td>　LV.' + i + ':' + $count.get().length + '</td>';
          j++;
          if (j % 2 === 0)
            tmp += '</tr>';
        }
      }
      tmp += '</tbody></table>';
      var $building = $('.buildStatus');
      var buildingNow = $building.get().length;
      if (buildingNow > 0) {
        tmp += '<div id="build_now">実行中: ' + buildingNow + '<div /></div>';
      }
      $('#mokotool ul').after(tmp);
    }
  }

  //「復活する」ボタン非表示
  function non_back() {
    if (location.pathname != "/village.php")
      return;
    if (!options.non_back)
      return;
    $('div#back_bottom').remove();
  }

  //実行中作業ウィンドウ拡大
  function big_flt_action_log() {
    if (location.pathname != "/village.php")
      return;
    $('#actionLog').css('background-image', 'url(' + IMAGES.flt_action_log + ')')
        .css({'height': '100px', 'bottom': '0'});
    $('#actionLog .clearfix').css('overflow', 'visible');
    $('#actionLog .clearfix li').css('white-space', 'nowrap');
  }

  //建設状況一覧の表示
  function villageListView() {
    if (!options.villageListView)
      return;
    
    $('<div id="villagelistdialog" style="display:none;">' +
      '<table style="width: 100%;">' +
      '<thead><tr><th class="imk_th_view">名前</th><th class="imk_th_view imk_border_right">実行中作業</tr></thead>' +
      '<tbody id="tb_villagelist"></tbody>' +
      '</table>' +
      '</div>'
    ).appendTo('#mokotool');
     
    $('<li class="list_img">' +
      '<a id="village" href="#TB_inline?height=400&amp;width=560&amp;inlineId=villagelistdialog" class="thickbox" title="建築状況一覧" onclick="return false;">建築状況</a>' +
      '</li>'
    ).appendTo('#toollist');
    
    $("a#village").live("mousedown", function() {
      var lastSelect = $('div.sideBoxInner.basename').find('li.on').text();
      tb_init('a.thickbox');
      var waite_TB_window =  function() {
                    var $TB_window = $('#TB_window');
                    if(!$TB_window[0]) {
                      setTimeout(waite_TB_window,1);
                    } else {
                      $TB_window.css({'position': 'absolute'});
                    }
                  }
      setTimeout(waite_TB_window,1);
      $('#tb_villagelist').children().remove();
      $.post( '/user/', function(html) {
        var href_point = [];
        var ins_point = [];
        $(html).find('table.common_table1.center').find('tr.fs14').each(function() {
          switch ($(this).find('td:eq(0)').text()) {
            case '本領':
            case '所領':
              break;
            default:
            return true;
          }
          var nm = $(this).find('a:eq(0)').text().replace(/^\s+|\s+$/g, "");
          var href = $(this).find('a:eq(0)').attr('href');
          var tmp = '<tr><td class="imk_td_centerb"><a href="' + href + '">' + nm + '</a></td><td class="imk_td_view_left imk_border_right"></td></tr>';
          $('#tb_villagelist').append(tmp);
          href_point.push(href);
          ins_point.push($('#tb_villagelist').find('tr:last'));
        });
        addVillageList(href_point, ins_point, 0, lastSelect);
      });
    });
  }

  function addVillageList(href_point, ins_point, i, lastSelect) {
    if (href_point.length <= i) {
      //地図の表示サイズタイプと同様にデフォルト所領選択値もサーバサイドで保持されている為、
      //最後にリクエストした所領がサーバで保持される
      //よって、建設状態リストを表示する直前のデフォルト所領選択値を保持しておき
      //最後にそのデフォルト所領へアクセスすることで、デフォルト値を元の値に戻す処理
      $.post('/user/', function(html) {
        $(html).find('table.common_table1.center').find('tr.fs14').each(function() {
          if ($(this).find('a:eq(0)').text().replace(/^\s+|\s+$/g, "") == lastSelect) {
            var href = $(this).find('a:eq(0)').attr('href');
            $.post( href, function(html) {
                  return;
            });
          }
        });
      });
      return;
    }
    
    $.post( href_point[i], function(html) {
      var buildStatus = [];
      buildStatus = $(html).find('#actionLog').find('div.clearfix').find('li:has(span.buildStatus)').text().match(/[^\s。]+[\s。][^\s。]+。\(あと\d+:\d+:\d+\)/g);
      if (buildStatus) {
        for (var j = 0; j < buildStatus.length; j++) {
          ins_point[i].find('td:last').append('<div style="line-height: 1.4; text-align: left; margin-left: 0.3em;">' + buildStatus[j] + '</div>');
          $('#tb_villagelist > tr > td > div:contains("研究中")').css('color', 'lightBlue');
        }
      }
      i++;
      addVillageList(href_point, ins_point, i, lastSelect);
    });
  }

//////////////////////
//土地：land
//////////////////////
  //空地戦力を表示
  function map_potential() {
    if (location.pathname != "/facility/send_troop.php" && location.pathname != "/land.php")
      return;
    if (!options.map_potential)
      return;
    
    if (location.pathname == "/land.php") {
      var tiles = [];
      tiles['森林'] = '0', tiles['綿花'] = '0', tiles['鉄鉱山'] = '0', tiles['畑'] = '0', tiles['池'] = '0';
      var Value = $('.ig_mappanel_dataarea p').text().match(/★{1,8}/);
        if (Value !== null) {
          Value = Value[0];
        }
        
      $('div[class^="ig_mappanel_tilelist_"]').each(function() {
        var tmp = $(this).text().match(/\s*(\D+)(\d+)/);
        
        if (tmp !== null) {
          tiles[tmp[1]] = tmp[2];
        }
      });
      var tiles_text = Value + tiles['森林'] + tiles['綿花'] + tiles['鉄鉱山'] + tiles['畑'] + tiles['池'];
      strength_display( tiles_text );
    }
    
    if (location.pathname == "/facility/send_troop.php"){
      $.post('/user/', function(html){
        var takoku = $('#sideboxBottom').find('div.basename:eq(1)').find('li.on').size();
        var x = $('#input_troop').find('input[name="village_x_value"]').val();
        var y = $('#input_troop').find('input[name="village_y_value"]').val();
        if( takoku ){
          var c = $(html).find('table.common_table1.center:eq(1)').find('a:eq(1)').attr('href').split('=')[3];
        }
        else {
          var c = $(html).find('table.common_table1.center:eq(0)').find('a:eq(1)').attr('href').split('=')[3];
        }
        var tmp = 'x=' + x + '&y=' +y + '&c=' + c;
          tmp = tmp.match(/x=([\-]*\d+).*y=([\-]*\d+).*c=(\d+)/);
        var url = '/land.php?x=' + tmp[1] + '&y=' + tmp[2] + '&c=' + tmp[3];
        $.post(url, function(html){
          var tiles = [];
          tiles['森林'] = '0', tiles['綿花'] = '0', tiles['鉄鉱山'] = '0', tiles['畑'] = '0', tiles['池'] = '0';
          var Value = $(html).find('.ig_mappanel_dataarea p').text().match(/★{1,8}/);
            if (Value !== null) {
              Value = Value[0];
            }
          $(html).find('div[class^="ig_mappanel_tilelist_"]').each(function() {
            var tmp = $(this).text().match(/\s*(\D+)(\d+)/);
            if (tmp !== null) {
              tiles[tmp[1]] = tmp[2];
            }
          });
          var tiles_text = Value + tiles['森林'] + tiles['綿花'] + tiles['鉄鉱山'] + tiles['畑'] + tiles['池'];
          strength_display(tiles_text);
        });
      });
    }
  }
  function strength_display( tiles_text ) {
    if ( options.chapter_change === '0') {
      if (tiles_text in POTENTIAL_LIST_4) {
        $('#mokotool').append('<div class="normal"><h5>必要攻撃力</h5>'+ POTENTIAL_LIST_4[tiles_text] +'</div>');
      }
    } else if ( options.chapter_change === '11') {
      if (tiles_text in POTENTIAL_LIST_6_6) {
        $('#mokotool').append('<div class="normal"><h5>必要攻撃力</h5>'+ POTENTIAL_LIST_6_6[tiles_text] +'</div>')
      }
    } else if ( options.chapter_change === '10') {
      if (tiles_text in POTENTIAL_LIST_6_5) {
        $('#mokotool').append('<div class="normal"><h5>必要攻撃力</h5>'+ POTENTIAL_LIST_6_5[tiles_text] +'</div>')
      }
    } else if ( options.chapter_change === '9') {
      if (tiles_text in POTENTIAL_LIST_6_4) {
        $('#mokotool').append('<div class="normal"><h5>必要攻撃力</h5>'+ POTENTIAL_LIST_6_4[tiles_text] +'</div>')
      }
    } else if ( options.chapter_change === '8') {
      if (tiles_text in POTENTIAL_LIST_6_3) {
        $('#mokotool').append('<div class="normal"><h5>必要攻撃力</h5>'+ POTENTIAL_LIST_6_3[tiles_text] +'</div>')
      }
    } else if ( options.chapter_change === '7') {
      if (tiles_text in POTENTIAL_LIST_6_2) {
        $('#mokotool').append('<div class="normal"><h5>必要攻撃力</h5>'+ POTENTIAL_LIST_6_2[tiles_text] +'</div>')
      }
    } else if ( options.chapter_change === '6') {
      if (tiles_text in POTENTIAL_LIST_6_1) {
        $('#mokotool').append('<div class="normal"><h5>必要攻撃力</h5>'+ POTENTIAL_LIST_6_1[tiles_text] +'</div>')
      }
    } else if ( options.chapter_change === '5') {
      if (tiles_text in POTENTIAL_LIST_5_5) {
        $('#mokotool').append('<div class="normal"><h5>必要攻撃力</h5>'+ POTENTIAL_LIST_5_5[tiles_text] +'</div>');
      }
    } else if ( options.chapter_change === '4') {
      if (tiles_text in POTENTIAL_LIST_5_4) {
        $('#mokotool').append('<div class="normal"><h5>必要攻撃力</h5>'+ POTENTIAL_LIST_5_4[tiles_text] +'</div>');
      }
    } else if ( options.chapter_change === '3') {
      if (tiles_text in POTENTIAL_LIST_5_3) {
        $('#mokotool').append('<div class="normal"><h5>必要攻撃力</h5>'+ POTENTIAL_LIST_5_3[tiles_text] +'</div>');
      }
    } else if ( options.chapter_change === '2') {
      if (tiles_text in POTENTIAL_LIST_5_2) {
        $('#mokotool').append('<div class="normal"><h5>必要攻撃力</h5>'+ POTENTIAL_LIST_5_2[tiles_text] +'</div>');
      }
    } else if ( options.chapter_change === '1') {
      if (tiles_text in POTENTIAL_LIST_5_1) {
        $('#mokotool').append('<div class="normal"><h5>必要攻撃力</h5>'+ POTENTIAL_LIST_5_1[tiles_text] +'</div>');
      }
    }
    // 有効兵科の色付け
    $('#mokotool > div.normal li:contains("◎")').css('color','orange');
    var dist = RegExp.$1
    if(dist > 10){
      $('.potential').after('<div id="decline" style="color: orangeRed;margin-top: 2px;">※攻撃力減少有</div>');
    }
  }
  
  //機能選択を押しボタン表示
  function panel_func_change() {
    if (!options.panel_func_change)
      return;
    if (location.pathname != "/land.php")
      return;
    var func_list = {};
    $('div.ig_mappanel_function_mid').find('br').each(function() {
      $(this).remove();
    });
    $('div.ig_mappanel_function_mid').find('img').each(function() {
      func_list[$(this).attr('alt')] = $(this).parent().attr('href');
      $(this).parent().remove();
    });
    var i, id_num = 0;
    function loop(i, id_num) {
      var obj = '<input type="button" id="btn_' + id_num + '" value="' + i + '">';
      $('div.ig_mappanel_function_mid').append(obj);
      if ((i == '陣を破棄する') || (i == '領地を破棄する')) {
        $('#btn_' + id_num).click(function(e) {
          return function() {
            if (confirm('ここを破棄し、空き地に戻しますか？')) {
              location.href = e.value;
            }
          };
        }({value: func_list[i]}));
      } else if (i == '破棄を中止する') {
        $('#btn_' + id_num).click(function(e) {
          return function() {
            if (confirm('破棄を中止しますか？')) {
              location.href = e.value;
            }
          };
        }({value: func_list[i]}));
      } else {
        $('#btn_' + id_num).click(function(e) {
          return function() {
            location.href = e.value;
          };
        }({value: func_list[i]}));
      }
    }
    for (i in func_list) {
      loop(i, id_num);
      id_num++;
    }
  }

  //機能選択を上部へ表示
  function funct_select_move() {
    if (location.pathname != "/land.php")
      return;
    if (!options.funct_select_move)
      return;
    $('div.ig_mappanel_function.map_jin').css('top', '102px');
    $('div.ig_mappanel_tilelist').css('top', '410px');
  }

  //「ここへ部隊出陣」を上にも表示
  function send_troop_check() {
    if (location.pathname != "/land.php")
      return;
    if (!options.send_troop_check)
      return;
    var tmp = $('a[href^="facility/send_troop.php?x"]').clone();
    $('div.ig_mappanel_maindataarea').find('h3').append(tmp);
  }

  //合戦報告書リンクを追加
   function warreportlinkland() {
    if (location.pathname !="/land.php")
      return;
    if (!options.warreportlinkland)
      return;
    
    var castellanname = $('div.ig_mappanel_dataarea').find('a:eq(0)').text();
    var alliancename = $('div.ig_mappanel_dataarea').find('a:eq(1)').text();
    
    $('div.ig_mappanel_dataarea').find('a[href^="/user"]')
    .after('&nbsp<a href="/war/list.php?m=&s=1&name=lord&word=' + castellanname + '&coord=map&x=&y=" class="land_report">[報]</a>');
      
    $('div.ig_mappanel_dataarea').find('a[href^="/alliance"]')
    .after('&nbsp<a href="/war/list.php?m=&s=1&name=alliance&word=' + alliancename + '&coord=map&x=&y=" class="land_report">[報]</a>');
     
    $('a.land_report').css('margin', '0 0.3em');
    $('div.ig_mappanel_dataarea strong').css('padding-right', '0');
  }

////////////////////
//書状：message
////////////////////
  //書状のレイアウト調整
  $(function() {
    if (location.pathname != "/message/inbox.php")
      return;
    $('#ig_deckmenu').find('ul.clearfix').slice(0, 2).remove();
    $('div.common_box3bottom').find('table.common_table1.center')
    .find('tr').find('a:eq(0)').each(function(){
      $(this).find('wbr').remove();
      $(this).css({'display':'inline-block', 'white-space':'nowrap', 'width':'250px', 'text-overflow':'ellipsis'});
    });
    var comTABLE = $('div.common_box3bottom').find('table.common_table1.center');
    comTABLE.find('th:eq(2)').css('width', '146px');
    comTABLE.find('th:eq(4)').css('width', '42px');
  });
  //書状：ナビを上部に
  function message_check() {
    if (location.pathname != "/message/detail.php")
      return;
    $('#ig_deckmenu').find('ul.clearfix').slice(0, 2).remove();
    var navi = $('div.message_footernavi').clone();
    $('div.common_box3bottom').prepend(navi);
  }
  //書状：選択削除
  function select_check_inbox() {
    if (location.pathname != "/message/inbox.php")
      return;
    
    var MissiveSelect = $('<span id="missive_selections"></span>')
            .css({ 'width':'230px', 'margin-left':'25px','color':'black' })
            .insertAfter( $('div.common_box3bottom').find('p:eq(1) > label') );
    
    $('<input type="button" value="落札" />')
    .bind('click', function(){
      $('input[name="chk[]"]').attr('checked', false );
      $('tr:has(input[name="chk[]"]):has(:contains("出品したカードが落札されました"), :contains("カードを落札しました")):has(:contains("戦国IXA運営チーム")) input[name="chk[]"]')
      .attr('checked', true).trigger('change');
      return false;
    }).appendTo( MissiveSelect );
    
    $('<input type="button" value="発掘報告" />')
    .bind('click', function(){
      $('input[name="chk[]"]').attr('checked', false );
      $('tr:has(input[name="chk[]"]):has(:contains("金山発掘報告")):has(:contains("戦国IXA運営チーム")) input[name="chk[]"]')
      .attr('checked', true).trigger('change');
      return false;
    }).appendTo( MissiveSelect );

    $('<input type="button" value="IXA運営" />')
    .bind('click', function(){
      $('input[name="chk[]"]').attr('checked', false );
      $('tr:has(input[name="chk[]"]):has(:contains("戦国IXA運営チーム")) input[name="chk[]"]')
      .attr('checked', true).trigger('change');
      return false;
    }).appendTo( MissiveSelect );
    
    $(MissiveSelect).append('<span>&nbsp;を選択</span>');
    $(MissiveSelect).find('input').css({'margin-left':'7px' });
  }

  //書状：全件既読にする
  function all_check_inbox() {
    if (location.pathname != "/message/inbox.php")
      return;
    $('p.mt10.mb5').prepend('<input id="all_check" type="button" value="このページを全件既読にする" style="margin-right: 60px;" />');
    $('p.mt10.mb5 > a > img').css('vertical-align','-10px');
    $('table.common_table1.center').find('th:eq(0)').empty()
    .append('<input id="select_check" type="button" value="選択" />');
    
    $('#all_check').click(function() {
      $("#all_check").attr('disabled', true);
      var list = [];
      $('td.left.comment_wbr').find('a').each(function() {
        var tmp = [];
        tmp[0] = $(this).attr("href");
        list = list.concat(tmp);
      });
      nowLoading();
      all_read(list, 0);
    });
    $('#select_check').click(function() {
      $('input[name="chk[]"]').attr('checked', true);
    });
  }
  function all_read(list, i) {
    if ((list.length < i - 1) || (list[i] === undefined)) {
      location.href = 'inbox.php';
    } else {
      $.post('/message/' + list[i], function(html) {
        all_read(list, i + 1);
      });
    }
  }

////////////////////
//報告書：report
////////////////////
  $(function() {
    if (location.pathname != "/report/list.php")
      return;
    // 報告書：リンクナビ表示調整
    $('#ig_deckheadmenubox').height('50px');
    $('#ig_deckmenu').remove();
    //報告書：下にもフィルタメニュー
    var tmp = $('ul.statMenu:eq(0)').clone().css('border-bottom', 'none');
    var ULpager = $('ul.pager').clone().css({'margin-bottom':'-5px', 'padding':'0'});
    $('ul.statMenu:eq(0)').before( ULpager );
    $('input[name="remove_checked"]').after(tmp);
    $('table.paneltable.p_report td').css('padding', '2px 8px');
    //報告書：上にも全てチェック/選択を削除
    var inputAll = $('input[name="all_checked"]').clone().css('margin-right', '4px'),
      inputRemove = $('input[name="remove_checked"]').clone().css('margin-right', '15px');
    $('li.last.r_input:eq(0)').css('padding', '0').prepend(inputRemove).prepend(inputAll);
    //見出し幅の調整
    $('table.paneltable.p_report').find('tr').find('a:eq(0)')
    .css({'width':'365px', 'white-space':'nowrap', 'display':'inline-block','text-overflow':'ellipsis'});
    $('table.paneltable.p_report').find('tr').find('th:eq(3)').width('105px');
  });

  $(function() {
    if (location.pathname != "/report/detail.php")
      return;
    //報告書：ナビを上部に
    $('#ig_deckheadmenubox').height('50px');
    $('#ig_deckmenu').remove();
    var navi = $('.report_navi').clone();
    $('div.ig_decksection_innermid').prepend(navi);
    //報告書：ログを上部へ
    var logtable = $('table.commontable');
    $('table.commontable_fight').before(logtable);
    $('table.armytable td, table.attacktable td, table.defensetable td')
    .css('height','auto');
  });

  //合戦報告書：ナビを追加の表示枠を作っておく
  $(function() {
    if (location.pathname != "/war/detail.php")
      return;
    $('table.ig_battle_table').before('<div id="detail_navi" style="height: 1.4em; margin-right: 10px;"></div>');
  });
  //合戦報告書：ナビを追加
  function war_detail_navi() {
    if (location.pathname != "/war/detail.php")
      return;
    var target_query = location.search.substr(1, location.search.length - 1).split("&");
    target_query = target_query[0];
    var back_query = $('a[href^="list.php"]').attr('href');
    $.post(
      '/war/' + back_query,
      function(html) {
        var before_query = '';
        var after_query = '';
        var target_row = 0;
        var i = 0;
        var max_row = 0;
        $(html).find('a[href^="detail.php"]').each(function() {
          if ($(this).attr('href').indexOf(target_query) >= 0) {
            target_row = i;
          }
          i++;
          max_row++;
        });
        i = 0;
        $(html).find('a[href^="detail.php"]').each(function() {
          if ((i == target_row - 1) && (target_row !== 0)) {
            after_query = $(this).attr('href');
          }
          if ((i == target_row + 1) && (target_row != max_row)) {
            before_query = $(this).attr('href');
            return false;
          }
          i++;
        });
        war_detail_navi_link(html, before_query, after_query);
        return;
      }
    );
  }

  function war_detail_navi_link(argHtml, before_query, after_query) {
    var target_href = '';
    var t_num = $(argHtml).find('.ig_battle_pagelist').find('span:eq(0)').text();
    if (before_query === '') {
      if (t_num !== '') {
        t_num++;
        $(argHtml).find('.ig_battle_pagelist').find('a[href^="/war/list.php"]').each(function() {
          if ($(this).text() == t_num) {
            target_href = $(this).attr('href');
            return false;
          }
        });
      }
    } else if (after_query === '') {
      if (t_num !== '') {
        t_num--;
        $(argHtml).find('.ig_battle_pagelist').find('a[href^="/war/list.php"]').each(function() {
          if ($(this).text() == t_num) {
            target_href = $(this).attr('href');
            return false;
          }
        });
      }
    } else {
      make_navi(before_query, after_query);
      return;
    }
    if (target_href !== '') {
      $.post(
        target_href,
        function(html) {
          if (before_query === '') {
            $(html).find('a[href^="detail.php"]').each(function() {
              before_query = $(this).attr('href');
              return false;
            });
          }
          if (after_query === '') {
            $(html).find('a[href^="detail.php"]').each(function() {
              after_query = $(this).attr('href');
            });
          }
          make_navi(before_query, after_query);
          return;
        }
      );
    } else {
      make_navi(before_query, after_query);
      return;
    }
  }

  function make_navi(before_query, after_query) {
    var a_query_page = after_query.substr(1, location.search.length - 1).split("&");
    a_query_page = a_query_page[2];
    if ((a_query_page === undefined) || (a_query_page == 'p=0'))
      after_query = '';
    var tmp = '<div class="report_navi clearfix">';
    if (before_query === '') {
      tmp += '<div class="leftG"></div>';
    } else {
      tmp += '<div class="leftF"><a href="' + before_query + '" style="color: #060;">前の報告書へ</a></div>';
    }
    if (after_query === '') {
      tmp += '<div class="rightG"></div>';
    } else {
      tmp += '<div class="rightF"><a href="' + after_query + '" style="color: #060;">次の報告書へ</a></div>';
    }
    $('#detail_navi').append(tmp);
  }

////////////////////
//出陣：
////////////////////
  //出陣確認 - 合流攻撃検索
  $(function(){
    if (location.pathname != "/facility/send_troop.php" && location.pathname != "/facility/confluence_list.php")
      return;
      var village_x_value = $('input[name="village_x_value"]').val(),
        village_y_value = $('input[name="village_y_value"]').val(),
        unit_select = $('input[name="unit_select"]').val();
        
    if(location.pathname == "/facility/send_troop.php"){
      
      if( $('input[name="radio_move_type"]').val() != 302 ) return;
      $('<a href="javascript:void(0)" onclick="return false;" class="confluence_search mk-button">合流攻撃検索</a>')
      .click(function(){
        var data = {
            village_x_value: village_x_value,
            village_y_value: village_y_value,
            radio_move_type: '320',
            unit_select: unit_select,
            x:'',
            y:''
          };
        $.form ({
          type: 'post',
          url: '/facility/confluence_list.php',
          data: data
        });
      }).appendTo('div.btnarea');
      
    }
    if(location.pathname == "/facility/confluence_list.php"){
      
      $('<a href="javascript:void(0)" onclick="return false;" id="return_confirmation">' +
        '<img src="/img/gofight/btn_confirm.png" style="margin-left: 10px;" />' +
        '</a>'
      ).click(function(){
        var data = {
            village_x_value: village_x_value,
            village_y_value: village_y_value,
            radio_move_type: '302',
            unit_select: unit_select,
            x:'',
            y:'',
            btn_preview: true
          };
        $.form ({
          type: 'post',
          url: '/facility/send_troop.php#ptop',
          data: data
        });
      }).appendTo('div.center.mb10');
      $('div.center.mb10 > a').css('text-decoration', 'none');
    }
    $.form = function(s) {
      var def = {
        type: 'get',
        url: location.href,
        data: {}
      };
      s = $.extend(true, s, $.extend(true, {}, def, s));
      var form = $('<form>').attr({'method': s.type,'action': s.url}).appendTo(document.body);
      for (var a in s.data) {
        $('<input>').attr({'name': a,'value': s.data[a]}).appendTo(form[0]);
      }
      form[0].submit();
    };
  });

  //おまかせ出陣
  function leave_departure(){
    if (!options.leave_departure)
      return;
    if (location.pathname != "/facility/send_troop.php")
      return;
    if($('div.ig_decksection_top').text() != '出陣確認')
      return;
      var ReachingTime = $('#area_up_timer0').text();
      var DepartureTime = $('#specified_time').val();
    $('<div style="margin-top: -20px; font-weight: normal; font-size: 14px; text-align: center;">' +
      '<span id="input_area">到着時間：' +
        '<input type="text" id="provisional" value="' + ReachingTime + '" style="width: 130px;" />' +
        '<input type="button" id="update" value="更新" style="margin: 0 5px 0;" />' +
        '<input type="button" id="set_time" value="おまかせ出陣!にセット" />' +
      '</span>' +
      '<span id="set_area"></span>' +
      '</div>'
    ).appendTo('div.ig_decksection_top');
    
    $('input[id="provisional"]').change(function(e) {
      $(this).val( toHankaku($(this).val()) );
    });
    
    if($('table.table_gofight_confskill')
    .find('span:contains("七本槍進撃"), span:contains("賤ヶ岳の強者"), span:contains("賤ヶ岳の強者"), span:contains("天下の両兵衛"), span:contains("忍び衆")').length){
      $('div.ig_decksection_mid').prepend('<div style="color:red;text-align: center;">※加速部隊スキル有り（到着時間より早く到着します）</div>');
    }
    
    $('#update').click(function() {
      var ReachingTime = $('#area_up_timer0').text();
      $('#provisional').val( ReachingTime );
    });
    
    $('#set_time').click(function() {
      $('#input_area').hide();
      $('#set_area').empty()
      .append('<span id="specified_time" style="font-weight: bold;color:lime;">' + $('#provisional').val() + '</span> 到着でおまかせ出陣! <input type="button" id="cancel" value="キャンセル" />');
    });
    
    $('#cancel').live('click',function() {
      $('#input_area').show();
      $(this).parent().empty();
      return false;
    });
    
    $.post(
      '/facility/unit_status.php?dmo=sortie',
      function(html) {
        $(html).find('div.ig_fight_statusarea').each(function(){
          var tgTitle = $(this).find('h3').text().split(' '),
              tgTitle = tgTitle[0] + ' ' + tgTitle[1];
          var tgTable = $(this).find('table.paneltable.table_fightlist');
          var TimeText = tgTable.find('td:eq(0) > span').text().split('　（')[0];
          var tgTH3 = tgTable.find('th:eq(3)');
          var tgTD7 = tgTable.find('td:eq(7)');
          tgTable.find('tr:gt(0)').remove();
          tgTable.find('th:eq(1)').remove();
          tgTable.find('td').remove();
          tgTable.find('tbody').find('tr').prepend('<td style="width:190px;"><span>出陣中：' + tgTitle + '</span></td>');
          tgTable.find('th').before(tgTH3).before(tgTD7)
          .after('<td><span class="reaching_time">' + TimeText + '</span></td><td><span><input type="button" value="この時間をセット" class="troops_time" style="margin: 0;" /></span></td>');
          tgTable.removeAttr('class').addClass('paneltable table_gofight_conftitle').css({'margin':'0 auto', 'width':'100%'});
          $('#ig_gofightconfirmboxtitle').css('margin-bottom', '7px').after(tgTable);
          
          $('input.troops_time').click(function(){
            var Reatime = $(this).closest('tr').find('span.reaching_time').text();
            $('#provisional').val(Reatime);
          });
          
        });
      }
    );
    
    setInterval( function() {
      var ReachingTime = $('#area_up_timer0').text();
      var DepartureTime = $('#specified_time').text();
      
      if( ReachingTime == DepartureTime ){
        $('#specified_time').css('color', 'red');
        departure_troops();
        
      }
    }, 500 );
  }
  
  function departure_troops(){
    var village_x_value = $('input[name="village_x_value"]').val(),
      village_y_value = $('input[name="village_y_value"]').val(),
      radio_move_type = $('input[name="radio_move_type"]').val(),
      unit_select = $('input[name="unit_select"]').val();
    $.post(
      '/facility/send_troop.php#ptop',
      { village_name:'',
        village_x_value:village_x_value,
        village_y_value:village_y_value,
        unit_assign_card_id:'',
        radio_move_type:radio_move_type,
        show_beat_bandit_flg:'',
        unit_select:unit_select,
        x:'',
        y:'',
        card_id:'204',
        btn_send:'true'
      },
      function(data){
        location.href = '/facility/unit_status.php?dmo=sortie';
      }
    );
  }
  $(function(){
    if (location.pathname != "/facility/send_troop.php")
      return;
    $('table.table_waigintunit').wrap('<label></label>')
    .hover(function(){
      $(this).css({'background-color':'#E1E0CD', 'border':'1px solid dimgray'});
      },
      function(){
      $(this).css({'background-color':'', 'border':''});
    });
    //本拠地・出城が陥落時の警告を書き換える
    $('div.btnarea').each(function(){
      var wordspan = $(this).find('span.red:eq(1)'),
        word = wordspan.text().trim();
      if( word == '※この拠点は現在陥落中のため、出陣できません。' ){
        $.post('/user/',
          function(html) {
            var honkyochi = $(html).find('div.common_box3bottom').find('table.common_table1.center:eq(0)').find('td:eq(4) > span.red').text();
            var deshiro = $(html).find('div.common_box3bottom').find('table.common_table1.center:eq(1)').find('tr:last').find('td:eq(4) > span.red').text();
            if(honkyochi == '陥落中' && deshiro == ''){
              wordspan.replaceWith('<span class="red">※本拠地が現在陥落中のため、出陣できません。</span><br />');
            }
            else if(honkyochi == '' && deshiro == '陥落中'){
              wordspan.replaceWith('<span class="red">※出城が現在陥落中のため、出陣できません。</span><br />');
            } 
          }
        );
      }
    });
  });
  //陣張り出兵時に出陣状況一覧の攻撃画像を陣張り画像に置き換える
  function fightlist() {
    if (location.pathname != "/facility/unit_status.php")
      return;
    $('.table_fightlist').each(function() {
      var tgWord = $(this).find('tr:eq(0) td:eq(2)').text();
      var tgImg = $(this).find('tr:eq(1) td:eq(1) img');
      var imgSrc = tgImg.attr('src') || '';

      if (imgSrc.indexOf('_attack.png') != -1 && tgWord == '-'){
        tgImg.attr('src', IMAGES.mode_jinhari);
      }
    });
  }

  //出陣状況一覧にmap対象のリンク「地図」を追加
  function LinkToMap() {
    if (location.pathname != "/facility/unit_status.php")
      return;
    $('table.table_fightlist').each(function() {
      var TargFl = $(this).find('tr').eq(2).find('td').find('span');
      if( TargFl.size() > 0 ){
        TargFl.each(function() {
          var Href = $(this).find('a').attr('href').replace('land', 'map');
          $(this).append('<span><a href="' + Href + '">地図</a></span>');
        });
      }
    });
  }

  //出陣：合流攻撃確認
  function merge_fight_info() {
    if (!options.merge_fight_info)
      return;
    if (location.pathname == "/facility/send_troop.php") {
      $('div#ig_gofightboxtitle').find('img').each(function() {
        if ($(this).attr('src').indexOf('hd_joinattack.gif') != -1) {
          $(this).attr('src', IMAGES.hd_joinattack);
          $(this).attr('width', '160');
          $(this).attr('height', '15');
          $(this).attr('alt', '攻撃か付近の攻撃に合流');
          return;
        }
      });
    }
    if (location.pathname != "/facility/confluence_list.php")
      return;
    $('#ig_deckmenu').remove();
    $('#ig_deckheadmenubox').height(50);
    $('div.ig_list_box_mid').find('p').remove();
    $('#go_search_box_innr').height(55);
    var vx_value = $('#village_x_value').val();
    var vy_value = $('#village_y_value').val();
    var u_select = $('#unit_select').val();
    var data = {
        village_x_value: vx_value,
        village_y_value: vy_value,
        radio_move_type: 302,
        unit_select: u_select,
        btn_preview: true
      };
      
    var data2 = {
        village_x_value: vx_value,
        village_y_value: vy_value,
        radio_move_type: 307,
        unit_select: u_select,
        btn_preview: true
      };
      
    $.ajax({
      type: "POST",
      url: '/facility/send_troop.php',
      data: data,
      cache: false,
      success: function(html) {
        var t_dom = $(html).find('#ig_gofightconfirmboxtitle').clone().css('margin-top', '10px');
        $('#go_search_box_innr').append( t_dom );
        var panelTABLE = $('table.paneltable.table_gofight_conftitle').css({'margin':'0 auto', 'border': '1px solid dimgray'});
        var wth = panelTABLE.find('th:eq(2)').clone();
        var wtd = panelTABLE.find('td:eq(2)').clone();
        var ForcesName = $(html).find('div.ig_fightunit_title3 > h3').text();
        panelTABLE.find('tr.noborder').remove();
        panelTABLE.find('th:eq(0)').before('<th>部隊</th><td>' + ForcesName + '</td>');
        panelTABLE.find('td:eq(1)').after( wth );
        panelTABLE.find('th:eq(2)').after( wtd );
        panelTABLE.find('td:eq(0)').attr('colspan','0');
        panelTABLE.find('th').css({'padding':'0 2px', 'width':'45px', 'font-family':'MS PMincho', 'text-shadow':'-1px -1px 4px black, 1px 1px 4px black', 'border':'none'});
        panelTABLE.find('td').css({'padding':'0 5px', 'border':'none'});
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      //console.log(textStatus);
      }
    });
  }

  //出陣：合流自動選択
  function confluence_select() {
    if (location.pathname != "/facility/confluence_list.php")
      return;
    $('input[name="queue"]:first').attr('checked', true);
    $('table.common_table1.center.mt10').find('tr').slice(1)
    .hover(function(){
      $(this).css('background-color', '#E1E0CD');
      },
      function(){
      $(this).css('background-color', '');
    })
    .click(function(){
      $(this).find('input[name="queue"]').attr('checked', true);
    })
  }

  //出陣：部隊の自動選択
  function ptop_check() {
    if ((location.pathname != "/facility/send_troop.php") && (location.pathname != "/facility/confluence_confirm.php"))
      return;
    $('div.btnarea:eq(0)').clone().css('margin-bottom', '10px')
    .insertAfter('#ig_deckheadmenubox');
    $('input[name="unit_select"]:first').attr('checked', true);
  }

  //出陣：合戦地の空地攻撃は陣取りをデフォルトにする
  function def_attack() {
    if(location.pathname != "/facility/send_troop.php")
      return;
    if(!options.def_attack) 
      return;
    var Battleimg = $('#sideboxMain').find('.situationWorldTable:eq(1) a > img').size();
    if(Battleimg > 0) {
      var tmp = location.search.match(/x=([-]*\d+).*y=([-]*\d+).*c=(\d+)/);
      if(tmp != null){
        $.post( '/land.php?'+ tmp[0], function (html) {
          $(html).find('div[class^="ig_mappanel_maindataarea"]').each(function() {
            var ans = $(this).find('h3').text().match(/空き地/);
            var Value = $(this).find('p strong').text().match(/価値/);
            
            if ( ans!==null && Value!==null && $('input[id="establish_camp"]').size() == 1 ) {
              $('input[id="establish_camp"]').attr('checked', true );
              $('table.table_waigintunit').find('td:has(input:checked)').css('background-color', 'mediumVioletRed');
            }
            else {
              $('table.table_waigintunit').find('td:has(input:checked)').css('background-color', 'red');
            }
          });
        });
      }
    }
  }
  
  $(function(){
    $('table.table_waigintunit').find('td:has(input:checked)').each(function(){
      if( $('#reinforcement:checked').size() == 1 ) { $(this).css('background-color', 'lightSkyBlue'); }  //加勢
      else if( $('#normal_attack:checked').size() == 1 ) { $(this).css('background-color', 'red'); }  //攻撃
      else if( $('#reclaim_attack:checked').size() == 1 ) { $(this).css('background-color', 'limeGreen'); }  //開拓
      else if( $('#establish_camp:checked').size() == 1 ) { $(this).css('background-color', 'mediumVioletRed'); }  //陣張り
      else if( $('#merge_attack:checked').size() == 1 ) { $(this).css('background-color', 'cornflowerBlue'); }  //合流
    });
    $('input[name="unit_select"]').change(function(){
      $('.table_waigintunit').find('td:has(input)').css('background-color', '');
      if( $('#reinforcement:checked').size() == 1 ) { $(this).parent().css('background-color', 'lightSkyBlue'); }  //加勢
      else if( $('#normal_attack:checked').size() == 1 ) { $(this).parent().css('background-color', 'red'); }  //攻撃
      else if( $('#reclaim_attack:checked').size() == 1 ) { $(this).parent().css('background-color', 'limeGreen'); }  //開拓
      else if( $('#establish_camp:checked').size() == 1 ) { $(this).parent().css('background-color', 'mediumVioletRed'); }  //陣張り
      else if( $('#merge_attack:checked').size() == 1 ) { $(this).parent().css('background-color', 'cornflowerBlue'); }  //合流
    });
    $('#reinforcement').change(function(){
      $('table.table_waigintunit').find('td:has(input:checked)').css('background-color', 'lightSkyBlue');  //加勢
    });
    $('#normal_attack').change(function(){
      $('table.table_waigintunit').find('td:has(input:checked)').css('background-color', 'red');  //攻撃
    });
    $('#reclaim_attack').change(function(){
      $('table.table_waigintunit').find('td:has(input:checked)').css('background-color', 'limeGreen');  //開拓
    });
    $('#establish_camp').change(function(){
      $('table.table_waigintunit').find('td:has(input:checked)').css('background-color', 'mediumVioletRed');  //陣張り
    });
    $('#merge_attack').change(function(){
      $('table.table_waigintunit').find('td:has(input:checked)').css('background-color', 'cornflowerBlue');  //合流
    });
    $('#merge_attack').change(function(){
      $('table.table_waigintunit').find('td:has(input:checked)').css('background-color', 'cornflowerBlue');  //合流
    });
  });

  //出陣ボタンを表示(即出陣用)
  function immediately_send_troop() {
    if(location.pathname != "/facility/send_troop.php")
      return;
    if(!options.immediately_send_troop) 
      return;
    if ( $('#input_troop :radio[name="unit_select"]').length == 0 ) { return; } 
    
    $('<img class="immediatelysend_button" title="即出陣" style="cursor: pointer;"/>')
      .attr( 'src', '/img/gofight/btn_attack.png' )
      .appendTo('div.btnarea');
    
    $('img.immediatelysend_button').click(function(){
      
      $('table.table_waigintunit').find('tr:has(input:checked)').each(function(){
        $(this).find('input[name="unit_select"]').attr('checked', true);
        var unit_select = $(this).find('input[name="unit_select"]:checked').val(),
          village_x_value = $('input[name="village_x_value"]').val(),
          village_y_value = $('input[name="village_y_value"]').val(),
          radio_move_type = $('input[name="radio_move_type"]:checked').val();
        immediately_troop( unit_select, village_x_value, village_y_value, radio_move_type );
      });
    
    });
  }
  function immediately_troop( unit_select, village_x_value, village_y_value, radio_move_type ){
    $.post(
      '/facility/send_troop.php',
      { 
        village_name: '',
        village_x_value: village_x_value,
        village_y_value: village_y_value,
        unit_assign_card_id: '',
        radio_move_type: radio_move_type,
        show_beat_bandit_flg: '',
        unit_select: unit_select,
        x: '',
        y: '',
        card_id: '204',
        btn_send: 'true'
      },
      function(){
        location.href = '/facility/unit_status.php?dmo=sortie';
      }
    );
  }

  //全部隊出陣
  function all_send_troop() {
    if(location.pathname != "/facility/send_troop.php")
      return;
    if(!options.all_send_troop) 
      return;
    if ( $('#input_troop :radio[name="unit_select"]').length == 0 ) { return; } 
    
    $('<img class="allsend_button" title="全出陣" style="cursor: pointer;"/>')
      .attr( 'src', IMAGES.all_attack )
      .appendTo('div.btnarea');
    
    $('img.allsend_button').click(function(){
      
      if ( !confirm('部隊を全て出陣させます。\nよろしいですか？') ) { return; }
      
      $('table.table_waigintunit').each(function(){
        $(this).find('input[name="unit_select"]').attr('checked', true);
        var partyID = $('input[name="unit_select"]:checked').val(),
            objX = $('input[name="village_x_value"]').val(),
            objY = $('input[name="village_y_value"]').val(),
            moveType = $('input[name="radio_move_type"]:checked').val();
        troop( partyID, objX, objY, moveType )
      });
    
    });
  }
  function troop( partyID, objX, objY, moveType ){
    $.post(
      '/facility/send_troop.php',
      { village_name: '',
        village_x_value: objX,
        village_y_value: objY,
        unit_assign_card_id: '',
        radio_move_type: moveType,
        show_beat_bandit_flg: '',
        unit_select: partyID,
        x: '',
        y: '',
        card_id: '204',
        btn_send: 'true'
      },
      function(resT){
        location.href = '/facility/unit_status.php?dmo=sortie';
      }
    );
  }

  //出陣確認で武将が持つスキルをデフォルト表示
  function gofight_skill(){
    if(location.pathname != "/facility/send_troop.php")
      return;
    if(!options.gofight_skill) 
      return;
    $('#btn_gofight_skill_unit > a').trigger('click');
  }

  //出陣：キャンセルボタンをclickした確認
  function cancel_confirmation() {
    if (location.pathname != "/facility/unit_status.php")
      return;
    $('img[alt="キャンセル"]').click(function(){
      $(this).css('opacity', '0.5');
    });
  }

  //出陣：全部隊出陣キャンセル
  function alltroops_cancel() {
    if (location.pathname != "/facility/unit_status.php")
      return;
    var sectionTop = $('.ig_decksection_top'),
      TopText = sectionTop.text().trim();
    
    if( (TopText == '全部隊' || '出陣中') && $('img[alt="キャンセル"]').size() > 0){ 
      $('<button id="allcancel" style="margin-left:20px;">全部隊キャンセル</button>')
      .appendTo( sectionTop );
    }
    
    $('#allcancel').live('click',function(){
      $('img[alt="キャンセル"]').each(function(){
        var href = $(this).parent().attr('href');
        $.post( href, function(html){ location.href = '/facility/unit_status.php'; } );
        $(this).css('opacity', '0.5');
      });
      return false;
    });
  }

////////////////////
//掲示板：チャット：
////////////////////
  //「戻る」ボタン表示
  function bbs_check() {
    if (location.pathname != "/bbs/res_view.php")
      return;
    $('div[class="common_box3"]')
    .after('<div align="center" style="margin-top:15px; margin-bottom: 15px;">' +
        '<a href="/bbs/topic_view.php"><img style="opacity: 1;" src="/img/common/btn_back.gif" class="fade" alt="戻る" title="戻る" /></a>' +
        '</div>'
      )
  }
  //同盟掲示板にリンクをつける
  function chat_log_check() {
    if (location.pathname != "/alliance/chat_view.php" && location.pathname != "/bbs/res_view.php")
      return;
    $('UL[class="clearfix"] > LI:eq(2)').wrap('<a href="/bbs/topic_view.php" style="color: #006600;text-decoration: underline;"></a>');
  }
  //チャットの見切れ修正
  function chat_check() {
    if (options.chat_mikire) {
      $('TD[class="al"]').css({width: '85px'}).find('> A').css({width: '85px',height: '1.1em'});
      $('TD[class="msg"] > SPAN').css({'width': '250px', 'margin-left': '3px'});

      $('UL[class="commentbtn"] > LI[class="right"] > A, UL[class="commentclose"] > LI:eq(0) > A').click(function(e) {
        setTimeout(function() {
          $('TD[class="al"]').css({width: '85px'}).find('> A').css({width: '85px',height: '1.1em'});
          $('TD[class="msg"] > SPAN').css({'width': '250px', 'margin-left': '3px'});
        }, 500);
      });
    }
  }
  //削除されたコメントを非表示
  function bbs_no_display_delete() {
    if (!options.bbs_no_display_delete)
      return;
    if (location.pathname != "/bbs/res_view.php")
      return;
    $('.delete').hide();
  }
  //掲示板の表示件数変更
  function bbs_default_check() {
    if (location.pathname != "/bbs/topic_view.php")
      return;
    if (options.bbs_def_num == "0")
      return;
    $('a[href^="res_view.php?thread_id="]')
    .each(function() {
      $(this).attr('href', $(this).attr('href') + '&pager_select=' + options.bbs_def_num );
    });
  }
  //「チャット履歴」のリンク修正、チャットの表示件数変更
  function chat_default_check() {
    if (!options.chat_linkchg)
      return;
    var pager_select = options.bbs_def_num > 0 ? options.bbs_def_num : 20;
    $('#header .commentbtn2 a:eq(1)').attr('href', '/alliance/chat_view.php?pager_select=' + pager_select);
    var $ig_deckmenu = $('#ig_deckmenu');
    if ($ig_deckmenu) {
      $ig_deckmenu.find('li').each(function() {
        this.childNodes[0].href += '?pager_select=' + pager_select;
      });
    }
  }
  //表示件数オプションをセレクターに追加
  function bbs_add_pager_value() {
    if (location.pathname != "/bbs/res_view.php" && !location.pathname.match(/\/alliance\/chat_view\w*\.php/))
      return;
    var pager_value = location.href.match(/pager_select=(\d+)/);
    if (pager_value)
      pager_value = pager_value[1];
    var arry = ['300', '500', '1000'];
    var tmp = '';
    for (var i = 0; i < 2; i++)
      tmp += '<option value=' + arry[i] + '>最新' + arry[i] + '件</option>';
    tmp += '<option value=' + arry[2] + '>全件</option>';
    $('SELECT[name="pager_select1"]').append(tmp);
    $('SELECT[name="pager_select2"]').append(tmp);
    if (pager_value > 100) {
      $('SELECT[name="pager_select1"] option[value=' + pager_value + ']').attr('selected', 'selected');
      $('SELECT[name="pager_select2"] option[value=' + pager_value + ']').attr('selected', 'selected');
    }
    $('A[href^="/bbs/res_view.php?"]').each(function() {
      var temp = $(this).attr('href') + "&pager_select=" + pager_value;
      $(this).attr('href', temp);
    });
  }
  //チャット履歴内の座標をリンク
  function chat_mapcood2() {
    if (!location.pathname.match(/\/alliance\/chat_view\w*\.php/))
      return;
    if (!options.chat_mapcood)
      return;
    var coord = new RegExp(/[ー－‐―\-]?[０-９\d]+[,，、。.．]\s?[ー－‐―\-]?[０-９\d]+/g);
    $('.chat_text').each(function() {
      var msg = $(this).text();
      var tmp = msg.match(coord);
      if (tmp) {
        //console.log(tmp);
        for (var i = 0; i < tmp.length; i++) {
          var tmp2 = tmp[i].match(/[ー－‐―\-]?[０-９\d]+/g);
          for (var j = 0; j < 2; j++)
            tmp2[j] = toHankaku(tmp2[j]);
          var tmp3 = '<A style="display:inline;" href="/map.php?x=' + tmp2[0] + '&y=' + tmp2[1] + '">' + tmp[i] + '</A>';
          msg = msg.replace(tmp[i], tmp3);
        }
        $(this).html(msg);
      }
    });
  }
  //掲示板の座標をリンク
  function bbs_mapcood() {
    if (location.pathname != "/bbs/res_view.php")
      return;
    if (!options.chat_mapcood)
      return;
    var coord = new RegExp(/[ー－‐―\-]?[０-９\d]+[,，、。.．]\s?[ー－‐―\-]?[０-９\d]+/g);
    $('.comment_wbr').each(function() {
      var msg = $(this).text().replace(/\n/g, "<br />");
      var tmp = msg.match(coord);
      if (tmp) {
        //console.log(msg);
        for (var i = 0; i < tmp.length; i++) {
          var tmp2 = tmp[i].match(/[ー－‐―\-]?[０-９\d]+/g);
          for (var j = 0; j < 2; j++)
            tmp2[j] = toHankaku(tmp2[j]);
          var tmp3 = '<A style="display:inline;" href="/map.php?x=' + tmp2[0] + '&y=' + tmp2[1] + '">' + tmp[i] + '</A>';
          msg = msg.replace(tmp[i], tmp3);
        //console.log(msg);
        }
        $(this).html(msg);
      }
    });
  }

//////////////////////
//取引：
//////////////////////
  //カードナンバー順に
  function trade_default_check() {
    $('a[href="/card/trade.php"]').attr('href', '/card/trade.php?t=name&k=&s=no&o=a');
    $('#ig_trademenu').find('.t_menu1 > a').attr('href', '/card/trade.php?t=name&k=&s=no&o=a');
  }

//////////////////////
//プロフィール：
//////////////////////
  //合戦報告書・一戦防衛・防御リンクの追加
  function reportlist_check() {
    if (location.pathname != "/user/")
      return;
    $('DIV.common_box3bottom > TABLE').find('strong').find('A:eq(0)').each(function() {
      var name = $(this).parent().text().match(/\S+/)[0];
      //console.log(name);
      var lordName = [];
      for (var i = 0; i < name.length; i++) {
        if (name[i] <= ')')
          lordName[i] = escape(name[i]);
        else if (name[i] <= '~')
          lordName[i] = encodeURIComponent(name[i]);
        else
          lordName[i] = name[i];
      }
      name = lordName.join("");
      var world = {'織田家': 1,'足利家': 2,'黒田家': 2,'武田家': 3,'上杉家': 4,'徳川家': 5,'毛利家': 6,'伊達家': 7,'浅井家': 7,
      '北条家': 8,'今川家': 8,'長宗我部家': 9,'島津家': 10,'豊臣家': 11,'大友家': 11,'最上家': 12,'石田家': 12};
      var worldNo = parseInt(world[$('.name').text()]);
      $(this).parent().after(' <span style="font-weight: normal;font-size: 12px;">　' +
        '<a href="/war/list.php?m=&s=1&name=lord&word='+name+'&coord=map&x=&y=">[合戦報告書]</a> ' +
        '<a href="/user/ranking.php?m=war_point&find_rank=&find_name=' + name + '&c=0">[格付]</a> ' +
        '<a href="ranking.php?m=attack_score&find_rank=&find_name='+name+'&c=0">[一戦撃破/防御]</a> ' +
        '<a href="/war/war_ranking.php?m=&c=' + worldNo + '&find_rank=&find_name=' + name + '">[合戦格付]</a></span>');
    });
    $('DIV.common_box3bottom > TABLE').find('DIV.pro4').find('A:eq(0)').each(function() {
      var name = $(this).parent().text().match(/\S+/)[0];
      var allianceName = [];
      for (var i = 0; i < name.length; i++) {
        if (name[i] <= ')')
          allianceName[i] = escape(name[i]);
        else if (name[i] <= '~')
          allianceName[i] = encodeURIComponent(name[i]);
        else
          allianceName[i] = name[i];
      }
      $(this).after('&nbsp;<span style="font-weight: normal;font-size: 12px;"><a href="/war/list.php?m=&s=1&name=alliance&word=' + allianceName.join('') + '&coord=map&x=&y=">[合戦報告書]</a></span>');
    });
  }

  //領地情報に陥落中の表示
  function fall_check() {
    if (location.pathname != "/user/")
      return;
    var myname = $('#lordName').text().trim();
    var myname2 = $('p.para.bb').text().trim();
    if(myname != myname2){
      var Table1 = $('table.common_table1.center:first');
      Table1.find('th:last').after('<th><input type="button" value="拠点の状態" class="state_check"></th>');
      Table1.find('tr.fs14').slice(0).find('td:last').after('<td class="disp"></td>');
      var nm = [];
      var tmp = [];
      var ins_point = [];
      $('input.state_check').click(function(){
        $(this).attr('disabled', true);
        
        $(this).closest('tbody').find('tr.fs14').each(function() {
          switch ($(this).find('td:eq(0)').text()) {
            case '本領':
            case '所領':
            case '出城':
            break;
          }
          var href = $(this).find('a:eq(0)').attr('href');
          nm.push( href );
          var t = href.match(/[map|land]\.php\?(.+)$/);
          tmp.push(t[1]);
          ins_point.push($(this).find('td:last'));
        });
        
        fall_write(nm, tmp, ins_point, 0);
      });
    }
  }

  function fall_write(nm, tmp, ins_point, cnt) {
    if (cnt >= nm.length)
      return;
    $.post(
      '/map.php?' + tmp[cnt],
      function(html) {
        var areas = $(html).find('#mapOverlayMap > area');
        var imgs = $(html).find('#ig_mapsAll > img').filter(function() {
          if ($(this).attr('src').indexOf('outside') < 0)
            return $(this);
        });
        var index = areas.index(areas.filter('[onclick*="' + nm[cnt] + '"]'));
        if (index >= 0 && imgs.eq(index).attr('src').indexOf('fall_capital') > 0) {
          $(ins_point[cnt]).append('<span class="red">陥落中</span>');
        } else {
          $(ins_point[cnt]).append('-');
        }
        cnt++;
        fall_write(nm, tmp, ins_point, cnt);
      }
    );
  }

  //拠点LV（一括Lvアップの伏線）
  function lv_check() {
    if (location.pathname != "/user/")
      return;
    var myname = $('#lordName').text().trim(),
      myname2 = $('p.para.bb').text().trim();
    if(myname == myname2){
      var lastSelect = $('#sideboxBottom').find('div.basename').find('li.on').text(),
        firsTable = $('table.common_table1.center:eq(0)'),
        lastTable = $('table.common_table1.center:eq(1)');
      firsTable.find('th:last').after('<th><input type="button" value="LV" id="lv_check"></th>');
      firsTable.find('tr').find('td:last').after('<td></td>');
      lastTable.find('th:last').after('<th>LV</th>');
      lastTable.find('tr').find('td:last').after('<td></td>');
      var nm = [];
      var url = [];
      var tmp = [];
      var ins_point = [];
      $('#lv_check').click(function(){
        $(this).attr('disabled', true);
        
        $('table.common_table1.center').find('tr.fs14').each(function() {
          var t = $(this).find('a:eq(1)').attr('href').match(/map\.php\?(.+)$/);
          url.push(t[1]);
          nm.push($(this).find('td:eq(0)').text());
          tmp.push($(this).find('a:eq(0)').attr('href'));
          ins_point.push($(this).find('td:last'));
        });
        
        lv_write(nm, url, tmp, ins_point, 0, lastSelect);
      });
    }
  }

  //拠点のLV表示(自拠点のみ)
  function lv_write(nm, url, tmp, ins_point, cnt, lastSelect) {
    if (cnt >= tmp.length) {
      $('table.common_table1.center').find('tr.fs14').each(function() {
        if ($(this).find('a:eq(0)').text().replace(/^\s+|\s+$/g, "") == lastSelect) {
          var href = $(this).find('a:eq(0)').attr('href');
          $.post( href, function(html) {
            return;
          });
        }
      });
      return;
    }
    $.post( tmp[cnt], function(html) {
      if ((nm[cnt] == '本領') || (nm[cnt] == '所領')) {
        var lv = $(html).find('#mapOverlayMap').find('area[title^="本丸 "]').attr('title');
        if (lv === undefined) {
          lv = $(html).find('#mapOverlayMap').find('area[title^="村落 "]').attr('title');
        }
        if (lv === undefined) {
          lv = $(html).find('#mapOverlayMap').find('area[title^="砦 "]').attr('title');
        }
        if (lv === undefined) {
          lv = '-';
        }
        if (lv != '-') {
          lv = lv.match(/\d/g).join('');
        }
        $(ins_point[cnt]).html( lv );
        cnt++;
        lv_write(nm, url, tmp, ins_point, cnt, lastSelect);
      }
      else {
        $.post( '/facility/camp_proc.php?' + url[cnt],function(html) {
          var key = $(html).find('div.ig_decksection_top').text();
          if (key !== '') {
            key = key.match(/\d/g).join('');
          }
          $(ins_point[cnt]).html( key );
          cnt++;
          lv_write(nm, url, tmp, ins_point, cnt, lastSelect);
        });
      }
    });
  }

//////////////////////
//秘境探索：
//////////////////////
  //全部隊自動選択/前回の秘境を記憶
  function dungeon_check() {
    if(location.pathname != "/facility/dungeon.php")
      return;
    var dungeon_btn = $('div.btnarea').clone();
    $('ul.dungeon_list_header').after(dungeon_btn);
    var idx = localStorage.getItem(location.hostname + 'crx_dungeon_idx');
    
    if (idx!=null) {
      $('INPUT[name="dungeon_select"][value="'+idx+'"]').attr('checked', true);
    }
    $('INPUT[name="dungeon_select"]').change(
        function() {
          localStorage.setItem(location.hostname + 'crx_dungeon_idx', $('INPUT[name="dungeon_select"]:checked').val());
        }, false);
    // change end
    
    if (options.hikyou_all) {
      $('DIV.ig_decksection_innermid').find('INPUT[name="unit_select[]"]').each(function(){
          $(this).attr('checked',true);
      })
    }
  }

  function dungeon_troops() {
    if(location.pathname != "/facility/dungeon.php")
      return;
    $.post('/facility/unit_status.php?dmo=all', function(html) {
      var waitTroops =  $(html).find('.table_fightlist:has(img[src$="mode_wait.png"])');
      var waitBase = waitTroops.eq(0).find('.td_bggray:eq(0) a').text();
      
      $('#sideboxBottom').find('div.basename:eq(0)').find('li > a').each(function() {
        var BaseName = $(this).text();
        
        if( waitBase == BaseName ){
          var DungeonTroops = $(this).attr('href');
          $('<a href="' + DungeonTroops +'" style="color: #060;">部隊配置拠点へ移動する</a>')
          .appendTo('div.dungeon_boxbottom > p');
        }
        
      });
    });
  }

  //秘境探索：部隊の兵種と兵数を表示
  function dungeon_soldiers() {
    if(!options['dungeon_soldiers']) return;
    if(location.pathname != "/facility/dungeon.php") return;
    var sol_cnt = {};
    var counter = 0;
    var txt_cnt = '<tr><th class="moko-th subhead">兵数</th>';
    var txt_kind = '<tr><th class="moko-th subhead">兵種</th>';
    var commandsol_hash = {
      commandsol_yari1: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_yari1.gif" alt="足軽">' ,
      commandsol_yari2: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_yari2.gif" alt="長槍足軽">' ,
      commandsol_yari3: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_yari3.gif" alt="武士">' ,
      commandsol_yari4: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_yari4.gif" alt="国人衆">' ,
      commandsol_yumi1: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_yumi1.gif" alt="弓足軽">' ,
      commandsol_yumi2: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_yumi2.gif" alt="長弓兵">' ,
      commandsol_yumi3: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_yumi3.gif" alt="弓騎馬">' ,
      commandsol_yumi4: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_yumi4.gif" alt="海賊衆">' ,
      commandsol_kiba1: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_kiba1.gif" alt="騎馬兵">' ,
      commandsol_kiba2: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_kiba2.gif" alt="精鋭騎馬">' ,
      commandsol_kiba3: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_kiba3.gif" alt="赤備え">' ,
      commandsol_kiba4: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_kiba4.gif" alt="母衣衆">' ,
      commandsol_heiki1: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_heiki1.gif" alt="破城鎚">' ,
      commandsol_heiki2: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_heiki2.gif" alt="攻城櫓">' ,
      commandsol_heiki3: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_heiki3.gif" alt="大筒兵">' ,
      commandsol_heiki4: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_heiki4.gif" alt="鉄砲足軽">' ,
      commandsol_heiki5: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_heiki5.gif" alt="騎馬鉄砲">' ,
      commandsol_heiki6: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_heiki6.gif" alt="雑賀衆">' ,
      commandsol_heiki7: '<img src="http://cache.sengokuixa.jp/world/20130516-01/img/deck/br_job_heiki7.gif" alt="焙烙火矢">' 
    };
    $('table.table_waigintunit').find('tr:eq(0)').find('td:eq(0)').attr('rowspan','5');
    $('table.table_waigintunit').find('tr:eq(1)').find('td:eq(0)').attr('rowspan','4').css('background-color', '#808080');
    $('table.table_waigintunit').find('tr:eq(1)').find('td:eq(0)').attr('rowspan','5');
    $('DIV[id^="cardWindow_"]').each(function() {
      var cid = $(this).attr('id').substring(11);
      txt_cnt += '<td colspan="2" class="busho_name"><span>';
      txt_cnt +=  $(this).find('div.cardfront').find('span.commandsol_no').find('SPAN[id^="card_commandsol_cnt_"]').text();
      txt_cnt += '人</span></td>';
      txt_kind += '<td colspan="2" class="busho_name">';
      var txt_kind_tmp = $(this).find('div.cardfront').find('div.parameta_area').find('SPAN[id^="card_commandsol_"]').attr('class');
      txt_kind += commandsol_hash[txt_kind_tmp];
      txt_kind += '</td>';
  
      if(counter%4<3) {
        var sho_check;
        var $this1;
        switch( Math.floor(counter/4) ) {
        case 0:
          $this1 = $('table.table_waigintunit:eq(0)').find('tr:eq(1)');
          break;
        case 1:
          $this1 = $('table.table_waigintunit:eq(1)').find('tr:eq(1)');
          break;
        case 2:
          $this1 = $('table.table_waigintunit:eq(2)').find('tr:eq(1)');
          break;
        case 3:
          $this1 = $('table.table_waigintunit:eq(3)').find('tr:eq(1)');
          break;
        case 4:
          $this1 = $('table.table_waigintunit:eq(4)').find('tr:eq(1)');
          break;
        default:
          break;
        }
        switch( counter%4 ) {
        case 0:
          sho_check = $this1.find('td:eq(2)').text();
          break;
        case 1:
          sho_check = $this1.find('td:eq(3)').text();
          break;
        case 2:
          sho_check = $this1.find('td:eq(4)').text();
          break;
        default:
          break;
        }
        if(sho_check.search(/-/) != -1){
          for (i = counter%4; i < 3; i++) {
            txt_cnt += '<td colspan="2" class="busho_name"> - </td>';
            txt_kind += '<td colspan="2" class="busho_name"> - </td>';
          }
          txt_cnt += '</tr>';
          txt_kind += '</tr>';
          switch( Math.floor(counter/4) ) {
          case 0:
            $('table.table_waigintunit:eq(0)').find('tr:last').after(txt_kind+txt_cnt);
            break;
          case 1:
            $('table.table_waigintunit:eq(1)').find('tr:last').after(txt_kind+txt_cnt);
            break;
          case 2:
            $('table.table_waigintunit:eq(2)').find('tr:last').after(txt_kind+txt_cnt);
            break;
          case 3:
            $('table.table_waigintunit:eq(3)').find('tr:last').after(txt_kind+txt_cnt);
            break;
          case 4:
            $('table.table_waigintunit:eq(4)').find('tr:last').after(txt_kind+txt_cnt);
            break;
          default:
            break;
          }
          txt_cnt = '<tr><th class="moko-th subhead">兵数</th>';
          txt_kind = '<tr><th class="moko-th subhead">兵種</th>';
          counter+= (3-(counter%4));
        }
      } else {
        txt_cnt += '</tr>';
        txt_kind += '</tr>';
        switch( (counter+1)/4 ) {
        case 1:
          $('table.table_waigintunit:eq(0)').find('tr:last').after(txt_kind+txt_cnt);
          break;
        case 2:
          $('table.table_waigintunit:eq(1)').find('tr:last').after(txt_kind+txt_cnt);
          break;
        case 3:
          $('table.table_waigintunit:eq(2)').find('tr:last').after(txt_kind+txt_cnt);
          break;
        case 4:
          $('table.table_waigintunit:eq(3)').find('tr:last').after(txt_kind+txt_cnt);
          break;
        case 5:
          $('table.table_waigintunit:eq(4)').find('tr:last').after(txt_kind+txt_cnt);
          break;
        default:
          break;
        }
        txt_cnt = '<tr><th class="moko-th subhead">兵数</th>';
        txt_kind = '<tr><th class="moko-th subhead">兵種</th>';
      }
      counter++;
    });
  }

//////////////////////
//部隊: 待機武将一覧：
//////////////////////
  //選択中のデッキの配置拠点にアンダーライン
  $(function () {
    if (location.pathname != "/card/deck.php")
      return;
      var deckSelect = $('div.ig_deck_unitdata_assign.deck_wide_select').text().trim() ||
              $('#select_village').children(':selected').attr('label');
      $('#sideboxBottom').find('div.sideBoxInner.basename').find('li').children()
      .each(function(){
        var baseName = $(this).text();
        if( deckSelect == baseName ){
          $(this).css({'text-decoration':'none', 'border-bottom':'2px solid coral'});
        }
      });
  });
  
  //待機武将一覧のレイアウト
  function card_deck_layout() {
    if (location.pathname != "/card/deck.php")
      return;
    $('#ig_deckheadmenubox').css({'height':'82px', 'margin-top':'5px'});
    $('#ig_keikenup').css({'top':'4px', 'right':'-6px'});
    $('#ig_deckmenu').remove();
    //組分けボタン:プルダウンメニュー
    for( var i = 0; i <= 5; i++){
      $('li[class^="btn_category_0' + i + '"]').empty();
      
      $('<div class="pulldown_' + i + '" style="height: 20px;" />')
      .appendTo('li[class^="btn_category_0' + i + '"]');

      $('<div class="menu_list">' +
        '<a href="/facility/set_unit_list.php?show_num=100&select_card_group=' + i + '">全兵士編成</a>' +
        '<a href="/facility/set_unit_list.php?show_num=50&select_card_group=' + i + '">兵士編成【50】</a>' +
        '<a href="/facility/set_unit_list.php?show_num=200&select_card_group=' + i + '">兵士編成【20】</a>' +
        '</div>'
      ).insertAfter('div.pulldown_' + i );
    }
    $('li[class^="btn_category_"]').live('contextmenu', function() {
      $('li[class^="btn_category_"]').find('div.menu_list').hide();
      $(this).find('div[class^="pulldown_"]').css('box-shadow', '');
      $(this).find('div.menu_list').slideDown(150);
      return false;
    }).hover(function() {
      //
    },function() {
      $(this).find('div.menu_list').slideUp(150);
    });
    //カード表示のレイアウト
    $('#ig_deck_cardlistmenu2').after('<div id="moko_container"></div>');
    $('#ig_deck_smallcardarea_out').find('div.ig_deck_smallcardarea').each(function(){
      var Gage2 = $(this).find('div.battlegage2').clone();
      $(this).find('div.battlegage2').remove();
      $(this).children('div:eq(1)')
      .after( Gage2 );
      Gage2.prepend('<span style="position: absolute;width: 116px;padding-top: 4px;text-align: center;font-size: 10px;color:white;">討伐ゲージ</span>');
      $(this).find('div.ig_deck_smallcarddelete.clearfix').hide();
      //指揮兵数がMAXの時、色付け
      var area = $(this).find('table.ig_deck_smallcarddata:eq(0)').find('tr:gt(2)');
      var soldiersval = $(this).find('table.ig_deck_smallcarddata:eq(0)').find('tr:eq(3) td').text().split('/');
      var nowval = soldiersval[0];
      var maxval = soldiersval[1];
      
      if(nowval == maxval) {
        area.css('background-color','#660');
      }
    });
    //負傷武将を強調表示
    var Cardarea = $('div.ig_deck_smallcardarea:contains("HP全回復までセット不可")').css({'box-shadow':'inset 0 0 20px firebrick', 'border-bottom-color':'#884545'});
        Cardarea.find('table.ig_deck_smallcarddata:eq(0)').find('tr:eq(2)').css('background-color','maroon');
    // 選択中の部隊へ」をクリック確認
    var Howto = $('#howto_butai_hensei').size();
    $('div.ig_deck_smallcardarea').find('img[alt="選択中の部隊へ"]')
    .live('click',function(){
      if( Howto > 0 ) {
        $(this).closest('div.ig_deck_smallcardarea').addClass('cardarea_select_first');
      }
      else {
        $(this).closest('div.ig_deck_smallcardarea').addClass('cardarea_select');
      }
    });
    //ページャーをAjaxに/リンクを全表示に組み分けボタンの関数書き替え
    if (options.pager_ajax) {
      toggle_unit_brigade_btn_func = function () {}; // ixaデフuォルトのトグル関数を書き替え
      var toggle_unit_brigade_btn_func_moko = function () {
        var cn = this.className.match(/\d/);
        cn++;
        if (cn > 5)
          cn = 1;
        this.className = this.className.replace(/\d/,cn);
      };
      $('#ig_deck_smallcardarea_out').find('div.ig_deck_smallcardarea').each(function() {
        $(this).find('div.ig_deck_unitbox div').click(toggle_unit_brigade_btn_func_moko);
      });
    }
    //出品中カードを暗色表示
    if (options.being_exhibited) {
      $('div.ig_deck_smallcardarea:contains("出品中は兵編成できません")').css('opacity','0.7');
    }
  
  }

  function union_deck_layout() {
    if (location.pathname != "/card/deck.php" && location.pathname != "/union/levelup.php" && location.pathname != "/union/remove.php" && location.pathname != "/union/additional.php"
      && location.pathname != "/card/trade.php" && location.pathname != "/card/exhibit_list.php" && location.pathname != "/card/bid_list.php" )
      return;
      //「技」の脱落回避
      $('#ig_deck_smallcardarea_out').find('div.ig_deck_smallcardarea').each(function(){
        $(this).find('table.ig_deck_smallcarddata:eq(2)').find('th').css({'padding':'2px 0', 'text-align':'center'});
      });
      frame_take_away();
  }

  function frame_take_away() {
    // カード枠消し
    $('#TB_ajaxContent').find('div.ig_card_cardStatusFront').live('click', function() {
      var Parameta = $(this).find('img.ig_card_parameta, div.parameta_area, img.ig_card_frame'),
          sizes = Parameta.filter(':visible').size();
      if (sizes == 3) {
        Parameta.filter('img.ig_card_parameta, div.parameta_area').fadeOut();
      }
      else if (sizes == 1) {
        Parameta.filter('img.ig_card_frame').fadeOut();
      }
      else {
        Parameta.fadeIn();
      }
      return false;
    });
  }

  //待機武将一覧をワイド表示
  function width_display() {
    if (location.pathname != "/card/deck.php" &&
      location.pathname != "/union/levelup.php" && 
      location.pathname != "/union/remove.php" &&
      location.pathname != "/union/additional.php" )
      return;
    if (!options.width_display)
      return;
    if( location.pathname == "/card/deck.php" ){ $('div.ig_decksection_top').remove(); };
    var Total = $('select.sortTotal').find('option:selected').val();
    if (options.width_display_mod == '0' && Total == 9)       { $('#deck_file').addClass('four_columns'); $('#deck_file').find('#ig_decksection3').addClass('vertical_3'); }
    else if (options.width_display_mod == '0' && Total == 12) { $('#deck_file').addClass('four_columns'); $('#deck_file').find('#ig_decksection3').addClass('vertical_3'); }
    else if (options.width_display_mod == '0' && Total == 15) { $('#deck_file').addClass('four_columns'); $('#deck_file').find('#ig_decksection3').addClass('vertical_4'); }
    else if (options.width_display_mod == '1' && Total == 9)  { $('#deck_file').addClass('five_columns'); $('#deck_file').find('#ig_decksection3').addClass('vertical_2'); }
    else if (options.width_display_mod == '1' && Total == 12) { $('#deck_file').addClass('five_columns'); $('#deck_file').find('#ig_decksection3').addClass('vertical_3'); }
    else if (options.width_display_mod == '1' && Total == 15) { $('#deck_file').addClass('five_columns'); $('#deck_file').find('#ig_decksection3').addClass('vertical_3'); }
    else if (options.width_display_mod == '2' && Total == 9)  { $('#deck_file').addClass('six_columns');  $('#deck_file').find('#ig_decksection3').addClass('vertical_2'); }
    else if (options.width_display_mod == '2' && Total == 12) { $('#deck_file').addClass('six_columns');  $('#deck_file').find('#ig_decksection3').addClass('vertical_2'); }
    else if (options.width_display_mod == '2' && Total == 15) { $('#deck_file').addClass('six_columns');  $('#deck_file').find('#ig_decksection3').addClass('vertical_3'); }
  }

  //兵編成セット補助
  function deck_soldier_set() {
    if (location.pathname != "/card/deck.php")
      return;
    $('input[id^="unit_cnt_text_"]')
    .each(function(){
      $('<span class="one" style="cursor: pointer; color: #BA8BE5; margin: 0 0.5em;">[<span>1</span>]</span>')
      .insertAfter( this );
      $(this).closest('tr').find('td.table_view:eq(0)').css('width', '54px');
      $(this).closest('tr').find('td.table_view:eq(1)').css('width', '80px');
      $(this).closest('tbody').find('th.border_right')
      .append('<select id="unit_set_select" style="float: right;margin-right: 4px;">' +
          '<option value="1">兵数選択</option>' +
          '<option value="5">5</option>' +
          '<option value="10">10</option>' +
          '<option value="50">50</option>' +
          '<option value="100">100</option>' +
          '<option value="250">250</option>' +
          '<option value="500">500</option>' +
          '<option value="1000">1000</option>' +
           '</select>'
        );
    });
    $('span.one').click(function() {
      var tg_span = $(this).find('span').text();
      var tg_input = $(this).parent().find('input[id^="unit_cnt_text_"]');
      var tg_button = $(this).parent().find('input[id^="btn_change_"]');
      tg_input.val( tg_span );
      tg_button.click();
    });
    $('select#unit_set_select').change(function() {
      var set_val = $(this).val();
      var tg_input = $(this).closest('tbody').find('input[id^="unit_cnt_text_"]');
      var tg_button = $(this).closest('tbody').find('input[id^="btn_change_"]');
      tg_input.val( set_val );
      tg_button.click();
    });
    $('span[id^="unit_set_link_"]').click(function() {
      var tg_button = $(this).next('input[id^="btn_change_"]');
      tg_button.click();
    });
    $('input[id^="btn_change_"]').each(function() {
      var i = $(this).attr('id').replace('btn_change_', '');
      $('#unit_set_link' + i).click(function() {
        $('#btn_change_' + i).trigger('click');
      });
      $('#unit_id_select_' + i).change(function() {
        if ( ($('#unit_id_select_' + i).val() !== '') && ($('#unit_cnt_text_' + i).val() == '1') ) {
          $('#btn_change_' + i).trigger('click');
        }
        else if ( $('#unit_id_select_' + i).val() === '' ) {
          $('#unit_cnt_text_' + i).attr('value', '0');
          $('#btn_change_' + i).trigger('click');
        }
        else{
          var nowtext = $('#unit_cnt_text_' + i).val();
          $('#unit_cnt_text_' + i).attr('value', nowtext );
          $('#btn_change_' + i).trigger('click');
        }
      });
    });
    $('input.input_kazu').each(function() {
      var max = $(this).closest('tr').find('span[id^="lead_unit_"]').text();
      if ( $(this).val() == max ) {
          $(this).css('background-color', 'pink');
        }
        if ( $(this).val() == 0 ) {
          $(this).css('background-color', 'darkGray');
        }
    });
    $('input[id^="btn_change_"]').click(function() {
      var naw_cut = $(this).parent().find('input.input_kazu');
      var naw_cut_Val = naw_cut.val();
      var maxVal =  $(this).closest('tr').find('span[id^="lead_unit_"]').text();
      if ( maxVal == naw_cut_Val ) {
        naw_cut.css('background-color', 'pink');
      }
      else if ( naw_cut_Val == 0 ) {
        naw_cut.css('background-color', 'darkGray');
      }
      else {
        naw_cut.css('background-color', 'white');
      }
    });
    
    soldiers_max_color_change();
  }
  function soldiers_max_color_change() {
    $('input[id^="btn_change_"]').click(function(){
      var cid = $(this).attr('id').split('_')[2];
      var setarea = $('#deck_unit_cnt_tr_' + cid).parent().find('tr:gt(2)');
      var setsol = $('#unit_cnt_text_' + cid).val();
      var maxsol = $('#deck_unit_cnt_tr_' + cid).find('td').text().trim().split('/')[1];
      if( setsol == maxsol ){
        setarea.css('background-color','#660');
      }
      else{
        setarea.css('background-color','');
      }
    });
  }

  // 組ボタンを上部にも表示
  function category_clone() {
    if (location.pathname != "/card/deck.php")
      return;
    if (!options.category_clone)
      return;
    var menubox = $('#ig_deckheadmenubox');
    var category = $('#btn_category').clone().css('margin','0 0 5px 15px');
    var deckcost = $('#ig_deckcost').clone().css({'top':'4px', 'left':'120px'});
    menubox.after( category );
    menubox.append( deckcost );
    $('#ig_cardreverse').remove();
  }

  //スクロールボタン2
  $(function(){
    if (location.pathname != "/union/levelup.php" && location.pathname != "/union/remove.php" && location.pathname != "/union/additional.php")
      return;
    $('#bottom_box').remove();
    var offset = $('#deck_file').find('#ig_decksection3').offset();
    $('#deck_file').find('#ig_decksection3').after('<div id="bottom_box" />');
    $('<div id="scroller_top" class="scr-button">TOP</div>')
    .click(function() {
      $('html,body').animate({ scrollTop: 0 }, 'fast');
      return false;
    }).appendTo('#bottom_box');
    
    $('<div id="scroller_up" class="scr-button">▲</div>')
    .click(function() {
      $('html,body').animate({ scrollTop: offset.top }, 'fast');
      return false;
    }).appendTo('#bottom_box');
  });

  //スクロールボタン
  function firstcard_prepara() {
    if (location.pathname != "/card/deck.php")
      return;
    $('#add_this').remove();
    $('#bottom_box').remove();
    $('#ig_unitchoice').append('<li id="add_this"></li>');
    $('<div id="scroller" class="scr-button">待機武将一覧 ▼</div>')
    .click(function() {
        $('html,body').animate({ scrollTop: 1110 }, 'fast');
        return false;
    }).appendTo('#add_this');
    
    $('#ig_decksection3').after('<div id="bottom_box" />');
    $('<div id="scroller_top" class="scr-button">TOP</div>')
    .click(function() {
      $('html,body').animate({ scrollTop: 0 }, 'fast');
      return false;
    }).appendTo('#bottom_box');
    
    $('<div id="scroller_up" class="scr-button">▲</div>')
    .click(function() {
      $('html,body').animate({ scrollTop: 1110 }, 'fast');
      return false;
    }).appendTo('#bottom_box');
    
    //小隊長をすべて外すを表示
    if(options.platoon_leader_remove){
      //$('<img id="platoon_remove" src="' + IMAGES.platoon_remove_button + '" />')
      $('<div id="platoon_remove" class="mk-button_m">小隊長を全て外す</div>')
      .click(function(){
      if (!confirm("小隊長をすべて部隊から外します。よろしいですか？\n（武将はHPが減った状態で待機状態に戻ります）"))
        return;
        $('img[alt="外す"]').each(function(){
          var source = $(this).parent().attr('onClick').match(/'.*?'/g),
            unit_assign_id= source[0].replace(/'/g, ''),
            unset_unit_squad_id= source[1].replace(/'/g, ''),
            select_assign_no = $('#select_assign_no').val(),
            select_card_group = $('#select_card_group').val(),
            p = $('#p').val();
          var data = {
            select_assign_no: select_assign_no,
            unit_assign_id: unit_assign_id,
            unset_unit_squad_id: unset_unit_squad_id,
            change_unit_squad_id:'',
            dungeon_unit_squad_id:'',
            dungeon_card_id:'',
            dungeon_select:'',
            deck_mode:'nomal',
            p: p,
            select_card_group: select_card_group
          };
          $.post( '/card/deck.php', data, function(data){ location.href = '/card/deck.php?ano=' + select_assign_no; });
        });
      }).prependTo('#add_this').hide();
      
    if( $('img[alt="外す"]').length ){ $('#platoon_remove').show(); }
    
    }
    
    //選択中の部隊へを上部に
    if (options.firstcard_in) {
      var org_card = $('#ig_deck_smallcardarea_out').find('a:has(img[alt="選択中の部隊へ"])').eq(0);
      var card = org_card.clone().css({'display':'block', 'margin':'-7px 0 0 275px','width':'220px', 'height':'29px', 'text-align':'center', 'background-color':'rgba(0, 0, 0, 0.5)', 'border-radius':'4px'});
      var bname = org_card.closest('div.ig_deck_smallcardarea').find('span.ig_deck_smallcard_cardname').text();
      card.find('img').css('vertical-align', '-10px');
      card.attr('id', 'first_in');
      card.prepend('<span style="font-size: 13px; font-weight: bold;">' + bname + ' を</span>');
      $('#first_in').remove();
      $('#ig_deckheadmenubox').append( card );
    }
  }

  //全部隊解散
  function all_dissolution() {
    if (!options.all_dissolution)
      return;
    if (location.pathname != "/card/deck.php")
      return;
    
    $('<a href="javascript:void(0);" onclick="return false;" id="deck_dissolution"><img src="' + IMAGES.btn_all_breakup + '" alt="全部隊解散"  style="visibility: hidden; position: absolute; top: 51px; left: 140px;" /></a>')
    .appendTo('#ig_deckheadmenubox');
    
    var assign = $('#ig_unitchoice').find('li:contains(新規部隊を作成)').size();
    if( assign < 4 ){
    
    $('#deck_dissolution > img').css('visibility', 'visible');
    
    $('#deck_dissolution').live('click', function() {
      if (!confirm("全部隊を解散しますか？\n(武将はHPが減った状態で待機状態に戻ります)"))
        return;
      nowLoading();
      var p = $('#p').attr('value');
      deck_dissolution( 0, '', '', p );
    });
    
    }
  }

  function deck_dissolution( select_assign_no, unit_assign_id, unset_unit_squad_id, p ) {
    if (select_assign_no > 4) {
      location.href = '/card/deck.php';
      return;
    }
    var work_id = '';
    var select_card_group = $('#select_card_group').val();
    $.post(
      '/card/deck.php',
      { select_assign_no: select_assign_no,
        unit_assign_id: unit_assign_id,
        unset_unit_squad_id: unset_unit_squad_id,
        deck_mode: 'nomal',
        p: p,
        select_card_group: select_card_group
      },
      function(html) {
        var Dissolution = $(html).find('div.deck_navi').find('img:eq(0)');
        var panel = $(html).find('#howto_butai_hensei').size();
        if ( panel == 1  ) {
          location.href = location.pathname;
        }
        else if ( Dissolution.attr('alt') === undefined && panel == 0  ) {
          select_assign_no++;
          deck_dissolution( select_assign_no, unit_assign_id, unset_unit_squad_id, p );
          return;
        }
        else {
          work_id = Dissolution.closest('a').attr('onClick').match(/'.*?'/g);
        }
        if ( work_id[0]) {
          unit_assign_id = work_id[0].replace(/'/g, '');
          unset_unit_squad_id = work_id[1].replace(/'/g, '');
        }
        deck_dissolution( select_assign_no, unit_assign_id, unset_unit_squad_id, p );
        return;
      }
    );
  }

  //全部隊配置
  function all_deck_setting() {
    if (!options.all_deck_setting)
      return;
    if (location.pathname != "/card/deck.php")
      return;
    var nowcost = $('#ig_deckcost > span').text().split('/')[0];
    var maxcost = $('#ig_deckcost > span').text().split('/')[1];
    var vacacost = maxcost - nowcost;
    var Vacancy = $('#ig_unitchoice').find('li:contains("[---新規部隊を作成---]")').size();
    
    if(options.all_setting_mod == '1'){
      $('<a href="javascript:void(0);" onclick="return false;" id="all_set"><img src="' + IMAGES.dungeon_btn_all_setting + '" alt="全部隊配置" style="visibility: hidden; position: absolute; top: 51px; left: 16px;" /></a>')
      .appendTo('#ig_deckheadmenubox');
    }
    else {
      $('<a href="javascript:void(0);" onclick="return false;" id="all_set"><img src="' + IMAGES.btn_all_setting + '" alt="全部隊配置" style="visibility: hidden; position: absolute; top: 51px; left: 16px;" /></a>')
      .appendTo('#ig_deckheadmenubox');
    }
    
    if( vacacost > 0.5 && Vacancy != 0 ) {
    
    $('#all_set > img').css('visibility', 'visible');
    var nawON = $('#select_card_group').val();
    
    if( nawON == 0 ) { var Category = '全武将' }
    else if( nawON == 1 ) { var Category = '第一組' }
    else if( nawON == 2 ) { var Category = '第二組' }
    else if( nawON == 3 ) { var Category = '第三組' }
    else if( nawON == 4 ) { var Category = '第四組' }
    else if( nawON == 5 ) { var Category = '未設定' }
    
    $('#all_set').live('click', function() {
      var cardareaSize = $('#ig_deck_smallcardarea_out').find('div.ig_deck_smallcardarea').size();
      if( cardareaSize == 0 ) {
        if (confirm('配置可能なカードが存在しません。'))
          return false;
      }
      else {
        if(options.all_setting_mod == '1'){
          if (!confirm("本拠地に【 "+ Category +" 】から全部隊を配置しますか？\n(現在のソート順で配置可能な武将から順次配置されます)"))
            return;
        }
        else {
          if (!confirm("【 "+ Category +" 】から全部隊を配置しますか？\n(現在のソート順で配置可能な武将から順次配置されます)"))
            return;
        }
        nowLoading();
        var assign_no = 0;
        
        $('#ig_unitchoice').find('li').each(function() {
          if($(this).attr('class') == 'now') 
            return false;
          assign_no++;
        });
        
        deck_all($('#deck'), assign_no, 1);
      }
    });
    
    }
  }

  function deck_all(html, no, index_page) {
    if (no > 4) {
      if(options.all_setting_mod == '1'){
        location.href = '/facility/dungeon.php';
        return;
      }
      else {
        location.href = '/card/deck.php';
        return;
      }
    }
    if(options.all_setting_mod == '1'){
      var basename = $('div.basename:eq(0)').find('li:first').text(),
        w_select_village = $('#select_village').find('option:contains("' + basename + '")').val();
    }
    else{
      var w_select_village = $('#select_village').find('option:selected').val();
    }
    var max_page = 1;
    if (options.pager_ajax) {
      $('ul.pager.cardstock:eq(0)').find('a.ixamoko_deckpager:last')
      .each(function() {
        max_page = parseInt( $(this).attr('page') );
      });
    }
    else {
      $('ul.pager.cardstock:eq(0)').find('li:last').each(function() {
        if ( $(this).attr('class') == 'last' ) {
          var script = $(this).find('a:eq(1)').attr('onClick');
            script = script.substring(script.indexOf('"p"'), script.length);
            script = script.match(/".*?"/g);
            script = script[1].replace(/"/g, '');
            max_page = parseInt( script );
        }
        else if ( $(this).attr('class') == '' ) {
          max_page = parseInt( $(this).find('span').text() );
        }
      });
    }
    set_deck_asc(html, 1, index_page, max_page, no, w_select_village);
  }

  function set_deck_asc(tmp, start, index_page, max_page, s_assign_no, w_select_village) {
    var set_squad_id = '';
    var set_assign_id = '';
    if(index_page > max_page) {
      deck_all(tmp, 5, index_page);
      return;
    }
    if (start > 4) {
      s_assign_no++;
      deck_all(tmp, s_assign_no, index_page);
      return;
    }
    var set_card_id = $('#set_card_id').val();
    var select_card_group = $('#select_card_group').val();
    var href = '/card/deck.php?ano=' + s_assign_no + '&select_card_group=' + select_card_group;
    
    $.post(
      href,
      {
        select_assign_no: s_assign_no,
        mode: 'assign_insert',
        set_village_id: w_select_village,
        deck_mode: 'nomal',
        p: index_page,
        select_card_group: select_card_group
      },
      function(html) {
        $(html).find('#ig_deck_smallcardarea_out').find('div.ig_deck_smallcardarea')
        .each(function() {
          if( $(this).find('img[alt="兵士編成"]').length == 0 )  //出品中
            return true;
          if( $(this).find('img[alt="選択中の部隊へ"]').length == 0 )   //配置出来ない状態( HP0 || 名称重複)
            return true;
          var work_id = ( $(this).find('a[id^="btn_gounit_"]').attr('onClick') || '' );
              work_id = work_id.replace('confirmRegist2(', '').replace(');','').split(',');
          if ( work_id == null ) 
            return true;
          var id = work_id[4].trim();
          if( $(this).find('#deck_unit_cnt_' + id ).text() === '0' ) //指揮兵数0
            return true;
          set_squad_id = work_id[1].replace(/\'/g, '').trim();
          set_assign_id = work_id[0];
          set_card_id = work_id[4].replace(/\'/g, '').trim();
            return false;
        });
        
        if (set_squad_id !== '') {
          set_assign_id = set_assign_id.replace(/\'/g, '').trim();
          
          $.post(
            href,
            {
              select_assign_no: s_assign_no,
              mode: 'assign_insert',
              set_village_id: w_select_village,
              set_assign_id: set_assign_id,
              set_card_id:set_card_id,
              set_squad_id: set_squad_id,
              select_card_group: select_card_group,
              deck_mode: 'nomal',
              p: index_page
            },
            function(html) {
              var start_leader_no = $(html).find('#ig_deck_unitdetailbox').find('img').length - 4;
              if(start_leader_no > 0 && start_leader_no != start) {
                start = start_leader_no;
              }
              var deck_cost = $(html).find('#ig_deckcost > span.ig_deckcostdata').text().match(/(\d+\.?\d?)\/(\d+)/);
              var free_cost = parseFloat(deck_cost[2]) - parseFloat(deck_cost[1]);
              if(free_cost < 1) {
                start = 4;
              }
              start++;
              set_deck_asc(html, start, index_page, max_page, s_assign_no, w_select_village);
            }
          );
        } else {
          index_page++;
          set_deck_asc(html, start, index_page, max_page, s_assign_no, w_select_village);
        }
      }
    );
  }

  function nowLoading() {
    if (arguments[0]) {
      $('#loading_mask').hide();
      $('#nowLoadingContent').hide();
      return false;
    }
    var id = '#nowLoadingContent';
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    if( $('#TB_overlay').size() == 0 ) {
      $('#loading_mask').css({'width': maskWidth,'height': maskHeight}).fadeTo(0, 0.75).show();
    }
    var winH = $(window).height();
    var winW = $(window).width();
    $(id).css('top', winH / 2 - $(id).height() / 2).css('left', winW / 2 - $(id).width() / 2).show();
    return false;
    if( $('#TB_overlay').size() > 0 ){ $('#loading_mask').hide(); }
  }

  function asort(hash, key) {
    hash.sort(function(b1, b2) {
      return b1[key] > b2[key] ? 1 : -1;
    });
    return hash;
  }

  function dsort(hash, key) {
    hash.sort(function(b1, b2) {
      return b1[key] > b2[key] ? -1 : 1;
    });
    return hash;
  }

  //拠点選択のデフォを現在の選択拠点に
  function deck_check() {
    if (!options.deck_check) return;
    if (location.pathname != "/card/deck.php")
      return;
    var t = $('#lordSiteArea').text().replace('選択中の拠点:', '');
    $('#select_village').find('option').each(function() {
      if ( $(this).text() == t ) {
        $(this).attr('selected', true );
        return false;
      }
    });
  }

  //ページャーリンクを全表示
  function replace_ulpagercardstock() {
    if(!options.pager_ajax)
      return;
    var i,
      li = '',
      ULpager = $('ul.pager.cardstock'),
      ano,
      max_page,
      this_page;
    if ( (location.pathname === "/card/deck.php" || location.pathname === "/union/levelup.php" || location.pathname === "/union/additional.php" || location.pathname === "/union/remove.php") && ULpager[0] ) {
      this_page = parseInt( ULpager.find('span')[0].innerText );
        max_page = parseInt( ULpager.find('#lastpage').attr('page') );
        
        if ( isNaN(max_page) ) {
          max_page = this_page;
        }
        for ( i=1; i<=max_page; i++) {
          li += '<li><a class="ixamoko_deckpager" page="' + i + '" href="javascript:void(0);">' + i + '</a></li>';
        }
      
      ULpager.children().remove();
      ULpager.append(li).find('li').eq( this_page - 1 ).append('<span>' + this_page + '</span>').find('a').remove();
      ULpager.find('li').eq( this_page - 1 + max_page ).append('<span>' + this_page + '</span>').find('a').remove();
    }
  }
  function desk_pager_replace() {
    
    var check = $('div.common_box2bottom').text();
    if (check.indexOf('既に5枚のカードが選択されています') >= 0) {
      $('#ig_deck_smallcardarea_out').find('img[title^="スロットにセットする"]').each(function() {
        var change_tag = $('<div class="center">(空きスロットがありません)</div>');
        $(this).parent().replaceWith( change_tag );
      });
    }
    
    $('ul.pager.cardstock').find('a').each(function() {
      var page, npage;
      if ($(this).attr('title') === '' && $(this).parent().attr('class') != 'last') {
        page = parseInt( $('ul.pager.cardstock:eq(0)').find('span').text() ) - 1;
        npage = '<a class="ixamoko_deckpager" page="' + page + '" href="javascript:void(0);"><</a>';
        $(this).replaceWith( npage );
      }
      else if ($(this).attr('title') == 'first page') {
        npage = '<a class="ixamoko_deckpager" page="1" href="javascript:void(0);"><<</a>';
        $(this).replaceWith( npage );
      }
      else {
        page = parseInt( $(this).attr('title').substring(1) );
        if (page > 0) {
          npage = '<a class="ixamoko_deckpager" page="' + page + '" href="javascript:void(0);"> ' + page + '</a>';
          $(this).replaceWith( npage );
        }
      }
    });
    
    $('ul.pager.cardstock').find('li.last').find('a').each(function() {
      var page, npage;
      if ($(this).attr('title') === '') {
        page = parseInt( $('ul.pager.cardstock:eq(0)').find('span').text() ) + 1;
        npage = '<a class="ixamoko_deckpager" page="' + page + '" href="javascript:void(0);">></a>';
        $(this).replaceWith( npage );
      }
      else if ($(this).attr('title') == 'last page') {
        var script = $(this).attr('onClick');
          script = script.substring(script.indexOf('"p"'), script.length);
          script = script.split('=');
          script = script[1].split(';');
          script = script[0].replace(/\s|"/g, '');
          npage = '<a class="ixamoko_deckpager" page="' + script + '" href="javascript:void(0);" id="lastpage">>></a>';
        $(this).replaceWith( npage );
      }
    });
  }

  //ページャーをAjaxに
  function disp_ToubatsuRestTime(initFlag) {
    
    if (this && typeof (this.ajflag) == 'undefined') {
      this.ajflag = false;
    }
    
    if (initFlag) {
      
      if (location.pathname != "/card/deck.php" && location.pathname != "/union/levelup.php" && location.pathname != "/union/additional.php" && location.pathname != "/union/remove.php")
        return;
      
      if (options.pager_ajax) {
        desk_pager_replace();
      }

      var data = '';
      var ano = '';
      var dmo = '';
      var base_cid = '';
      var added_cid = '';
      var union_type = '';
      var select_card_group = '';
      var new_cid = '';
      var add_flg = '';
      var btn_change_flg = '';
      var remove_cid = '';
      
      if (location.pathname == "/card/deck.php") {
        ano = $('#deck_file').find('#select_assign_no').val();
        dmo = $('#deck_file').find('#deck_mode').val();
        select_card_group = $('#deck_file').find('#select_card_group').val();
      }
      else {
        base_cid = $('#base_cid').val();
        added_cid = $('#added_cid').val();
        union_type = $('input[name="union_type"]').val();
        new_cid = $('#new_cid').val();
        add_flg = $('#add_flg').val();
        btn_change_flg= $('#btn_change_flg').val();
        remove_cid = $('#remove_cid').val();
      }

      $('a.ixamoko_deckpager').live('click', function(e) {
        if (disp_ToubatsuRestTime.ajflag)
          return;
        disp_ToubatsuRestTime.ajflag = true;
        var page = $(this).attr('page');
        if (location.pathname == "/card/deck.php") {
          data = {
            myselect: '',
            ano: ano,
            dmo: dmo,
            select_card_group: select_card_group,
            p: page
          };
        }
        else {
          data = {
            base_cid: base_cid,
            added_cid: added_cid,
            add_flg: add_flg,
            new_cid: new_cid,
            p: page,
            union_type: union_type,
            btn_change_flg: btn_change_flg,
            remove_cid: remove_cid
          };
        }
        $.ajax({
          type: "POST",
          url: location.pathname,
          data: data,
          cache: false,
          page: page,
          dataType: "text",
          success: function(html) {
            var cardWindow = $('div[id^="cardWindow_"]');
            var new_cardWindow = $(html).find('#ig_boxInner').find('div[id^="cardWindow_"]');
            var new_ig_decksection3 = $(html).find('#deck_file').find('#ig_decksection3');
            $('#deck_file').find('#ig_decksection3').replaceWith( new_ig_decksection3 );
            cardWindow.remove();
            if (location.pathname == "/card/deck.php") {
              $('#sidebar').before( new_cardWindow );
            }
            else {
              $('#deck_file').find('#ig_decksection3').after( new_cardWindow );
            }
            
            if (options.width_display){
              var Total = $('select.sortTotal').find('option:selected').val();
              if ( location.pathname == "/card/deck.php") $('div.ig_decksection_top').remove();
              if (options.width_display_mod == '0' && Total == 9)       { new_ig_decksection3.addClass('vertical_3'); }
              else if (options.width_display_mod == '0' && Total == 12) { new_ig_decksection3.addClass('vertical_3'); }
              else if (options.width_display_mod == '0' && Total == 15) { new_ig_decksection3.addClass('vertical_4'); }
              else if (options.width_display_mod == '1' && Total == 9)  { new_ig_decksection3.addClass('vertical_2'); }
              else if (options.width_display_mod == '1' && Total == 12) { new_ig_decksection3.addClass('vertical_3'); }
              else if (options.width_display_mod == '1' && Total == 15) { new_ig_decksection3.addClass('vertical_3'); }
              else if (options.width_display_mod == '2' && Total == 9)  { new_ig_decksection3.addClass('vertical_2'); }
              else if (options.width_display_mod == '2' && Total == 12) { new_ig_decksection3.addClass('vertical_2'); }
              else if (options.width_display_mod == '2' && Total == 15) { new_ig_decksection3.addClass('vertical_3'); }
            }
            tb_init('a.thickbox');
            disp_ToubatsuRestTime(false);
            disp_ToubatsuRestTime.ajflag = false;
            $('input[name="p"]').val(this.page);
            desk_pager_replace();
            card_deck_layout();
            favoriteSort();
            deckGroupImgView();
            deck_soldier_set();
            replace_ulpagercardstock();
            union_deck_layout();
            firstcard_prepara();
            soldiers_blind();
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            disp_ToubatsuRestTime.ajflag = false;
          //console.log(textStatus);
          }
        });
        return false;
      });
  }

  //討伐ゲージの回復時間とHP回復時間
  if ((options.toubatsu) || (options.refillhp)) {
    
    var firstf = true;
    $('#ig_deck_smallcardarea_out').find('div.ig_deck_smallcardarea').each(function() {
      var timeText, dayText, txt;
      // 討伐ゲージの回復時間
      if (options.toubatsu) {
        var BattleGage = $(this).find('span.ig_deck_battlepoint2').text();
        if (BattleGage === '')
          return;
        var tb = 300 - parseInt( BattleGage );
        
        if (tb !== 0) {
          timeText = getTime(tb);
          dayText = caddDate(new Date(), timeText);
          txt = "<div class='toubatsu' title='" + dayText + " 完了'>300まで " + timeText + "</div>";
          $(this).find('div.battlegage2').append( txt );
        }
      }
      //HP回復時間
      if (options.refillhp) {
        var currentHPrate = $(this).find('table.ig_deck_smallcarddata:eq(0) tr:eq(2) td').text();
        var currentHP = parseInt( currentHPrate.substring(0, currentHPrate.indexOf('/')) );
        if (currentHP < 100) {
          var ranklvl = $(this).find('table.ig_deck_smallcarddata:eq(0) tr:eq(1) td').text();
          var rank = parseInt( ranklvl.substring(1, 2) );
          var jobType = getJobType( $(this).find('.ig_deck_unitbox>div')[0].id.match(/\d+/)[0]);
          var lvl = parseInt( ranklvl.substring(3) );
          var cardNo = $(this).find('img.smallcard_chara').attr('src').split('/')[8],
              cardNo = parseInt(cardNo.split('_')[0]);
          var rea =  $(this).find('span.ig_deck_smallcard_cardrarety').text();
          
          timeText = getHPMAXTime( currentHP, rank, lvl, cardNo, rea, jobType );
          dayText = caddDate(new Date(), timeText);
          txt = "<div class='hp_100' title='" + dayText + " 完了'>HP全回復まで<br />あと <span class='time_text'>" + timeText + "</span></div>";
          
          $(this).find('div.battlegage2').before(txt);
        }
      }
    });
    // 討伐ゲージの回復時間(デッキ)
    if (options.toubatsu && initFlag) {
      var deckCard = $('#id_deck_card1').find('div.battlegage');
      var bg_value = parseInt( deckCard.find('span.ig_deck_battlepoint').text() );
      var timeText, dayText, txt, tb;
      
      if ( bg_value === '' ) return;
      
      if ( bg_value < 300 ) {
        tb = 300 - bg_value;
        timeText = getTime(tb);
        dayText = caddDate(new Date(), timeText);
        txt = '<div class="toubatsu_deck">300まであと ' + timeText + ' (' + dayText + ')</div>';
        deckCard.prepend(txt);
      }
      else if ( bg_value < 400 ) {
        tb = 400 - bg_value;
        timeText = getTime(tb);
        dayText = caddDate(new Date(), timeText);
        txt = '<div class="toubatsu_deck">400まであと ' + timeText + ' (' + dayText + ')</div>';
        deckCard.prepend(txt);
      }
      else if ( bg_value < 500 ) {
        tb = 500 - bg_value;
        timeText = getTime(tb);
        dayText = caddDate(new Date(), timeText);
        txt = '<div class="toubatsu_deck">500まであと ' + timeText + ' (' + dayText + ')</div>';
        deckCard.prepend(txt);
      }
    }
  }

  function getJobType( id) {
   return $( '#cardWindow_' + id + ' div.parameta_area_back span:eq(0)')[0].className;
  }

  function getTime(toubatsu) {
    var tmp = toubatsu * 163;
    var h = Math.floor(tmp / 3600);
    var m = Math.floor((tmp - h * 3600) / 60);
    var s = Math.floor(tmp - h * 3600 - m * 60);
    var tim = h + ":" +
    (m + 100).toString().substr(-2) + ':' + (s + 100).toString().substr(-2);
    return tim;
  }

  function getHPMAXTime( currentHP, rank, lv, cardNo, rea, jobType ) {
    //☆0 剣豪の基本レート(HP1辺りの回復時間)
    var HPres_kengou = [ 18, 19, 20, 21, 22, 24, 25, 30, 31, 34, 36, 40, 44, 48, 51, 54, 58, 61, 62, 70, 72 ];
    //☆0 将・忍・文の基本レート(HP1辺りの回復時間)
    var HPres_normal = [ 7, 9, 11, 13, 14, 16, 18, 20, 22, 23, 25, 27, 29, 31, 32, 34, 36, 38, 40, 41, 43 ];
    
    var rate = 0;

    //ランク★1以上の時
    if (rank > 0) {
      //剣豪
      if (  jobType === 'jobtype_2') {
        rate =  ( rank * 72 ) + HPres_kengou[lv];  //基本レートにランク1毎に +72 加算
        //console.log( 'No.' + cardNo + '/' + rea + '/' + '★' + rank + '/Lv.' + lv + '/剣豪 rate = ' + rate );
      }
      else {
          // ランクアップによる修正廃止
          rank = 0;
          lv = 20;

          //※特を基準に大凡の増減を加える。 天 = +25% 極 = +8.5% 上 = -8.5% 序 = -15%
          //基本レートにランク1毎に +43 加算
          if( rea == '天' ) {
            rate = Math.round( (( rank * 43 ) + HPres_normal[lv]) * 1.25 );
          }
          else if( rea == '極' ) {
            rate = Math.round( (( rank * 43 ) + HPres_normal[lv]) * 1.085 );
          }
          else if( rea == '特' ) {
            rate = Math.round( (( rank * 43 ) + HPres_normal[lv]) );
          }
          else if( rea == '上' ) {
            rate = Math.round( (( rank * 43 ) + HPres_normal[lv]) * 0.915 );
          }
          else if( rea == '序' ) {
            rate = Math.round( (( rank * 43 ) + HPres_normal[lv]) * 0.85 );
          }
        //console.log( 'No.' + cardNo + '/' + rea + '/' + '★' + rank + '/Lv.' + lv + '/normal rate = ' + rate );
      }
    
    }
    else {
    //ランク★0の時
    //剣豪
      if( jobType === 'jobtype_2') {
        rate = HPres_kengou[lv];  //剣豪の基本レート
        //console.log( 'No.' + cardNo + '/' + rea + '/' + '★' + rank + '/Lv.' + lv + '/剣豪 rate = ' + rate );
      }
      else {
      //※特を基準に大凡の増減を加える。 天 = +25% 極 = +8.5% 上 = -8.5% 序 = -15%
        if( rea == '天' ) {
          rate = Math.round( HPres_normal[lv] * 1.25 );
        }
        else if( rea == '極' ) {
          rate = Math.round( HPres_normal[lv] * 1.085 );
        }
        else if( rea == '特' ) {
          rate = Math.round( HPres_normal[lv] );
        }
        else if( rea == '上' ) {
          rate = Math.round( HPres_normal[lv] * 0.915 );
        }
        else if( rea == '序' ) {
          rate = Math.round( HPres_normal[lv] * 0.85 );
        }
        //console.log( 'No.' + cardNo + '/' + rea + '/' + '★' + rank + '/Lv.' + lv + '/normal rate = ' + rate );
      }
    }
    var tmp = rate * (100 - currentHP);
    var h = Math.floor(tmp / 3600);
    var m = Math.floor((tmp - h * 3600) / 60);
    var s = Math.floor(tmp - h * 3600 - m * 60);
    var tim = h + ":" +
    (m + 100).toString().substr(-2) + ":" +
    (s + 100).toString().substr(-2);
    return tim;
  }
}
  //討伐ゲージの回復時間とHP回復時間用
  function caddDate(baseDate, timetxt) {
    var tim = timetxt.match(/^(\d+):(\d+):(\d+)/);
    if (!tim)
      return "";
    
    var dt = new Date(baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    baseDate.getHours() + parseInt(tim[1], 10),
    baseDate.getMinutes() + parseInt(tim[2], 10),
    baseDate.getSeconds() + parseInt(tim[3], 10));
    
    return (dt.getMonth() + 1) + "/" + dt.getDate() + " " +
    (dt.getHours() + 100).toString().substr(-2) + ":" +
    (dt.getMinutes() + 100).toString().substr(-2) + ":" +
    (dt.getSeconds() + 100).toString().substr(-2);
  }

  //待機武将一覧にグループアイコン表示 ※グループ機能使用時のみ表示
  function deckGroupImgView() {
    if (!options.unit_list_group) 
      return;
    if (location.pathname != "/card/deck.php" && location.pathname != "/union/levelup.php" && location.pathname != "/union/additional.php")
      return;
    var group_id = {};
    if (localStorage.getItem("crx_ixamoko_group_set")) {
      group_id = secureEvalJSON(localStorage.getItem("crx_ixamoko_group_set"));
    } else {
      return;
    }
    $('div.ig_deck_smallcardarea').each(function() {
      var id = $(this).find('a[href^="#TB_inline"]').attr('href').replace('&caption=general_detail', '').split('_')[2];
      
      if (groups_img[group_id[id]]) {
        $(this).find('div.ig_deck_smallcardimage')
        .prepend('<div style="position: absolute;z-index:4;"><img src="' + groups_img[group_id[id]] + '" /></div>');
      }
      
    });
  }

  //簡易兵種フィルター
  function soldiers_blind() {
    if (location.pathname != "/card/deck.php")
      return;
    if (!options.soldiers_blind)
      return;
    $('#moko_container').height('30px').width('754px')
    .append('<ul id="soldiers_blind_list">'
        + '<li><a id="all">全</a></li>'
        + '<li><a id="yari">槍</a>'
        + '<div>'
          + '<a id="yari_yumi">槍弓</a>'
          + '<a id="yari_kiba">槍馬</a>'
        + '</div>'
        + '<li><a id="yumi">弓</a>'
        + '<div>'
          + '<a id="yumi_kiba">弓馬</a>'
        + '</div>'
        + '</li>'
        + '<li><a id="kiba">馬</a></li>'
        + '<li><a id="defense">砲</a>'
        + '<div>'
          + '<a id="yari_defense">砲槍</a>'
          + '<a id="yumi_defense">砲弓</a>'
          + '<a id="kiba_defense">砲馬</a>'
        + '</div>'
        + '</li>'
        + '<li><a id="hakai">兵器</a>'
        + '<div>'
          + '<a id="ki_attack">攻砲</a>'
          + '<a id="ki_hakai">器</a>'
        + '</div>'
        + '</li>'
      + '</ul>'
      );
    
    $('#soldiers_blind_list > li')
    .hover(function() {
        $(this).children('div').show();
      },
      function() {
        $(this).children('div').hide();
    });
    
    $('#ig_deck_smallcardarea_out').each(function() {
      var yari_g = $('div.ig_deck_smallcardarea:contains("足軽"), .ig_deck_smallcardarea:contains("長槍足軽"), .ig_deck_smallcardarea:contains("武士"), .ig_deck_smallcardarea:contains("国人衆")');
      var yumi_g = $('div.ig_deck_smallcardarea:contains("弓足軽"), .ig_deck_smallcardarea:contains("長弓兵"), .ig_deck_smallcardarea:contains("弓騎馬"), .ig_deck_smallcardarea:contains("海賊衆")');
      var kiba_g = $('div.ig_deck_smallcardarea:contains("騎馬兵"), .ig_deck_smallcardarea:contains("精鋭騎馬"), .ig_deck_smallcardarea:contains("赤備え"), .ig_deck_smallcardarea:contains("母衣衆")');
      var defense_hou = $('div.ig_deck_smallcardarea:contains("鉄砲足軽")');
      var defense_yari = $('div.ig_deck_smallcardarea:contains("鉄砲足軽"), .ig_deck_smallcardarea:contains("足軽"), .ig_deck_smallcardarea:contains("長槍足軽"), .ig_deck_smallcardarea:contains("武士")');
      var defense_yumi = $('div.ig_deck_smallcardarea:contains("鉄砲足軽"), .ig_deck_smallcardarea:contains("弓足軽"), .ig_deck_smallcardarea:contains("長弓兵"), .ig_deck_smallcardarea:contains("弓騎馬")');
      var defense_kiba = $('div.ig_deck_smallcardarea:contains("鉄砲足軽"), .ig_deck_smallcardarea:contains("騎馬兵"), .ig_deck_smallcardarea:contains("精鋭騎馬"), .ig_deck_smallcardarea:contains("赤備え")');
      var attack_hou = $('div.ig_deck_smallcardarea:contains("騎馬鉄砲"), .ig_deck_smallcardarea:contains("雑賀衆")');
      var hakai_g = $('div.ig_deck_smallcardarea:contains("破城鎚"), .ig_deck_smallcardarea:contains("攻城櫓"), .ig_deck_smallcardarea:contains("大筒兵"), .ig_deck_smallcardarea:contains("焙烙火矢")');
      
      $('#all').click(function() {
        $('div.ig_deck_smallcardarea').show();
      });
      $('#yari').click(function() {
        $('div.ig_deck_smallcardarea').hide();
        yari_g.show();
        $('div.ig_deck_smallcardarea:contains("弓足軽")').hide();
        $('div.ig_deck_smallcardarea:contains("鉄砲足軽")').hide();
      });
      $('#yari_kiba').click(function() {
        $('div.ig_deck_smallcardarea').hide();
        yari_g.show();
        kiba_g.show();
        $('div.ig_deck_smallcardarea:contains("弓足軽")').hide();
        $('div.ig_deck_smallcardarea:contains("鉄砲足軽")').hide();
      });
      $('#yumi').click(function() {
        $('div.ig_deck_smallcardarea').hide();
        yumi_g.show();
      });
      $('#yari_yumi').click(function() {
        $('div.ig_deck_smallcardarea').hide();
        yumi_g.show();
        yari_g.show();
        $('div.ig_deck_smallcardarea:contains("弓足軽")').hide();
        $('div.ig_deck_smallcardarea:contains("鉄砲足軽")').hide();
      });
      $('#yumi_kiba').click(function() {
        $('div.ig_deck_smallcardarea').hide();
        yumi_g.show();
        kiba_g.show();
      });
      $('#kiba').click(function() {
        $('div.ig_deck_smallcardarea').hide();
        kiba_g.show();
      });
      $('#defense').click(function() {
        $('div.ig_deck_smallcardarea').hide();
        defense_hou.show();
      });
        $('#yari_defense').click(function() {
          $('div.ig_deck_smallcardarea').hide();
          defense_yari.show();
        });
        $('#yumi_defense').click(function() {
          $('div.ig_deck_smallcardarea').hide();
          defense_yumi.show();
        });
        $('#kiba_defense').click(function() {
          $('div.ig_deck_smallcardarea').hide();
          defense_kiba.show();
        });

      $('#hakai').click(function() {
        $('div.ig_deck_smallcardarea').hide();
        attack_hou.show();
        hakai_g.show();
      });
        $('#ki_attack').click(function() {
          $('div.ig_deck_smallcardarea').hide();
          attack_hou.show();
        });
        $('#ki_hakai').click(function() {
          $('div.ig_deck_smallcardarea').hide();
          hakai_g.show();
        });
    });
  }

  //部隊戦力を表示
  function UnitPowerView() {
    if (!options['unit_power'])
      return;
    if(location.pathname != "/card/deck.php")
      return;
    var panel = $('#ig_deckunitdetail').size();
    if(!panel > 0 )
      return;
    var unitKey ={ "":"",
      yari1:  "足軽"     , yari2: "長槍足軽" , yari3: "武士"   , yari4: "国人衆" , 
      yumi1:  "弓足軽"   , yumi2: "長弓兵"   , yumi3: "弓騎馬" , yumi4: "海賊衆" , 
      kiba1:  "騎馬兵"   , kiba2: "精鋭騎馬" , kiba3: "赤備え" , kiba4: "母衣衆" , 
      heiki1: "破城鎚"   , heiki2:"攻城櫓"   , heiki3:"大筒兵" , 
      heiki4: "鉄砲足軽" , heiki5:"騎馬鉄砲" , heiki6:"雑賀衆", heiki7:"焙烙火矢" };
    var rank    = {
      sss: 1.20, ss: 1.15, s: 1.10,
      a: 1.05, b: 1, c: 0.95, d: 0.9, e: 0.85, f: 0.80,
      SSS: 1.20, SS: 1.15, S: 1.10,
      A: 1.05, B: 1, C: 0.95, D: 0.9, E: 0.85, F: 0.80,};
    
    var UnitData = {
      "足軽"    :{typeno:321, off:11,def:11,mov:15,des: 2,tp1:"t1",tp2:"t1", cmd1:"yari" ,cmd2:"yari" , drill:true , order: 1},
      "長槍足軽":{typeno:322, off:16,def:16,mov:16,des: 2,tp1:"t1",tp2:"t1", cmd1:"yari" ,cmd2:"yari" , drill:true , order: 2},
      "武士"    :{typeno:323, off:18,def:18,mov:18,des: 2,tp1:"t1",tp2:"t3", cmd1:"yari" ,cmd2:"yumi" , drill:true , order: 3},
      "国人衆"  :{typeno:324, off:17,def:13,mov:17,des: 3,tp1:"t1",tp2:"t1", cmd1:"yari" ,cmd2:"yari" , drill:false, order:15},
      "弓足軽"  :{typeno:325, off:10,def:12,mov:16,des: 1,tp1:"t3",tp2:"t3", cmd1:"yumi" ,cmd2:"yumi" , drill:true , order: 7},
      "長弓兵"  :{typeno:326, off:15,def:17,mov:18,des: 1,tp1:"t3",tp2:"t3", cmd1:"yumi" ,cmd2:"yumi" , drill:true , order: 8},
      "弓騎馬"  :{typeno:327, off:17,def:19,mov:23,des: 1,tp1:"t2",tp2:"t3", cmd1:"kiba" ,cmd2:"yumi" , drill:true , order: 9},
      "海賊衆"  :{typeno:328, off:16,def:17,mov:20,des: 2,tp1:"t3",tp2:"t3", cmd1:"yumi" ,cmd2:"yumi" , drill:false, order:17},
      "騎馬兵"  :{typeno:329, off:12,def:10,mov:22,des: 1,tp1:"t2",tp2:"t2", cmd1:"kiba" ,cmd2:"kiba" , drill:true , order: 4},
      "精鋭騎馬":{typeno:330, off:17,def:15,mov:23,des: 1,tp1:"t2",tp2:"t2", cmd1:"kiba" ,cmd2:"kiba" , drill:true , order: 5},
      "赤備え"  :{typeno:331, off:21,def:20,mov:25,des: 1,tp1:"t1",tp2:"t2", cmd1:"yari" ,cmd2:"kiba" , drill:true , order: 6},
      "母衣衆"  :{typeno:332, off:19,def:16,mov:24,des: 2,tp1:"t2",tp2:"t2", cmd1:"kiba" ,cmd2:"kiba" , drill:false, order:16},
      "破城鎚"  :{typeno:333, off: 3,def:8 ,mov: 8,des:10,tp1:"t4",tp2:"t4", cmd1:"heiki",cmd2:"heiki", drill:true , order:12},
      "攻城櫓"  :{typeno:334, off:14,def: 5,mov:10,des: 7,tp1:"t4",tp2:"t4", cmd1:"heiki",cmd2:"heiki", drill:true , order:13},
      "大筒兵"  :{typeno:335, off:10,def:12,mov: 8,des:20,tp1:"t3",tp2:"t4", cmd1:"yumi" ,cmd2:"heiki", drill:true , order:14},
      "鉄砲足軽":{typeno:336, off:18,def:26,mov:15,des: 1,tp1:"t1",tp2:"t4", cmd1:"yari" ,cmd2:"heiki", drill:true , order:10},
      "騎馬鉄砲":{typeno:337, off:26,def:18,mov:21,des: 1,tp1:"t2",tp2:"t4", cmd1:"kiba" ,cmd2:"heiki", drill:true , order:11},
      "雑賀衆"  :{typeno:338, off:23,def:27,mov:18,des: 5,tp1:"t1",tp2:"t4", cmd1:"yari" ,cmd2:"heiki", drill:false, order:18},
      "焙烙火矢"  :{typeno:345, off:23,def:23,mov:19,des: 2,tp1:"t3",tp2:"t4", cmd1:"yumi" ,cmd2:"heiki", drill:false, order:19}
    };
    
    var attack_power = 0, defense_power = 0, destruct_power = 0 ;
    var movements = [];
    var tactics = [];
    [1,2,3,4].each(function(val, idx){
      $('div[id^="ig_decksection"] #id_deck_card' + val + '_front div.parameta_area').each(function(){
        var $this = $(this);
        // 武将ステータス
        var stats_att = parseInt($this.children('.ig_card_status_att').text());
        var stats_def = parseInt($this.children('.ig_card_status_def').text());
        var stats_int = parseInt($this.children('.ig_card_status_int').text());
        // 現在兵士数、兵種
        var sol_no    = parseInt($this.find('span.commandsol_no span[id^="card_commandsol_cnt_"]').text());
        var sol_type  = $this.children('span.ig_card_cardno + span[id^="card_commandsol_"]').attr('class');
        sol_type = sol_type.replace(/^commandsol_/,'');
        sol_type = unitKey[sol_type];
        var power_seeds = {
          attack  : stats_att, defence : stats_def, interi  : stats_int,
          sol_type: sol_type, sol_no  : sol_no
        };
        var rate = {};
        rate.t1 = rank[ $this.children('.yari').attr('class').replace(/^yari lv_/,"")  ];
        rate.t2 = rank[ $this.children('.kiba').attr('class').replace(/^kiba lv_/,"")  ];
        rate.t3 = rank[ $this.children('.yumi').attr('class').replace(/^yumi lv_/,"")  ];
        rate.t4 = rank[ $this.children('.heiki').attr('class').replace(/^heiki lv_/,"") ];
        var commandRate = ( rate[ UnitData[sol_type].tp1 ] + rate[ UnitData[sol_type].tp2 ] ) / 2;
        attack_power  += ( UnitData[sol_type].off * sol_no + stats_att ) * commandRate ;
        defense_power += ( UnitData[sol_type].def * sol_no + stats_def ) * commandRate ;
        destruct_power+= ( UnitData[sol_type].des * sol_no ) ;
        movements.push( UnitData[sol_type].mov );
        tactics.push( stats_int );
      });
    });
    
    var movement = Math.min.apply( undefined, movements );
    
    var tacticsPower = 0;
    new function(){
      tactics.sort(function(a,b){ return b - a });
      var tacticsMax = tactics.shift();
      tactics.each(function(v){ tacticsPower += v });
      tacticsPower = Math.floor( (tacticsPower/6 + tacticsMax ) / 10 );
      tacticsPower /= 10;
    }
    
    var sec_per_sq = ( 3600 / movement );
    var sps_sec = Math.floor(sec_per_sq % 60 );
    var sps_min = Math.floor( sec_per_sq / 60 );
    
    var attack = Math.floor(attack_power );
    var defense = Math.floor(defense_power);
    var destruct = destruct_power;
    var tactics;
      if ( isNaN(tacticsPower) ) {
        tactics = 0
      } else{
        tactics = tacticsPower
      }
    
    var tmpl = $('<table class="moko-unitpower no_mb" style="width: 100%">' +
        '<tr><td rowspan="3" style="width:1em;vertical-align: middle;background-color: #444;">部隊戦力</td><th>攻撃</th><td>'+ attack +'</td><th>防御</th><td>'+ defense +'</td></tr>' +
        '<tr><th>破壊</th><td>'+ destruct +'</td><th>兵法</th><td>＋'+ tactics +'<small> ％<small></td></tr>' +
        '<tr><th>移動</th><td colspan="3">'+ movement +' （'+ sps_min +'分'+ sps_sec +'秒/<small>マス</small>）</td></tr>' +
        '</table>'
      );
    
    var panel = $('<div id="ixamoko-unitpower">').append(tmpl);
    panel.appendTo('#ig_bg_decksection1right')
      .css({'position':'absolute', 'width':'242px', 'right':'16px', 'bottom':'0'});
    $('#ig_bg_decksection1right').css({'min-height':'444px', 'margin-bottom':'-7px'});
    $('#ig_deck_unitdetailbox').css('height', '292px');
    $('#deck_skill_display_navi > ul').css('height', '103px');
    $('div.deck_skill_display_data').css({'min-height':'59px', 'margin-height':'59px'});
  }

  //カード一括削除：ランク一定以上の非活性、全選択ボタンの追加
  function delList_check() {
    if (location.pathname != "/card/deck_card_delete.php")
      return;
    if ($('div.ig_decksection_innermid').find('input[name="delete_card_arr[]"]:eq(0)').attr('type') == 'checkbox') {
      
      $('div.ig_decksection_innermid').find('tr').each(function() {
        var a = $(this).find('img').attr('alt');
        if ( options.rank_lock !== 0 &&
          options.rank_lock <= 1 && a == "UC" ||  //上
          options.rank_lock <= 2 && a == "R"  ||  //特
          options.rank_lock <= 3 && a == "SR" ||  //極
          options.rank_lock <= 4 && a == ""   ||  //雅
          options.rank_lock <= 4 && a == "UR"  //天
        )
        { $(this).find('input[name="delete_card_arr[]"]').attr('disabled', true); }
      });
      
      $('div.ig_decksection_innermid').find('table.common_table1.center.mt10')
      .before('<div class="left" style="width:680px; margin: 0 auto;"><input type="button" value="全選択" id="sel_check" style="margin-right: 10px;" /><input type="button" value="全解除" id="unsel_check"/></div>');
      
      $('#sel_check').click(function() {
        $('div.ig_decksection_innermid').find('input[name="delete_card_arr[]"]').each(function() {
          if ($(this).attr('disabled') == false) {
            $(this).attr('checked', true);
          }
        });
      });
      
      $('#unsel_check').click(function() {
        $('div.ig_decksection_innermid').find('input[name="delete_card_arr[]"]').each(function() {
          $(this).attr('checked', false);
        });
      });
    }
  }

  //合成：1個目のスキルを自動チェック
  function levelup_check() {
    if (location.pathname != "/union/union_levelup.php" && location.pathname != "/union/union_remove.php")
      return;
    if( $('div.common_box3bottom').find('table.common_table1.center.mb10').find('tr.fs12:has(input)').size() == 1 ) {
      $('input[name="selected_skill_radio"]:first').attr('checked', true);
    }
    $('tr.fs12:has(input)').css('cursor', 'default')
    .hover(function(){
      $(this).find('td').css('background-color', '#E1E0CD');
      },
      function(){
      $(this).find('td').css('background-color', '');
    })
    .click(function(){
      $(this).find('input').attr('checked', true);
    });
  }

  //合成：「合成確認画面へ」を自動押下
  function auto_union_check() {
    if (!options.auto_union_check)
      return;
    if (location.pathname != "/union/levelup.php")
      return;
    if( $('img[src$="btn_union_check.png"]').length == 1 )
      $('body').hide();
      $('img[src$="btn_union_check.png"]').trigger('click');
      return false;
  }
  function fade_change() {
    if (!options.auto_union_check)
      return;
    if (location.pathname != "/union/union_levelup.php")
      return;
    if( $('#union_btn_add').length == 1 )
      $('img[alt="カード選択に戻る"]')
      .removeAttr('onclick')
      .parent().attr('href', '/union/index.php');
  }

  //合成： スキル名  追加スロットボーナスTHクリックでダウン
  $( function() {
    if (location.pathname != "/union/additional.php")
      return;
    $('table.common_table1.no_mb.no_br').css('cursor', 'default');
    $('table.common_table1.no_mb.no_br').click(function() {
      $('html,body').animate({ scrollTop: 890 }, 'fast');
      return false;
    });
  });

  //お気に入り部隊登録のレイアウト調整
  $(function() {
    if (!options.hold_butai)
      return;
    if (location.pathname != "/card/deck.php")
      return;
    $('#ig_bg_decksection1right').css({'min-height':'444px', 'margin-bottom':'-7px'});
    $('#ig_deck_unitdetailbox').css('height', '292px');
    $('#deck_skill_display_navi ul').css('height', '103px');
    $('.deck_skill_display_data').css({'min-height':'59px', 'margin-height':'59px'});
  });
  //お気に入り部隊 登録
  function hold_butai() {
    if (!options.hold_butai)
      return;
    if (location.pathname != "/card/deck.php")
      return;

    var category = $('#btn_category').find('li:first').attr('class');
    
    if( category != 'btn_category_00_on' )
      return;

    if ($('#ig_deck_unititle_s5.clearfix').find('p:eq(0)').text() == '[------]部隊') {
      var butai_list = {};
      if (localStorage.getItem("crx_ixakaizou_butai_list_id")) {
        butai_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_butai_list_id"));
      } else {
        return;
      }
      $('#ig_deck_unititle_s5.clearfix').css({height:'86px',whiteSpace:'nowrap'});
      
      $('.deck_navi').css('height', '1px');
      var s_0 = '<p style="float: left; padding: 2px 5px;font-size: 12px;font-weight: normal;">攻撃部隊:<select id="s_0" style="width: 10em;"><option>-----選択-----</option>';
      var s_1 = '<p style="float: left; padding: 2px 5px;font-size: 12px;font-weight: normal;">防衛部隊:<select id="s_1" style="width: 10em;"><option>-----選択-----</option>';
      var s_2 = '<p style="padding: 2px 5px;font-size: 12px;font-weight: normal;">両用部隊:<select id="s_2" style="width: 10em;"><option>-----選択-----</option>';
      var s_3 = '<p style="padding: 2px 5px;font-size: 12px;font-weight: normal;">秘境部隊:<select id="s_3" style="width: 10em;"><option>-----選択-----</option>';
      for (var i in butai_list) {
        if (parseInt( butai_list[i][0] ) === 0) {
          s_0 += '<option value="' + i + '">' + i + '</option>';
        } else if ( parseInt(butai_list[i][0] ) === 1) {
          s_1 += '<option value="' + i + '">' + i + '</option>';
        } else if ( parseInt(butai_list[i][0] ) === 3) {
          s_3 += '<option value="' + i + '">' + i + '</option>';
        } else {
          s_2 += '<option value="' + i + '">' + i + '</option>';
        }
      }
      s_0 += '</select><input type=button value="セット" id="set_0"></p>';
      s_1 += '</select><input type=button value="セット" id="set_1"></p>';
      s_2 += '</select><input type=button value="セット" id="set_2"></p>';
      s_3 += '</select><input type=button value="セット" id="set_3"></p>';
      $('#ig_deck_unititle_s5.clearfix')
        .find('p:eq(0)').replaceWith(s_0 + s_1 + s_2 + s_3);
      $('#ig_deck_unititle_s5.clearfix')
        .prepend('<p style="border-bottom: 1px solid #B1912C;margin-bottom: 8px;">お気に入り部隊</p>');
      $('#set_0').live("click", function() {
        var s_val = $('#s_0').children(':selected').val();
        if (s_val == '-----選択-----')
          return;
        deck_setting(s_val);
      });
      $('#set_1').live("click", function() {
        var s_val = $('#s_1').children(':selected').val();
        if (s_val == '-----選択-----')
          return;
        deck_setting(s_val);
      });
      $('#set_2').live("click", function() {
        var s_val = $('#s_2').children(':selected').val();
        if (s_val == '-----選択-----')
          return;
        deck_setting(s_val);
      });
      $('#set_3').live("click", function() {
        var s_val = $('#s_3').children(':selected').val();
        if (s_val == '-----選択-----')
          return;
        deck_setting(s_val);
      });
    } else {
      var butai_nm = $('#ig_bg_decksection1right.clearfix').find('#ig_deck_unititle.clearfix').find('p:eq(0)').text().replace('[', '');
      butai_nm = butai_nm.replace(']', '');
      $('<div style="padding: 8px 0 0 2px; border-top: 1px dotted black;">' +
        '<label>部隊名&nbsp;<input id="b_name" type=text value="' + butai_nm + '" style="width: 9em;" /></label>&nbsp;' +
        '<select id="b_type">' +
        '<option value="0">攻撃</option>' +
        '<option value=1>防衛</option>' +
        '<option value=2>両用</option>' +
        '<option value=3>秘境</option>' +
        '</select>' +
        '<input id="butai_save" type="button" value="お気に入り部隊へ登録" style="margin-top: 6px;" />' +
        '</div>'
      ).appendTo('#ig_deck_unitdetailbox');
      

      $('#butai_save').click(function() {
        var tmp = $('a[href^="/facility/set_unit_list.php?unit_assign_id"]').attr('href').split('&');
        tmp = tmp[0].split('=');
        butai_save( tmp[1] );  //tmp[1] = unit_assign_id
      });
    }
    var okiniButaiTable = $('<div id="okiniiriButai" style="display:none;"><span id="butaiTable"></span></div>');
    $('#mokotool').append(okiniButaiTable);
    
    $('#toollist').append('<li class="list_img"><a id="okini" href="#TB_inline?height=340&amp;width=665&amp;inlineId=okiniiriButai" class="thickbox" title="お気に入り部隊" onclick="return false;">お気に入り部隊</a></li>');
    
    $("a#okini").live("mousedown", function() {
      tb_init('a.thickbox');
      var waite_TB_window =  function() {
                    var $TB_window = $('#TB_window');
                    if(!$TB_window[0]) {
                      setTimeout(waite_TB_window,1);
                    } else {
                      $TB_window.css({'position': 'absolute'});
                    }
                  }
      setTimeout(waite_TB_window,1);
      re_butai();
    });
  }

  function butai_save(unit_assign_id) {
    var butai_list = {};
    var b_array = [];
    if (localStorage.getItem("crx_ixakaizou_butai_list_id")) {
      butai_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_butai_list_id"));
    }
    b_array.push($('#b_type').children(':selected').val());
    if ($('#b_name').val() === '') {
      $('#b_name').attr('value', butai_nm);
    }
    var ano = $('#select_assign_no').val();
    $.post(
      '/facility/set_unit_list.php?unit_assign_id=' + unit_assign_id + '&ano=' + ano,
      function(html) {
        $(html).find('a.thickbox.busho_name').each(function() {
          var tmp = $(this).attr('href').split('=');
          tmp = $(this).text() + ':' + tmp[3].replace('cardWindow_', '');
          b_array.push(tmp);
        });
        butai_list[$('#b_name').val()] = b_array.join(',');
        localStorage.setItem('crx_ixakaizou_butai_list_id', toJSON(butai_list));
        re_butai();
        alert('この部隊を記録しました。');
      }
    );
  }

  function re_butai() {
    var tmp = '<span id="butaiTable"><p id="b_head"></p><table style="width:100%;">';
    tmp += '<thead>' +
        '<tr>' +
          '<th class="imk_th_view">選択</th>' +
          '<th class="imk_th_view">タイプ</th>' +
          '<th class="imk_th_view">部隊名</th>' +
          '<th class="imk_th_view">部隊長</th>' +
          '<th class="imk_th_view">小隊長</th>' +
          '<th class="imk_th_view">小隊長</th>' +
          '<th class="imk_th_view">小隊長</th>' +
          '<th class="imk_th_view imk_border_right"></th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';
    var butai_list = {};
    var c = 0, i, j;
    if (localStorage.getItem("crx_ixakaizou_butai_list_id")) {
      butai_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_butai_list_id"));
      for (i in butai_list) {
        var b_type = '';
        if (parseInt( butai_list[i][0] ) === 0) {
          b_type = '攻撃部隊';
        }
        else if ( parseInt(butai_list[i][0] ) === 1) {
          b_type = '防衛部隊';
        }
        else if ( parseInt(butai_list[i][0] ) === 3) {
          b_type = '秘境部隊';
        }
        else {
          b_type = '両用部隊';
        }
        tmp += '<tr><td class="imk_td_view_center"><input type="checkbox" id="d' + c + '" value="' + i + '" /></td><td class="imk_td_view_center">' + b_type + '</td><td class="imk_td_view_center">' + i + '</td>';
        var t = butai_list[i].split(',');
        for (j = 1; j < 5; j++) {
          if (t[j] !== undefined) {
            var nm = t[j].split(':');
            tmp += '<td class="imk_td_view_center">' + nm[0] + '</td>';
          } else {
            tmp += '<td class="imk_td_view_center">&nbsp;</td>';
          }
        }
        tmp += '<td class="imk_td_view_center imk_border_right"><input class="del_butai" type="button" value="消去" id="' + i + '" /></td></tr>';
        c++;
      }
      tmp += '<tr><td colspan="8" class="imk_td_view_center imk_border_right">お気に入り部隊は登録されていません</td></tr>';
    }
    
    tmp += '</tbody></table></span>';
    $('#butaiTable').replaceWith(tmp);
    
    if($('input.del_butai').length > 0){ $('tr:contains("お気に入り部隊は登録されていません")').remove(); }
    
    tmp = $('#howto_butai_hensei').find('table').clone();
      tmp.css('margin-bottom', '5px');
    if ( tmp.find('#select_village').attr('id') !== undefined ) {
    
      tmp.find('#select_village').attr('name', 'select_village2');
      tmp.find('#select_village').attr('id', 'select_village2');
      $('#b_head').append( tmp );
      $('#b_head').append('<input type=button value="選択部隊をデッキへセット" id="butai_all_set">');
      
      $('#butai_all_set').live('click', function() {
        deck_all_setting();
      });
    
    }
    
    $('input.del_butai').live('click', function() {
      var butai_list = {},
      butai_list_new = {},
      i;
      if (localStorage.getItem("crx_ixakaizou_butai_list_id")) {
        butai_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_butai_list_id"));
      }
      for (i in butai_list) {
        if (i != $(this).attr('id')) {
          butai_list_new[i] = butai_list[i];
        }
      }
      localStorage.setItem('crx_ixakaizou_butai_list_id', toJSON(butai_list_new));
      tmp = '<span id="butaiTable"><p id="b_head"></p><table style="width:100%;">';
      tmp += '<thead><tr><th class="imk_th_view">選択</th><th class="imk_th_view">タイプ</th><th class="imk_th_view">部隊名</th><th class="imk_th_view">部隊長</th><th class="imk_th_view">小隊長</th><th class="imk_th_view">小隊長</th><th class="imk_th_view">小隊長</th><th class="imk_th_view imk_border_right"></th></tr></thead><tbody>';
      butai_list = {};
      var c = 0, i, j;
      if (localStorage.getItem("crx_ixakaizou_butai_list_id")) {
        butai_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_butai_list_id"));
        for (i in butai_list) {
          var b_type = '';
          if ( parseInt( butai_list[i][0] ) === 0) {
            b_type = '攻撃部隊';
          }
          else if ( parseInt( butai_list[i][0] ) === 1) {
            b_type = '防衛部隊';
          }
          else if ( parseInt( butai_list[i][0] ) === 3) {
            b_type = '秘境部隊';
          } 
          else {
            b_type = '両用部隊';
          }
          tmp += '<tr><td class="imk_td_view_center"><input type="checkbox" id="d' + c + '" value="' + i + '" /></td><td class="imk_td_view_center">' + b_type + '</td><td class="imk_td_view_center">' + i + '</td>';
          var t = butai_list[i].split(',');
          for (j = 1; j < 5; j++) {
            if (t[j] !== undefined) {
              var nm = t[j].split(':');
              tmp += '<td class="imk_td_view_center">' + nm[0] + '</td>';
            }
            else {
              tmp += '<td class="imk_td_view_center">&nbsp;</td>';
            }
          }
          tmp += '<td class="imk_td_view_center imk_border_right"><input class="del_butai" type="button" value="消去" id="' + i + '" /></td></tr>';
          c++;
        }
        tmp += '<tr><td colspan="8" class="imk_td_view_center imk_border_right">お気に入り部隊は登録されていません</td></tr>';
      }
      
      tmp += '</tbody></table></span>';
      $('#butaiTable').replaceWith( tmp );
      
      if($('input.del_butai').length > 0){ $('tr:contains("お気に入り部隊は登録されていません")').remove(); }
      
      tmp = $('#howto_butai_hensei').find('table').clone();
        tmp.css('margin-bottom', '5px');
      if ( tmp.find('#select_village').attr('id') !== undefined ) {
      
        tmp.find('#select_village').attr('name', 'select_village2');
        tmp.find('#select_village').attr('id', 'select_village2');
        $('#b_head').append( tmp );
        $('#b_head').append('<input type=button value="選択部隊をデッキへセット" id="butai_all_set">');
        
        $('#butai_all_set').live('click', function() {
          deck_all_setting();
        });
      
      }
    
    });
  }

  function deck_all_setting() {
    if ($('#select_village2').find('option:selected').val() === '') {
      alert('部隊の所属が未設定です');
      return false;
    }
    var butai_list = {};
    if ( localStorage.getItem("crx_ixakaizou_butai_list_id") ) {
      butai_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_butai_list_id"));
    }
    var i,
    j = 0,
    c = 0;
    for (i in butai_list) {
      if ($('#d' + c).attr('checked')) {
        j++;
      }
      c++;
    }
    if (j === 0) {
      alert('部隊が選択されていません');
      return false;
    }
    c = 0;
    for (i in butai_list) {
      $('#d' + c).attr('disabled', true);
      c++;
    }
    var start_deck = 1;
    $('a[onclick^="selectAssignNo"]').each(function() {
      if ($(this).text() == '[---新規部隊を作成---]')
        start_deck++;
    });
    start_deck = 5 - start_deck;
    $('#butai_all_set').attr('disabled', true);
    nowLoading();
    deck_interval(start_deck, true);
  }

  function deck_interval(start_deck, flg) {
    if (start_deck > 3) {
      flg = false;
    }
    var select_assign_no = start_deck;
    var w_select_village = $('#select_village2').find('option:selected').val();
    var max_page = 1;
    
    if (options.pager_ajax) {
      $('ul.pager.cardstock:eq(0)').find('a.ixamoko_deckpager:last')
      .each(function() {
        max_page = parseInt( $(this).attr('page') );
      });
    }
    else {
      $('ul.pager.cardstock:eq(0)').find('li:last').each(function() {
        if ( $(this).attr('class') == 'last' ) {
          var script = $(this).find('a:eq(1)').attr('onClick');
          script = script.substring(script.indexOf('"p"'), script.length);
          script = script.match(/".*?"/g);
          script = script[1].replace(/"/g, '');
          max_page = parseInt( script );
        }
        else if ( $(this).attr('class') == '' ) {
          max_page = parseInt( $(this).find('span').text() );
        }
      });
    }
    var butai_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_butai_list_id"));
    var i, j = 0;
    var card_key = '';
    
    for (i in butai_list) {
      if ($('#d' + j).attr('checked')) {
        card_key = $('#d' + j).attr('value');
        $('#d' + j).attr('checked', false);
        break;
      }
      j++;
    }
    if (card_key === '') {
      location.href = '/card/deck.php';
      return;
    }
    
    var t = butai_list[card_key].split(',');
    var param_list = [];
    
    for (i = 1; i < t.length; i++) {
      var tmp = t[i].split(':');
      param_list.push(tmp[1]);
    }
    
    set_deck( param_list, 0, 1, max_page, select_assign_no, w_select_village, flg );
  }

  function deck_setting( card_key ) {
    var select_assign_no = $('#select_assign_no').val();
    var set_assign_id = $('#set_assign_id').val();
    var w_select_village = $('#select_village').find('option:selected').val();
    var max_page = 1;
    
    if (options.pager_ajax) {
      $('ul.pager.cardstock:eq(0)').find('a.ixamoko_deckpager:last')
      .each(function() {
        max_page = parseInt( $(this).attr('page') );
      });
    }
    else {
      $('ul.pager.cardstock:eq(0)').find('li:last').each(function() {
        if ( $(this).attr('class') == 'last' ) {
          var script = $(this).find('a:eq(1)').attr('onClick');
            script = script.substring(script.indexOf('"p"'), script.length);
            script = script.match(/".*?"/g);
            script = script[1].replace(/"/g, '');
            max_page = parseInt( script );
        }
        else if ( $(this).attr('class') == '' ) {
          max_page = parseInt( $(this).find('span').text() );
        }
      });
    }
    var butai_list = secureEvalJSON(localStorage.getItem("crx_ixakaizou_butai_list_id"));
    var t = butai_list[card_key].split(',');
    var param_list = [];
    
    for (i = 1; i < t.length; i++) {
      var tmp = t[i].split(':');
      param_list.push(tmp[1]);
    }
    
    nowLoading();
    set_deck(param_list, 0, 1, max_page, select_assign_no, w_select_village, false);
  }
  //お気に入り部隊：配置
  function set_deck( list, a, b, c, s_assign_no, w_select_village, flg ) {
    var set_squad_id = '';
    var set_assign_id = '';
    var max_page = '';
    var select_card_group = $('#select_card_group').val();
    
    if (((a > 4) || (list[a] === '') || (b > c)) && (!flg)) {
      var data2 = {
        select_assign_no: s_assign_no,
        select_card_group: select_card_group,
        deck_mode: 'nomal',
        p: '1'
      };
      
      $.form({
        type: 'post',
        url: '/card/deck.php',
        data: data2
      });
      
    } else if (((a > 4) || (list[a] === '') || (b > c)) && (flg)) {
      s_assign_no++;
      deck_interval(s_assign_no, flg);
      return;
    }

    $.form = function(s) {
      var def = {
        type: 'get',
        url: location.href,
        data: {}
      };
      s = $.extend(true, s, $.extend(true, {}, def, s));
      var form = $('<form>').attr({'method': s.type,'action': s.url}).appendTo(document.body);
      
      for (var a in s.data) {
        var f = $('<input>').attr({'name': a,'value': s.data[a]}).appendTo(form[0]);
      }
      
      form[0].submit();
    };

    var data = {
      select_assign_no: s_assign_no,
      select_card_group: select_card_group,
      deck_mode: 'nomal',
      p: b
    };

    $.post('/card/deck.php', data, function(html) {
      $(html).find('#ig_deck_smallcardarea_out').find('div.ig_deck_smallcardarea')
      .each(function() {
        
        var id = $(this).find('div[id^="unit_group_type_"]').attr('id').split('_')[3];
        var setSrc = $(this).find('img[title^="選択中の部隊へ"]').attr('src');
        
        if ( (id == list[a]) && ( setSrc !== undefined) ) {
          var work_id = $(this).find('a[id^="btn_gounit_"]').attr('onClick').match(/'.*?'/g);
          set_squad_id = work_id[1].replace(/'/g, '');
          set_assign_id = work_id[0].replace(/'/g, '');
          return false;
        }
        else {
          set_squad_id = '';
        }
      
      });
      
      if (set_squad_id !== '') {
        var data2 = {
          select_assign_no: s_assign_no,
          mode: 'assign_insert',
          set_village_id: w_select_village,
          set_assign_id: set_assign_id,
          set_squad_id: set_squad_id,
          select_card_group: select_card_group,
          deck_mode: 'nomal',
          p: b
        };
        
        $.post('/card/deck.php', data2, function(html) {
          a++;
          b = 1;
          set_deck(list, a, b, c, s_assign_no, w_select_village, flg);
        });
      } else {
        b++;
        set_deck(list, a, b, c, s_assign_no, w_select_village, flg);
      }
    });
  }

  //ステ振り支援機能
  function status_set_support() {
    if(location.pathname != "/card/status_info.php")
      return;
    var remain = $('#hidden_remain_pt').val();
    var total = 0;
    var Allcat = $('<button id="unlock_button" style="float: right">未分配種別のロック解除</button>');
    $('#status_table').before(Allcat);
    Allcat.click(unlock);
    var Line = $('#status_table').find('tr:gt(1)');
    var Line_input = $('#status_table').find('tr:gt(1) input');
      Line.each(function(){
        var Line = $(this);
        var Line_td = Line.find('td');
        Line_td.eq(2).attr('default', '0');
        
        Line_td.eq(3).find('input[type="button"]').val('全て')
          .each(function() {
            var source = $(this).attr('onClick');
            if (!source) {
              return;
            }
            source = source.slice(0, -2) + remain + ')';
            $(this).attr('onClick', source);
        });
        
        Line_td.eq(5).each(function(){
          var point = parseInt($(this).text());
          $(this).attr('default', point);
          if (point == 0){
            Line.find('input[type="button"]').attr('disabled', true);
          }
          total += point;
        });
      });
    if (total == 0) {
      unlock();
    }
    Line_input.click( update );
  }
  function unlock() {
    $('#status_table').find('input[type="button"]').attr('disabled', false);
    $('#unlock_button').attr('disabled', true);
    return false;
  }
  function update() {
    $(this).parent().parent().find('td:eq(2), td:eq(5)').each(function() {
      if ( $(this).text() == $(this).attr('default') ) {
        $(this).css({'color':'#C00', 'font-weight':'bold'});
      }
      else {
        $(this).css({'color':'#C00', 'font-weight':'bold'});
      }
    });
  }
  //ランクアップ支援
  function rank_up_support() {
    if(location.pathname != "/card/lead_info.php")
      return;
    $('#rank_up_table input').click(function(){
      $(this).parent().parent().find('td:eq(3), td:eq(5)')
      .each(function() {
      
        $(this).css({'color':'#06C', 'font-weight':'bold'});
      
      });
    });
  }

//////////////////////
//兵士編成：
//////////////////////
  //兵編成支援機能
  function soldier_set_support() {
    if(location.pathname != "/facility/set_unit_list.php")
      return;
    
    var flag = $('#deck_file').find('img.iepngfix.mb5').size();
    
    if( flag == 2 ) {
    var someval = $('#busho_info').find('input[id="unit_cnt_text_0"]').val();
    $('<div id="soldierset" style="float: right;margin: -28px 25px 0 0;">' +
       '<input id="conspe" type="button" value="部隊長と同兵種" style="margin-right: 24px;" />' +
       '<select id="solset" style="width: 100px;">' +
       '<option value="1">同兵数</option>' +
       '<option id="same" value="' + someval + '">部隊長と同数</option>' +
       '<option value="1">1</option>' +
       '<option value="5">5</option>' +
       '<option value="10">10</option>' +
       '<option value="50">50</option>' +
       '<option value="100">100</option>' +
       '<option value="250">250</option>' +
       '<option value="500">500</option>' +
       '<option value="1000">1000</option>' +
       '</select>' +
       '</div>'
    ).insertBefore('#busho_info');
    
    $('#unit_cnt_text_0').change(function(){
      $('#same').val($(this).val());
    });
    
    //同兵種
    $('#conspe').click(function(){
      var solTypeno = $('#busho_info').find('select[id^="unit_id_select_"]:first').val();
      $('#busho_info').find('select[id^="unit_id_select_"]').val(　solTypeno　);
      return false;
    });
    //同兵数
    $('#solset').change(function(){
      var someval = $(this).val();
      $('#busho_info').find('input[id^="unit_cnt_text_"]').val(　someval　);
      return false;
    });
    
    }
  }

  //兵士編成下準備
  function unitList_preparation() {
    if (location.pathname != "/facility/set_unit_list.php")
      return;
    $('div.center_posi').after('<div id="moko_container"></div>');
    var groups = $('#select_card_group').val(),
      flag = $('#deck_file').find('img.iepngfix.mb5').size(),
      TopLeft = '';
    if( groups == 0 ){ TopLeft = '0 0' }
    else if( groups == 1 ){ TopLeft = '0 -20px' }
    else if( groups == 2 ){ TopLeft = '0 -40px' }
    else if( groups == 3 ){ TopLeft = '0 -60px' }
    else if( groups == 4 ){ TopLeft = '0 -80px' }
    else if( groups == 5 ){ TopLeft = '0 -100px' }
    //デッキ配置部隊の編成時に現在選択中の組を把握できるようにimgで表示
    if( flag == 2 ) {
      $('#frame_00_top').append('<div style="position: absolute; top: 13px; right: 20px; width: 118px; height: 20px; background: url(../img/unit_list/btn_category.png) no-repeat ' + TopLeft + ';"></div>');
    }
    //各デッキへの移動ボタンを追加
    $('<ul id="deck_navi">'
      + '<li class="dummy dfirst">'
      + '<li class="ｍovedeck_0"><a href="/card/deck.php?ano=0&select_card_group=' + groups + '">デッキ 1</a></li>'
      + '<li class="ｍovedeck_1"><a href="/card/deck.php?ano=1&select_card_group=' + groups + '">デッキ 2</a></li>'
      + '<li class="ｍovedeck_2"><a href="/card/deck.php?ano=2&select_card_group=' + groups + '">デッキ 3</a></li>'
      + '<li class="ｍovedeck_3"><a href="/card/deck.php?ano=3&select_card_group=' + groups + '">デッキ 4</a></li>'
      + '<li class="ｍovedeck_4"><a href="/card/deck.php?ano=4&select_card_group=' + groups + '">デッキ 5</a></li>'
      + '<li class="dummy dlast">'
      + '</ul>'
    ).appendTo('#frame_00_top');
    
    //各デッキへの移動ボタンに逆参照のプルダウンメニュー
    for( var i = 0; i <= 5; i++){
      $('<div>' +
        '<a href="/card/deck.php?ano=' + i + '&select_card_group=0">全武将</a>' +
        '<a href="/card/deck.php?ano=' + i + '&select_card_group=1">第一組</a>' +
        '<a href="/card/deck.php?ano=' + i + '&select_card_group=2">第二組</a>' +
        '<a href="/card/deck.php?ano=' + i + '&select_card_group=3">第三組</a>' +
        '<a href="/card/deck.php?ano=' + i + '&select_card_group=4">第四組</a>' +
        '<a href="/card/deck.php?ano=' + i + '&select_card_group=5">未設定</a>' +
        '</div>'
      ).appendTo('li[class^="ｍovedeck_' + i + '"]');
    }
    
    //組分けボタンに逆参照のプルダウンメニュー
    for( var i = 0; i <= 5; i++){
      $('<div class="pulldown_' + i + '" style="height: 20px;" />')
      .appendTo('li[class^="btn_category_0' + i + '"]');
      
      $('<div class="menu_list">' +
        '<a href="/card/deck.php?ano=0&select_card_group=' + i + '">デッキ1へ</a>' +
        '<a href="/card/deck.php?ano=1&select_card_group=' + i + '">デッキ2へ</a>' +
        '<a href="/card/deck.php?ano=2&select_card_group=' + i + '">デッキ3へ</a>' +
        '<a href="/card/deck.php?ano=3&select_card_group=' + i + '">デッキ4へ</a>' +
        '<a href="/card/deck.php?ano=4&select_card_group=' + i + '">デッキ5へ</a>' +
        '</div>'
      ).insertAfter('div.pulldown_' + i );
    }
    
    for( var i = 0; i <= 5; i++){
      $('div[onclick*="btn_selectassignno_click(' + i + ')"]').each(function() {
        var unitname = $(this).html();
        $('#btn_category').find('li').find('div > a:eq(' + i + ')').html( unitname );
      });
    }

    $('li[class^="btn_category_"]').live('contextmenu', function() {
      $('li[class^="btn_category_"]').find('div.menu_list').hide();
      $(this).find('div.menu_list').slideDown(150);
      return false;
    }).hover(function() {
      
    },function() {
      $(this).find('div.menu_list').slideUp(150);
    });

    $('li[class^="ｍovedeck_"]').live('contextmenu', function() {
      $(this).find('a').css('opacity' ,'1');
      $(this).find('div').slideDown(150);
      return false;
    }).hover(function() {
      $(this).find('a').css('opacity' ,'1');
    },function() {
      $(this).find('div').slideUp(150);
      $('#deck_navi').find('li[class^="ｍovedeck_"] > a').css('opacity' ,'0.6');
    });
    //解散ボタンを追加
    var flag = $('#deck_file').find('img.iepngfix.mb5').size();
    if( flag == 2 ) {
      $('<a href="javascript:void(0);"><img src="/img/deck/box03_btn_breakup_w.png" alt="解散" style="margin: 0 0 5px 4px;" /></a>')
      .click(function(){
        var ano = $(this).prev().attr('href').split('=')[1],
          unitname = $('div.tab_spacer_on').text(),
          href = '/card/deck.php?ano=' + ano,
          Pathname = location.pathname,
          showNum = $('input[name="show_num"]').val(),
          cardGroup = $('#select_card_group').val();
        
        if (confirm('【' + unitname +'】を解散させてよろしいですか？')) {
          $.post(
            href,
            function(html) {
              var Unregist = ( $(html).find('img[alt="解散"]').parent().attr('onClick') || '').match(/'.*?'/g),
                  unit_assign_id = Unregist[0].replace(/'/g, ''),
                  unset_unit_squad_id = Unregist[1].replace(/'/g, ''),
                  p = $(html).find('input[id="p"]').val(),
                  select_card_group = $(html).find('input[id="select_card_group"]').val();
              var data = {
                select_assign_no: ano,
                unit_assign_id: unit_assign_id,
                unset_unit_squad_id: unset_unit_squad_id,
                deck_mode: 'nomal',
                p: p,
                select_card_group: select_card_group
              };
              $.post(
                '/card/deck.php', data,
                function(data) {
                  var tab_len = $('div.tab_spacer_off').length;
                  var newano ='';
                  if( tab_len == 0 && ano == 0 ) { newano = 6 }
                  else { newano = 0 }
                  $('div[onclick*="btn_selectassignno_click(' + newano + ')"]').trigger('click');
                  return false;
                }
              );
            }
          );
        }
      }).insertAfter($('img[alt="デッキへ"]').parent());
    }
    //グループ順記録・基本兵種記録ボタンの表示スペースの生成
    $('#moko_container').append('<div id="button_box" style="float: right; margin-top: 6px;"></div>');
    //待機兵士一覧から総兵数を表示
    $.post('/facility/unit_list.php', function (html){
      var Training = $(html).find('div.ig_fightunit_title:eq(1)').text(),
          Training = parseInt( Training.replace('訓練中の兵士 (', '').replace(')', '') ) || 0;
      var Waiting = $(html).find('div.ig_solder_commentarea:first > strong').text().trim();
      var Waitsol = parseInt( Waiting.split(' / ')[0] ) || 0,
          Waitsol =  Waitsol - Training;
      var Waitjinya = Waiting.split(' / ')[1];
      var Vacancy = Waitjinya - ( Waitsol + Training );

      if (options.table_sol_in_mokotool) {
        $('#mokotool').append(
          '<table class="common_table1 center table_sol">' +
            '<tbody>' +
              '<tr><th>総兵数</th>'+'<td id="allsol"></td></tr>'+
              '<tr><th>指揮兵</th>'+'<td id="activesol"></td></tr>'+
              '<tr><th>待機兵</th>'+'<td>' + Waitsol + '</td></tr>'+
              '<tr><th>陣屋</th>'+'<td style="border-left-width: 2px;">' + Waitjinya + '</td></tr>'+
              '<tr><th>訓練中</th>'+'<td>' + Training + '</td></tr>'+
              '<tr><th>空き</th>' +'<td>' + Vacancy + '</td></tr>' +
            '</tbody>' +
          '</table>'
         );
      } else {
        $('<table class="common_table1 center table_sol">' +
            '<tbody>' +
            '<tr><th>総兵数</th><th>指揮兵数</th><th>待機兵数</th><th style="border-left-width: 2px;">陣屋</th><th>訓練中</th><th>空き</th></tr>' +
            '<tr><td id="allsol"></td><td id="activesol"></td><td>' + Waitsol + '</td><td style="border-left-width: 2px;">' + Waitjinya + '</td><td>' + Training + '</td><td>' + Vacancy + '</td></tr>' +
            '</tbody>' +
            '</table>'
         ).insertAfter('#ig_deckmenu');
        $('.table_sol').css({ 'position':'absolute', 'top':'48px', 'right':'3px', 'z-index':'10','background':'#F3F2DE','font-size':'11px'});
        $('.table_sol th').css({ 'padding':'4px 8px 3px !important'});
        $('.table_sol td').css({ 'line-height':'1.1 !important'});
      }
      all_sol();
      var solall = $("#allsol").text();
      var solactive = solall - Waitsol;
      $("#activesol").html( solactive );
    });

  }

  function all_sol() {
    var val = 0;
    $('#soldiers_catalog').find('tr').slice(1).find('td.td_left_posi:eq(1)')
    .each(function(){
      val += parseFloat( $(this).html() );
    });
    $("#allsol").html( val );
  }

  //==兵士編成総合==
  function unitList_check() {
    if ( location.pathname != "/facility/set_unit_list.php" )
      return;
    if( !options.unit_list_group && !options.unit_list_200 && !options.unit_list_total && !options.off_face &&
      !options.set_unit_color && !options.unit_list_allset && !options.unit_list_max && !options.unit_list_default &&
      !options.unit_set_one && $('select[name="show_num"]').val() == 100 )
      return;

    //スペース用のTRを削除
    var notTR = $('#busho_info').find('tr:has( td.tb_space )');
    notTR.remove();

    unit_set_one();
    set_unit_color();
    after_tohankaku();
    unit_list_max();
    off_face();
    frame_take_away();

    //カードの最大指揮数を表示
    var groupSelect = $('#select_card_group').val(),
      showNum = $('input[name="show_num"]').val(),
      btn_select = $('div[onclick*="btn_selectassignno_click"]');
    if( groupSelect == 0 && showNum == 100 && btn_select.length == 1 ){
      $('#title_00').after('<span id="max" style="float: right; color: white; margin: 18px 150px 0 0;">全カード最大指揮数：<span id="all_sol"></span></span>');
      var val = 0;
      $('div[id^="cardWindow"]').find('span[class^="commandsol_no"]').each(function(){
        var max_sol = $(this).text().split('/')[1];
        val += parseFloat( max_sol );
        $('#all_sol').html(val);
      });
    }

    var soldiers = {}, hpstatus = {};
    $('span[id^="now_unit_cnt_"]').each(function() {
      //総兵数
      var id_num = $(this).attr('id').substring(13) || 0;
      var card_id = $('#card_id_arr_' + id_num).val();
      var max = parseInt( $(this).parent().next('span').text() );
      var current = parseInt( $(this).text() );
      var type = $(this).parent().prev().find('img').attr('alt');
      var parentTR = $(this).closest('tr');
      hpstatus[card_id] = parentTR.find('table:first').find('td:eq(1)').text();
      
      if (current > 0) {
      
        if (typeof (soldiers[type]) == 'undefined') {
          soldiers[type] = current;
        } else {
          soldiers[type] += current;
        }
      
      }
      //HPが100でない場合は背景を色付けする
      if ( (hpstatus[card_id] != '100/100') && (hpstatus[card_id] != '193/193') ) {
        parentTR.css('background-color', '#600');
      }
      // 兵数が最大時・0の時にインプットの背景を色付けする
      var Paint = parentTR.find('input[id^="unit_cnt_text_"]');
      var PaintVal = Paint.val();
        
        if ( max == current ) {
          Paint.css('background-color', 'pink');
        }
        if ( current == 0 ) {
          Paint.css('background-color', 'darkGray');
        }
    });
      // 兵数が最大時・0の時にインプットの背景を色付けする click時の更新
      $('input[id^="btn_change_"]').click(function() {
        var naw_cut = $(this).closest('tr.tr_gradient').find('input[id^="unit_cnt_text_"]');
        var naw_cut_Val = naw_cut.val();
        var maxVal = $(this).closest('tr.tr_gradient').find('span[id^="lead_unit_"]').text();
        if ( maxVal == naw_cut_Val ) {
          naw_cut.css('background-color', 'pink');
        }
        else if ( naw_cut_Val == 0 ) {
          naw_cut.css('background-color', 'darkGray');
        }
        else {
          naw_cut.css('background-color', 'white');
        }
      });

    //総兵数を表示
    var type_list = {1: '足軽',2: '長槍足軽',3: '武士',4: '弓足軽',5: '長弓兵',6: '弓騎馬',7: '騎馬兵',8: '精鋭騎馬',9: '赤備え',10: '鉄砲足軽',11: '騎馬鉄砲',12: '焙烙火矢',13: '破城鎚',14: '攻城櫓',15: '大筒兵',16: '国人衆',17: '海賊衆',18: '母衣衆',19: '雑賀衆'};
    if (options.unit_list_total) {
      var tmp = '';
      var total = 0;
      for (i = 1; i <= 19; i++) {
        if (soldiers[type_list[i]]) {
          tmp += '<tr><th>' + type_list[i] + '</th><td style="text-align: right;">' + soldiers[type_list[i]] + '</td></tr>';
          total += soldiers[type_list[i]];
        }
      }
      tmp += '<tr style="border-top: 1px solid #76601D;"><th>合計</th><td style="text-align: right;">' + total + '</td></tr>';
      if (tmp !== '') {
        $('#mokotool').append('<table style="background-color:#f3f2de;" class="common_table1 center">' + tmp + '</table>');
      }
    }

    //グループ機能
    if (options.unit_list_group) {
      group_setting = {};
      //cardname_setting = {};
      group_index = [];
      if (localStorage.getItem("crx_ixamoko_group_set")) {
        group_setting = secureEvalJSON(localStorage.getItem("crx_ixamoko_group_set"));
      }
      if (localStorage.getItem("crx_ixakaizou_group_index")) {
        group_index = secureEvalJSON(localStorage.getItem("crx_ixakaizou_group_index"));
      }
      //グループ順記録ボタンの生成とclickイベント
       $('<input type="button" id="ixamoko_reset_grp" value="グループ順記録" style="width: 9em;" />')
       .click(function(e) {
        var ngroup_setting = {};
        var ngroup_index = [];
        $('span[id^="now_unit_cnt_"]').each(function() {
          var id_num = $(this).attr('id').substring(13);
          var card_id = $('#card_id_arr_' + id_num).val();
          ngroup_setting[card_id] = group_setting[card_id];
          delete group_setting[card_id];
          ngroup_index.push(card_id);
        });
        for (var key in group_setting) {
          ngroup_setting[key] = group_setting[key];
          ngroup_index.push(key);
        }
        group_setting = ngroup_setting;
        ngroup_index.reverse();
        group_index = ngroup_index;
        localStorage.setItem('crx_ixamoko_group_set', toJSON(group_setting));
        localStorage.setItem('crx_ixakaizou_group_index', ArraytoJSON(group_index));
        $(this).val('記録完了');
      }).mouseover(function() {
        $(this).removeAttr('value').val('グループ順記録');
      }).prependTo('#button_box');
      $('#moko_container').css({'height':'32px', 'width':'715px'});
      
      $('span[id^="now_unit_cnt_"]').each(function() {
        var id_num = $(this).attr('id').substring(13);
        var card_id = $('#card_id_arr_' + id_num).val();
        var parentTR = $(this).closest('tr');
        
        if (typeof (group_setting[card_id]) == 'undefined') {
          group_setting[card_id] = 0;
        }
        
        //グループアイコンを表示
        var tga = parentTR.find('a:first');
        var tgdiv = tga.find('div:first').clone();
        var tdone = parentTR.find('td:eq(1)');
        tga.remove();
        tdone.append( tgdiv );
        
        parentTR.find('div[class^="icon_rarelity_"]')
        .append('<img class="ixamoko_grp" cardid="' + card_id +'" src="' + groups_img[group_setting[card_id]] + '" />');

        //グループ設定の背景色
        if (typeof (hpstatus[card_id]) != 'undefined') {
        
          if (hpstatus[card_id] == '100/100' || hpstatus[card_id] == '193/193') {
            parentTR.css('background-color', groups[ group_setting[card_id] ] );
          } else {
            parentTR.css('background-color', groupsx[ group_setting[card_id] ] );
          }
          
        } else {
        
          parentTR.css('background-color', groups[ group_setting[card_id] ] );
        
        }
      });
      
      //強制グループ単位ソート
      if (options.group_sort_mode === '0') {
        var fiximg = $('#deck_file').find('.iepngfix.mb5').size();
        if( fiximg == 0 ){
        
          for (i = groups.length - 1; i > 0; --i) {
            for (var j = 0; j < group_index.length; j++) {
              if ( group_setting[ group_index[j] ] == i ) {
                $('#busho_info').find('tr:first')
                .after( $('img[cardid="' + group_index[j] + '"]').closest('tr') );
              }
            }
          }
        
        }
      }
      
      //グループアイコン/背景色の切り替えイベント(左クリック)
      $('.ixamoko_grp').live('click', function(e) {
        var card_id = $(this).attr('cardid');
        ++group_setting[card_id];
        //グループアイコン
        if (group_setting[card_id] >= groups.length) {
          group_setting[card_id] = 0;
        }
        //背景色
        if (typeof (hpstatus[card_id]) != 'undefined') {
          if (hpstatus[card_id] == '100/100' || hpstatus[card_id] == '193/193') {
            $(this).closest('tr').css( 'background-color', groups[ group_setting[card_id] ] );
          } 
          else {
            $(this).closest('tr').css( 'background-color', groupsx[ group_setting[card_id] ] );
          }
        }
        else {
          $(this).closest('tr').css( 'background-color', groups[ group_setting[card_id] ] );
        }
        
        $(this).get()[0].src = groups_img[group_setting[card_id]];
        localStorage.setItem('crx_ixamoko_group_set', toJSON(group_setting));
        return false;
        
      });

      //グループアイコン/背景色の切り替えイベント(右クリック)
      $('.ixamoko_grp').live('contextmenu', function(e) {
        var card_id = $(this).attr('cardid');
        --group_setting[card_id];
        //グループアイコン
        if (group_setting[card_id] < 0) {
          group_setting[card_id] = groups.length - 1;
        }
        //背景色
        if (typeof (hpstatus[card_id]) != 'undefined') {
          if (hpstatus[card_id] == '100/100' || hpstatus[card_id] == '193/193') {
            $(this).closest('tr').css( 'background-color', groups[ group_setting[card_id] ] );
          }
          else {
            $(this).closest('tr').css( 'background-color', groupsx[ group_setting[card_id] ] );
          }
        }
        else {
          $(this).closest('tr').css( 'background-color', groups[ group_setting[card_id] ] );
        }
        
        $(this).get()[0].src = groups_img[ group_setting[card_id] ];
        localStorage.setItem( 'crx_ixamoko_group_set', toJSON(group_setting) ) ;
        return false;
      });
    
    }
    
  }

  //兵士編成の兵種選択押下で自動補充
  function unit_list_max() {
    if(!options.unit_list_max)
      return;
    $('input[id^="btn_change_"]').each(function() {
      var i = $(this).attr('id').replace('btn_change_', '');
      $('#unit_set_link' + i).click(function() {
        $('#btn_change_' + i).trigger('click');
      });
      $('#unit_id_select_' + i).change(function() {
        if ( ($('#unit_id_select_' + i).val() !== '') && ($('#unit_cnt_text_' + i).val() == '1') ) {
          $('#btn_change_' + i).trigger('click');
        }
        else if ( $('#unit_id_select_' + i).val() === '' ) {
          $('#unit_cnt_text_' + i).attr('value', '0');
          $('#btn_change_' + i).trigger('click');
        }
        else{
          var nowtext = $('#unit_cnt_text_' + i).val();
          $('#unit_cnt_text_' + i).attr('value', nowtext );
          $('#btn_change_' + i).trigger('click');
        }
      });
    });
  }

  //兵士編成の武将画像を非表示
  function off_face() {
    if(!options.off_face)
      return;
    var style = document.createElement("style");
    style.innerHTML = '#busho_info div[class^="icon_rarelity_"] { left: 10px; top: 9px; }' +
             '#busho_info .img_face { background-image: none !important; width: 36px; }'
    document.head.appendChild(style);
  }

  //簡易編成の兵種の色分け
  function set_unit_color() {
    if (location.pathname!="/facility/set_unit_list.php")
      return;
    if(!options.set_unit_color)
      return;
    var nowsol = {
        足軽: '#F5DED5', 長槍足軽: '#F6CBBF', 武士: '#ECA896', 国人衆: '#FFA3A3',
        弓足軽: '#E9D8F4', 長弓兵: '#DABDF8', 弓騎馬: '#BB93E2', 海賊衆: '#D6A1FF',
        騎馬兵: '#F6DC8D', 精鋭騎馬: '#F8D165', 赤備え: '#E7BB43', 母衣衆: '#FDEC6D',
        破城鎚: '#B5BEBC', 攻城櫓: '#7198B8', 大筒兵: '#798D9D', 鉄砲足軽: '#9E8680', 騎馬鉄砲: '#B1A178', 焙烙火矢: '#86079E', 雑賀衆: '#ACAC4F'
    };
    
    $.each( nowsol, function( sol, color ) {
        $('img[alt="' + sol + '"]').parent().css('background-color', color);
    });
    
    change_color();
  }
  function change_color() {
    $('input[id^="btn_change_"]').click(function() {
      var sol = $(this).closest('tr.tr_gradient').find('select.force_type2').find('option:selected').attr('value');
      var changeDIV = $(this).closest('tr.tr_gradient').find('div.force_type');
      set_unit_color_change( sol, changeDIV );
    });
  }
  function set_unit_color_change( sol, changeDIV ){
    var nowcolor = {
        '': '', 321: '#F5DED5', 322: '#F6CBBF', 323: '#ECA896', 324: '#FFA3A3',
        325: '#E9D8F4', 326: '#DABDF8', 327: '#BB93E2', 328: '#D6A1FF',
        329: '#F6DC8D', 330: '#F8D165', 331: '#E7BB43', 332: '#FDEC6D',
        333: '#B5BEBC', 334: '#7198B8', 335: '#798D9D', 336: '#9E8680', 337: '#B1A178', 345: '#86079E', 338: '#ACAC4F'
    };
    
    $.each( nowcolor, function( solnm, color ) {
      if( sol == solnm ) { changeDIV.css('background-color', color) }
    });
  }

  //兵1セットボタンを追加
  function unit_set_one() {
    if (location.pathname != "/facility/set_unit_list.php")
      return;
    if (!options.unit_set_one)
      return;
    $('#busho_info').find('tr.tr_gradient').slice(1).each(function() {
      var buttonV = $(this).find('input[id^="btn_change_"]');
      var buttonCL = buttonV.clone();
      buttonV.remove();
      $(this).find('td.td_center:eq(4)').find('td.td_border_0:eq(0)')
      .append( buttonCL );
      $(this).find('td.td_border_left_0.td_center:last').remove();
      var no = $(this).find('input:first').val();
      $('#unit_set_link' + no )
      .before('<span class="one_sol" style="color:#BA8BE5; cursor:pointer;">[<span>1</span>]</span>&nbsp;');
    });
    $('.one_sol').click(function() {
      var tg_input = $(this).closest('tbody').find('td:first').find('input:first');
      var tg_button = $(this).closest('tbody').find('td:first').find('input:eq(1)');
      var tg_value = $(this).find('span').text();
      
      tg_input.val( tg_value );
      tg_button.click();
    });
  }

  //基本兵種機能
  function unit_list_default() {
    if (options.unit_list_200 && $('select[name="show_num"]').val() == 100 && $('ul.pager li.last a:first').attr('href'))
      return;
    if (!options.unit_list_default)
      return;
    if (location.pathname != "/facility/set_unit_list.php")
      return;
    unitListDefaultView();
  }

  function unitListDefaultView() {
    if (location.pathname != "/facility/set_unit_list.php")
      return;
    if (!options.unit_list_default)
      return;

    var default_unit = {};
    if (localStorage.getItem("crx_ixamoko_default_unit")) {
      default_unit = secureEvalJSON(localStorage.getItem("crx_ixamoko_default_unit"));
    }
    $('#button_box').append('&nbsp;<input type="button" value="基本兵種記録" id="default_unit_set" style="width:9em;" />');
    $('#moko_container').css({'height':'32px', 'width':'715px'});
    $('#busho_info').find('tr.tr_gradient:eq(0)').find('th:eq(8)').replaceWith('<th>基本兵種/兵種(待機数)</th>');
    
    $('#busho_info').find('tr.tr_gradient').slice(1).each(function() {
      var unit = '';
      //存在する兵種のみ基本兵種のメニューに表示
      $('#soldiers_catalog').find('tr').slice(1)
      .each(function() {
        if( $(this).find('td[id^="unit_count_"]').length ){
          var unit_no = $(this).find('td[id^="unit_count_"]').attr('id').substring(11);
          unit += '<option value="' + unit_no + '">' + $(this).find('img[src*="/img/card/icon/"]').attr('alt') + '</option>';
        }
      });
      var no = $(this).find('input:eq(0)').val();
      $('#unit_id_select_' + no)
      .before('<select id="unit_default_select_' + no + '">' + 
           '<option value="">なし</option>' + unit + 
           '</select><br />');
      var card_id = $('#card_id_arr_' + no).val();
      if (default_unit[card_id]) {
        $('#unit_default_select_' + no).val(default_unit[card_id]);
      }
    });
    
    $('#default_unit_set').click(function() {
      $('span[id^="now_unit_cnt_"]').each(function() {
        var id_num = $(this).attr('id').substring(13);
        var card_id = $('#card_id_arr_' + id_num).val();
        var unit = $('#unit_default_select_' + id_num).find('option:selected').val();
        default_unit[card_id] = unit;
      });
      localStorage.setItem('crx_ixamoko_default_unit', toJSON(default_unit));
      $(this).val('記録完了');
    }).mouseover(function() {
      $(this).removeAttr('value').val('基本兵種記録');
    });
    
    if( $('#deck_file').find('img.iepngfix.mb5').size() ) {
      $('select[id^="unit_default_select_"]').attr('disabled', true);
    }
  }

  //簡易編成兵士一括セット関連
  function unit_list_allset() {
    if (!options.unit_list_allset)
      return;
    if (location.pathname != "/facility/set_unit_list.php")
      return;
    
    var default_unit = {};
    var pool_unit = {};
    //基本兵種取得
    if (localStorage.getItem("crx_ixamoko_default_unit")) {
      default_unit = secureEvalJSON(localStorage.getItem("crx_ixamoko_default_unit"));
    }
    //存在する兵種のみ設定できる + 存在する兵種のみメニューに表示
    var unit = '';
    var unit2 = '';
    $('#soldiers_catalog').find('tr').slice(1)
    .each(function() {
      if( $(this).find('td[id^="unit_count_"]').length ){
        var unit_no = $(this).find('td[id^="unit_count_"]').attr('id').substring(11); //文字列
        unit += '<option value="' + unit_no + '">' + $(this).find('img[src*="/img/card/icon/"]').attr('alt') + '</option>';
        pool_unit[unit_no] = parseFloat($('#pool_unit_cnt_' + unit_no).val()); //数値
      }
    });
    
    $('select.force_type2:first').find('option').slice(1).each(function() {
      var unit_no = $(this).attr('value'); //文字列
      unit2 += '<option value="' + unit_no + '">' + $(this).attr('label') + '</option>';
      pool_unit[unit_no] = parseFloat($('#pool_unit_cnt_' + unit_no).val()); //数値
    });
    //｢0以上｣、「余り兵種」をデフォルトに
    $('<div class="soldier_bulk">' +
      '<span>兵数</span>' +
      '<select id="select_butai_heisuu">'+ 
      '<option value="3">0以上</option><option value="0">0</option><option value="1">1</option><option value="2">2以上</option>' +
      '</select>' +
      '<span>の</span>' +
      '<select id="select_butai_heisyu">' +
      '<option value="all">全て</option>' + unit + 
      '</select>' +
      '<span>の武将に</span>' +
      '<select id="set_butai_heisyu">' +
      '<option value="zanhei">余り兵種</option><option value="nochange">現状兵種</option><option value="default_sol">基本兵種</option>' + unit2 + 
      '</select>' +
      '<span>で兵数</span>' +
      '<select id="set_butai_heisuu">' +
      '<option value="max">最大</option><option value="0">0</option><option value="1">1</option>' +
      '</select>' +
      '<span>を</span>' +
      '<input type=button id="heisi_set" value="一括セット">' +
      '</div>'
    ).insertBefore('#bar_card');
    
    if (localStorage.getItem("crx_ixamoko_kanihensei")) {
      var selections = secureEvalJSON(localStorage.getItem("crx_ixamoko_kanihensei"));
      //console.log(selections);
      $('#select_butai_heisyu').val(selections.select_butai_type);
      $('#select_butai_heisuu').val(selections.select_butai_cnt);
      $('#set_butai_heisyu').val(selections.set_butai_type);
      $('#set_butai_heisuu').val(selections.set_butai_cnt);
    }

    //一括セットクリック
    $('#heisi_set').live('click', function() {
      nowLoading();
      setTimeout(function() {
        var card_array = [];
        //検索兵種
        var select_butai_type = $('#select_butai_heisyu').find('option:selected').val(); //文字列
        //検索兵数
        var select_butai_cnt = parseFloat($('#select_butai_heisuu').find('option:selected').val()); //数値
        //セット兵種選択
        var set_butai_type = $('#set_butai_heisyu').find('option:selected').val(); //文字列
        //セット兵数選択
        var set_butai_cnt = $('#set_butai_heisuu').find('option:selected').val(); //文字列
        
        localStorage.setItem("crx_ixamoko_kanihensei", toJSON({"select_butai_type": select_butai_type,"select_butai_cnt": select_butai_cnt,"set_butai_type": set_butai_type,"set_butai_cnt": set_butai_cnt}));

        //プール兵数更新
        for (var key in pool_unit) {
          pool_unit[key] = parseFloat($('#pool_unit_cnt_' + key).val());
        }

        //簡易編成行単位ループ
        $('#busho_info').find('tr.tr_gradient:visible').slice(1).each(function() {
          //現状取得
          //行番号
          var no = $(this).find('input[id^="key_str_array_"]').val();
          //兵種
          var now_unit_type = $('#now_unit_type_' + no).val(); //文字列
          //兵数
          var now_unit_cnt = parseFloat($('#now_unit_cnt_' + no).text()); //数値
          //基本兵種
          var now_default = $('#unit_default_select_' + no).find('option:selected').val(); //文字列
          //指揮力
          var lead = parseFloat($('#lead_unit_' + no).text()); //数値
          //セット兵種
          var set_unit_type = ''; //文字列
          //セット兵数
          var set_unit_cnt = 0; //数値

          //検索条件.兵数の判定
          //検索条件.兵数が2以上かつ対象行兵数が2以上または、検索条件.兵数と対象行兵数が同じまたは、検索条件.兵数が0以上
          if (((select_butai_cnt == 2) && (now_unit_cnt >= 2)) || (select_butai_cnt == now_unit_cnt) || (select_butai_cnt == 3)) {
            //検索条件.兵種の判定
            //検索条件.兵種が全て、または、検索条件.兵種と対象行兵種が同じ、または、検索条件.兵数が0
            if ((select_butai_type == 'all') || (select_butai_type == now_unit_type) || (select_butai_cnt == 0)) {
              //ここまでが変更対象の特定処理

              //セット兵数が0以外
              if (set_butai_cnt != '0') {
                //兵種セット
                //プールに現兵数を加算
                if (now_unit_type !== '') {
                  pool_unit[now_unit_type] = pool_unit[now_unit_type] + now_unit_cnt;
                }
                //セット兵種が現兵種
                if (set_butai_type == 'nochange') {
                  set_unit_type = now_unit_type;
                }
                //セット兵種が基本兵種
                else if (set_butai_type == 'default_sol') {
                  set_unit_type = now_default;
                }
                //セット兵種が余り兵種
                else if (set_butai_type == 'zanhei') {
                  //兵種の決定
                  //プール最大兵数兵種を求める
                  var pool_max = 0;
                  var max_key = '';
                  for (var key in pool_unit) {
                    if (pool_unit[key] > pool_max) {
                      pool_max = pool_unit[key];
                      max_key = key;
                    }
                  }
                  //セット兵数が1
                  if (set_butai_cnt == '1') {
                    //現兵数が0
                    if (now_unit_cnt === 0) {
                      set_unit_type = max_key;
                    //現兵数が1以上
                    }
                    else {
                      set_unit_type = now_unit_type;
                    }
                  //セット兵数が最大のとき
                  }
                  else {
                    set_unit_type = max_key;
                  }
                //セット兵種が特定兵種
                }
                else {
                  set_unit_type = set_butai_type;
                }
                //兵数セット
                //残兵なし
                if (set_unit_type === '' || set_unit_type == 'undefined' || pool_unit[set_unit_type] === 0) {
                  set_unit_type = '';
                  set_unit_cnt = 0;
                }
                //セット兵数が最大
                else if (set_butai_cnt == 'max') {
                  //指揮力がプール兵数より大きいならプール兵数をセット
                  if (lead > pool_unit[set_unit_type]) {
                    set_unit_cnt = pool_unit[set_unit_type];
                  //指揮力がプール兵数より小さいなら指揮力兵数をセット
                  }
                  else if (lead <= pool_unit[set_unit_type]) { //条件文追加2011.11.26 なぜこれでまともに動くようになるのかはわからない
                    set_unit_cnt = lead;
                  }
                //セット兵数1
                }
                else {
                  set_unit_cnt = 1;
                }
                //残兵計算
                if ( set_unit_type !== '' ) {
                  pool_unit[set_unit_type] = pool_unit[set_unit_type] - set_unit_cnt;
                }
              }
              //変更前後で差異が無い場合は次の行
              if ((now_unit_type == set_unit_type) && (now_unit_cnt == set_unit_cnt)) {
                return true;
              }
              //兵種と兵数をセット
              $('#unit_id_select_' + no).val( set_unit_type );
              //$('#unit_cnt_text_' + no).attr('value', set_unit_cnt );
              $('#unit_cnt_text_' + no).val( set_unit_cnt );
              //対象行のカード番号、セット兵種、セット兵数をArrayに詰め込む
              card_array.push( $('#card_id_arr_' + no).attr('value') + ',' + set_unit_type + ',' + set_unit_cnt);
            }
          }
        });
        unit_list_set(card_array, 0);
      }, 100);
    });
  }

  //兵種、兵士一括セット
  function unit_list_set(card_array, i) {
    var shonum = $('select[name="show_num"]').val();
    var nowselectgrp = $('#select_card_group').val();
    //変更対象が無くなったら、簡易編成画面をリロード ※現在選択中のグループを維持させる
    if (card_array.length <= i) {
      location.href = location.pathname + '?show_num=' + shonum + '&select_card_group=' + nowselectgrp;
      return;
    }
    //既存の【変更】ボタンがAjaxである為、既存の【変更】ボタン押下では、変更処理完了をキャッチできない
    //本来、IXAが【変更】ボタンの2度押し防止対策を施す必要があるのだが、現仕様では【変更】ボタン連打が可能となっており、
    //悪意ある操作者がサーバへ負荷をかけることが可能となっている。
    //mokoでは、上記のようなことを避けるため、画面をモーダルにし【変更】ボタンの代用Ajaxで変更処理完了をキャッチしてから次の変更処理を行うようにしている
    if (card_array[i] !== '') {
      $('#nowLoadingContent > p > span').text((i + 1) + '/' + (card_array.length) + '人目');
      var card = card_array[i].split(',');
      $.post(
        '/facility/set_unit_list_if.php',
        { card_id: card[0], unit_type: card[1], unit_count: card[2] },
        function( data ) {
          i++;
          setTimeout(unit_list_set, 0, card_array, i);
        }
      );
    }
  }

  //兵種フィルター
  function unit_filter_branch() {
    if (location.pathname != "/facility/set_unit_list.php")
      return;
    if (!options.unit_filter_branch)
      return;
      
    $('<ul id="branch_ul">' +
      '<li><a id="all" class="main">全兵科</a></li>' +
      '<li><a id="yari" class="main">槍兵科</a>' +
        '<div>' +
          '<a id="ashigaru">足軽</a>' +
          '<a id="nagayari">長槍足軽</a>' +
          '<a id="bushi">武士</a>' +
          '<a id="kokunin">国人衆</a>' +
        '</div>' +
      '</li>' +
      '<li><a id="yumi" class="main">弓兵科</a>' +
        '<div>' +
          '<a id="yumiashigaru">弓足軽</a>' +
          '<a id="nagayumi">長弓兵</a>' +
          '<a id="yumikiba">弓騎馬</a>' +
          '<a id="kaizoku">海賊衆</a>' +
        '</div>' +
      '</li>' +
      '<li><a id="kiba" class="main">騎馬兵科</a>' +
        '<div>' +
          '<a id="kibahei">騎馬兵</a>' +
          '<a id="seiei">精鋭騎馬</a>' +
          '<a id="akasonae">赤備え</a>' +
          '<a id="horo">母衣衆</a>' +
        '</div>' +
      '</li>' +
      '<li><a id="heiki" class="main">兵器兵科</a>' +
        '<div>' +
          '<a id="teppou">鉄砲足軽</a>' +
          '<a id="kibatetsu">騎馬鉄砲</a>' +
          '<a id="horokuhiya">焙烙火矢</a>' +
          '<a id="saika">雑賀衆</a>' +
          '<a id="hajyou">破城鎚</a>' +
          '<a id="kohjyou">攻城櫓</a>' +
          '<a id="ootutu">大筒兵</a>' +
        '</div>' +
      '</li>' +
      '<li><a id="none" class="main">なし</a></li>' +
      '<span id="select_count"></span>' +
      '<span id="select_cost"></span>' +
      '</ul>'
    ).insertAfter('#btn_category');
    
    function hidebox() {
      $('div.ikkatsu').hide();
      $('tr.tr_gradient').slice(1).hide();
    }
    //カード枚数・コスト
    function showCost(){
      var onfirst = $('#btn_category').find('li:first').attr('class');
      var onlast = $('#btn_category').find('li:last').attr('class');
      if( onfirst != 'btn_category_00_off' ||  onlast != 'btn_category_05_off' )
        return;
      var val = 0;
      $('tr.tr_gradient:visible').slice(1).find('td:eq(6)')
      .each(function(){
        val += parseFloat( $(this).html() );
      });
      
      $("#select_cost").html('cost&nbsp;' + val );
    }
    function showCount() {
      var Count = $('tr.tr_gradient:visible').size() - 1;
      $('#select_count').html( Count );
      showCost();
    }
    //プルダウンメニュー
    $('#branch_ul > li').live('contextmenu', function() {
      $(this).children('div').slideDown(150);
      return false;
    }).hover(function() {
      //
    },function() {
      $('#branch_ul > li > div').slideUp(150);
    });
    
    $('#branch_ul > li > a').click(function() {
      $('#branch_ul > li').find('a.now_branch').remove();
      $('a.main').show();
      $('#branch_ul > li > a').removeClass('select_now');
      $(this).addClass('select_now');
      
    });
    
    $('#branch_ul > li').find('div > a').click(function() {
      var selecttext = $(this).text(),
        closestLI = $(this).closest('li');
      $('#branch_ul > li > a').removeClass('select_now');
      $('#branch_ul').find('a.now_branch').remove();
      $('#branch_ul').find('a.main').show();
      closestLI.find('a.main').hide();
      closestLI.find('a.now_branch').remove();
      closestLI.prepend('<a class="now_branch">' + selecttext + '</a>');
      $(this).parent().slideUp(150);
    }).hover(function() {
      $(this).closest('li').find('a:first').addClass('select_now');
    },function() {
      $(this).closest('li').find('a:first').removeClass('select_now');
    });
    //フィルター
    $('#all').click(function() {
      $('div.soldier_bulk, #button_box, div.ikkatsu').show();
      $('tr.tr_gradient').slice(1).show();
      showCount();
    });

    $('#yari').click(function() {
      hidebox();
      $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="足軽"], img[alt="長槍足軽"], img[alt="武士"], img[alt="国人衆"]) )')
      .show();
      showCount();
    });
      $('#ashigaru').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="足軽"]))').show();
        showCount();
      });
      $('#nagayari').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="長槍足軽"]))').show();
        showCount();
      });
      $('#bushi').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="武士"]))').show();
        showCount();
      });
      $('#kokunin').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="国人衆"]))').show();
        showCount();
      });

    $('#yumi').click(function() {
      hidebox();
      $('tr.tr_gradient').slice(1).filter(':has( div.force_type:has(img[alt="弓足軽"], img[alt="長弓兵"], img[alt="弓騎馬"], img[alt="海賊衆"]) )')
      .show();
      showCount();
    });
      $('#yumiashigaru').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="弓足軽"]))').show();
        showCount();
      });
      $('#nagayumi').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="長弓兵"]))').show();
        showCount();
      });
      $('#kaizoku').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="海賊衆"]))').show();
        showCount();
      });
      $('#yumikiba').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="弓騎馬"]))').show();
        showCount();
      });

    $('#kiba').click(function() {
      hidebox();
      $('tr.tr_gradient').slice(1).filter(':has( div.force_type:has(img[alt="騎馬兵"], img[alt="精鋭騎馬"], img[alt="赤備え"], img[alt="母衣衆"]) )')
      .show();
      showCount();
    });
      $('#kibahei').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="騎馬兵"]))').show();
        showCount();
      });
      $('#seiei').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="精鋭騎馬"]))').show();
        showCount();
      });
      $('#akasonae').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="赤備え"]))').show();
        showCount();
      });
      $('#horo').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="母衣衆"]))').show();
        showCount();
      });

    $('#heiki').click(function() {
      hidebox();
      $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="鉄砲足軽"], img[alt="騎馬鉄砲"], img[alt="焙烙火矢"], img[alt="雑賀衆"], img[alt="破城鎚"], img[alt="攻城櫓"], img[alt="大筒兵"]) )')
      .show();
      showCount();
    });
      $('#teppou').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="鉄砲足軽"]))').show();
        showCount();
      });
      $('#kibatetsu').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="騎馬鉄砲"]))').show();
        showCount();
      });
      $('#horokuhiya').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="焙烙火矢"]))').show();
        showCount();
      });
      $('#saika').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="雑賀衆"]))').show();
        showCount();
      });
      $('#hajyou').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="破城鎚"]))').show();
        showCount();
      });
      $('#kohjyou').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="攻城櫓"]))').show();
        showCount();
      });
      $('#ootutu').click(function() {
        hidebox();
        $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[alt="大筒兵"]))').show();
        showCount();
      });

    $('#none').click(function() {
      hidebox();
      $('tr.tr_gradient').slice(1).filter(':has(div.force_type:has(img[src$="blank.gif"]))').show();
      showCount();
    });

  }
  //カード表示を200枚まで表示使用時は200枚表示に書き換える
  $( function() {
    if (location.pathname != "/facility/set_unit_list.php")
      return;
    if (!options.unit_list_200)
      return;
    $('select[name="show_num"]').find('option:last').text('200枚表示');
  });
  
  //兵士編成のカード表示を200枚まで表示
  function unit_list_200() {
    if (location.pathname != "/facility/set_unit_list.php")
      return;
      
    if (!options.unit_list_200) {
      unitList_check();
      return;
    }
    
    if ( $('select[name="show_num"]').val() != 100 ) {
      unitList_check();
      return;
    }
    
    if ( $('ul.pager').size() > 0 ) {
      var href = $('ul.pager > li.last > a:first').attr('onClick').match(/".*?"/g)[2];
          href = href.replace(/"/g, '');
      var href2 = href + '&p=2';
    }
    
    if( href == '/facility/set_unit_list.php' ) {
      href += '?&show_num=100';
      href2 = href + '&p=2';
    }
    
    if (!href) {
      unitList_check();
      return;
    }
    
    //ページャーの削除
    $('ul.pager').remove();
    // 非同期処理完了確認の為不可視
    $('#deck_file, #button_box').hide();
    $('#frame_01_spacer').append('<div id="read" style="text-align: center;">読込中...</div>');
    
    $.post( href2, function(html) {
      $(html).find('div[id^="cardWindow"]')
      .each(function() {
        var tmp = $(this).clone();
        $('#lump_sum').before(tmp);
      });
      
      $(html).find('#busho_info').find('tr.tr_gradient').slice(1)
      .appendTo('#busho_info > tbody');
      
      $('a.thickbox').live('mousedown', function() {
        tb_init('a.thickbox');
      });
      
      $('#now_group_type').find('option:first').remove();
      
      unitList_check();
      unitListDefaultView();
      // 非同期処理完了確認で表示
      $('#deck_file, #button_box').show();
      $('#read').remove();
    });
  }

///////////////////
//ツールチップ:
///////////////////
  //取引検索用ツールチップ[部隊編成・兵士編成・取引・出品]
  function card_tool() {
    if ( !options.card_tool)
      return;
    if ( location.pathname != "/card/deck.php" && location.pathname != "/facility/set_unit_list.php" && location.pathname != "/union/levelup.php" && location.pathname != "/union/remove.php" && location.pathname != "/card/trade_card.php" && location.pathname != "/card/trade.php" && location.pathname != "/card/exhibit_list.php" )
      return;
    $('body').append('<div id="tooltip_layer"><div id="tooltip"><ul id="cardUnit"></ul></div></div>');
    $("#tooltip_layer").hide();
    
    var TargetArea ='';
    if(location.pathname == "/card/deck.php" || location.pathname == "/union/levelup.php" || location.pathname == "/union/remove.php"){
      TargetArea = $('div.ig_deck_smallcardimage');
    }
    else if(location.pathname == "/facility/set_unit_list.php"){
      TargetArea = $('#busho_info').find('tr.tr_gradient').find('td:nth-child(1), td:nth-child(2), td:nth-child(3)');
    }
    else if(location.pathname == "/card/trade_card.php"){
      TargetArea = $('div.ig_deck_subcardarea');
    }
    else if(location.pathname == "/card/trade.php" || location.pathname == "/card/exhibit_list.php"){
      TargetArea = $('table.common_table1.center.mt10').find('tr.fs12').find('td:nth-child(1), td:nth-child(2), td:nth-child(3), td:nth-child(4)');
    }
    
    TargetArea.live('contextmenu', function(event) {
      openMenu(this, event.pageX, event.pageY);
      event.preventDefault();
      return false;
    });
  }
  
  function openMenu(target, x, y) {
    $('#tooltip_layer').css({left: x - 10, top: y - 10, 'padding':'10px'}).show();
    $('#tooltip').css({'padding':'2px', 'border':'1px solid #937824', 'box-shadow':'0 2px 12px -1px black'});
    $('#tooltip_layer').mouseout(function() {
      $('#tooltip_layer').hide();
    });
    $('#tooltip_layer:children').mouseover(function() {
      $('#tooltip_layer').show();
    });
    $('#cardUnit').text('').append('<div style="padding:2px 10px; opacity: 0.6;"><img src="' + IMAGES.wait + '" /></div>');
    if(location.pathname == "/card/deck.php"){
      var CardName = $(target).parent().parent().find('span.ig_deck_smallcard_cardname').text(),
        CardNo = $(target).find('img.smallcard_chara').attr('src'),
        CardNo = CardNo.substring(CardNo.indexOf('deck/'), CardNo.indexOf('_')).replace('deck/', ''),
        CardId = $(target).find('a.thickbox').attr('href'),
        CardId = CardId.substring(CardId.indexOf('cardWindow_'), CardId.indexOf('&caption')).replace('cardWindow_', ''),
        CardLv = $(target).parent().find('table.ig_deck_smallcarddata:eq(0)').find('td:eq(1)').text().split('｜')[1],
        CardRank = $(target).parent().find('table.ig_deck_smallcarddata:eq(0)').find('td:eq(1)').text().split('｜')[0].split('★')[1],
        Area = $(target).parent().find('table.ig_deck_smallcarddata:eq(2)'),
        skill_1 = Area.find('td:eq(0)').text().split('L')[0],
        skill_2 = Area.find('td:eq(1)').text().split('L')[0],
        skill_3 = Area.find('td:eq(2)').text().split('L')[0];
    }
    if(location.pathname == "/union/levelup.php" || location.pathname == "/union/remove.php"){
      var CardName = $(target).parent().parent().find('span.ig_deck_smallcard_cardname').text(),
        CardNo = $(target).find('img.smallcard_chara').attr('src'),
        CardNo = CardNo.substring(CardNo.indexOf('deck/'), CardNo.indexOf('_')).replace('deck/', ''),
        Area = $(target).parent().find('table.ig_deck_smallcarddata:eq(2)'),
        skill_1 = Area.find('td:eq(0)').text().split('L')[0],
        skill_2 = Area.find('td:eq(1)').text().split('L')[0],
        skill_3 = Area.find('td:eq(2)').text().split('L')[0];
    }
    if(location.pathname == "/facility/set_unit_list.php"){
      var CardId = $(target).parent().find('a.busho_name').attr('href').split('_')[2],
        CardName = $(target).parent().find('a.busho_name').text(),
        CardRank = $(target).parent().find('span.rank_glay').text(),
        Area = $('#cardWindow_' +CardId),
        CardNo = Area.find('span.ig_card_cardno').text(),
        CardLv = Area.find('span.ig_card_level').text(),
        skill_1 = Area.find('div.skill1').find('span.ig_skill_name').text().split('L')[0],
        skill_2 = Area.find('div.skill2').find('span.ig_skill_name').text().split('L')[0],
        skill_3 = Area.find('div.skill3').find('span.ig_skill_name').text().split('L')[0];
    }
    if(location.pathname == "/card/trade_card.php" || location.pathname == "/card/trade.php" || location.pathname == "/card/exhibit_list.php"){
      var CardName = $(target).parent().find('span.ig_card_name').text(),
        CardNo = $(target).parent().find('span.ig_card_cardno').text(),
        Area = $(target).parent().find('div.parameta_area_back'),
        skill_1 = Area.find('div.skill1').find('span.ig_skill_name').text().split('L')[0],
        skill_2 = Area.find('div.skill2').find('span.ig_skill_name').text().split('L')[0],
        skill_3 = Area.find('div.skill3').find('span.ig_skill_name').text().split('L')[0];
    }
    addMenu(CardName, CardNo, skill_1, skill_2, skill_3, CardId, CardLv, CardRank);
  }
  
  function addMenu(CardName, CardNo, skill_1, skill_2, skill_3, CardId, CardLv, CardRank){
    var CardUnit = $('#cardUnit');
    $('#cardUnit').text('').append('<div id="menu_tile">取引検索と合成</div>');
    
    $('<li id="cNo">No.' + CardNo + '</li>').click(function(){
      $('#tooltip_layer').hide();
      location.href = '/card/trade.php?t=no&k=' + CardNo + '&s=price&o=a';
    }).appendTo( CardUnit );
    
    $('<li id="ts">' + CardName + '</li>').click(function(){
      $('#tooltip_layer').hide();
      location.href = '/card/trade.php?t=name&k=' + CardName + '&s=price&o=a';
    }).appendTo( CardUnit );
    
    $('<hr class="separator" />').appendTo( CardUnit );
    
    $('<li id="tsa">' + skill_1 + '</li>').click(function(){
      $('#tooltip_layer').hide();
      location.href = '/card/trade.php?t=skill&k=' + skill_1 + '&s=price&o=a';
    }).appendTo( CardUnit );
    if(skill_2 != ''){
      $('<li id="tsb">' + skill_2 + '</li>').click(function(){
        $('#tooltip_layer').hide();
        location.href = '/card/trade.php?t=skill&k=' + skill_2 + '&s=price&o=a';
      }).appendTo( CardUnit );
    }
    if(skill_3 != ''){
      $('<li id="tsc">' + skill_3 + '</li>').click(function(){
        $('#tooltip_layer').hide();
        location.href = '/card/trade.php?t=skill&k=' + skill_3 + '&s=price&o=a';
      }).appendTo( CardUnit );
    }
    
    if(location.pathname == "/card/deck.php"){
      $('<hr class="separator" />').appendTo( CardUnit );
      if(CardLv == '20' && CardRank != '5'){
        $('<li id="rank_up">ランクアップ</li>').click(function(){
          $('#tooltip_layer').hide();
          var data = { selected_cid: CardId, union_type: '4' };
          $.form ({ type: 'post', url: '/union/levelup.php', data: data });
        }).appendTo( CardUnit );
      }
    }
    if(location.pathname == "/facility/set_unit_list.php"){
      $('<hr class="separator" />').appendTo( CardUnit );
      if(CardLv == '20' && CardRank != ''){
        $('<li id="rank_up">ランクアップ</li>').click(function(){
          $('#tooltip_layer').hide();
          var data = { selected_cid: CardId, union_type: '4' };
          $.form ({ type: 'post', url: '/union/levelup.php', data: data });
        }).appendTo( CardUnit );
      }
    }
    if(location.pathname == "/card/deck.php" || location.pathname == "/facility/set_unit_list.php"){
      
      $('<li id="skill_str">スキル強化</li>').click(function(){
        $('#tooltip_layer').hide();
        var data = { selected_cid: CardId, union_type: '1' };
        $.form ({ type: 'post', url: '/union/levelup.php', data: data });
      }).appendTo( CardUnit );
      
      $('<li id="skill_add">スキル追加</li>').click(function(){
        $('#tooltip_layer').hide();
        var data = { selected_cid: CardId, union_type: '2' };
        $.form ({ type: 'post', url: '/union/levelup.php', data: data });
      }).appendTo( CardUnit );
      
      if(skill_2 != ''){
        $('<li id="skill_del">スキル削除</li>').click(function(){
          $('#tooltip_layer').hide();
          var data = { base_cid: CardId, selected_cid: CardId,  union_type: '3' };
          $.form ({ type: 'post', url: '/union/union_remove.php', data: data });
        }).appendTo( CardUnit );
      }
      
      $.form = function(s) {
        var def = {
          type: 'get',
          url: location.href,
          data: {}
        };
        s = $.extend(true, s, $.extend(true, {}, def, s));
        var form = $('<form>').attr({'method': s.type,'action': s.url}).appendTo(document.body);
        for (var a in s.data) {
          $('<input>').attr({'name': a,'value': s.data[a]}).appendTo(form[0]);
        }
        form[0].submit();
      };
      
    }
  }
  
  $(function() {
    if(location.pathname != "/map.php")
    return;
    $('<div id="quick_layer" style="display: none;">' +
      '<table class="common_table1">' +
      '<thead><tr><th colspan="7">全体格付</th><th colspan="4" style="border-left-width: 2px;">合戦格付</th></tr>' +
      '<tr><th>城主名</th><th>順位</th><th>戦功</th><th>攻撃</th><th>防御</th><th>一戦撃破</th><th>一戦防衛</th><th style="border-left-width: 2px;">順位</th><th>戦功</th><th>攻撃</th><th>防御</th></tr></thead>' +
      '<tbody></tbody></table>' +
      '</div>'
    ).appendTo('#box');
  });
  
  //内政用ツールチップ
  function facility_tool() {
    if ( location.pathname != "/village.php")
      return;
    if ( !options.facility_tool)
      return;
      $('body').append('<div id="tooltip_layer"><div id="tooltip"><ul id="facilityUnit"></ul></div></div>');
      $('#tooltip_layer').hide();
      $('#mapOverlayMap > area').bind('contextmenu', function(event) {
        openTool(this, event.pageX, event.pageY);
        event.preventDefault();
        return false;
      });
  }
  //施設建築
  function openTool(target, x, y) {
    $('#tooltip_layer').css({left: x - 50, top: y - 50, 'padding':'50px 50px'}).show();
    $('#tooltip').css({'padding':'2px', 'border':'1px solid #937824', 'box-shadow':'0 2px 12px -1px black'});
    $('#tooltip_layer').mouseout(function() {
      $('#tooltip_layer').hide();
    });
    $('#tooltip_layer:children').mouseover(function() {
      $('#tooltip_layer').show();
    });
    $('#facilityUnit').text('').append('<div style="padding:2px 10px; opacity: 0.6;"><img src="' + IMAGES.wait + '" /></div>');
    var facilityName = $(target).attr('title');
    var shortage = $(target).attr('href').split('/')[1];
    
    $.post( '/' + $(target).attr('href'), function(html) {
      var unit_list = [];
      $(html).find('h3').each(function() {
        if ($(this).find('a').text() !== '') {
          var unit = $(this).find('a').text();
          var url = $(this).parent().parent().parent().find('a[href^="build.php"]').attr('href');
          var construction =  $(this).parent().parent().parent().find('img[alt="この施設を建設する"]').attr('alt');
          var len =  $(this).parent().parent().parent().find('div.ig_tilesection_btnarea_left').find('img').length;
          var shortage_txt =  $(this).parent().parent().parent().find('div.ig_tilesection_btnarea_left').text().match(/資源が不足しています/);
          var none_txt =  $(this).parent().parent().parent().find('div.ig_tilesection_btnarea_left').text().match(/これ以上、建設準備を追加できません/);
          var max_txt =  $(this).parent().parent().parent().find('div.ig_tilesection_btnarea_left').text().match(/最大レベルです/);
          if (!options.hide_facility || (options.hide_facility && unit !== '水田' && unit !== '機織り場' && unit !== '木工所' && unit !== 'たたら場')) {
            url = url.replace('&mode=cp', '');
            if ( construction == 'この施設を建設する') {
              unit_list.push({mod: 'c', unit: unit, url: url, len: len, shortage_txt: shortage_txt, none_txt: none_txt, max_txt: max_txt });
            }
            else {
              unit_list.push({mod: 'u',unit: unit,url: url, len: len, shortage_txt: shortage_txt, none_txt: none_txt, max_txt: max_txt});
            }
          }
        }
      });
      if (typeof unit_list === 'undefined' || typeof unit_list[0] === 'undefined') {
        $('#tooltip_layer').hide();
        return;
      } else {
        addUnit(unit_list, facilityName, shortage);
        return;
      }
    });
  }

  //施設建築Lvアップ
  function addUnit( unit_list, facilityName, shortage ) {
    $('#facilityUnit').text('').append('<div id="facility_selection_tile">' + facilityName + '</div>');
    var i;
    function addUnit_loop(i) {
      if(unit_list[i].mod == 'c'){
        var mod = unit_list[i].mod == 'c' ? '建設' : '';
      }
      if(unit_list[i].mod == 'u'){
        var mod = unit_list[i].mod == 'u' ? 'LvUP' : '';
      }
      if(unit_list[i].mod == 'c' || unit_list[i].shortage_txt){
        var mod = unit_list[i].mod == 'c' ? '建設' : '資源不足';
      }
      if(unit_list[i].mod == 'c' || unit_list[i].none_txt){
        var mod = unit_list[i].mod == 'c' ? '建設' : '建設追加不可';
      }
      if( unit_list[i].max_txt ){
        $('#facilityUnit').append('<li id="fUnit' + i + '" url="' + shortage + '">最大レベル</li>');
      }
      else {
        $('#facilityUnit').append('<li id="fUnit' + i + '" url="' + unit_list[i].url + '">' + mod + '[' + unit_list[i].unit + ']</li>');
      }
      $('#facilityUnit').find('li:contains("資源不足"), li:contains("建設追加不可"), li:contains("最大レベル")').css('color', 'darkgray');
      $('#fUnit' + i).click(function(){
        $('#tooltip_layer').hide();
        if( unit_list[i].shortage_txt || unit_list[i].none_txt){
          location.href = "/facility/" + shortage;
        }
        else {
          location.href = "/facility/" + $(this).attr('url');
        }
      });
      if (options.facility_tool_WUP) {
        if( unit_list[i].len != 0 ){
        
        mod = unit_list[i].mod == 'u' ? 'LvUP[' + unit_list[i].unit + ']×2' : '';
        $('#facilityUnit').append('<li id="fUnit_opt' + i + '" url="' + unit_list[i].url + '" mod="' + unit_list[i].mod + '">' + mod + '</li>');
        $('#fUnit_opt' + i).click(function(){
          nowLoading();
          $('#tooltip_layer').hide();
          $.post('/facility/' + $(this).attr('url'), function(html) {
            if ($(this).attr('mod') == 'c') {
              var tmp = $(this).attr('url');
                  tmp = tmp.substring(tmp.indexOf('x='), tmp.length);
              location.href = "/facility/build.php?" + tmp;
            } else {
              location.href = $(this).attr('url');
            }
          });
          
        });
        
        }
      }
    }
    for (i = 0; i < unit_list.length; i++)
      addUnit_loop(i);
  }

  //地図用ツールチップ
  function map_tool() {
    if (location.pathname != "/map.php")
      return;
    if (!options.map_rightclick && !options.map_leftclick)
      return;
    if (this && typeof (this.ajflag) == 'undefined') {
      this.ajflag = true;
    }

    $("#tooltip_layer").remove();
      $("#tooltip_layer").hide();
    if (options.map_leftclick) {
      $('#mapSubmenu').append('<div id="tooltip_layer"><div id="tooltip"><ul id="mapUnit"></ul></div></div>');
      $('#mapSubmenu *').css({'width':'auto'});
      $("#mapOverlayMap > area").live('click', function(event) {
        event.preventDefault();
        $("#mapSubmenu ul.sub").hide();
        openToolMap( this, event.pageX, event.pageY );
        return false;
      });
    } else {
      $('body').append('<div id="tooltip_layer"><div id="tooltip"><ul id="mapUnit"></ul></div></div>');
      $("#mapOverlayMap > area").live('contextmenu', function(event) {
        event.preventDefault();
        openToolMap( this, event.pageX, event.pageY );
        return false;
      });
    }
    map_rightclick.ajflag = false;
  }

  function openToolMap(target, x, y ) {
    if (options.map_leftclick) {
      $('#tooltip_layer').css({padding:'2em 4em'}).show();
      $('#mapUnit').css({'margin':'auto','border':'none'}).text('').append('<div style="padding:2px 10px; opacity: 0.6;"><img src="' + IMAGES.wait + '" /></div>');
    } else {
      $('#tooltip_layer').css({left: x - 50, top: y -50, padding:'50px 50px'}).show();
      $('#mapUnit').text('').append('<div style="padding:2px 10px; opacity: 0.6;"><img src="' + IMAGES.wait + '" /></div>');
    }
    $('#tooltip').css({'padding':'2px', 'border':'1px solid #937824', 'box-shadow':'0 2px 12px -1px black'});
    $('#tooltip_layer').mouseout(function() {
      $('#tooltip_layer').hide();
    });
    $('#tooltip_layer:children').mouseover(function() {
      $('#tooltip_layer').show();
    });

    var tmp = $(target).attr('onClick').match(/'.*?'/g);
    var tmp2 = $(target).attr('onMouseOver').match(/'.*?'/g);
    var castellanLV = tmp2[1].match(/\(Lv.+?\)/),
        castellan = tmp2[1].replace( castellanLV, '').replace(/'/g, '');//城主名
    var areaName = $(target).attr('balloon');
    var territory = $(target).attr('onmouseover').toString().match(/\/img\/panel\/territory/); //領地
    var coordinate = tmp[2].replace(/'/g, ''),
        coordinate = coordinate.split('?')[1];
    var searchURL = tmp[10].replace(/'/g, '');
    var villageName = $('#sideboxBottom').find('div.basename').find('li.on').text();
    var center_href = $('#ig_map_movepanel').find('li:eq(0) > a').attr('href').match(/map\.php\?x=(-?\d+)&y=(-?\d+)&type=(\d+)&c=(\d+)/);
      center_href = '/map.php?x=' + center_href[1] + '&y=' + center_href[2] + '&c=' + center_href[4];
      
    addToolMap( tmp, tmp2, areaName, castellan, territory, coordinate, villageName, center_href );
  }

  //地図用ツールチップ(アイテム)
  function addToolMap( tmp, tmp2, areaName, castellan, territory, coordinate, villageName, center_href ) {
    var MapUnit = $('#mapUnit');
    MapUnit.text('').append('<div id="selection_tile">' + areaName + '</div>');

    $('<li id="mapMove">ここを中心に表示</li>')
    .click(function() {
      if (tmp === null) {
        map_rightclick.ajflag = false;
        return true;
      }
      var ajaxurl = tmp[2].replace(/'/g, '');
      map_Ajax_Move(ajaxurl);
      $("#tooltip_layer").hide();
      return false;
    }).appendTo( MapUnit );

    //ここへ部隊出陣
    if( villageName != tmp2[0].replace(/'/g, '') && tmp[1] != "''" ){
      $('<li id="mapAttack">ここへ部隊出陣</li>')
      .click(function(){
        $("#tooltip_layer").hide();
        location.href = tmp[1].replace(/'/g, '');
      }).appendTo( MapUnit );
    }
    //最寄拠点から出陣
    if (options.nearby_tool) {
      if(tmp[1] != "''") {
      
      $('<li id="nearby">最寄拠点から部隊出陣</li>').appendTo( MapUnit );
      $.post('/user/',function(html) {
        var tmp2 = coordinate.split('&');
        var base = coordinate.match(/(-?\d+)/g);
        var m_nm;
        var m_url;
        var m_dist = 9999;
        var foword = coordinate;
        $(html).find('table.common_table1.center').find('tr:not(:contains("陥落中"))').find('a')
        .each(function() {
          if ($(this).attr('href').indexOf(tmp2[2], '0') > 0) {
            if ($(this).closest('tr').find('td').eq(0).text() == '領地')
              return;
            var tmp3 = $(this).text().match(/(-?\d+),(-?\d+)/);
            var dist = Math.sqrt(Math.pow( parseInt(tmp3[1] ) - base[0], 2) + Math.pow( parseInt(tmp3[2] ) - base[1], 2));
            dist = Math.floor(dist * 10) / 10;
            if (m_dist > dist && dist > 0) {
              m_dist = dist;
              m_nm = $(this).closest('tr').find('a:eq(0)').text().replace(/(^\s+)|(\s+$)/g, "");
              m_url = $(this).closest('tr').find('a:eq(0)').attr('href');
              $('#nearby').attr('title', m_nm );
            }
          }
        });
        $('#nearby').click(function(){
          $.post( m_url, function(html) {
            $("#tooltip_layer").hide();
            location.href = tmp[1].replace(/'/g, '');
          });
        });
      });
      
      }
    }

    // ここへ部隊を配置
    if ( tmp[6] != "''" || tmp[7] != "''" || tmp[9] != "''" ) {
    //セパ
    $('<hr class="separator" />').appendTo( MapUnit );
    
      $( '<div id="placement_container">' +
         '<li id="placed_here">ここへ部隊配置</li>' +
         '<li id="groups_1">【第一組】から配置</li>' +
         '<li id="groups_2">【第二組】から配置</li>' +
         '<li id="groups_3">【第三組】から配置</li>' +
         '<li id="groups_4">【第四組】から配置</li>' +
         '<li id="groups_5">【未設定】から配置</li>' +
         '</div>'
      )
      .hover(function(){
          $(this).css( {'-webkit-transition-delay':'0.8s', 'height':'10em', } );
        },
        function(){
          $(this).css( {'-webkit-transition-delay':'1s', 'height':'20px', } );
      }).appendTo( MapUnit );
      
      $('#placed_here').click(function(){
        $('#tooltip_layer').hide();
        $.post('/facility/unit_status.php?dmo=all',function(html) {
          var ano = $(html).find('.ig_fight_dotbox').size();
          var slot = '/card/deck.php?ano=' + ano;
          if(ano == 5){
            if (confirm('空きスロットが有りません。\nそれでもデッキへ移動しますか？')){
              if( areaName == villageName ){
                location.href = slot;
              }
              else{
                $.post('/user/',function(html) {
                  $(html).find('table.common_table1.center').find('.fs14').find('td:eq(1) > a')
                  .each(function() {
                    var Pointname = $(this).text().trim();
                    var Pointhref = $(this).attr('href'),
                        Pointhref = Pointhref + '&from=menu&page=%2Fmap.php';
                    if( areaName == Pointname ){
                      location.href = Pointhref + '&from=menu&page=' + slot;
                    }
                  });
                });
              }
            }
          }
          else {
            if( areaName == villageName ){
              location.href = slot;
            }
            else{
              $.post('/user/',function(html) {
                $(html).find('table.common_table1.center').find('.fs14').find('td:eq(1) > a')
                .each(function() {
                  var Pointname = $(this).text().trim();
                  var Pointhref = $(this).attr('href'),
                      Pointhref = Pointhref + '&from=menu&page=%2Fmap.php';
                  if( areaName == Pointname ){
                    location.href = Pointhref + '&from=menu&page=' + slot;
                  }
                });
              });
            }
          }
        });
      });
      
      $('li[id^="groups_"]').click(function(){
        var grp = $(this).attr('id').split('_')[1];
        $("#tooltip_layer").hide();
        $.post('/facility/unit_status.php?dmo=all',function(html) {
          var ano = $(html).find('.ig_fight_dotbox').size();
          var slot = '/card/deck.php?ano=' + ano;
          var slot2 = '%2Fcard%2Fdeck.php%3Fano%3D' + ano;
          if(ano == 5){
            if (confirm('空きスロットが有りません。\nそれでもデッキへ移動しますか？')){
              if( areaName == villageName ){
                location.href = slot + '&select_card_group=' + grp;
              }
              else {
                $.post('/user/',function(html) {
                  $(html).find('table.common_table1.center').find('tr.fs14').find('td:eq(1) > a')
                  .each(function() {
                    var Pointname = $(this).text().trim();
                    var Pointhref = $(this).attr('href') + '&from=menu&page=%2Fmap.php';
                    if( areaName == Pointname ) {
                      location.href = Pointhref + '&from=menu&page=' + slot2 + '%26select_card_group%3D' + grp;
                    }
                  });
                });
              }
            }
          }
          else {
            if( areaName == villageName ){
              location.href = slot + '&select_card_group=' + grp;
            }
            else{
              $.post('/user/',function(html) {
                $(html).find('table.common_table1.center').find('tr.fs14').find('td:eq(1) > a')
                .each(function() {
                  var Pointname = $(this).text().trim();
                  var Pointhref = $(this).attr('href') + '&from=menu&page=%2Fmap.php';
                  if( areaName == Pointname ) {
                    location.href = Pointhref + '&from=menu&page=' + slot2 + '%26select_card_group%3D' + grp;
                  }
                });
              });
            }
          }
        });
      });
    }
    
    // ここを選択する
    if ( areaName != villageName && (tmp[6] != "''" || tmp[7] != "''" || tmp[9] != "''" )) {
    
      $('<li id="coord_select">ここを選択する</li>')
      .click(function(){
        $.post('/user/', function(html) {
          $(html).find('table.common_table1.center').find('tr.fs14').find('td:eq(1) > a')
          .each(function() {
            var Pointname = $(this).text().trim();
            var Pointhref = $(this).attr('href') + '&from=menu&page=%2Fmap.php';
            if( areaName == Pointname )
              location.href = Pointhref;
          });
        });
        $("#tooltip").hide();
      }).appendTo( MapUnit );
    
    }

    //セパ
    $('<hr class="separator" />').appendTo( MapUnit );

    //合戦報告書(座標)
    $('<li id="mapWarlistarea">合戦報告書：座標</li>')
    .click(function(){
      location.href = '/war/list.php?m=&s=1&name=lord&word=&coord=map&' + coordinate;
      $("#tooltip_layer").hide();
    }).appendTo( MapUnit );

    //座標記録
    if (options.map_reg){
      var map_list = {},
      mname = areaName,
      coord = coordinate;
      if (localStorage.getItem("crx_map_list")) {
        var map_list = secureEvalJSON(localStorage.getItem("crx_map_list"));
      }
      if (typeof (map_list[coord]) == 'undefined') {
        $('<li class="reg_map"  mname="' + mname + '" coord="' + coord + '">この座標を記録</li>')
        .click(function(){
          $("#tooltip_layer").hide();
            var map_list = {};
            if (localStorage.getItem("crx_map_list")) {
              map_list = secureEvalJSON(localStorage.getItem("crx_map_list"));
            }
            map_list[coord] = mname;
            localStorage.setItem("crx_map_list", toJSON(map_list));
          map_Ajax_Move( center_href );
        }).appendTo( MapUnit );
      }
      else {
        $('<li class="remove_map"  mname="' + mname + '" coord="' + coord + '">座標記録を削除</li>')
        .click(function() {
          $("#tooltip_layer").hide();
            if (localStorage.getItem("crx_map_list")) {
              var map_list = secureEvalJSON(localStorage.getItem("crx_map_list"));
              if (typeof (map_list[coord]) != 'undefined') {
                delete map_list[coord];
                localStorage.setItem("crx_map_list", toJSON(map_list));
              }
            }
          map_Ajax_Move( center_href );
        }).appendTo( MapUnit );
      }
    }

    //最寄拠点を選択
    if (options.move_nearby) {
      $('<li id="nearby_select">ここの最寄拠点を選択</li>')
      .click(function(){
        $.post('/user/', function(html) {
          var tmp2 = coordinate.split('&');
          var base = coordinate.match(/(-?\d+)/g);
          var m_url;
          var m_dist = 9999;
          var foword = coordinate;
          $(html).find('table.common_table1.center').find('tr:not(:contains("陥落中"))').find('a')
          .each(function() {
            if ($(this).attr('href').indexOf(tmp2[2], '0') > 0) {
              if ($(this).closest('tr').find('td').eq(0).text() == '領地')
                return;
              var tmp3 = $(this).text().match(/(-?\d+),(-?\d+)/);
              var dist = Math.sqrt(Math.pow(parseInt(tmp3[1]) - base[0], 2) + Math.pow(parseInt(tmp3[2]) - base[1], 2));
              dist = Math.floor(dist * 10) / 10;
              if (m_dist > dist && dist > 0) {
                m_dist = dist;
                m_url = $(this).closest('tr').find('a:eq(0)').attr('href');
              }
            }
          });
          $("#tooltip_layer").hide();
          location.href = m_url + '&from=menu&page=%2Fmap.php';
        });
      }).appendTo( MapUnit );
    }

    //ツールチップに左クリックのメニューを追加
    if (options.leftclick_menu) {
      //セパ
      $('<hr class="separator" />').appendTo( MapUnit );
      //陣のレベルアップ・破棄
      if( tmp[6] != "''" ) {
        var url = tmp[6].replace(/'/g, ''),
          url2 = tmp[10].replace(/'/g, ''),
          proc_type = '陣',
          proc_list = $('<li id="camp_proc">陣のレベルアップ</li>')
                .click(function(){
                  $("#tooltip_layer").hide();
                  map_levelup( url, url2, proc_type, center_href );
                }).appendTo( MapUnit );
                
          map_stateinfo( url, proc_list );
                
        var remove_list = $('<li id="remove_territory">陣を破棄する</li>')
                .click(function(){
                  $("#tooltip_layer").hide();
                  map_remove( url2, proc_type, center_href );
                }).appendTo( MapUnit );
                
        map_remove_cancel( url2, proc_type, proc_list, remove_list )
      }
      //出城のレベルアップ
      if( tmp[7] != "''" ) {
        var url = tmp[7].replace(/'/g, ''),
          url2 = tmp[10].replace(/'/g, ''),
          proc_type = '出城',
          proc_list = $('<li id="deshiro_proc">出城のレベルアップ</li>').click(function(){
                $("#tooltip_layer").hide();
                map_levelup( url, url2, proc_type, center_href );
              }).appendTo( MapUnit );
        map_stateinfo( url, proc_list );
      }
      //領地を陣にする・破棄
      if( tmp[8] != "''" ) {
        var url = tmp[8].replace(/'/g, ''),
          url2 = tmp[10].replace(/'/g, ''),
          proc_type = '領地',
          proc_list = $('<li id="to_camp">領地を陣にする</li>')
                .click(function(){
                  $.post( url, function(html){
                      var btnarea =  $(html).find('div.ig_tilesection_btnarea > a').attr('href');
                      $.post( btnarea, function(html){ map_Ajax_Move( center_href ); } );
                  });
                  $("#tooltip_layer").hide();
                }).appendTo( MapUnit );
                
        var remove_list = $('<li id="remove_territory">領地を破棄する</li>')
                .click(function(){
                  $("#tooltip_layer").hide();
                  map_remove( url2, proc_type, center_href );
                }).appendTo( MapUnit );
                
        map_remove_cancel( url2, proc_type, proc_list, remove_list );
      }
      
      if( tmp[9] != "''" ) {
        $('<li id="to_admi">ここの内政を行う</li>')
        .click(function(){
          location.href = tmp[9].replace(/'/g, '');
          $("#tooltip_layer").hide();
        }).appendTo( MapUnit );
      }
      
      if( tmp[9] != "''" && villageName != areaName ) {
        $('<li id="may_look_detail">ここの詳細を見る</li>')
        .click(function(){
          location.href = tmp[2].replace(/'/g, '').replace('map', 'land');
          $("#tooltip_layer").hide();
        }).appendTo( MapUnit );
      }
      
      if( tmp[10] != "''" ) {
        $('<li id="look_detail">ここの詳細を見る</li>')
        .click(function(){
          location.href = tmp[10].replace(/'/g, '');
          $("#tooltip_layer").hide();
        }).appendTo( MapUnit );
      }
      
    }
    //合戦報告書(城主)
    if ( tmp[4] != "''" ) {
      //セパ
      $('<hr class="separator" />').appendTo( MapUnit );
      
      $('<li id="mapWarlistlord">合戦報告書：城主</li>')
      .click(function(){
        location.href = tmp[4].replace(/'/g, '');
        $("#tooltip_layer").hide();
      }).appendTo( MapUnit );
    }
    //格付情報：城主
    if ( tmp[4] != "''" ) {
      var tgTable = $('#quick_layer').find('tbody'),
          Country = center_href.split('=')[3],
          cc = {'織田家': 1,'足利家': 2,'黒田家': 2,'武田家': 3,'上杉家': 4,'徳川家': 5,'毛利家': 6,'伊達家': 7,'浅井家': 7,'北条家': 8,'今川家': 8,'長宗我部家': 9,'島津家': 10,'豊臣家': 11,'大友家': 11,'最上家': 12,'石田家': 12};
      
      $('#box').one('click',function(){
        $('#quick_layer').slideUp(200);
      });
      
      $('<li id="quick_information">格付情報：城主</li>')
      .click(function(){
      $('#quick_layer').slideUp(200);
      $.post('/user/ranking.php?m=war_point&find_rank=&find_name=' + castellan + '&c=0',
        function(html) {
          var tgTR = $(html).find('tr.fs12.now');
          var Rank = tgTR.find('td:eq(1)').text(),
              Palms = tgTR.find('td:eq(4)').text(),
              Attack = tgTR.find('td:eq(5)').text(),
              Defense = tgTR.find('td:eq(6)').text()
          $.post('/user/ranking.php?m=attack_score&find_rank=&find_name=' + castellan + '&c=0',
            function(html) {
              var blow_tgTR = $(html).find('tr.fs12.now'),
                  blow_Attack = blow_tgTR.find('td:eq(4)').text(),
                  blow_Defense = blow_tgTR.find('td:eq(5)').text(),
                  cood = blow_tgTR.find('td:eq(0)').text();
              $.post('/war/war_ranking.php?m=&c=' + cc[cood] + '&find_rank=&find_name=' + castellan,
                function(html) {
                  var war_tgTR = $(html).find('tr.ig_rank_you'),
                      war_Rank = war_tgTR.find('td:eq(0)').text(),
                      war_Palms = war_tgTR.find('td:eq(3)').text(),
                      war_Attack = war_tgTR.find('td:eq(4)').text(),
                      war_Defense = war_tgTR.find('td:eq(5)').text();
                  
                  var tmp = '<tr><td>' + castellan + '</td><td>' + Rank + '</td><td>' + Palms + '</td><td>' + Attack + '</td><td>' + Defense + '</td><td>' + blow_Attack + '</td><td>' + blow_Defense + '</td><td style="border-left-width: 2px;">' + war_Rank + '</td><td>' + war_Palms + '</td><td>' + war_Attack + '</td><td>' + war_Defense + '</td></tr>';
                  tgTable.empty().append(tmp);
                  $('#quick_layer').slideDown(200);
                }
              );
            }
          );
        }
      );
      $('#mapOverlayMap').find('img[alt="rating_view"]').remove();
      var href = tmp[10].replace('land', 'map').replace(/'/g, ''),
        alt_name = 'rating_view';
      new_overOperation2( alt_name, href, IMAGES.panel_rating);
        $("#tooltip_layer").hide();
      }).appendTo( MapUnit );
    }
    if ( tmp[5] != "''" && tmp2[13].match(/_r_/) ) {
      $('<li id="mapAlliance_base">拠点をマーク</li>')
      .click(function(){
        $("#tooltip_layer").hide();
        $('#mapOverlayMap').find('img[alt="view"]').remove();
        var alliance_name = tmp2[4];
        
        $('#mapOverlayMap > area').each(function(){
          var view_source = $(this).attr('onMouseOver').match(/'.*?'/g);
          var href = $(this).attr('href').replace('land', 'map');
          var view_castellanLV = view_source[1].match(/\(Lv.+?\)/),
              view_castellan = view_source[1].replace( view_castellanLV, '').replace(/'/g, '');
          var alt_name = 'view';
          
          if( view_source[13].match(/\/img\/panel\/fort_r/) || view_source[13].match(/\/img\/panel\/village_r/) || view_source[13].match(/\/img\/panel\/camp_r/) || view_source[13].match(/\/img\/panel\/stronghold_r/) || view_source[13].match(/\/img\/panel\/capital_r/) ) {
            //この城主の拠点
            if( castellan == view_castellan ){
              new_overOperation2( alt_name, href, IMAGES.panel_my_base );
              return true;
            }
            //この城主の同盟
            if( tmp2[4] == view_source[4] ){
              new_overOperation2( alt_name, href, IMAGES.panel_alliance_base );
              return true;
            }
          }
          
        });
        
      }).appendTo( MapUnit );
    }
    if ( tmp[3] != "''" ) {
      $('<li id="mapProfile">プロフィール</li>')
      .click(function(){
        location.href = tmp[3].replace(/'/g, '');
        $("#tooltip_layer").hide();
      }).appendTo( MapUnit );
    }
    if ( tmp[5] != "''" ) {
      $('<li id="mapAlliance">同盟情報</li>')
      .click(function(){
        location.href = tmp[5].replace(/'/g, '');
        $("#tooltip_layer").hide();
      }).appendTo( MapUnit );
    }
    if( tmp[10] == "''" || (tmp[6] != "''" || tmp[7] != "''" || tmp[8] != "''") ) {
      $('<li id="mapRename">名称変更</li>')
      .click(function(){
        renameArea( tmp[2].replace(/'/g, '').replace('/map', '') );
        $("#tooltip_layer").hide();
      }).appendTo( MapUnit );
    }
  }
  //名称変更
  function renameArea(url) {
    var req_data = {};
    $.post('/user/change/change.php', function(html) {
      var new_name = null;
      var keys = null;
      req_data.comment = $(html).find('.profile_edit').val();
      
      $(html).find('div.common_box3bottom').find('a').each(function() {
        if ($(this).attr('href') == '/land' + url) {
          var old_name = $(this).closest('tr').find('input:eq(0)').val();
          new_name = prompt(old_name, old_name);
          keys = $(this).closest('tr').find('input:eq(0)').attr('name');
          return false;
        }
      });
      
      if (!new_name)
        return;
      $(html).find('div.common_box3bottom').find('input')
      .each(function() {
        req_data[$(this).attr('name')] = $(this).val();
      });
      
      req_data[keys] = new_name;
      req_data.btn_preview = '確認';
      
      $.post('/user/change/change.php#ptop', req_data, function(html) {
        delete req_data.btn_preview;
        req_data.btn_send = '更新';
        req_data.ssid = $(html).find('*[name="ssid"]').val();
        
        $.post('/user/change/change.php#ptop', req_data, function(html) {
          location.reload();
        });
      });
    });
  }
  //建築状況とレベルの取得
  function map_stateinfo( url, proc_list ){
    $.post(
      url,
        function(html){
          var level = $(html).find('div.ig_decksection_top').text().split(' ')[1],
              btnarea_txt =  $(html).find('div.ig_tilesection_btnarea').text().trim(),
              href =  $(html).find('div.ig_tilesection_btnarea').find('a'),
              construction =  $(html).find('p.ig_top_alartbox'),
              state = '';
          if(href.length == 1){
            state = 'レベルアップ可能';
          }
          else if(construction.length == 1 && btnarea_txt == '資源が不足しています'){
            state = '現在レベルアップ中です';
          }
          else if(construction.length == 0 && btnarea_txt == '資源が不足しています'){
            state = btnarea_txt;
          }
          proc_list.attr('title', '【' + level + '】' + state );
        }
    );
  }
  //地図画面からのレベルアップ
  function map_levelup( url, url2, proc_type, center_href ){
    $.post(
      url,
      function(html){
        var btnarea =  $(html).find('div.ig_tilesection_btnarea > a').attr('href'),
          btnarea_txt =  $(html).find('div.ig_tilesection_btnarea').text().trim(),
          level = $(html).find('div.ig_decksection_top').text().split(' ')[1],
          construction =  $(html).find('p.ig_top_alartbox');
        if( $(html).find('div.ig_tilesection_btnarea > a').length == 0 ) {
          if(btnarea_txt != '最大レベルです'){
            $.post( url2, function(html){
              var BuildTime = $(html).find('span.buildTime').text();
              if( construction.length == 1 && btnarea_txt == '資源が不足しています' ){
                btnarea_txt = '現在レベルアップ中です';
                alert( btnarea_txt + '\n' + BuildTime + 'に完了します。' );
              }
              else if(construction.length == 0 && btnarea_txt == '資源が不足しています'){ alert( btnarea_txt); }
              else { alert( btnarea_txt + '\n' + BuildTime + 'に完了します。' ); }
            });
          }
          else { alert( btnarea_txt ); }
        }
        else { $.post( btnarea, function(html){ map_Ajax_Move( center_href ); alert( proc_type +'のレベルアップを実行しました'); });
        }
      }
    );
  }
  //地図画面からの破棄
  function map_remove( url2, proc_type, center_href ) {
    $.post( url2, function(html){
        var build = $(html).find('span.buildTime'),
          txt = build.text(),
          remove_href = $(html).find('img[alt="' + proc_type + 'を破棄する"]').parent().attr('href'),
          cancel_href = $(html).find('img[alt="破棄を中止する"]').parent().attr('href');
          
        if( cancel_href != undefined ){
          if ( confirm( proc_type + 'の破棄が' + txt + 'に完了します\n破棄をキャンセルしますか？') ){
            $.post( cancel_href, function(html){ map_Ajax_Move( center_href ); } );
          }
        }
        else if( remove_href != undefined ) {
          if ( confirm('この' + proc_type + 'を破棄し、空き地に戻しますか？') ) {
            $.post( remove_href, function(html){ map_Ajax_Move( center_href ); } );
          }
        }
      }
    );
  }
  //地図画面から破棄のキャンセル
  function map_remove_cancel( url2, proc_type, proc_list, remove_list ) {
    $.post( url2, function(html){
      var build_status = $(html).find('span.buildStatus').text();
      if( build_status == '建設中　陣' ){ $('#remove_territory').remove(); }
      if( build_status == proc_type + 'の破棄' ){
        proc_list.remove();
        remove_list.html( proc_type + 'の破棄を中止する');
      }
    });
  }

////////////////////
// 敵襲：
////////////////////
  //総合敵襲警off(チャット)
  function comBtnEnemy() {
    var tmp = '<li id="comBtnEnemy"><a href="javascript:void(0);" id="Enemy">敵襲</a></li>';
    $('#commentNavi, #commentNavi2').append(tmp);
    $('#comBtnRecruit').find('a').attr('id', 'Recruit');
    $('#comBtnChat').find('a').attr('id', 'Chat');
    $('#comBtnRecruit2').find('a').attr('id', 'Recruit');
    $('#comBtnArmy').find('a').attr('id', 'Army');
    $('#comBtnChat2').find('a').attr('id', 'Chat');
    $('#Recruit').click(function() {
      tabChangeListKaizou('Recruit');
    });
    $('#Army').click(function() {
      tabChangeListKaizou('Army');
    });
    $('#Chat').click(function() {
      tabChangeListKaizou('Chat');
    });
    $('#Enemy').click(function() {
      tabChangeListKaizou('Enemy');
    });

    //チャットウインドウのタブと背景画像：4章の場合
    if( options.chapter_change === '0' ) {
    
    var tmp2 = '<div id="commentListEnemy" style="display: none;"><div id="enemyComment" style=" overflow-x: hidden; overflow-y: auto; width: 475px; height: 68px; float: left;"><table><tbody id="enemyLine"><tr><td>&nbsp;&nbsp;現在、該当する状態の部隊はいません</td></tr></tbody></table></div><ul style="float: right;width: 53px;padding: 7px 6px 0 0;"><li style="padding-bottom: 4px;"><a href="javascript:void(0);" id="enemyReload"><img src="/img/common/news/btn_comment_reload.gif" alt="敵襲欄を更新" title="敵襲欄を更新" class="fade" style="opacity: 1; "></a></li></ul></div>';
    $('#commentBody').append(tmp2);
    
    var style = document.createElement("style");
    style.innerHTML = '#commentBox #commentListEnemy { background-image: url(' + IMAGES.chat.comListEnemy + ');' +
             'background-position: left top; background-repeat: no-repeat; background-size: 100% 100%;  width: 555px; height: 65px; padding: 3px 2px 3px; }' +
             '#commentBox #commentNavi li#comBtnEnemy, #commentBox #commentNavi li#comBtnEnemy a, #commentBox #commentNavi2 li#comBtnEnemy, #commentBox #commentNavi2 li#comBtnEnemy a { width:47px; height: 23px; no-repeat; text-indent:-9999px; overflow:hidden; font-size:0; background:url(' + IMAGES.chat.comBtn4 + ')}' +
             '#commentBox #commentNavi li#comBtnEnemy, #commentBox #commentNavi2 li#comBtnEnemy { background-position: -47px 0px;}' +
             '#commentBox #commentNavi li#comBtnEnemy a, #commentBox #commentNavi2 li#comBtnEnemy a { background-position: 0 0;}' +
             '#commentBox #commentNavi li#comBtnEnemy a:hover, #commentBox #commentNavi2 li#comBtnEnemy a:hover { background-position: -47px 0px;}' +
             '#comBtnRecruit2, #comBtnArmy, #comBtnChat2 { height: 16px !important; }'
    document.head.appendChild(style);
    
    }
    //チャットウインドウのタブと背景画像：5章の場合
    else {
    
    var tmp2 = '<div id="commentListEnemy" style="display: none;"><div id="enemyComment" style=" overflow-x: hidden; overflow-y: auto; width: 475px; height: 68px; float: left;"><table><tbody id="enemyLine"><tr><td>&nbsp;&nbsp;現在、該当する状態の部隊はいません</td></tr></tbody></table></div><ul style="float: right;width: 53px;padding: 7px 6px 0 0;"><li style="padding-bottom: 4px;"><a href="javascript:void(0);" id="enemyReload"><img src="/img/common/news/s5_btn_comment_reload.gif" alt="敵襲欄を更新" title="敵襲欄を更新" class="fade" style="opacity: 1; "></a></li></ul></div>';
    $('#commentBody').append(tmp2);

    var style = document.createElement("style");
    style.innerHTML = '#commentBox #commentListEnemy { background-color: black;  width: 555px; height: 71px; padding: 2px; margin-top: -6px; border: 1px solid #B08F2A; border-radius: 4px; }' +
             '#commentBox #commentNavi li#comBtnEnemy, #commentBox #commentNavi li#comBtnEnemy a, #commentBox #commentNavi2 li#comBtnEnemy, #commentBox #commentNavi2 li#comBtnEnemy a { width:47px; height: 20px; no-repeat; text-indent:-9999px; overflow:hidden; font-size:0; background:url(' + IMAGES.chat.comBtn5 + ')}' +
             '#commentBox #commentNavi li#comBtnEnemy, #commentBox #commentNavi2 li#comBtnEnemy { background-position: -47px 0px;}' +
             '#commentBox #commentNavi li#comBtnEnemy a, #commentBox #commentNavi2 li#comBtnEnemy a { background-position: 0 0;}' +
             '#commentBox #commentNavi li#comBtnEnemy a:hover, #commentBox #commentNavi2 li#comBtnEnemy a:hover { background-position: -47px 0px;}' +
             '#commentBox #commentNavi li#comBtnChat { margin-bottom: 2px; }' +
             //
             '#comBtnRecruit2, #comBtnArmy, #comBtnChat2 { height: 15px !important; }' +
             '#comBtnArmy, #comBtnChat2 { margin-top: 0 !important; }' +
             '#commentListRecruit2, #commentListArmy, #commentListChat2 { background-size: 100% 100% !important; height: 61px !important; }'
    document.head.appendChild(style);
    
    }
    $('#enemyReload').click(function() {
      if (options.raid_system)
        enemyCheckR();
      else
        enemyCheck();
    });
  }

  function enemyCheck() {
    $.post(
      '/facility/unit_status.php?dmo=enemy',
      function(html) {
        $('#enemyLine').children().remove();
        var t = $(html).find('div.ig_decksection_innermid').text();
        t = t.replace(/\s/g, '');
        if (t == '現在、該当する状態の部隊はいません') {
          var tmp = '<tr><td>&nbsp;&nbsp;現在、該当する状態の部隊はいません</td></tr>';
          $('#enemyLine').append(tmp);
        }
        else {
          var cnt = 0;
          $(html).find('div.ig_decksection_innermid').find('div.ig_fight_statusarea').each(function() {
            var enemy_nm = $(this).find('a:eq(0)').text();
            var enemy_href = $(this).find('a:eq(0)').attr('href');
            var enemy_time = $(this).find('table.paneltable.table_fightlist').find('td:eq(1)').text().match(/\d+/g);
            var at = enemy_time[1] + '/' + enemy_time[2] + '&nbsp;' + enemy_time[3] + ':' + enemy_time[4] + ':' + enemy_time[5] + '&nbsp;';
            var enemy_start = $(this).find('td.td_bggray:eq(0)').text();
            var enemy_start_href = $(this).find('a:eq(1)').attr('href');
            var enemy_arrival = $(this).find('td.td_bggray:eq(1)').text();
            var enemy_arrival_href = $(this).find('a:eq(2)').attr('href');
            var tmp = '<tr><td style="padding-bottom: 2px;">&nbsp;' + at + '</td><td><a href="' + enemy_href + '" style="color:red;width:100%;">' + enemy_nm + '</a></td><td style="padding: 0 3px;">の</td><td><a href="' + enemy_start_href + '" style="color:red;width:100%;">' + enemy_start + '</a></td><td style="padding: 0 3px;">から</td><td><a href="' + enemy_arrival_href + '" style="color:red;width:100%;">' + enemy_arrival + '</a></td></tr>';
            if (cnt < 4) {
              $('#enemyLine').append(tmp);
            }
            cnt++;
          });
        }
      }
    );
  }

  //統合敵襲警報ループ
  function raid_system() {
    if (!options.raid_system || $('div.information_situ p').text().match(/只今休戦中/) || !$('li.gMenu05 > ul').find('a:contains("合戦地へ")').length ) {
      return;
    }
    
    var rst = 10;
    function raid_loop(rst) {
      var r = enemyCheckR(rst);
      if (r.num > 0) {
        rst = 10;
      } else {
        rst = 30;
      }
      setTimeout(raid_loop, rst*1000, rst);
    }
    raid_loop(rst);
  }

  //統合敵襲警報用敵襲クロール
  function enemyCheckR(rst) {
    var d = (new Date() / 1000) | 0;
    var rrr = { 'date': 0, 'raid': { 'time': [-1], 'num': 0} };
   //console.log( 'enemyCheckR 1', rrr, toJSON( rrr), JSON.parse( toJSON( rrr)), JSON.parse(localStorage.crx_enemyCheckR || "false" ));    
    if ( localStorage.crx_enemyCheckR) {
      rrr = JSON.parse( localStorage.crx_enemyCheckR);
    }
    var dd = d - rrr.date, raidnum = rrr.raid.num;
    if (dd >= rst) {
      $.post(
        '/facility/unit_status.php?dmo=enemy',
        function(html) {
          rrr.date = d;
          rrr.raid = get_raid(html);
          localStorage.crx_enemyCheckR = toJSON( rrr);
         //console.log( 'enemyCheckR 5', rrr, toJSON( rrr), JSON.parse( toJSON( rrr)), JSON.parse(localStorage.crx_enemyCheckR));
          if (rrr.raid.time[0] > 0 && (raidnum < rrr.raid.num || rrr.raid.time[0] < 180)) {
            if ( webkitNotifications.checkPermission() === 0 ) {
              var n = parseInt(Math.random()*5) + 1;
              var notification = webkitNotifications.createNotification('/img/lot/img_ixadog0' + n + '.png','','Enemy is in sight.');
              window.onunload = function() {
                notification.cancel();
              };
              notification.show();
              setTimeout(function(){
                notification.cancel();
              }, 5000);
            }
            if ( options.raid_sound ) {
              var raid_sound_load_and_play = function() {
                var raid_sound = $('#raid_sound')[0];
                if (!raid_sound) {
                  setTimeout(raid_sound_load_and_play,1000);
                } else if (!raid_sound.buffered.length) {
                  raid_sound.load();//console.log("load");
                  setTimeout(raid_sound_load_and_play,1000);
                } else {
                  raid_sound.play();//console.log("play");
                }
              };
              raid_sound_load_and_play();
            }
          }
        }
      );
    }
    write_raid(rrr.raid);
    return rrr.raid;
  }
  //チャット覧
  function get_raid(html) {
    var i,
        cnt = 0,
        enemyL = {},
        enemyT = [],
        t = $(html).find('div.ig_decksection_innermid').text().replace(/\s/g, '');
    if (t === '現在、該当する状態の部隊はいません') {
      enemyT.push(-1);
      enemyL[enemyT[0]] = '<tr><td style="padding-bottom:3px;">&nbsp;&nbsp;現在、該当する状態の部隊はいません</td></tr>';
    } else {
      $(html).find('div.ig_decksection_innermid').find('div.ig_fight_statusarea').each(function() {
        var enemy_nm = $(this).find('a:eq(0)').text(),
          enemy_href = $(this).find('a:eq(0)').attr('href'),
          enemy_time = $(this).find('table.paneltable.table_fightlist').find('td:eq(1)').text().match(/\d+/g);
        var rt = '&nbsp;(あと ' + enemy_time[6] + ':' + enemy_time[7] + ':' + enemy_time[8] + ')&nbsp;',
          enemy_start = $(this).find('td.td_bggray:eq(0)').text(),
          enemy_start_href = $(this).find('a:eq(1)').attr('href').replace('/land', '/map'),
          enemy_arrival = $(this).find('td.td_bggray:eq(1)').text(),
          enemy_arrival_href = $(this).find('a:eq(2)').attr('href').replace('/land', '/map');
        var tmp = '<tr>' +
            '<th style="padding-bottom: 2px;">' + rt + '</th>' +
            '<td><a href="' + enemy_href + '" style="color:red;width:100%;">' + enemy_nm + '</a></td>' +
            '<td style="padding: 0 3px;">の</td>' +
            '<td><a href="' + enemy_start_href + '" style="color:red;width:100%;">' + enemy_start + '</a></td>' +
            '<td style="padding: 0 3px;">から</td>' +
            '<td><a href="' + enemy_arrival_href + '" style="color:red;width:100%;">' + enemy_arrival + '</a></td>' +
          '</tr>';
        enemyT[cnt] = enemy_time[6] * 3600 + enemy_time[7] * 60 + enemy_time[8] * 1;
        enemyL[enemyT[cnt]] = tmp;
        cnt++;
      });
      enemyT.sort();
    }
   //console.log( 'get_raid', enemyT);
    return {'html': enemyL, 'time': enemyT,  'num': cnt};
  }
  //資源バー
  function write_raid(r) {
    if (!r.html) {
      return;
    }
    var i;
    $('#enemyLine').children().remove();
    if (r.num === 0) {
      $('#enemyLine').append(r.html[r.time[0]]);
      $('#status_left').find('a:contains(敵襲)').text('敵襲(0)');
      if ($('div.ixamoko_raid')) {
        $('div.ixamoko_raid').remove();
      }
      $('#status.clearfix').removeAttr('style');
    } else {
        if ( options.chapter_change === '0' ) {
          $('#status').css('background-image', 'url(' + IMAGES.bg_status_red + ')');
        }
        else {
          $('#status').css('background-image', 'url(' + IMAGES.s5_bg_status_red + ')');
        }
      for (i = 0; i < r.num; i++) {
        if (i < 4) {
          $('#enemyLine').append(r.html[r.time[i]]);
        } else {
          $('#enemyLine').append($(r.html[r.time[i]]).hide());
        }
      }
      $('#敵襲 > a').css('color', 'yellow');
      $('#status_left').find('a:contains(敵襲)').text('敵襲(' + r.num + ')');
      if (options.raid_system) {
        var rt = $('#enemyLine').find('th:eq(0)').text().match(/\d+/g);
        var rt_sec = rt[0] * 3600 + rt[1] * 60 + rt[2] * 1;
        if (rt_sec < 180) {
          var ab = [];
          ab[0] = '<DIV class="ixamoko_raid" style="width:100%; height: 1em; position:fixed; top:   0; padding:2px; background-color:#f00; z-index:9999;"><MARQUEE scrolldelay="100">敵襲あり</MARQUEE></DIV>';
          ab[1] = '<DIV class="ixamoko_raid" style="width:100%; height: 1em; position:fixed; bottom:0; padding:2px; background-color:#f00; z-index:9999;"><MARQUEE scrolldelay="100">敵襲あり</MARQUEE></DIV>';
          ab[2] = '<DIV class="ixamoko_raid" style="width: 1em; height:100%; position:fixed; left:  0; padding:2px; background-color:#f00; z-index:9999;"><MARQUEE scrolldelay="100" direction="down" height="100%">敵襲あり</MARQUEE></DIV>';
          ab[3] = '<DIV class="ixamoko_raid" style="width: 1em; height:100%; position:fixed; right: 0; padding:2px; background-color:#f00; z-index:9999;"><MARQUEE scrolldelay="100" direction="down" height="100%">敵襲あり</MARQUEE></DIV>';
          for (i = 0; i < 4; i++) {
            if ((options.raid_system >> i) & 1) {
              $('BODY').prepend(ab[i]);
            }
          }
        } else {
          $('div.ixamoko_raid').remove();
        }
      }
    }
  }

  function tabChangeListKaizou(b) {
    $("div[id^=commentList]").css("display", "none");
    $("#commentNavi li a, #commentNavi2 li a").css("display", "block");
    $("#commentList" + b +", #commentList" + b + "2").css("display", "block");
    $("#commentNavi #comBtn" + b + " a" + ", #commentNavi2 #comBtn" + b + " a" + ", #commentNavi2 #comBtn" + b + "2 a").css("display", "none");
    localStorage.setItem("crx_header_info_type", b);
  }

  function commentListSelecter() {
    var target = localStorage.getItem("crx_header_info_type");
    if (target && target !== 'null') {
      tabChangeListKaizou(target);
    } else {
      tabChangeListKaizou('Recruit');
    }
  }

  //敵襲・ここへ部隊を配置
  function EnemyPlacementPoint(){
    if (location.pathname !== "/facility/unit_status.php")
      return;
    var top_title = $('.ig_decksection_top').text().trim();
    
    if(top_title == '敵襲'){
    
    $('div.ig_fight_dotbox').each(function() {
      var point_view = $(this).find('td.td_bggray:eq(1)').find('a:eq(0)').text();
      $('#sideboxBottom').find('div.basename').find('li').children()
      .each(function() {
        var base_view = $(this).text();
        if( base_view == point_view ){
          $(this).css({'text-decoration':'none', 'border-bottom':'2px solid red'});
        }
      });
    });
    
    $.post(
      '/facility/unit_status.php?dmo=all',
      function(html) {
        var FightBotbox = $('div.ig_decksection_innermid').find('div.ig_fight_dotbox');
        var FightunitTitle = $('div.ig_fightunit_title2').find('h3');
        $('<span id="enemyMenu">' +
          '<div class="view">ここへ部隊配置</div>' +
          '<ul>' +
            '<li class="placement" name="0">【全武将】から配置</li>' +
            '<li class="placement" name="1">【第一組】から配置</li>' +
            '<li class="placement" name="2">【第二組】から配置</li>' +
            '<li class="placement" name="3">【第三組】から配置</li>' +
            '<li class="placement" name="4">【第四組】から配置</li>' +
            '<li class="placement" name="5">【未設定】から配置</li>' +
          '</ul>' +
          '</span>'
        ).click(function(){
          $(this).css('color', 'yellow');
          $(this).find('ul').slideDown(150);
        })
        .hover(function(){
          
        },function(){
          $(this).css('color', '');
          $(this).find('ul').slideUp(150);
        })
        .appendTo(FightunitTitle);
        
        var ano = $(html).find('div.ig_fight_dotbox').size(),
          slot = '/card/deck.php?ano=' + ano;
        
        if(ano == 5){ $('div.view').html('空きスロットなし'); }
        
        $('li.placement').click(function(){
          $(this).closest('div.ig_fight_statusarea').addClass('slect_point');
          var groupNo = $(this).attr('name');
          var enemy_point = $(this).closest('div.ig_fight_statusarea').find('td.td_bggray:eq(1)').find('a:eq(0)').text();
          
          $('#sideboxBottom').find('div.basename').find('li').children()
          .each(function() {
            var enemy_ss = $(this).text();
            
            if( enemy_ss == enemy_point ){
              var villageID = $(this).attr('href');
              if(villageID == undefined){
                location.href = slot + '&select_card_group=' + groupNo;
              }
              else {
                var vid = villageID.split('&')[0];
                location.href = vid + '&from=menu&page=' + encodeURIComponent( slot + '&select_card_group=' + groupNo );
              }
            
            }
            
          });
        });
      }
    );
    
    }
}

//////////////////////
//同盟：
//////////////////////
  //同盟スコア計算追加2011.11.17
  function doumeiscore() {
    if (location.pathname != "/alliance/info.php")
      return;
    var totalscore = 0;
    $('TR.fs12').each(function() {
      var score = $(this).find('td').eq(2).text().trim().split(',').join('');
      totalscore = totalscore + parseFloat(score);
    });
    $('DIV.ig_decksection_top').append('(同盟スコア:' + Math.floor(totalscore / 500) + ')');
  }

  //同盟ポイント比較機能
  function ar_point_cmp() {
    if (location.pathname != "/alliance/info.php")
      return;
    if(!options['ar_point_cmp']) return;
    var flag = 0;
    if(( localStorage.getItem('crx_ixamoko_ar_id') != undefined ) && ( location.search.replace("?id=","") == localStorage.getItem('crx_ixamoko_ar_id') )) {
      flag = 1;
      disp_apc();
    }
    var input_bottun;
      if(flag==1){
        input_bottun = '<br /><input type="button" id="apc" name="apc" value="更新する" />';
      } else {
        input_bottun = '<br /><input type="button" id="apc" name="apc" value="記録する" />';
      }
    var CommonTable = $('#ig_mainareaboxInner').find('.common_table1.center');
    CommonTable.find('th:eq(2)').append(input_bottun);
    CommonTable.find('th:eq(1)').width('12em');
    
      $('input#apc').live('click',function(){
        var ans;
        var ar_date = localStorage.getItem('crx_ixamoko_ar_date');
        if(flag==1){
          ans = confirm(ar_date+"のデータが消去されます。\nよろしいですか？");
        } else {
          var ar_name = localStorage.getItem('crx_ixamoko_ar_name');
          ans = confirm("現在の同盟ポイントを記録をします。\nよろしいですか？");
        }
        if (!ans) return;
        var point_array = {};
        
          CommonTable.find('tr:gt(0)').each(function(){
            var ar_point = $(this).find('td:eq(2)').text().replace(/(^\s+)|(\s+$)/g,"").replace(/\,/g,"");
            var ar_member = $(this).find('td:eq(1)').text().replace(/(^\s+)|(\s+$)/g,"");
            point_array[ar_member] = ar_point;
          });
        localStorage.setItem('crx_ixamoko_ar_point', toJSON(point_array));
        var ar_id = location.search.replace("?id=","");
        localStorage.setItem('crx_ixamoko_ar_id', ar_id);
        var ar_name = $('div#ig_deckheadmenubox').find('div.alliance_title').text().replace(/(^\s+)|(\s+$)/g,"");
        localStorage.setItem('crx_ixamoko_ar_name', ar_name);
        var now = new Date();
        var ar_date = now.getMonth() + 1 + "/";
        ar_date+= now.getDate() + " ";
        ar_date+= now.getHours() + ":";
        ar_date+= now.getMinutes() + "";
        localStorage.setItem('crx_ixamoko_ar_date', ar_date);
        
        CommonTable.find('input').attr('value','記録完了');
        CommonTable.find('input').attr('disabled', true);
      });
  }
  function disp_apc() {
    var recorded_ap = secureEvalJSON(localStorage.getItem("crx_ixamoko_ar_point"));
      //console.log(recorded_ap);
    var ar_date = localStorage.getItem('crx_ixamoko_ar_date');
    var CommonTable = $('#ig_mainareaboxInner').find('.common_table1.center');
    
    CommonTable.find('tr:eq(0) th:eq(2)')
      .after('<th>変動値<div style="font-weight: normal;color:maroon;margin-top: 4px;">' + ar_date + '</div></th>');
  
      CommonTable.find('tr:gt(0)').each(function(){
        var now_ar_point = $(this).find('td:eq(2)').text().replace(/(^\s+)|(\s+$)/g,"").replace(/\,/g,"");
        var now_ar_member = $(this).find('td:eq(1)').text().replace(/(^\s+)|(\s+$)/g,"");
        if(recorded_ap[now_ar_member] == undefined ){
          recorded_ap[now_ar_member] = now_ar_point;
        }
        var cmpd_value = now_ar_point - recorded_ap[now_ar_member];
          if(cmpd_value > 999){
            cmpd_value = cmpd_value + "";
            while(cmpd_value != (cmpd_value = cmpd_value.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
          }
        $(this).find('td:eq(2)').after('<td style="color:maroon;">' + cmpd_value + '</td>');
      });
  }

//////////////////////
//その他：
//////////////////////
  //ナビ「兵士編成」20件に「カード一括破棄」リンクを100件に
  $(function () {
    var menu = $('#statMenu');
    menu.find('a:contains("兵士編成")')
    .replaceWith('<a href="/facility/set_unit_list.php?show_num=100">全兵士編成</a>');
    menu.find('a:contains("カード一括破棄")')
    .attr('href', '/card/deck_card_delete.php?show_num=100');
  });

  //全体格付テーブル表示補正
  $(function () {
    if (location.pathname !="/user/ranking.php" && location.pathname !="/alliance/list.php")
      return;
    $('.common_box3bottom').find('.common_table1.center')
    .find('strong').css({'display':'inline-block', 'width':'5em'});
  });

  //合戦報告書テーブル表示補正
  $(function () {
    if (location.pathname !="/war/list.php")
      return;
    $('th.w80').css('width', '100px');
    $('div.ig_battle_report_text > a')
    .css({'display':'inline-block', 'width':'425px', 'white-space':'nowrap', 'text-overflow':'ellipsis'});
    
  });

  //兵士編成にスクロールボタンを表示
  function unit_list_pageup() {
    if (location.pathname != "/facility/set_unit_list.php")
      return;
    if (!options.unit_list_pageup)
      return;
    var scrollup = $('<div id="move_button"><div id="page_up">▲</div><div id="page_down">▼</div></div>');
    $('#frame_00_spacer').append( scrollup );
    
    $('#page_up').click(function() {
      $('html,body').animate({ scrollTop: 0 }, 'fast');
      return false;
     });
    $('#page_down').click(function() {
      $('html,body').animate({ scrollTop: 20000 }, 'fast');
      return false;
     });
  }

  //部隊：スクロールダウンメニュー
  function deckFix() {
    if (location.pathname != "/card/deck.php")
      return;
    if (!options.deckFix)
      return;
    var howto = $('#howto_butai_hensei').size();
    if ( howto == 1 ) {
      var Deckcos = $('#howto_butai_hensei').find('table');
    } else {
      var Deckcos = $('.ig_deck_unitdata_assign.deck_wide_select');
    }
    var costDATA = $('.ig_deckcostdata').clone().css({'position':'relative', 'top':'0', 'left':'0', 'font-size':'13px', 'line-height':'1em', 'color':'lime'});
    var allcostDATA = $('.ig_deck_unitdata_allcost').clone().css({'display':'inline', 'background-image':'none', 'padding':'0', 'line-height':'1em', 'color': 'white'});
    var solnoDATA = $('.ig_deck_unitdata_solno').clone().css({'display':'inline', 'background-image':'none', 'padding':'0 4px', 'line-height':'1em', 'color': 'white'});
    var DeckFix = $('<ul id="deck_fixmenu"><li>デッキコスト：</li><li>選択中の部隊 コスト：</li><li>兵数 :</li></ul>');
    var Tekishu = $('#敵襲, #全編成, #待機兵, #くじ, #取引, #合成').clone().css({'float': 'left', 'display': 'block', 'padding-left':'5px'});
    $(Deckcos).after(DeckFix);
    DeckFix.hide();
    var navTop = Deckcos.offset().top;
    $(window).scroll(function () {
      var winTop = $(this).scrollTop();
      if (winTop >= navTop) {
        Deckcos.addClass('assign_fix');
        DeckFix.show();
        DeckFix.find('li:eq(0)').append(costDATA);
        DeckFix.find('li:eq(1)').append(allcostDATA);
        DeckFix.find('li:eq(2)').append(solnoDATA);
        DeckFix.append(Tekishu);
        $('#ig_deckunitdetail').css('margin-top', '28px');
      } else if (winTop <= navTop) {
        Deckcos.removeClass('assign_fix');
        DeckFix.hide();
        $('#ig_deckunitdetail').css('margin-top', '0');
      }
    });
  }

  //合戦報告書サマリー(城主：スキル発動)
  function warskil_summary_init() {
    if(location.pathname != "/war/list.php")
      return;
    if (!options.warskil_summary_init)
      return;
    var selectName = $('#ig_battle_report_search').find('option:selected').val();
    if(selectName == 'lord'){
      $('#t').after('<input type="button" name="ws_summary" id="ws_summary" value="サマリー[スキル発動]" style="margin-left:30px;" />');
    }
    var cardandskilllist = '';
    cardandskilllist += '<div id="ixamoko_ws_boxes">' +
        '<div id="ixamoko_ws_dialog" style="display:none;">' +
        '<div id="Moko_Title">' +
        '<div id="Moko_WindowTitle">この城主のスキル発動</div>' +
        '<div id="Moko_closeWindow"><a href="javascript:void(0);" class="close">close</a> or Esc Key</div>' +
        '</div>' +
        '<div id="Moko_Content" style="width: 570px; height: 385px;"></div>' +
        '</div>' +
        '</div>';
    $('body').prepend( cardandskilllist );
    
    $('#ixamoko_ws_dialog .close').click(function() {
      $('#ixamoko_mask, #ixamoko_ws_dialog').hide();
      return false;
    });
    
    $('#ws_summary').click(function () {
      $('#ixamoko_ws_list').empty();
      if (!confirm('Ajaxによる非同期通信を行うので応答がなくなります。\n処理が完了するまで"待機"を継続して下さい。\nよろしいですか？')) {
        return;
      }
      var tmp = location.search.match(/word=([^&]+)/i);
      if(tmp == null){
        nowLoading(true);
        alert("対象城主名が取得できません");
        return false;
      }
      var author=decodeURIComponent(tmp[1]);
      if(author == ""){
        nowLoading(true);
        alert("対象城主名が取得できませんでした");
        return false;
      }
      var battle_reportinfos={};
      var target = $('table.ig_battle_table').parent();
      battle_reportinfos = warskil_summary_sub( author, battle_reportinfos, target );
      var url_list = new Array();
        $('div.ig_battle_pagelist').find('a').each( function(){
          url_list.push( $(this).attr('href') );
        });
      url_list = $.unique( url_list );
      if(url_list.length > 1){
        for (var i = 0; i < url_list.length; i++) {
          $.ajax({
            type: "POST",
            url: url_list[i],
            cache: false, 
            async: false,
            dataType: "text",
            success: function (html){
              var battle_reportinfos_tmp = warskil_summary_sub( author, battle_reportinfos, $(html) );
              for (var keyString in battle_reportinfos_tmp) {
                if (battle_reportinfos[keyString]==undefined){
                  battle_reportinfos[keyString] = "" + battle_reportinfos_tmp[ keyString ];
                } else if ( !(battle_reportinfos[keyString].match(battle_reportinfos_tmp[keyString])) ) {
                  battle_reportinfos[keyString] += ", " + battle_reportinfos_tmp[keyString];
                }
              }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            //console.log(textStatus);
            }
          });
        }
      }
      
      var cardandskilllist = '';
      cardandskilllist += '<table border="0" width="100%"><tr><th class="imk_th_view">武将</th><th class="imk_th_view imk_border_right">スキル</th></tr>';
      for (var keyString in battle_reportinfos) {
        var tmp = $.unique(battle_reportinfos[keyString].split(", "));
        cardandskilllist += '<tr><td class="imk_td_centerb">'+keyString+'</td><td  class="imk_td_view_left imk_border_right">'+tmp.join(", ")+"</td></tr>";
      }
      cardandskilllist += '</table></div>';
      var id = '#ixamoko_ws_dialog';
      var maskHeight = $(document).height();
      var maskWidth = $(window).width();
      $('#ixamoko_mask').css({'width':maskWidth,'height':maskHeight}).fadeTo(0 ,0.75).show();
      var winH = $(window).height();
      var winW = $(window).width();
      $(id).css('top',  winH/2-$(id).height()/2).css('left', winW/2-$(id).width()/2).fadeIn(500);
      $('#Moko_Content').empty();
      $('#Moko_Content').prepend(cardandskilllist);
    });
  }
  function warskil_summary_sub(author,battle_reportinfos,target) {
    var $target = $(target);
    var indexv = $target.find('.ig_battle_table').find('.ig_battle_report_text').size();
    var optionArray = [];
      $target.find('.ig_battle_table').find('.ig_battle_report_text').each( function(){
        var $this = $(this);
        var rep_url = $this.find('a').attr('href');
        optionArray.push({"url":rep_url});
      });
      
        doOrderGuaranteedAjax(optionArray, function(){
        });
      return battle_reportinfos;
    
    function doOrderGuaranteedAjax(ajaxOptionArray, allCompleteHandler){
      var defaults = {
        type: "POST",
        cache: false, 
        dataType: "text",
        async: false,
        success : function(html) {
            var texts = $(html).find('#ig_battle_reportinfo').html().split("<br>");
            for (var i = 0; i < texts.length; i++) {
              if(texts[i].match(author)){
                
                if(!(texts[i].match("】部隊が、【"))){
                  var keyString = "" + texts[i].replace(/^[\s\S]*】の【/,"").replace(/】が、【[\s\S]*$/,"");
                  var valueString = "" + texts[i].replace(/^[\s\S]*】が、【/,"").replace(/】を発動させ[\s\S]*$/,"");
                  
                  if ( battle_reportinfos[keyString] == undefined ){
                    battle_reportinfos[keyString] = "" + valueString;
                  } else if (!(battle_reportinfos[keyString].match(valueString))) {
                    battle_reportinfos[keyString] += ", " + valueString;
                  }
                  
                }
              }
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
          },
          complete : function(html) {
            ajaxOptionArray.shift();    // 最初の要素を削除
            if (ajaxOptionArray.length == 0 ) {    // すべての通信が完了した場合
              if (allCompleteHandler) {      // コールバックが設定された場合
                allCompleteHandler();
              }
            } else {      // 通信配列にまだ通信が残っている場合
              option = ajaxOptionArray[0];      // ajaxのオプションを次の通信に切り替え
              opts = $.extend({}, defaults, option);
              $.ajax(opts);      // 通信を開始
            };
          }
        };
        // 初期指定
        var option = ajaxOptionArray[0];
        var opts = $.extend({}, defaults, option);
        // 一回のみ実行
        $.ajax(opts);
      };
    }

  //格付サマリー(盟主情報)
  function ar_summary_init() {
    if ( location.pathname != "/alliance/list.php" )
      return;
    if (!options.warskil_summary_init)
      return;
    $('table.common_table1.center.mt10, table.ig_battle_table').before('<input type="button" name="ar_summary" id="ar_summary" value="サマリー[盟主情報]" style="margin-left:30px;">');
    var cardandskilllist = '';
    cardandskilllist += '<div id="ixamoko_ar_boxes">' +
        '<div id="ixamoko_ar_dialog" style="display:none;">' +
        '<div id="Moko_Title">' +
        '<div id="Moko_WindowTitle">盟主情報</div>' +
        '<div id="Moko_closeWindow"><a href="javascript:void(0);" class="close">close</a> or Esc Key</div>' +
        '</div>' +
        '<div id="Moko_Content" style="width: 570px; height: 380px;"></div>' +
        '</div>' +
        '</div>';
    $('body').prepend(cardandskilllist);
    
    $('#ixamoko_ar_dialog .close').click(function() {
      $('#ixamoko_mask, #ixamoko_ar_dialog').hide();
      return false;
    });
      $('#ar_summary').live('click', function () {
        $('#ixamoko_ws_list').empty();
      if (!confirm('Ajaxによる非同期通信を行うので応答がなくなります。\n処理が完了するまで"待機"を継続して下さい。\nよろしいですか？')) {
        return;
      }
        $('div#ixamoko_ar_list').empty();
        var id = '#ixamoko_ar_dialog';
        var winH = $(window).height();
        var winW = $(window).width();
        $(id).css('top',  winH/2-$(id).height()/2).css('left', winW/2-$(id).width()/2).fadeIn(500);
        
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();
        $('#ixamoko_mask').css({'width':maskWidth,'height':maskHeight}).fadeTo(0 ,0.75).show();
        
        var battle_reportinfos={};
        var target = $('table.common_table1.center.mt10, table.ig_battle_table');
        battle_reportinfos = ar_summary_sub(battle_reportinfos,target);
        var url_list = new Array();
        var pathv = $('div.ig_battle_pagelist, ul.pager').find('a:last').attr('href').replace(/&p=\d+/,"");
        var indexv = $('div.ig_battle_pagelist, ul.pager').find('a:last').attr('href').match(/&p=(\d+)/);
        for (var i = 0; i < indexv[1]; i++) {
          url_list[i] = pathv + '&p=' + (i+1);
        }
        if(url_list.length > 1){
          for (var i = 0; i < url_list.length; i++) {
            $.ajax({
              type: "POST",
              url: url_list[i],
              cache: false, 
              async: false,
              dataType: "text",
              success: function (html){
                target = $(html).find('.common_table1.center.mt10, .ig_battle_table');
                var battle_reportinfos_tmp = ar_summary_sub(battle_reportinfos,$(target));
                for (var keyString in battle_reportinfos_tmp) {
                  if (battle_reportinfos[keyString]==undefined){
                    battle_reportinfos[keyString] = battle_reportinfos_tmp[keyString];
                  }
                }
              },
              error: function (XMLHttpRequest, textStatus, errorThrown) {
              }
            });
          }
        }
        var cardandskilllist = '';
        cardandskilllist += '<table border="0" width="100%"><tr><th class="imk_th_view">方角</th><th class="imk_th_view">盟主</th><th class="imk_th_view">座標</th><th class="imk_th_view">同盟名</th><th class="imk_th_view">同士</th><th class="imk_th_view imk_border_right">順位</th></tr>';
        for (var keyString in battle_reportinfos) {
          var area = battle_reportinfos[keyString].match(/area=([^&]+)/);
          var xy_x = battle_reportinfos[keyString].match(/xy_x=([^&]+)/);
          var xy_y = battle_reportinfos[keyString].match(/xy_y=([^&]+)/);
          var rank = battle_reportinfos[keyString].match(/rank=([^&]+)/);
          var member = battle_reportinfos[keyString].match(/member=([^&]+)/);
          var name = battle_reportinfos[keyString].match(/name=([^&]+)/);
          var level = battle_reportinfos[keyString].match(/level=([^&]+)/);
          if(area!=null){
          cardandskilllist += '<tr>' +
              '<td class="imk_td_view_center">' + area[1] + '</td>' +
              '<td class="imk_td_view_left">' + name[1] + '(Lv.' + level[1] + ')</td>' +
              '<td class="imk_td_view_center">' + xy_x[1] + ',' + xy_y[1] + '</td>' +
              '<td class="imk_td_view_left">' + keyString + '</td>' +
              '<td class="imk_td_view_center">' + member[1] + '人</td>' +
              '<td class="imk_td_view_center imk_border_right">' + rank[1] + '位</td>' +
              '</tr>';
          }
        }
        cardandskilllist += '</table></div>';
        $('#Moko_Content').empty();
        $('#Moko_Content').prepend(cardandskilllist);
      });
  }
  function ar_summary_sub(battle_reportinfos,target) {
    var $target = $(target);
    var optionArray = [];
    $target.find('tr').each( function(){
      var $this = $(this);
      var rank = $this.find('td:first').text();
      var member =$this.find('td:eq(3)').text();
      if(rank == '筆頭'){
        rank=1;
      }
      if(isNaN(rank))
        return;
      if(rank == '')
        return;
      if ((rank <= 50)||(member > 1)) {
        optionArray.push({"url":$this.find('a[href*="/user/\?user_id="]').attr('href')});
        battle_reportinfos[$this.find('td:eq(1)').text()] = 'rank=' + rank + '&&member=' + member + '&&name=' + $this.find('td:eq(2)').text();
      }
    });
    var i = 0;
    for(key in optionArray){
      i++;
      break;
    }
    if (i > 0) {
      doOrderGuaranteedAjax(optionArray, function(){
      });
    }
    return battle_reportinfos;
    
    function doOrderGuaranteedAjax(ajaxOptionArray, allCompleteHandler){
      var defaults = {
        type: "POST",
        cache: false, 
        dataType: "text",
        async: false,
        success : function(html) {
            $(html).find('#ig_mainareaboxInner').find('.common_table1.center').find('td').each( function(){
              if($(this).text()=="本領"){
                var main_url = $(this).parent().find('td:eq(2)>a').attr("href");
                  var alliance_name = $(html).find('#ig_mainareaboxInner').find('a[href*="/alliance/info.php\?id="]').text();
                  var level = $(html).find('#ig_mainareaboxInner').find('.pro1').find('.para').text().match(/Lv\.(\d+)/);
                  if (battle_reportinfos[alliance_name]!=undefined){
                  var xy_x = main_url.match(/x=([-\d]+)/);
                  var xy_y = main_url.match(/y=([-\d]+)/);
                  var area;
                  if(xy_y[1]<0){area="南";}else{area="北";}
                  if(xy_x[1]<0){area+="西";}else{area+="東";}
                  battle_reportinfos[alliance_name] = battle_reportinfos[alliance_name] + '&&area=' + area + '&&xy_x=' + xy_x[1] + '&&xy_y=' + xy_y[1] + '&&level=' + level[1];
                  }
              }
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        complete : function(html) {
          ajaxOptionArray.shift();    // 最初の要素を削除
          if (ajaxOptionArray.length == 0 ) {    // すべての通信が完了した場合
            if (allCompleteHandler) {      // コールバックが設定された場合
              allCompleteHandler();
            }
          } else {      // 通信配列にまだ通信が残っている場合
            option = ajaxOptionArray[0];      // ajaxのオプションを次の通信に切り替え
            opts = $.extend({}, defaults, option);
            $.ajax(opts);      // 通信を開始
          };
        }
      };
      // 初期指定
      var option = ajaxOptionArray[0];
      var opts = $.extend({}, defaults, option);
      // 一回のみ実行
      $.ajax(opts);
    };
  }

//////////////////////// add end //////////////////////

// JSON関連
// jquey.json-2.2.jsから。MITライセンスに基づき著作権表示を記載します。
/*
* jQuery JSON Plugin
* version: 2.1 (2009-08-14)
*
* This document is licensed as free software under the terms of the
* MIT License: http://www.opensource.org/licenses/mit-license.php
*
* Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
* website's http://www.json.org/json2.js, which proclaims:
* "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
* I uphold.
*
* It is also influenced heavily by MochiKit's serializeJSON, which is
* copyrighted 2005 by Bob Ippolito.
*/

  function toJSON( o) {
    //return JSON.stringify( o);
    //if (typeof(JSON) == 'object' && JSON.stringify)return JSON.stringify(o);
    var type = typeof (o);
    if (o === null)
      return "null";
    if (type == "undefined")
      return undefined;
    if (type == "number" || type == "boolean")
      return o + "";
    if (type == "string")
      return quoteString(o);
    if (type == 'object') {
      //if (typeof o.toJSON == "function") return toJSON( o.toJSON() );
      if (o.constructor === Date) {
        var month = o.getUTCMonth() + 1;
        if (month < 10)
          month = '0' + month;
        var day = o.getUTCDate();
        if (day < 10)
          day = '0' + day;
        var year = o.getUTCFullYear();
        var hours = o.getUTCHours();
        if (hours < 10)
          hours = '0' + hours;
        var minutes = o.getUTCMinutes();
        if (minutes < 10)
          minutes = '0' + minutes;
        var seconds = o.getUTCSeconds();
        if (seconds < 10)
          seconds = '0' + seconds;
        var milli = o.getUTCMilliseconds();
        if (milli < 100)
          milli = '0' + milli;
        if (milli < 10)
          milli = '0' + milli;
        return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
      }
      if (o.constructor === Array) {
        var ret = [];
        for (var i = 0; i < o.length; i++)
          ret.push(toJSON(o[i]) || "null");
        return "[" + ret.join(",") + "]";
      }
      var pairs = [];
      for (var k in o) {
        var name;
        type = typeof k;
        if (type == "number")
          name = '"' + k + '"';
        else if (type == "string")
          name = quoteString(k);
        else
          continue; //skip non-string or number keys
        if (typeof o[k] == "function")
          continue;
        var val = toJSON(o[k]);
        pairs.push(name + ":" + val);
      }
      return "{" + pairs.join(", ") + "}";
    }
  }

  function secureEvalJSON(src) {
      return JSON.parse(src);
  }

  function quoteString(string) {
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    var _meta = {'\b': '\\b','\t': '\\t','\n': '\\n','\f': '\\f','\r': '\\r','"': '\\"','\\': '\\\\'};
    if (string.match(_escapeable)) {
      return '"' + string.replace(_escapeable, function(a) {
        var c = _meta[a];
        if (typeof c === 'string')
          return c;
        c = a.charCodeAt();
        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
      }) + '"';
    }
    return '"' + string + '"';
  }


/*
* Cookie plugin
*
* Copyright (c) 2006 Klaus Hartl (stilbuero.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = $.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  function getUnixTime() {
    return ~~(new Date() / 1000);
  }
  function formatTime(sec) {
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec - h * 3600) / 60);
    var s = Math.floor(sec - h * 3600 - m * 60);
    var tim = h + ":" +
    (m + 100).toString().substr(-2) + ":" +
    (s + 100).toString().substr(-2);
    return tim;
  }
  function ArraytoJSON(src) {
    var tmp = '';
    for (var i = 0; i < src.length; ++i) {
      if (tmp !== '')
        tmp += ',';
      tmp += '"' + src[i].replace('"', '\"') + '"';
    }
    return '[' + tmp + ']';
  }

  tableSorter_($);
  tablesorter_pager_plugin($);
}
