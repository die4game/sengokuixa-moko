$( function () {

  var allSettings ={},
    groups = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    groups_def = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    groups_img, groups_img_def = [], SOUND, group_setting = {}, options = {}, WORLD,

    // moko設定のデフォルト値
    options_def = {
      MapOverlay_FallMain: true,
      MapOverlay_Leader: true,
      ad_sort: "1",
      all_area_map: true,
      all_deck_setting: true,
      all_dissolution: true,
      all_map_status: true,
      all_send_troop: true,
      all_setting_mod: "0",
      alliance_report_link: true,
      ar_point_cmp: true,
      auto_union_check: true,
      bases_blind: true,
      bbs_def_num: "20",
      bbs_no_display_delete: true,
      being_exhibited: true,
      card_tool: true,
      category_clone: true,
      chapter_change: "5",
      chat_linkchg: true,
      chat_mapcood: true,
      chat_mikire: true,
      commentListEnemy: true,
      deal_favorite: true,
      deckFix: true,
      deck_check: true,
      def_attack: true,
      def_kind_soldier: [
        0, // 未使用
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        true,
        false,
        false,
        true,
        false,
        false
      ],
      def_num_of_soldier: "100",
      desc_soldier: true,
      dungeon_soldiers: true,
      faci_list: true,
      facilityStuffTextColor: true,
      facility_favorites: true,
      facility_maxsoldier: true,
      facility_panelreverse: true,
      facility_selecter: true,
      facility_tool: true,
      facility_tool_WUP: true,
      favoriteSort: true,
      firstcard_in: false,
      funct_select_move: true,
      gofight_skill: true,
      group_sort_mode: "0",
      hide_facility: false,
      hide_soldier: false,
      hikyou_all: true,
      hold_butai: true,
      immediately_send_troop: true,
      inside_attack_view: false,
      ixa_time: true,
      kind_mod: "0",
      leave_departure: true,
      leftclick_menu: true,
      logout_correction: false,
      map_butai_status: true,
      map_history: true,
      map_leftclick: true,
      map_minimap: true,
      map_potential: true,
      map_quarters: true,
      map_reg: true,
      map_rightclick: true,
      map_starx: "5",
      market_desc: true,
      market_maxsoldier: true,
      market_radiobutton: true,
      menu_reversal: true,
      merge_fight_info: true,
      mod_status_left: true,
      move_nearby: true,
      nearby_tool: true,
      non_back: false,
      non_cardview: true,
      now_select_point: true,
      off_face: false,
      pager_ajax: true,
      panelAttack: true,
      panel_func_change: false,
      place_skip: false,
      place_skip_str: "",
      platoon_leader_remove: true,
      prod_with_smalllot: "0",
      pulldown_menu: true,
      raid: false,
      raid_sound: false,
      raid_sound_src: "",
      raid_system: 12,
      rank_lock: "2",
      refillhp: true,
      return_mode: "0",
      reversal_mod: "1",
      rightclick_mode: "1",
      send_troop_check: false,
      set_unit_color: true,
      sidebox_change: true,
      soldiers_blind: true,
      sort_village: false,
      table_sol_in_mokotool: true,
      timeout_countdown: true,
      tohankaku: true,
      toolbox_fixing: false,
      toride_count: "0",
      toride_inbox: false,
      toubatsu: true,
      trade_auxiliary: true,
      unitListDialog: "2",
      unit_filter_branch: true,
      unit_list_200: false,
      unit_list_allset: true,
      unit_list_default: true,
      unit_list_group: true,
      unit_list_max: true,
      unit_list_pageup: true,
      unit_list_total: true,
      unit_power: true,
      unit_set_one: true,
      villageListView: true,
      warreportlinkland: true,
      warskil_summary_init: false,
      width_display: true,
      width_display_mod: "0",
      zoomMap: true
    };

  // カレントウィンドウを取得
  chrome.windows.getCurrent( function ( win) {
    var windowId = win.id;

    // カレントタブを取得
    chrome.tabs.getSelected( windowId, function ( tab) {

      var tmp = tab.url.match(/http:\/\/(.+?)\./);
      WORLD = tmp? tmp[1]: false;

      // 設定があるworldを取得し、world選択をセット
      chrome.storage.sync.get( 'worldKey', function ( store) {
        var worldArray = store.worldKey || [];
        if ( $.inArray( WORLD, worldArray) < 0)
          worldArray.push( WORLD);
        worldArray.sort();
        worldArray.forEach( function ( world) {
          $( '#worldSelect').append( '<option value="' + world + '">' + world + '</option>').val( world);
        });
        chrome.storage.sync.set( { 'worldKey': worldArray}, function () {
          //console.log( worldArray);
        });
        $('#worldSelect').val(WORLD);
      });

      // moko設定をロード
      chrome.storage.sync.get( WORLD, function ( store) {
        setSetting( store, WORLD);
      });

      $('#ixamoko_set_tab_all').show();
      $('#ixamoko_set_grp>div').eq(0).css('background-color', '#aaf');

      // groupSettingをロード
      chrome.tabs.sendMessage( tab.id, 'send groupSetting', function ( obj) {
        //console.log( obj);
        groups = obj? obj.crx_ixamoko_init_groups: groups_def;
        groups_img = obj? obj.crx_ixamoko_init_groups_img: groups_img_def;
        setGroup( groups, groups_img);
      });
    });
  });

  // groupとSOUNDのdefualt settingを取得
  chrome.runtime.sendMessage( "send CRXMOKODATA", function( obj) {
    var CRXMOKODATA = JSON.parse(obj), i;
    groups_img_def = CRXMOKODATA.group[0];
    SOUND = CRXMOKODATA.sound;
  });



  ///////////////
  // event定義 //
  ///////////////


  // world選択
  $('#worldSelect').change( function () {
    //console.log('world change', $(this).val());
    var options, world = $(this).val();
    if ( world === 'default') {
      options = options_def;
      setOptions( options_def);
    } else {
      chrome.storage.sync.get( world, function ( store) {
        setSetting( store, world);
      });
    }
  });

  // importボタン
  $('#import').click( function () {
    if ( confirm( $('#worldSelect').val() + 'の設定をインポートします。')) {
      saveSetting( WORLD);
      $('#worldSelect').val( WORLD);
    }
  });

  // deleteボタン
  $('#delete').click( function () {
    var world = $('#worldSelect').val();
    if ( world !== 'default' && confirm( world + 'の設定を削除します。')) {
      chrome.storage.sync.remove( world);
      $('#worldSelect').find('[value="'+world+'"]').remove();
      $('#worldSelect').val( WORLD).trigger( 'change');
    }
  });

  // 設定を変更する
  $('#ixamoko_dialog_main').on( "change", function () {
    var world = $('#worldSelect').val();
    if ( world !== 'default')
      saveSetting( world);
  });

  // タブ切り替え
  $('#ixamoko_set_grp > DIV').click(function(e) {
    $('#ixamoko_set_tab_' + $(this).attr('tabid')).show().siblings().hide();
    $(this).css('background-color', '#aaf')
        .siblings().css('background-color', '');
  });

  // group設定
  $( '#ixamoko_grp_list').on( 'click', 'INPUT.ixamoko_set_grp_set', function(e) {
    if (confirm('本当に変更して良いですか。')) {
      var $parent = $(this).parent();
      var color = $parent.find('INPUT.ixamoko_color').val();
      var icon = $parent.find('INPUT.ixamoko_icon').val();
      groups[parseInt($parent.attr('grpid'), 10)] = color.replace('"', '%22');
      groups_img[parseInt($parent.attr('grpid'), 10)] = icon.replace('"', '%22');
      $parent.find('IMG').attr('src', icon);
      setStorage( 'crx_ixamoko_init_groups', groups);
      setStorageLocal( 'crx_ixamoko_init_groups_img', groups_img);
    }
  });
  $( '#ixamoko_grp_list').on( 'click', 'INPUT.ixamoko_set_grp_del', function(e) {
    if (confirm('本当に削除して良いですか。')) {
      var $parent = $(this).parent();
      var id = parseInt($parent.attr('grpid'), 10);
      groups.splice(id, 1);
      groups_img.splice(id, 1);
      for (var cardid in group_setting) {
        if (group_setting[cardid] == id) {
          group_setting[cardid] = 0;
        } else if (group_setting[cardid] > id) {
          --group_setting[cardid];
        }
      }
      setStorage( 'crx_ixamoko_group_set', group_setting);
      $parent.remove();
      setStorage( 'crx_ixamoko_init_groups', groups);
      setStorageLocal( 'crx_ixamoko_init_groups_img', groups_img);
    }
  });
  $('INPUT.ixamoko_set_grp_default').click(function(e) {
    if (confirm('"標準"に戻してよろしいですか？グループ順記録も破棄されます。')) {
      group_setting = {};
      setStorage( 'crx_ixamoko_group_set', group_setting);
      setGroup( groups_def, groups_img_def);
      setStorage( 'crx_ixamoko_init_groups', groups_def);
      setStorageLocal( 'crx_ixamoko_init_groups_img', groups_img_def);
    }
  });
  $('INPUT.ixamoko_set_grp_add').click(function(e) {
    var $list = $('#ixamoko_grp_list');
    var i = $list.find('DIV').get().length;
    var html = '<DIV grpid="' + i + '"><IMG src="' + groups_img[0] + '" /> <INPUT class="ixamoko_icon" type="text" value="' + groups_img[0] + '" /> <INPUT class="ixamoko_color" type="text" value="" />&nbsp;<INPUT type="button" value="設定" class="ixamoko_set_grp_set" />&nbsp;<INPUT type="button" value="削除" class="ixamoko_set_grp_del" /></DIV>';
    $list.append(html);
    groups[i] = '';
    groups_img[i] = groups_img[0];
    setStorage( 'crx_ixamoko_init_groups', groups);
    setStorageLocal( 'crx_ixamoko_init_groups_img', groups_img);
  });
  // group設定ここまで

  // 戦況マップクリア
  $('#clear_all_map_status').click(function(e) {
    setStorage('crx_ixakaizou_map_status', false, true);
    alert('Done.');
  });

  // 敵襲情報クリア
  $('#clear_enemyCheckR').click(function(e) {
    setStorage( 'crx_enemyCheckR', false, true);
    alert('Done.');
  });

  // 敵襲通知
  $('#raidNotification').click(function(e) {
    webkitNotifications.requestPermission();
  });
  $('#raidNotification_test').click(function(e) {
    var notification = webkitNotifications.createNotification('','','Enemy is in sight.');
    notification.show();
    setTimeout(function(){
      notification.cancel();
    }, 5000);
  });

  // 広域マップクリア
  $('#clear_all_area_map').click(function(e) {
    if (confirm('表示設定と記録した同盟データをすべて消去してよろしいですか？')) {
      setStorage('crx_areamaptoride', false, true);
      setStorage('crx_areamapcountry', false, true);
      setStorage('crx_alliesObj', false, true);
    }
  });

  // 座標記録クリア
  $('#clear_map_reg').click(function(e) {
    if (confirm('記録した座標をすべて消去してよろしいですか？')) {
      var map_list = {};
      setStorage( "crx_map_list", map_list, true);
    }
  });

  // グループ順記録をクリア
  $('#clear_grp_reg').click(function(e) {
    if (confirm('記録したグループをすべて消去してよろしいですか？')) {
      var tmp_list = {};
      setStorage( "crx_ixamoko_group_set", tmp_list, true);
    }
  });

  // お気に入り施設クリア
  $('#clear_facility_reg').click(function(e) {
    if (confirm('記録した施設をすべて消去してよろしいですか？')) {
      var facility_list = {};
      setStorage( "crx_facility_list", facility_list, true);
    }
  });

  // 一部設定クリア
  $('#clear_localStorage').click(function(e) {
    if (confirm('・グループ設定\n・お気に入り部隊\n・お気に入りソート選択\n・基本兵種設定\n　\n上記以外の設定は破棄されます。')) {
      for (var key in localStorage) {
        if ( key === 'crx_ixakaizou_butai_list_id' ||
          key === 'crx_ixakaizou_favorite_list' ||
          key === 'crx_ixamoko_default_unit' ||
          key === 'crx_ixamoko_group_set' ||
          key === 'crx_ixamoko_init_groups' ||
          key === 'crx_ixamoko_init_groups_img' ||
          key === 'crx_ixakaizou_group_index'
        ) {
          continue;
        } else {
          setStorage( key, false, true);
        }
      }
    }
  });
  
  // 敵襲音再生
  $('#raid_sound_src')
  .after('<a><audio id="reid_sound_test"></audio>&#9654;</a>')
  .next('a').css({marginLeft:'1em', padding:'0 0.4em', border:'solid 1px', borderRadius:'4px', color:'gray', cursor:'pointer'})
  .hover(function(e){$(this).css({color:'black'});},function(e){$(this).css({color:'gray'});})
  .click(function(e){$('#reid_sound_test').attr('src',$('#raid_sound_src').val()?$('#raid_sound_src').val():SOUND.raid_sound).get(0).play()});



  //////////////////
  // function定義 //
  //////////////////


  // moko設定をセーブ
  function saveSetting ( world) {
    var options = {};
    $('.ixamoko_setting').each(function() {
      var key = $(this).attr('key'), i;
      if ( key == 'def_kind_soldier') {
        options[key] = [];
        $(this).find('INPUT[type="checkbox"]').each( function ( idx, elm) {
          options[key][idx + 1] = $(elm).prop("checked");
        });
      } else if ( (key == 'map_starx') || (key == 'def_num_of_soldier') || (key == 'rank_lock') || (key == 'ad_sort') || (key == 'toride_count') ||
            (key == 'func_dbclk') || (key == 'prod_with_smalllot') || (key == 'kind_mod') || (key == 'bbs_def_num') || (key == 'unitListDialog') || (key == 'chapter_change') || (key == 'rightclick_mode') || (key == 'return_mode') || (key == 'reversal_mod') || (key === 'group_sort_mode') || (key === 'width_display_mod') || (key === 'all_setting_mod') ) {
        options[key] = $(this).children(':selected').prop('value');
      } else if (key == 'place_skip_str') {
        options[key] = $(this).prop('value');
      } else if (key == 'raid_system') {
        options[key] = 0;
        if ($(this).prop('checked') === true) {
          for (i = 0; i < 4; i++)
            options[key] |= $('INPUT.raid_system').eq(i).prop('checked') === true ? $('INPUT.raid_system').eq(i).attr('key') : false;
        }
      } else if (key == 'raid_sound_src') {
        options[key] = $(this).val();
      } else {
        options[key] = $(this).prop('checked') === true ? true : false;
      }
    });
    setStorage( 'crx_ixa_moko_options', options, false, world);
    return false;
  }


  // storage.sync.setの部分
  function setStorage (  key, options, toggle, world) {
    var world = world? world: $('#worldSelect').val();
    chrome.storage.sync.get( world, function ( store) {
      allSettings = store[world]? JSON.parse(store[world]): {};
      allSettings[key] = options;
      allSettings.toggle ^= toggle;
      store[world] = JSON.stringify(allSettings);
      chrome.storage.sync.set( store, function(){
        //console.log(allSettings)
      });
    });
  }
  // storage.local.set group_img用
  function setStorageLocal (  key, options, toggle, world) {
    var world = world? world: $('#worldSelect').val();
    chrome.storage.local.get( world, function ( store) {
      allSettings = store[world]? JSON.parse(store[world]): {};
      allSettings[key] = options;
      allSettings.toggle ^= toggle;
      store[world] = JSON.stringify(allSettings);
      chrome.storage.local.set( store, function(){
        //console.log(allSettings)
      });
    });
  }


  // moko設定をロード
  function setSetting ( store, world) {
    //console.log( store);
    var options;
    if ( !store[world] || !( options = JSON.parse( store[world]).crx_ixa_moko_options)) {
      saveSetting();
      return;
    }
    setOptions( options);
  }

  // optionsを渡してセット
  function setOptions( options) {
    $('.ixamoko_setting').each(function() {
      var key = $(this).attr('key'), i;
      if ( key == 'def_kind_soldier') {
        $( this).find( 'INPUT[type="checkbox"]').each( function ( idx, elm) {
          $( elm).prop( "checked", options[ key][ idx + 1]);
        });
      } else if ( (key == 'map_starx') || (key == 'def_num_of_soldier') || (key == 'rank_lock') || (key == 'ad_sort') || (key == 'toride_count') || (key == 'func_dbclk') || (key == 'prod_with_smalllot') || (key == 'kind_mod') || (key == 'bbs_def_num') || (key == 'unitListDialog') || (key == 'chapter_change') || (key == 'rightclick_mode') || (key == 'return_mode') || (key == 'reversal_mod') || (key === 'group_sort_mode') || (key === 'width_display_mod') || (key === 'all_setting_mod') ) {
        $( this).val( options[key]);
      } else if (key == 'place_skip_str') {
        $( this).prop( 'value', options[key]);
      } else if (key == 'raid_system') {
        $(this).prop('checked', options[key]);
        for ( i = 0; i < 4; i++) {
          $( 'INPUT.raid_system').eq( i).prop('checked', ( options[key] & $( 'INPUT.raid_system').eq( i).attr( 'key')));
        }
      } else if ( key == 'raid_sound_src') {
        $(this).val( options[key]);
      } else {
        $(this).prop('checked', options[key]);
      }
    });
  }


  // ixamoko_grp_listをセット
  function setGroup ( groups, groups_img) {
    var setting_dialog_strx = '', i;
    for ( i = 0; i < groups.length; ++i) {
      setting_dialog_strx += '<DIV grpid="' + i + '"><IMG src="' + groups_img[i] + '" /> <INPUT class="ixamoko_icon" type="text" value="' + groups_img[i] + '" /> <INPUT class="ixamoko_color" type="text" value="' + groups[i] + '" />';
      setting_dialog_strx += '&nbsp;<INPUT type="button" value="設定" class="ixamoko_set_grp_set" />';
      if (i > 0) {
        setting_dialog_strx += '&nbsp;<INPUT type="button" value="削除" class="ixamoko_set_grp_del" />';
      }
      setting_dialog_strx += '</DIV>';
    }
    $( '#ixamoko_grp_list').empty();
    $( '#ixamoko_grp_list').append( setting_dialog_strx);
  }
});