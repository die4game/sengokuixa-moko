$( function () {
  var fname = $('DIV.ig_tilesection_detailarea > H3:eq(0) > A').text(),
    wood, stone, iron, rice, rate, key, soldiertype = {};
  soldiertype['足軽'] = [9, 14, 5, 5];
  soldiertype['長槍足軽'] = [14, 20, 7, 8];
  soldiertype['武士'] = [18, 27, 9, 11];
  soldiertype['弓足軽'] = [14, 9, 5, 5];
  soldiertype['長弓兵'] = [20, 14, 8, 7];
  soldiertype['弓騎馬'] = [27, 18, 11, 9];
  soldiertype['騎馬兵'] = [5, 5, 9, 14];
  soldiertype['精鋭騎馬'] = [7, 8, 14, 20];
  soldiertype['赤備え'] = [9, 11, 18, 27];
  soldiertype['鉄砲足軽'] = [72, 67, 90, 75];
  soldiertype['騎馬鉄砲'] = [67, 90, 72, 75];
  soldiertype['焙烙火矢'] = [90, 72, 67, 75];
  soldiertype['破城鎚'] = [14, 7, 11, 9];
  soldiertype['攻城櫓'] = [22, 16, 11, 14];
  soldiertype['大筒兵'] = [69, 81, 108, 45];

  if ( fname == '市') {
    $( function () {
      var top = $('div.ig_decksection_top'),
          mid = $('div.ig_tilesection_mid:eq(0)'),
          bottom = $('div.ig_tilesection_bottom:eq(0)'),
          newtop = $('div.ig_tilesection_bottom:eq(1)');
      newtop.after(top);
      top.after(mid);
      mid.after(bottom);
    });
  }

  if ( fname == '厩舎' || fname == '足軽兵舎' || fname == '弓兵舎' || fname == '兵器鍛冶') {
    wood = parseInt( $( '#wood').text(), 10);
    stone = parseInt( $( '#stone').text(), 10);
    iron = parseInt( $( '#iron').text(), 10);
    rice = parseInt( $( '#rice').text(), 10);

    //上位兵を上段に表示
    $( function () {
      var line = [],  count = 0,
        $targetLoop = $('DIV.ig_tilesection_mid:eq(1) > DIV.ig_tilesection_innermid');
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
    });

    $(function() {
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
    $( function () {
      $('DIV.ig_tilesection_detailarea > H3').each(function() {
        var soltype = $(this).text().match(/\[([^\]]+)\]/)[1],
          $parent, maxsol;
        //console.log(soltype);
        //デフォルトの訓練数をセット
        if (soltype !== fname) { //操作無し
          $parent = $(this).parent();
          maxsol = 150000;
          if ((wood / soldiertype[soltype][0]) < maxsol)
            maxsol = Math.floor(wood / soldiertype[soltype][0]);
          if ((stone / soldiertype[soltype][1]) < maxsol)
            maxsol = Math.floor(stone / soldiertype[soltype][1]);
          if ((iron / soldiertype[soltype][2]) < maxsol)
            maxsol = Math.floor(iron / soldiertype[soltype][2]);
          if ((rice / soldiertype[soltype][3]) < maxsol)
            maxsol = Math.floor(rice / soldiertype[soltype][3]);
          if (maxsol >= 100) {
            if ( 2000 > maxsol) {
              $parent.find('input[id^="unit_value"]').val('' + maxsol);
            } else {
              $parent.find('input[id^="unit_value"]').val( 2000);
            }
          }
        }
      });
    });
  //取引後最大作成兵数表示
  } else if ( fname == '市') {
    $( function () {
      wood = parseInt( $( '#wood').text(), 10);
      stone = parseInt( $( '#stone').text(), 10);
      iron = parseInt( $( '#iron').text(), 10);
      rice = parseInt( $( '#rice').text(), 10);
      rate = parseInt($('DIV.ig_tilesection_detailarea IMG[alt="取引相場"]').parent().next().find('SPAN').text().substring(0, 2), 10) / 100;
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
          $('input#' + key).prop('checked', JSON.parse(localStorage.getItem('crx_checked_soldier' + key)));
      }
      combo_soldier();
      $('table.common_table1').on( 'click', 'input', combo_soldier);

      //ホバーで色変、クリックで取引資源と数をセット
      //不足
      $('SPAN.ixamoko_short').hover(function() {
        $(this).css({'cursor': 'default', 'background-color': '#F9DEA1', 'text-decoration': 'underline'});
      }, function() {
        $(this).css({'background-color': '', 'text-decoration': ''});
      }).on( 'click', function ( e) {
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
      }).on( 'click', function (e) {
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
      (function () {
        var $select = [$('#select').hide(), $('#select2').hide()],
            i;
        function linkage1 (e) {
          $(this).nextAll('label').find('[value="'+$(this).val()+'"]').prop('checked', true);
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
          ).css( 'whiteSpace', 'nowrap').children().css({'margin-left':'1em','padding-right':'1em'}).children().change(linkage2);
        }
        for (i=0;i<2;i++) {
          $select[i].on( 'change', linkage1);
        }
      })();
    });
  }

  //複合の最大兵数表示
  function combo_soldier() {
    var tmp2 = '',
      wood2 = 0,
      stone2 = 0,
      iron2 = 0,
      rice2 = 0,
      checker = 0;
    for (var key in soldiertype) {
      localStorage.setItem('crx_checked_soldier' + key, JSON.stringify( $( 'input#' + key).prop( 'checked')? true: false));
      if ($('input#' + key).prop('checked')) {
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
});