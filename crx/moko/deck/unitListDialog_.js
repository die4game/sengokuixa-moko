( function () {
  var world, tabId, options = {}, groups, group_setting, groups_img, IMAGES = CRXMOKODATA.images;

  // カレントタブ取得
  chrome.tabs.getCurrent( function ( tab) {
    arg = tab.url.split( '?')[1].split( '&');
    world = arg[0], tabId = arg[1];
    console.log( world, tabId, tab);

    // options、グループ設定の取得
    chrome.storage.sync.get( world, function ( store) {
      var storeWorld = JSON.parse( store[world]);
      console.log( storeWorld);
      options = storeWorld.crx_ixa_moko_options;
      group_setting = storeWorld.crx_ixamoko_group_set;
      groups = storeWorld.crx_ixamoko_init_groups;
      chrome.storage.local.get( world, function ( store) {
        var storeWorld = JSON.parse( store[world]);
        console.log( storeWorld);
        groups_img = storeWorld.crx_ixamoko_init_groups_img;
        $(unitListDialog);
      });
    });
  });
  tableSorter_($);
  tablesorter_pager_plugin($);

  function unitListDialog () {

    // imgのロード
    $( '#unitlistdialog>div.Loading').append( '<img src="' + IMAGES.unitListDialog.Loading + '">')
    .next().children().first().before(
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

    // 列の表示
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
    });

    // デッキの表示
    $('#v_head').change( function () {
      $(this).find('span[class^="ano"]').hide();
      if ($(this).find('option:selected').attr('class')){
        $(this).find('span.' + $(this).find('option:selected').attr('class')).show();
      }
    });

    // デッキセットボタン
    $('#v_head').on('click', 'button.set_unitlist', function() {
      unit_set($(this).parent().parent());
    });

    // 総攻防力
    $('#energy').on('click', function() {
      cal_energy($(this).next());
    });

    // 武将リスト取得
    $( function () {
      $('div.pager').hide();
      $('#tb_unit').css({'opacity': '0.3'});
      $('div.Loading').show();
      unitListLoad(1, 0, group_setting, groups, groups_img);
    });

  }
})();