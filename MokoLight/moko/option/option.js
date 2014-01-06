$( function () {
  var options, worldoptions;


  chrome.storage.local.get( null, function ( item) {
    options = item;
    if ( options.world)
      initOption( options.world);
    else
      options.world = {};
    Object.keys( options).map( function ( key) {
      if ( key !== 'world') {
        key = key.replace( 'ワールド', '');
        if ( !options.world[ key]) {
          options.world[ key] = '0';
          $( '#worldList').empty();
          initOption( options.world);
        }
      }
    });
    chrome.storage.local.set( options);
  });

  function initOption( store) {
    var keys = Object.keys( store).sort();
    $.each( keys, function ( idx, key) {
      var div = $( '<div>'),
          divLeft = $(''),
          btn = $( '<p>ワールド'+key+'<button>削除</button></p>'),
          p = $( '<p>兵1セットリンクの兵科選択<br></p>'),
          input = $( '<label><input type="radio" name="hei1setlink'+key+'" value="0">騎馬兵</label>'+
                     '<label><input type="radio" name="hei1setlink'+key+'" value="1">精鋭騎馬</label>'),
          world = key+'ワールド',
          p2 = $( '<p><input type="text" name="season">章'+'<input type="text" name="period">期 (7章7期の場合「7」章「07」期)</p>'),
          soldier = $( '<ul>'+
                      '<li><label><input type="checkbox" name="足軽"><span>足軽</span></label>'+
                      '<li><label><input type="checkbox" name="長槍足軽"><span>長槍足軽</span></label>'+
                      '<li><label><input type="checkbox" name="武士"><span>武士</span></label>'+
                      '<li><label><input type="checkbox" name="弓足軽"><span>弓足軽</span></label>'+
                      '<li><label><input type="checkbox" name="長弓兵"><span>長弓兵</span></label>'+
                      '<li><label><input type="checkbox" name="弓騎馬"><span>弓騎馬</span></label>'+
                      '<li><label><input type="checkbox" name="騎馬兵"><span>騎馬兵</span></label>'+
                      '<li><label><input type="checkbox" name="精鋭騎馬"><span>精鋭騎馬</span></label>'+
                      '<li><label><input type="checkbox" name="赤備え"><span>赤備え</span></label>'+
                      '<li><label><input type="checkbox" name="鉄砲足軽"><span>鉄砲足軽</span></label>'+
                      '<li><label><input type="checkbox" name="騎馬鉄砲"><span>騎馬鉄砲</span></label>'+
                      '<li><label><input type="checkbox" name="焙烙火矢"><span>焙烙火矢</span></label>'+
                      '<li><label><input type="checkbox" name="破城槌"><span>破城槌</span></label>'+
                      '<li><label><input type="checkbox" name="攻城櫓"><span>攻城櫓</span></label>'+
                      '<li><label><input type="checkbox" name="大筒"><span>大筒</span></label>'+
                    '</ul>'),
          season, period;
      input.find( ':radio').eq(store[key]).prop('checked',true);
      p.append( input).change( function (e) {
        store[key] = input.find( ':checked').val();
        chrome.storage.local.set( options);
      });
      p2.find( '[name=season]').val( options[world].season);
      p2.find( '[name=period]').val( options[world].period);
      p2.change( function (e) {
        store[world] = { season: p2.find( '[name=season]').val(), period: p2.find( '[name=period]').val()};
        chrome.storage.local.set( options);
      });
      if ( options[ world].enableSoldier) {
        $.each( options[ world].enableSoldier, function ( idx, val) {
          soldier.find( '[name="'+idx+'"]').prop( 'checked', val);
        });
      }
      soldier.on( 'change', 'input', function (e) {
        var $this = $( this),
          type = $this.next().text(),
          bool = $this.prop( 'checked');
        if ( !options[ world].enableSoldier)
          options[ world].enableSoldier = {};
        options[ world].enableSoldier[ type] = bool;
        chrome.storage.local.set( options);
      });
      btn.on( 'click', 'button', function (e) {
        delete store[key];
        chrome.storage.local.set( options);
        chrome.storage.local.remove( world);
        div.remove();
      });
      $( '#worldList').append( div.append(
        $( '<div>').append( btn, p2, p),
        $( '<div>').append( '<span>市支援表示兵科</span>', soldier)
      ));
    });
  }
});