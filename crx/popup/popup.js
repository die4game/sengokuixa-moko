$( function () {

  var allSettings ={},
    groups = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    groups_def = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    groups_img, groups_img_def = [], SOUND, group_setting = {}, options = {}, world;

  // カレントウィンドウを取得
  chrome.windows.getCurrent( function ( win) {
    var windowId = win.id;

    // カレントタブを取得
    chrome.tabs.getSelected( windowId, function ( tab) {

      var tmp = tab.url.match(/http:\/\/(.+?)\./);
      world = tmp? tmp[1]: false;

      // world表示
      //console.log( world);
      if ( $('#worldSelect[value="'+world+'"]')[0])
        $('#worldSelect').val(world);
      else
        $('#worldSelect').append('<option value="'+world+'">'+world+'</option>').val(world);

      // moko設定をロード
      chrome.storage.sync.get( world, setSetting);

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

  // group と SOUND の defualt setting
  chrome.runtime.sendMessage( "send CRXMOKODATA", function( obj) {
    var CRXMOKODATA = JSON.parse(obj), i;
    groups_img_def = CRXMOKODATA.group[0];
    SOUND = CRXMOKODATA.sound;
  });

  $( '#ixamoko_grp_list').on( 'click', 'INPUT.ixamoko_set_grp_set', function(e) {
    if (confirm('本当に変更して良いですか。')) {
      var $parent = $(this).parent();
      var color = $parent.find('INPUT.ixamoko_color').val();
      var icon = $parent.find('INPUT.ixamoko_icon').val();
      groups[parseInt($parent.attr('grpid'), 10)] = color.replace('"', '%22');
      groups_img[parseInt($parent.attr('grpid'), 10)] = icon.replace('"', '%22');
      $parent.find('IMG').attr('src', icon);
      setStorage( 'crx_ixamoko_init_groups', groups);
      setStorage( 'crx_ixamoko_init_groups_img', groups_img);
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
      setStorage( 'crx_ixamoko_init_groups_img', groups_img);
      chrome.storage.sync.set();
    }
  });
  $('#ixamoko_set_grp > DIV').click(function(e) {
    $('#ixamoko_set_tab_' + $(this).attr('tabid')).show().siblings().hide();
    $(this).css('background-color', '#aaf')
        .siblings().css('background-color', '');
  });
  $('INPUT.ixamoko_set_grp_default').click(function(e) {
    if (confirm('"標準"に戻してよろしいですか？グループ順記録も破棄されます。')) {
      group_setting = {};
      setStorage( 'crx_ixamoko_group_set', group_setting);
      setGroup( groups_def, groups_img_def);
      setStorage( 'crx_ixamoko_init_groups', groups_def);
      setStorage( 'crx_ixamoko_init_groups_img', groups_img_def);
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
    setStorage( 'crx_ixamoko_init_groups_img', groups_img);
  });
  $('#clear_all_map_status').click(function(e) {
    setStorage('crx_ixakaizou_map_status', false, true);
    alert('Done.');
  });
  $('#clear_enemyCheckR').click(function(e) {
    setStorage( 'crx_enemyCheckR', false, true);
    alert('Done.');
  });
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
  $('#clear_all_area_map').click(function(e) {
    if (confirm('表示設定と記録した同盟データをすべて消去してよろしいですか？')) {
      setStorage('crx_areamaptoride', false, true);
      setStorage('crx_areamapcountry', false, true);
      setStorage('crx_alliesObj', false, true);
    }
  });
  $('#clear_map_reg').click(function(e) {
    if (confirm('記録した座標をすべて消去してよろしいですか？')) {
      var map_list = {};
      setStorage( "crx_map_list", map_list, true);
    }
  });
  $('#clear_grp_reg').click(function(e) {
    if (confirm('記録したグループをすべて消去してよろしいですか？')) {
      var tmp_list = {};
      setStorage( "crx_ixamoko_group_set", tmp_list, true);
    }
  });
  $('#clear_facility_reg').click(function(e) {
    if (confirm('記録した施設をすべて消去してよろしいですか？')) {
      var facility_list = {};
      setStorage( "crx_facility_list", facility_list, true);
    }
  });
  
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
  //敵襲音再生
  $('#raid_sound_src')
  .after('<a><audio id="reid_sound_test"></audio>&#9654;</a>')
  .next('a').css({marginLeft:'1em', padding:'0 0.4em', border:'solid 1px', borderRadius:'4px', color:'gray', cursor:'pointer'})
  .hover(function(e){$(this).css({color:'black'});},function(e){$(this).css({color:'gray'});})
  .click(function(e){$('#reid_sound_test').attr('src',$('#raid_sound_src').val()?$('#raid_sound_src').val():SOUND.raid_sound).get(0).play()});
  //設定を変更する
  $('#ixamoko_dialog_main').on( "change", saveSetting);



  //////////////////
  // function定義 //
  //////////////////


  // moko設定をセーブ
  function saveSetting () {
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
    setStorage( 'crx_ixa_moko_options', options);
    return false;
  }


  // storage.sync.setの部分
  function setStorage (  key, options, toggle) {
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


  // moko設定をロード
  function setSetting ( store) {
    //console.log( store);
    var options;
    if ( !store[world] || !( options = JSON.parse( store[world]).crx_ixa_moko_options)) {
      saveSetting();
      return;
    }
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