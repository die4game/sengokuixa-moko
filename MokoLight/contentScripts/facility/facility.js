var world = location.host.split( '.')[0] + 'ワールド';
chrome.storage.local.get( world, function ( store) {
  var season = store[ world]? ( store[ world].season? store[ world].season: '6'): '6',
    checkedSoldier = store[ world]? ( store[ world].checkedSoldier? store[ world].checkedSoldier: {}): {};
  if ( !store[ world])
    store[ world] = { checkedSoldier: checkedSoldier = {}};
  else if ( !store[ world].checkedSoldier)
    store[ world].checkedSoldier = checkedSoldier = {};
  else
    checkedSoldier = store[ world].checkedSoldier;
  $( function () {
    var fname = $( 'DIV.ig_tilesection_detailarea > H3:eq( 0) > A').text(),
      wood, stone, iron, rice, rate, key,
      soldiertype = season === '5'? {
          足軽: [9, 14, 5, 5],
          長槍足軽: [14, 20, 7, 8],
          武士: [18, 27, 9, 11],
          弓足軽: [14, 9, 5, 5],
          長弓兵: [20, 14, 8, 7],
          弓騎馬: [27, 18, 11, 9],
          騎馬兵: [5, 5, 9, 14],
          精鋭騎馬: [7, 8, 14, 20],
          赤備え: [9, 11, 18, 27],
          鉄砲足軽: [72, 67, 90, 75],
          騎馬鉄砲: [67, 90, 72, 75],
          破城鎚: [14, 7, 11, 9],
          攻城櫓: [22, 16, 11, 14],
          大筒兵: [69, 81, 108, 45]
        }: {
          足軽: [7, 9, 5, 5],
          長槍足軽: [12, 17, 7, 8],
          武士: [18, 25, 9, 11],
          弓足軽: [9, 7, 5, 5],
          長弓兵: [16, 11, 8, 7],
          弓騎馬: [25, 18, 11, 9],
          騎馬兵: [5, 5, 7, 9],
          精鋭騎馬: [7, 8, 11, 16],
          赤備え: [9, 11, 18, 25],
          鉄砲足軽: [72, 67, 90, 75],
          騎馬鉄砲: [67, 90, 72, 75],
          焙烙火矢: ( season === '6'? [90, 72, 67, 75]: [41, 41, 36, 45]),
          破城鎚: [14, 7, 10, 9],
          攻城櫓: [21, 15, 11, 14],
          大筒兵: [68, 81, 108, 45]
        };

    if ( fname == '厩舎' || fname == '足軽兵舎' || fname == '弓兵舎' || fname == '兵器鍛冶') {
      wood = parseInt( $( '#wood').text(), 10);
      stone = parseInt( $( '#stone').text(), 10);
      iron = parseInt( $( '#iron').text(), 10);
      rice = parseInt( $( '#rice').text(), 10);

      //上位兵を上段に表示
      $( function () {
        var line = [],  count = 0,
          $targetLoop = $( 'DIV.ig_tilesection_mid:eq( 1) > DIV.ig_tilesection_innermid');
        if ( $targetLoop.get().length > 0) {
          $targetLoop.each( function() {
            line[count++] = $( this);
          });

          $( 'DIV.ig_tilesection_mid:eq( 1) > DIV.ig_tilesection_innertop').each( function() {
            $( this).after( line[--count]);
          });
        } else {
          $( 'DIV.ig_tilesection_mid:eq( 1) > DIV.ig_tilesection_innermid2').each( function() {
            line[count++] = $( this);
          });

          $( 'DIV.ig_tilesection_mid:eq( 1) > DIV.ig_tilesection_innertop2').each( function() {
            $( this).after( line[--count]);
          });
        }
      });

      $( function() {
        $( 'table.paneltable.table_tile').find( 'label').next( 'span').css( 'margin', '0 2px');
        $( 'form[name="createUnitForm"]').find( 'span:eq( 0)').css( 'white-space', 'nowrap');
          $( 'input[id^="unit_value"]').each( function() {
            $( '<select class="set_num" style="margin-right: 5px;">' +
              '<option value="" selected>兵数選択</option>' +
              '<option value="100">100</option>' +
              '<option value="300">300</option>' +
              '<option value="500">500</option>' +
              '<option value="1000">1000</option>' +
              '<option value="2000">2000</option>' +
              '<option value="3000">3000</option>' +
              '<option value="4000">4000</option>' +
              '<option value="5000">5000</option>' +
              '<option value="6000">6000</option>' +
            '</select>'
          ).insertBefore( $( this).closest( 'span').find( 'input[name="send"]') );
          $( 'select.set_num').change( function() {
            $( this).closest( 'span').find( 'input[id^="unit_value"]').val( $( this).val() );
          });
        });
      });

      //最大作成可能兵数リンク設置、デフォルトの訓練数、デフォルトの兵種のみを表示
      $( function () {
        $( 'DIV.ig_tilesection_detailarea > H3').each( function() {
          var soltype = $( this).text().match( /\[([^\]]+)\]/)[1],
            $parent, maxsol, tmp;
          //デフォルトの訓練数をセット
          if ( soltype !== fname) { //操作無し
            $parent = $( this).parent();
            if ( store[ world].enableSoldier && !store[ world].enableSoldier[ soltype]) {
              $parent.parent().hide().parent().append(
                $( '<button>'+soltype+'</button>')
                .on( 'click', function (e) {
                  $parent.parent().toggle();
                })
              );
              return true;
            }
            maxsol = 150000;
            tmp = [ wood  / soldiertype[soltype][0],
                    stone / soldiertype[soltype][1],
                    iron  / soldiertype[soltype][2],
                    rice  / soldiertype[soltype][3]
                  ];
            if ( tmp[0] < maxsol)
              maxsol = Math.floor( tmp[0]);
            if ( tmp[1] < maxsol)
              maxsol = Math.floor( tmp[1]);
            if ( tmp[2] < maxsol)
              maxsol = Math.floor( tmp[2]);
            if ( tmp[3] < maxsol)
              maxsol = Math.floor( tmp[3]);
            if ( maxsol >= 100) {
              if ( 2000 > maxsol) {
                $parent.find( 'input[id^="unit_value"]').val( '' + maxsol);
              } else {
                $parent.find( 'input[id^="unit_value"]').val( 2000);
              }
            }
          }
        });
      });
    //取引後最大作成兵数表示
    } else if ( fname == '市') {
      wood = parseInt( $( '#wood').text(), 10);
      stone = parseInt( $( '#stone').text(), 10);
      iron = parseInt( $( '#iron').text(), 10);
      rice = parseInt( $( '#rice').text(), 10);
      rate = parseInt( $( 'DIV.ig_tilesection_detailarea IMG[alt="取引相場"]').parent().next().find( 'SPAN').text().substring( 0, 2), 10) / 100;
      $( function () {
        var top = $( 'div.ig_decksection_top'),
            mid = $( 'div.ig_tilesection_mid:eq( 0)'),
            bottom = $( 'div.ig_tilesection_bottom:eq( 0)'),
            newtop = $( 'div.ig_tilesection_bottom:eq( 1)');
        newtop.after( top);
        top.after( mid);
        mid.after( bottom);
      });
      $( function () {
        var table1 = '<TABLE style="background-color:#F3F2DE;" class="common_table1 center" width="100%">' +
          '<TR><TH>複合</TH><TH>比</TH><TH>兵士</TH><TH>不足</TH><TH>過剰</TH><TH>作成可能</TH></TR>',
          table2 = $(
            '<table class="common_table1 center">' +
              '<tr><th></th><th>所領:ID</th><th>座標:x</th><th>座標:y</th><th>兵種</th><th>兵数</th><th>分割数</th><th></th><th></th></tr>' +
              '<tr><td><button>登録</button></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td>' +
                '<td><select></select></td><td><input type="text"></td><td><input type="text"></td><td><button>兵退避</button></td><td></td></tr>' +
            '</table>'),
          tmp2,
          solId = {
            321: '足軽',
            322: '長槍足軽',
            323: '武士',
            325: '弓足軽',
            326: '長弓兵',
            327: '弓騎馬',
            329: '騎馬兵',
            330: '精鋭騎馬',
            331: '赤備え',
            333: '破城槌',
            334: '攻城櫓',
            335: '大筒兵',
            345: '焙烙火矢',
            336: '鉄砲足軽',
            337: '騎馬鉄砲'
          },
          renpeiSet = store[ world].renpeiSet? store[ world].renpeiSet: ( store[ world].renpeiSet = []);
        for ( key in soldiertype) {
          var moko = maxsoldier( wood, stone, iron, rice, soldiertype[key][0], soldiertype[key][1], soldiertype[key][2], soldiertype[key][3], rate);
          if ( store[ world].enableSoldier && !store[ world].enableSoldier[ key])
            continue;
          table1 += '<TR><TD><input type="checkbox" id="' + key + '"></TD>' +
            '<TD><select name="ratio">' +
              '<option value="1" selected>1</option>' +
              '<option value="2">2</option>' +
              '<option value="3">3</option>' +
              '<option value="4">4</option>' +
              '<option value="5">5</option>' +
              '<option value="6">6</option>' +
              '<option value="7">7</option>' +
              '<option value="8">8</option>' +
              '<option value="9">9</option>' +
              '<option value="10">10</option>' +
            '</select></TD><TD>' + key + '</TD>';
          if ( moko.maxsoldier < 100) {
            table1 += '<TD>-</TD><TD>-</TD><TD>100未満</TD></TR>';
          } else {
            table1 += '<TD>' + moko.shortage + '</TD><TD>' + moko.excess + '</TD><TD>' + moko.maxsoldier + '</TD></TR>';
          }
        }
        table1 += '</br><TR id="maxsol_total"><TH colspan=3><div id="merge">-</div></TH><TD id="shortage">-</TD><TD id="excess">-</TD><TD id="maxsoldier">-</TD></TR>';
        table1 += '</TABLE>';
        $( 'div.ig_tilesection_btnarea').after( ( table1 = $( table1)), table2);

        table2.find( 'th').last().css( { width: '8em'});
        table2.find( 'input').css( { width: '4em'});
        table2.find( 'select').append(
          '<option value="321">足軽</option>' +
          '<option value="322">長槍足軽</option>' +
          '<option value="323">武士</option>' +
          '<option value="325">弓足軽</option>' +
          '<option value="326">長弓兵</option>' +
          '<option value="327">弓騎馬</option>' +
          '<option value="329">騎馬兵</option>' +
          '<option value="330">精鋭騎馬</option>' +
          '<option value="331">赤備え</option>' +
          '<option value="333">破城槌</option>' +
          '<option value="334">攻城櫓</option>' +
          '<option value="335">大筒兵</option>' +
          '<option value="345">焙烙火矢</option>' +
          '<option value="336">鉄砲足軽</option>' +
          '<option value="337">騎馬鉄砲</option>'
        );
        $.each( renpeiSet, function ( idx, data) {
          appendRenpeiSet( data);
        });

        // 登録
        table2.find( 'button:eq(0)').on( 'click', function ( e) {
          var data = [];
          e.preventDefault();
          table2.find( 'tr:eq(1)').find( 'td').each( function () {
            data.push( $( this).children().val());
          });
          data.shift();
          data.pop();
          appendRenpeiSet( data);
          renpeiSet.push( data);
          chrome.storage.local.set( store);
        });

        function appendRenpeiSet( data) {
          var tr = $( '<tr><td><button>削除</button></td><td>'+data[0]+'</td><td>'+data[1]+'</td><td>'+data[2]+
            '</td><td>'+solId[ data[3]]+'</td><td>'+data[4]+'</td><td>'+data[5]+'</td><td><button>練兵</button></td><td></td></tr>');
          table2.append( tr);
          tr.on( 'click', 'button:eq(0)', function ( e) {
            e.preventDefault();
            renpeiSet.splice( tr.prevAll().length - 2, 1);
            chrome.storage.local.set( store);
            tr.remove();
          });
          tr.on( 'click', 'button:eq(1)', function ( e) {
            var result = $( this).parent().next();
            e.preventDefault();
            result.text( '');
            $.get( '/village_change.php?village_id='+data[0])
            .done( function ( htmlData) {
              $.post( '/facility/facility.php', 'btnSend=true&create_count='+data[5]+'&count='+data[4]+'&unit_id='+data[3]+'&y='+data[2]+'&x='+data[1])
              .done( function ( html) {
                var $html = $( $.parseHTML( html));
                  pred = $html.find( 'p.red');
                if ( pred.length < 1) {
                  if ( $html.find( 'h3>a:eq(0)').text().match( /足軽兵舎|弓兵舎|厩舎|兵器鍛冶/)) {
                    result.text( '送信(要確認)');
                  } else
                    result.text( '兵舎以外のページにアクセスしました。');
                } else
                  result.text( pred.text());
              }).fail( function ( html) { result.text( 'ajax error'); console.log(html)});
            });
          });
        }

        // 兵退避
        table2.find( 'button:eq(1)').on( 'click', function ( e) {
          var btn = this;
          e.preventDefault();
          btn.disabled = true;
          $.post(
            '/facility/set_unit_list.php',
            { show_deck_card_count: '',
              show_num: '',
              select_card_group: '',
              p: '',
              now_unit_type: 'all_unit',
              now_group_type: 0,
              edit_unit_type: 'not_unit',
              edit_unit_count: 0,
              btnlumpsum: true }
          ).then( function () {
            return $.post(
              '/facility/set_unit_list.php?show_num=100&select_card_group=0',
              { btn_change_flg: '1',
                select_card_group: '0',
                select_assign_no: '0',
                sort_order: [ '12', '6', '3'],
                sort_order_type: [ '1', '0', '0'],
                show_num: '100' }
            );
          }).done( function ( html) {
            var $html = $( $.parseHTML( html)),
              $unit = $html.find( '#unit_id_select_0 option'),
              $lead_unit = $html.find( 'span[id^="lead_unit"]'),
              $id = $html.find( 'div[id^="unit_group_type_"]')
              unit = [], postData = [];
            //console.log($unit, $lead_unit);
            $unit.each( function ( idx, elm) {
              var key = $( elm).val(), cnt = $( elm).text().replace( /[^\d]/g, "");
              //console.log( key, cnt);
              if ( key)
                unit.push( [ key, parseInt( cnt, 10)]);
            });
            $lead_unit.each( function ( idx, elm) {
              unit.sort( function ( a, b) { return b[1] - a[1]});
              if ( unit[0][1] === 0) return false;
              postData.push( {
                card_id: $id.eq( idx).prop( 'id').replace( /[^\d]/g, ""),
                unit_type: unit[0][0],
                unit_count: unit[0][1] < elm.innerText? unit[0][1]: elm.innerText
              });
              unit[0][1] -= postData[idx].unit_count;
            });
            //console.log( postData);
            $.each( postData, function ( idx, data) {
              $.post( '/facility/set_unit_list_if.php', data);
              if ( postData.length === idx + 1)
                btn.disabled = false;
            });
          });
        });

        //チェック兵種をストレージから取得、複合の最大兵数を表示
        for ( key in soldiertype) {
          tmp2 = checkedSoldier[ key];
          if ( tmp2) {
            $( 'input#' + key).prop( 'checked', tmp2[0]).parent().next().find( 'select').val( tmp2[1]);
          }
        }
        combo_soldier();
        $( table1).on( 'change', 'td', combo_soldier);

        //ホバーで色変、クリックで取引資源と数をセット
        //不足
        $( 'SPAN.ixamoko_short').hover( function() {
          $( this).css( { 'cursor': 'default', 'background-color': '#F9DEA1', 'text-decoration': 'underline'});
        }, function() {
          $( this).css( { 'background-color': '', 'text-decoration': ''});
        }).on( 'click', function ( e) {
          $( '#select2').val( $( this).attr( 'type')).trigger( 'change');
          var tc0 = $( '#tc').val() * 1;
          var tc1 = $( this).attr( 'value') * 1;
          //console.log( tc0,tc1);
          if ( !tc0 || tc0 > tc1) {
            tc1 = Math.floor( tc1/100) * 100;
            $( '#tc').val( tc1);
          }
        });
        //過剰
        $( 'SPAN.ixamoko_excess').hover( function() {
          $( this).css( {'cursor': 'default', 'background-color': '#F9DEA1', 'text-decoration': 'underline'});
        }, function() {
          $( this).css( {'background-color': '', 'text-decoration': ''});
        }).on( 'click', function ( e) {
          $( '#select').val( $( this).attr( 'type')).trigger( 'change');
          var tc0 = $( '#tc').val() * 1;
          var tc1 = $( this).attr( 'value') * 1;
          //console.log( tc0,tc1);
          if ( !tc0 || tc0 > tc1) {
            tc1 = Math.floor( tc1/100) * 100;
            $( '#tc').val( tc1);
          }
        });

        //取引資源選択をラジオボタン化
        ( function () {
          var $select = [$( '#select').hide(), $( '#select2').hide()],
              i;
          function linkage1 ( e) {
            $( this).nextAll( 'label').find( '[value="'+$( this).val()+'"]').prop( 'checked', true);
          }
          function linkage2 ( e) {
            $( this).parent().prevAll( 'select').val( $( this).val());
          }
          for ( i=0;i<2;i++) {
            $select[i].parent().append(
              '<label><input type="radio" name="selectstuff'+i+'" value="101">木</label>'+
              '<label><input type="radio" name="selectstuff'+i+'" value="102">綿</label>'+
              '<label><input type="radio" name="selectstuff'+i+'" value="103">鉄</label>'+
              '<label><input type="radio" name="selectstuff'+i+'" value="104">糧</label>'
            ).css( 'whiteSpace', 'nowrap').children().css( {'margin-left':'1em','padding-right':'1em'}).children().change( linkage2);
          }
          for ( i=0;i<2;i++) {
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
        checker = 0,
        $elm;
      for ( var key in soldiertype) {
        $elm = $( 'input#' + key);
        checkedSoldier[ key] = [ $elm.prop( 'checked'), $elm.parent().next().find( 'select').val()];
        chrome.storage.local.set( store);
        if ( checkedSoldier[ key][0]) {
          checker++;
          tmp2 += '<div>' + key + '</div>';
          wood2 += soldiertype[ key][ 0] * checkedSoldier[ key][ 1];
          stone2 += soldiertype[ key][ 1] * checkedSoldier[ key][ 1];
          iron2 += soldiertype[ key][ 2] * checkedSoldier[ key][ 1];
          rice2 += soldiertype[ key][ 3] * checkedSoldier[ key][ 1];
        }
      }
      var moko = maxsoldier( wood, stone, iron, rice, wood2, stone2, iron2, rice2, rate);

      if ( checker === 0) {
        tmp2 = '-';
        moko.shortage = '-';
        moko.excess = '-';
        moko.maxsoldier = '-';
      }

      $( 'div#merge').replaceWith( '<div id="merge">' + tmp2 + '</div>');
      $( 'td#shortage').replaceWith( '<TD id="shortage">' + moko.shortage + '</TD>');
      $( 'td#excess').replaceWith( '<TD id="excess">' + moko.excess + '</TD>');
      $( 'td#maxsoldier').replaceWith( '<TD id="maxsoldier">' + moko.maxsoldier + ' (×比)</TD');

      $( '#shortage > span.ixamoko_short').hover( function() {
        $( this).css( {'cursor': 'default', 'background-color': '#F9DEA1', 'text-decoration': 'underline'});
      }, function() {
        $( this).css( {'background-color': '', 'text-decoration': ''});
      }).click( function( e) {
        $( '#select2').val( $( this).attr( 'type'));
        var tc0 = $( '#tc').val() * 1;
        var tc1 = $( this).attr( 'value') * 1;
        //console.log( tc0,tc1);
        if ( !tc0 || tc0 > tc1) {
          tc1 = Math.floor( tc1/100) * 100;
          $( '#tc').val( tc1);
        }
      });
      $( '#excess > span.ixamoko_excess').hover( function() {
        $( this).css( {'cursor': 'default', 'background-color': '#F9DEA1', 'text-decoration': 'underline'});
      }, function() {
        $( this).css( {'background-color': '', 'text-decoration': ''});
      }).click( function( e) {
        $( '#select').val( $( this).attr( 'type'));
        var tc0 = $( '#tc').val() * 1;
        var tc1 = $( this).attr( 'value') * 1;
        //console.log( tc0,tc1);
        if ( !tc0 || tc0 > tc1) {
          tc1 = Math.floor( tc1/100) * 100;
          $( '#tc').val( tc1);
        }
      });
    }

    function maxsoldier( a, b, c, d, aa, bb, cc, dd, rate) {
      var cmax = 1500000;
      if ( ( a / aa) < cmax)
        cmax = Math.floor( a / aa);
      if ( ( b / bb) < cmax)
        cmax = Math.floor( b / bb);
      if ( ( c / cc) < cmax)
        cmax = Math.floor( c / cc);
      if ( ( d / dd) < cmax)
        cmax = Math.floor( d / dd);
      var i;
      for ( i = ( cmax + 1); i < 15000; ++i) {
        var shortage = 0;
        var excess = 0;
        if ( ( i * aa) > a) {
          shortage += i * aa - a;
        } else {
          excess += a - i * aa;
        }
        if ( ( i * bb) > b) {
          shortage += i * bb - b;
        } else {
          excess += b - i * bb;
        }
        if ( ( i * cc) > c) {
          shortage += i * cc - c;
        } else {
          excess += c - i * cc;
        }
        if ( ( i * dd) > d) {
          shortage += i * dd - d;
        } else {
          excess += d - i * dd;
        }
        if ( excess * rate < shortage)
          break;
      }
      --i;
      var tmp1 = '[';
      var tmp1c = 0;
      var tmp1t = null;
      var tmp2 = '[';
      var tmpx;
      if ( ( i * aa) < a) {
        tmpx = ( a - i * aa);
        tmp2 += ' <SPAN class="ixamoko_excess" type="101" value="' + tmpx + '">木: ' + tmpx + '</SPAN>';
      } else {
        tmpx = Math.ceil( ( i * aa - a) / rate);
        tmp1 += ' <SPAN class="ixamoko_short" type="101" value="' + tmpx + '">木: ' + tmpx + '</SPAN>';
        tmp1c++;
        tmp1t = 101;
      }
      if ( ( i * bb) < b) {
        tmpx = ( b - i * bb);
        tmp2 += ' <SPAN class="ixamoko_excess" type="102" value="' + tmpx + '">綿: ' + tmpx + '</SPAN>';
      } else {
        tmpx = Math.ceil( ( i * bb - b) / rate);
        tmp1 += ' <SPAN class="ixamoko_short" type="102" value="' + tmpx + '">綿: ' + tmpx + '</SPAN>';
        tmp1c++;
        tmp1t = 102;
      }
      if ( ( i * cc) < c) {
        tmpx = ( c - i * cc);
        tmp2 += ' <SPAN class="ixamoko_excess" type="103" value="' + tmpx + '">鉄: ' + tmpx + '</SPAN>';
      } else {
        tmpx = Math.ceil( ( i * cc - c) / rate);
        tmp1 += ' <SPAN class="ixamoko_short" type="103" value="' + tmpx + '">鉄: ' + tmpx + '</SPAN>';
        tmp1c++;
        tmp1t = 103;
      }
      if ( ( i * dd) < d) {
        tmpx = ( d - i * dd);
        tmp2 += ' <SPAN class="ixamoko_excess" type="104" value="' + tmpx + '">糧: ' + tmpx + '</SPAN>';
      } else {
        tmpx = Math.ceil( ( i * dd - d) / rate);
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
});