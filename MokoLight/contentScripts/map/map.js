var key = location.host.split('.')[0] + 'ワールド';
chrome.storage.local.get( key, function ( store) {
  var typesOfSoldiers = {
    '農民': [ '他', 5],
    '抜け忍': [ '弓', 12],
    '野盗': [ '馬', 12],
    '浪人': [ '槍', 12],
    '雑賀衆': [ '他', 17],
    '海賊衆': [ '弓', 17],
    '母衣衆': [ '馬', 16],
    '国人衆': [ '槍', 17],
    '赤備え': [ '馬', 20],
    '武士': [ '槍', 18],
    '弓騎馬': [ '弓', 19],
    '鬼': [ '他', 88],
    '天狗': [ '他', 112]
  },
  npcData = {
    5: [ // npcData[章][土地種][兵][分類、兵種、数]
      [
        [ '他', '農民', 25],
        [ '弓', '抜け忍', 5]
      ],
      [
        [ '他', '農民', 25],
        [ '馬', '野盗', 5]
      ],
      [
        [ '他', '農民', 20],
        [ '槍', '浪人', 5],
        [ '弓', '抜け忍', 5],
        [ '馬', '野盗', 15]
      ],
      [
        [ '他', '農民', 20],
        [ '槍', '浪人', 10],
        [ '弓', '抜け忍', 10],
        [ '馬', '野盗', 10]
      ],
      [
        [ '他', '農民', 45],
        [ '馬', '野盗', 85]
      ],
      [
        [ '他', '農民', 45],
        [ '槍', '浪人', 85]
      ],
      [
        [ '他', '農民', 45],
        [ '弓', '抜け忍', 85]
      ],
      [
        [ '他', '雑賀衆', 125],
        [ '他', '農民', 375]
      ],
      [
        [ '弓', '海賊衆', 100],
        [ '他', '農民', 350],
        [ '弓', '抜け忍', 50]
      ],
      [
        [ '槍', '国人衆', 110],
        [ '他', '農民', 355],
        [ '槍', '浪人', 75]
      ],
      [
        [ '馬', '母衣衆', 120],
        [ '他', '農民', 360],
        [ '馬', '野盗', 25]
      ],
      [
        [ '槍', '国人衆', 145],
        [ '馬', '母衣衆', 625],
        [ '他', '農民', 240]
      ],
      [
        [ '他', '雑賀衆', 125],
        [ '槍', '浪人', 610],
        [ '弓', '抜け忍', 305]
      ],
      [
        [ '槍', '国人衆', 560],
        [ '弓', '海賊衆', 95],
        [ '他', '農民', 280],
        [ '槍', '浪人', 235]
      ],
      [
        [ '他', '雑賀衆', 375],
        [ '槍', '浪人', 190],
        [ '弓', '抜け忍', 190],
        [ '馬', '野盗', 190]
      ],
      [
        [ '弓', '海賊衆', 590],
        [ '馬', '母衣衆', 100],
        [ '他', '農民', 295]
      ],
      [
        [ '槍', '国人衆', 170],
        [ '他', '農民', 170],
        [ '槍', '浪人', 280],
        [ '馬', '野盗', 560]
      ],
      [
        [ '槍', '国人衆', 1085],
        [ '槍', '浪人', 1085],
        [ '弓', '抜け忍', 1085]
      ],
      [
        [ '槍', '国人衆', 1660],
        [ '他', '雑賀衆', 210],
        [ '槍', '浪人', 1245]
      ],
      [
        [ '槍', '武士', 825],
        [ '槍', '国人衆', 515],
        [ '弓', '抜け忍', 1545]
      ],
      [
        [ '馬', '母衣衆', 1455],
        [ '他', '雑賀衆', 100],
        [ '馬', '野盗', 1260]
      ],
      [
        [ '弓', '海賊衆', 1320],
        [ '他', '農民', 790],
        [ '馬', '野盗', 1145]
      ],
      [
        [ '弓', '海賊衆', 1440],
        [ '他', '雑賀衆', 90],
        [ '弓', '抜け忍', 1170]
      ],
      [
        [ '馬', '赤備え', 1200],
        [ '馬', '野盗', 7175]
      ],
      [
        [ '他', '農民', 1125],
        [ '馬', '野盗', 7875],
        [ '他', '鬼', 115]
      ],
      [
        [ '槍', '武士', 1225],
        [ '槍', '浪人', 7335]
      ],
      [
        [ '他', '農民', 465],
        [ '槍', '浪人', 1860],
        [ '弓', '抜け忍', 1860],
        [ '馬', '野盗', 1860],
        [ '他', '鬼', 465]
      ],
      [
        [ '弓', '弓騎馬', 1295],
        [ '弓', '抜け忍', 6475],
        [ '馬', '野盗', 650]
      ],
      [
        [ '他', '農民', 520],
        [ '弓', '抜け忍', 5165],
        [ '他', '鬼', 520]
      ],
      [
        [ '槍', '国人衆', 1750],
        [ '馬', '母衣衆', 875],
        [ '他', '雑賀衆', 1310],
        [ '槍', '浪人', 5240],
        [ '他', '鬼', 90],
        [ '他', '天狗', 5]
      ],
      [
        [ '槍', '国人衆', 370],
        [ '弓', '海賊衆', 1105],
        [ '他', '雑賀衆', 370],
        [ '弓', '抜け忍', 2940],
        [ '他', '鬼', 735],
        [ '他', '天狗', 5]
      ],
      [
        [ '馬', '母衣衆', 1575],
        [ '馬', '野盗', 2950],
        [ '他', '鬼', 790],
        [ '他', '天狗', 5]
      ],
      [
        [ '他', '鬼', 905],
        [ '他', '天狗', 455]
      ]
    ],
    6: [
      //	☆1
      [
        [ '他', '農民', 25],
        [ '弓', '抜け忍', 5]
      ],
      [
        [ '他', '農民', 25],
        [ '馬', '野盗', 5]
      ],
      //	☆2
      [
        [ '他', '農民', 20],
        [ '槍', '浪人', 5],
        [ '弓', '抜け忍', 5],
        [ '馬', '野盗', 15]
      ],
      [
        [ '他', '農民', 20],
        [ '槍', '浪人', 10],
        [ '弓', '抜け忍', 10],
        [ '馬', '野盗', 10]
      ],
      //	☆3
      [
        [ '他', '農民', 45],
        [ '馬', '野盗', 85]
      ],
      [
        [ '他', '農民', 45],
        [ '槍', '浪人', 85]
      ],
      [
        [ '他', '農民', 45],
        [ '弓', '抜け忍', 85]
      ],
      //	☆4
      [
        [ '他', '雑賀衆', 125],
        [ '他', '農民', 375]
      ],
      [
        [ '弓', '海賊衆', 100],
        [ '他', '農民', 350],
        [ '弓', '抜け忍', 50]
      ],
      [
        [ '槍', '国人衆', 110],
        [ '他', '農民', 355],
        [ '槍', '浪人', 75]
      ],
      [
        [ '馬', '母衣衆', 120],
        [ '他', '農民', 360],
        [ '馬', '野盗', 25]
      ],
      //	☆5
      [
        [ '槍', '国人衆', 145],
        [ '馬', '母衣衆', 625],
        [ '他', '農民', 240]
      ],
      [
        [ '他', '雑賀衆', 125],
        [ '槍', '浪人', 610],
        [ '弓', '抜け忍', 305]
      ],
      [
        [ '槍', '国人衆', 560],
        [ '弓', '海賊衆', 95],
        [ '他', '農民', 280],
        [ '槍', '浪人', 235]
      ],
      [
        [ '他', '雑賀衆', 375],
        [ '槍', '浪人', 190],
        [ '弓', '抜け忍', 190],
        [ '馬', '野盗', 190]
      ],
      [
        [ '弓', '海賊衆', 590],
        [ '馬', '母衣衆', 100],
        [ '他', '農民', 295]
      ],
      [
        [ '槍', '国人衆', 170],
        [ '他', '農民', 170],
        [ '槍', '浪人', 280],
        [ '馬', '野盗', 560]
      ],
      //	☆6
      [
        [ '槍', '国人衆', 1085],
        [ '槍', '浪人', 1085],
        [ '弓', '抜け忍', 1085]
      ],
      [
        [ '槍', '国人衆', 1660],
        [ '他', '雑賀衆', 210],
        [ '槍', '浪人', 1245]
      ],
      [
        [ '槍', '武士', 825],
        [ '槍', '国人衆', 515],
        [ '弓', '抜け忍', 1545]
      ],
      [
        [ '馬', '母衣衆', 1455],
        [ '他', '雑賀衆', 100],
        [ '馬', '野盗', 1260]
      ],
      [
        [ '弓', '海賊衆', 1320],
        [ '他', '農民', 790],
        [ '馬', '野盗', 1145]
      ],
      [
        [ '弓', '海賊衆', 1440],
        [ '他', '雑賀衆', 90],
        [ '弓', '抜け忍', 1170]
      ],
      //	☆7
      [
        [ '馬', '赤備え', 1200],
        [ '馬', '野盗', 7175]
      ],
      [
        [ '他', '農民', 1125],
        [ '馬', '野盗', 7875],
        [ '他', '鬼', 115]
      ],
      [
        [ '槍', '武士', 1225],
        [ '槍', '浪人', 7335]
      ],
      [
        [ '他', '農民', 465],
        [ '槍', '浪人', 1860],
        [ '弓', '抜け忍', 1860],
        [ '馬', '野盗', 1860],
        [ '他', '鬼', 465]
      ],
      [
        [ '弓', '弓騎馬', 1295],
        [ '弓', '抜け忍', 6475],
        [ '馬', '野盗', 650]
      ],
      [
        [ '他', '農民', 520],
        [ '弓', '抜け忍', 5165],
        [ '他', '鬼', 520]
      ],
      //	☆8
      [
        [ '槍', '国人衆', 1750],
        [ '馬', '母衣衆', 875],
        [ '他', '雑賀衆', 1310],
        [ '槍', '浪人', 5240],
        [ '他', '鬼', 90],
        [ '他', '天狗', 5]
      ],
      [
        [ '槍', '国人衆', 370],
        [ '弓', '海賊衆', 1105],
        [ '他', '雑賀衆', 370],
        [ '弓', '抜け忍', 2940],
        [ '他', '鬼', 735],
        [ '他', '天狗', 5]
      ],
      [
        [ '馬', '母衣衆', 1575],
        [ '馬', '野盗', 2950],
        [ '他', '鬼', 790],
        [ '他', '天狗', 5]
      ],
      [
        [ '他', '鬼', 905],
        [ '他', '天狗', 455]
      ]
    ]
  },
  periodCorrection = [
    [ 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ],
    [ 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1
    ],
    [ 1, 1, 1, 1, 1, 1, 1,
      1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1,
      1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2
    ],
    [ 1, 1, 1, 1, 1, 1, 1,
      1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2,
      1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3
    ],
    [ 1, 1, 1, 1, 1, 1, 1,
      1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3,
      1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4
    ],
    [ 1, 1, 1, 1, 1, 1, 1,
      1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4,
      1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4
    ],
    [ 1, 1, 1, 1, 1, 1, 1,
      1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4,
      1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4
    ]
  ],
  matchBonus = function ( types) {
    var typesJoin = types.join('');
    if ( types[0] === types[1] || types[0] === '他') {
      return 1;
    } else if ( typesJoin === '槍弓' || typesJoin === '弓馬' || typesJoin === '馬槍') {
      return 0.5;
    } else if ( typesJoin === '槍馬' || typesJoin === '弓槍' || typesJoin === '馬弓') {
      return 2;
    } else if ( typesJoin === '槍器' || typesJoin === '馬器') {
      return 0.8;
    } else if ( typesJoin === '弓器') {
      return 1.3;
    } else {
      return 1;
    }
  },
  dataCal = function ( npcDataIdx, chapter, period) {
    var sumDef = [ 0, 0, 0, 0];
    npcData[ chapter][ npcDataIdx].forEach( function ( elm, idx, arr) {
      var npcNum = Math.floor( elm[2] * periodCorrection[ period - 1][ npcDataIdx] * 0.2) * 5;
      sumDef[0] += typesOfSoldiers[ elm[1]][1] * npcNum * matchBonus( [ elm[0], '槍']);
      sumDef[1] += typesOfSoldiers[ elm[1]][1] * npcNum * matchBonus( [ elm[0], '弓']);
      sumDef[2] += typesOfSoldiers[ elm[1]][1] * npcNum * matchBonus( [ elm[0], '馬']);
      sumDef[3] += typesOfSoldiers[ elm[1]][1] * npcNum * matchBonus( [ elm[0], '器']);
    });
    sumDef.forEach( function ( elm, idx, arr) {
      arr[idx] = Math.ceil( arr[idx]);
    });
    return sumDef;
  },
  hoshis = [
    '★10000',
    '★01000',
    '★★00201',
    '★★11020',
    '★★★11101',
    '★★★11110',
    '★★★★11101',
    '★★★★12100',
    '★★★★11210',
    '★★★★21131',
    '★★★★★50201',
    '★★★★★32010',
    '★★★★★23010',
    '★★★★★10501',
    '★★★★★01520',
    '★★★★★04150',
    '★★★★★★22210',
    '★★★★★★43311',
    '★★★★★★45232',
    '★★★★★★25132',
    '★★★★★★32431',
    '★★★★★★11450',
    '★★★★★★★15152',
    '★★★★★★★22230',
    '★★★★★★★12630',
    '★★★★★★★910651',
    '★★★★★★★52222',
    '★★★★★★★33341',
    '★★★★★★★★72221',
    '★★★★★★★★27213',
    '★★★★★★★★22702',
    '★★★★★★★★33342'
  ],
  POTENTIAL_LIST = {
    '★10000': '<h6>★1 [平 10000]</h6><ul class="potential">',
    '★01000': '<h6>★1 [平 01000]</h6><ul class="potential">',
    '★★00201': '<h6>★2 [鉄 00201]</h6><ul class="potential">',
    '★★11020': '<h6>★2 [糧 11020]</h6><ul class="potential">',
    '★★★11101': '<h6>★3 [平 11101]</h6><ul class="potential">',
    '★★★11110': '<h6>★3 [平 11110]</h6><ul class="potential">',
    '★★★★11101': '<h6>★4 [木 11101]</h6><ul class="potential">',
    '★★★★12100': '<h6>★4 [綿 12100]</h6><ul class="potential">',
    '★★★★11210': '<h6>★4 [鉄 11210]</h6><ul class="potential">',
    '★★★★21131': '<h6>★4 [糧 21131]</h6><ul class="potential">',
    '★★★★★50201': '<h6>★5 [木 50201]</h6><ul class="potential">',
    '★★★★★32010': '<h6>★5 [木 32010]</h6><ul class="potential">',
    '★★★★★23010': '<h6>★5 [綿 23010]</h6><ul class="potential">',
    '★★★★★10501': '<h6>★5 [鉄 10501]</h6><ul class="potential">',
    '★★★★★01520': '<h6>★5 [鉄 01520]</h6><ul class="potential">',
    '★★★★★04150': '<h6>★5 [糧 04150]</h6><ul class="potential">',
    '★★★★★★22210': '<h6>★6 [木 22210]</h6><ul class="potential">',
    '★★★★★★43311': '<h6>★6 [木 43311]</h6><ul class="potential">',
    '★★★★★★45232': '<h6>★6 [綿 45232]</h6><ul class="potential">',
    '★★★★★★25132': '<h6>★6 [綿 25132]</h6><ul class="potential">',
    '★★★★★★32431': '<h6>★6 [鉄 32431]</h6><ul class="potential">',
    '★★★★★★11450': '<h6>★6 [糧 11450]</h6><ul class="potential">',
    '★★★★★★★15152': '<h6>★7 [山 15152]</h6><ul class="potential">',
    '★★★★★★★22230': '<h6>★7 [山 22230]</h6><ul class="potential">',
    '★★★★★★★12630': '<h6>★7 [山 12630]</h6><ul class="potential">',
    '★★★★★★★910651': '<h6>★7 [山 910651]</h6><ul class="potential">',
    '★★★★★★★52222': '<h6>★7 [山 52222]</h6><ul class="potential">',
    '★★★★★★★33341': '<h6>★7 [山 33341]</h6><ul class="potential">',
    '★★★★★★★★72221': '<h6>★8 [山 72221]</h6><ul class="potential">',
    '★★★★★★★★27213': '<h6>★8 [山 27213]</h6><ul class="potential">',
    '★★★★★★★★22702': '<h6>★8 [山 22702]</h6><ul class="potential">',
    '★★★★★★★★33342': '<h6>★8 [山 33342]</h6><ul class="potential">'
  },
  defs = [],
  chapterPeriod = {
    POTENTIAL_LIST_5_1: [ 5, 1],
    POTENTIAL_LIST_5_2: [ 5, 2],
    POTENTIAL_LIST_5_3: [ 5, 3],
    POTENTIAL_LIST_5_4: [ 5, 4],
    POTENTIAL_LIST_5_5: [ 5, 5],
    POTENTIAL_LIST_6_1: [ 6, 1],
    POTENTIAL_LIST_6_2: [ 6, 2],
    POTENTIAL_LIST_6_3: [ 6, 3],
    POTENTIAL_LIST_6_4: [ 6, 4],
    POTENTIAL_LIST_6_5: [ 6, 5],
    POTENTIAL_LIST_6_6: [ 6, 6]
  },
  setPotential = function ( chapter, period) {
    var potential = {};
    $.each( npcData[ chapter], function ( idx, elm) {
      defs[idx] = dataCal( idx, chapter, period);
    });
    defs[5][0] = defs[5][0]>defs[6][0]? defs[5][0]: defs[6][0];
    defs[5][1] = defs[5][1]>defs[6][1]? defs[5][1]: defs[6][1];
    defs[5][2] = defs[5][2]>defs[6][2]? defs[5][2]: defs[6][2];
    defs[5][3] = defs[5][3]>defs[6][3]? defs[5][3]: defs[6][3];
    defs.splice( 6, 1);
    $.each( hoshis, function ( idx, hoshi) {
      var powerInner = '', min = [ true, true, true, true], arr = defs[idx];
      $.each( arr, function ( idx, elm) {
        var i, len = arr.length;
        for ( i = idx + 1; i<len; i++) {
          if ( min[i] && arr[i] > elm) {
            min[idx] = true;
            min[i] = false;
          } else  if ( min[i] && arr[i] < elm) {
            min[idx] = false;
            break;
          }
        }
      });
      powerInner +=
        '<li>' + ( min[0]? '◎': '×') + '槍' + arr[0] + '</li>' +
        '<li>' + ( min[1]? '◎': '×') + '弓' + arr[1] + '</li>' +
        '<li>' + ( min[2]? '◎': '×') + '馬' + arr[2] + '</li>' +
        '<li>' + ( min[3]? '◎': '×') + '器' + arr[3] + '</li></ul>';
      if ( min[0] & min[1] & min[2] & min[3]) {
        powerInner = '<li>◎計' + arr[3] + '</li></ul>';
      }
      potential[hoshi] = POTENTIAL_LIST[hoshi] + powerInner;
    });
      return potential;
  },
  POTENTIAL, season, period;

  if ( !store[key] || !store[key].season) {
    season = 6;
  } else if ( store[key].season === '5') {
    season = 5;
    typesOfSoldiers['国人衆'] = [ '槍', 13];
  } else { //6,7章
    season = 6;
  }

  if ( !store[key] || !store[key].period) {
    period = 6;
  } else {
    period = parseInt( store[key].period, 10);
    if ( isNaN( period) || period > 6) {
      period = 6;
    }
  }

  //console.log( store, store[key].season, store[key].period);
  POTENTIAL = setPotential( season, period);

  //カーソル対象の拡大表示と空地戦力表示：地図に必要攻撃力表示枠の形成
  $(function(){
    $('<div id="required">' +
        '<div class="th">必要攻撃力</div>' +
        '<div id="required_value"></div>' +
      '</div>'
    ).appendTo('div.ig_mappanel_dataarea');
  });
  //カーソル対象の拡大表示と空地戦力表示
  zoomMap();
  function zoomMap() {

    $('area').each(function(){
      var balloonvalue = $(this).attr('balloon').split(' ')[0],
        territory = $(this).attr('onMouseOver').toString().match(/\/img\/panel\/territory/),  //領地
        mapdata = ( $(this).attr('onMouseOver') || '' ).split('; overOperation')[0],
        world = $('img[src$="name_war.png"]').size();

      mapdata = mapdata.match(/'.*?'/g);

      if ( balloonvalue == '空き地' || territory != null ) {
        $( this).hover(
          function () {
            var tiles_text,
              distance,
              Required_val;

            if( world > 0 ) {
              tiles_text = mapdata[4] + mapdata[10] + mapdata[11] + mapdata[12] + mapdata[13] + mapdata[14];
              tiles_text = tiles_text.replace(/'/g, '');
              distance = mapdata[5].replace(/'/g, '');
            } else if( world == 0 ) {
              tiles_text = mapdata[5] + mapdata[7] + mapdata[8] + mapdata[9] + mapdata[10] + mapdata[11];
              tiles_text = tiles_text.replace(/'/g, '');
              distance = mapdata[6].replace(/'/g, '');
            }

            Required_val = $('#required_value');
            if (tiles_text in POTENTIAL) {
              $('<div id="ixamoko_potential">'+ POTENTIAL[tiles_text] +'</div>')
              .appendTo( Required_val );
            }

            //有効兵科の色付け
            $('#ixamoko_potential li:contains("◎")').addClass('least');

            if (distance > 10) {
              $('#ixamoko_potential > ul').append('<li id="decline" style="color: orangeRed;width: 8em;">※攻撃力減少有</li>');
            }

          },
          function(){
            $('#ixamoko_potential').remove();
          }
        );
      }

    });
  }

  // mini map クリックで移動
  $( '#map_navi').click( function ( e) {
    var $this = $( this),
      offset = $this.offset(),
      l = e.pageX - offset.left - 100,
      t = e.pageY - offset.top - 60,
      x = Math.floor( 180*( l/90 + t/30)),
      y = Math.floor( 180*( l/90 - t/30)),
      c = $( '#ig_map_movepanel').find( 'input[name="c"]').val(),
      url = '/map.php?x='+x+'&y='+y+'&c='+c;
    if ( Math.abs(x) < 180 && Math.abs(y) < 180)
      $.get( url, function ( html) {
        var $html = $( $.parseHTML( html)),
          navi = [ 91+( l>90? 90: ( l<-90? -90: l)), 50+( t>30? 30: ( t<-30? -30: t))];
        history.pushState( {}, '('+x+', '+y+', '+c+')', url);
        $( '#ig_mapbox_container').html( $html.find( '#ig_mapbox_container').html());
        $( '#mnavi_box').css( { left: navi[0]+'px', top: navi[1]+'px'});
        zoomMap();
      });
  });
});
