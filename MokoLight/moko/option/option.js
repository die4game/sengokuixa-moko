$( function () {
  var options;

  chrome.storage.local.get( 'world', function ( item) {
    if ( item.world)
      initOption( item.world);
    else
      item = { world: {}};
    options = item;
  });


  $( '#appendWorld').click( function () {
    var val = $( '#selectWorld').val();
    options.world[val] = '0';
    chrome.storage.local.set( options);
    $( '#worldList').empty();
    initOption( options.world);
  });

  function initOption( store) {
    var keys = Object.keys( store).sort();
    $.each( keys, function ( idx, key) {
      var div = $( '<div>ワールド'+key+'</div>'),
          btn = $( '<button>削除</button>'),
          p = $( '<p>兵1セットリンクの兵科選択<br></p>'),
          input = $( '<label><input type="radio" name="hei1setlink'+key+'" value="0">騎馬兵</label>'+
                     '<label><input type="radio" name="hei1setlink'+key+'" value="1">精鋭騎馬</label>'),
          world = key+'ワールド',
          p2 = $( '<p><input type="text" name="season">章'+'<input type="text" name="piriod">期 (7章7期の場合「7」章「07」期)</p>'),
          season, piriod;
      input.find( ':radio').eq(store[key]).prop('checked',true);
      p.append( input).change( function (e) {
        store[key] = input.find( ':checked').val();
        chrome.storage.local.set( { world: store});
      });
      chrome.storage.local.get( world, function ( item) {
        if ( item[world]) {
          p2.find( '[name=season]').val( item[world].season);
          p2.find( '[name=piriod]').val( item[world].piriod);
        }
      });
      p2.change( function (e) {
        store[world] = { season: p2.find( '[name=season]').val(), piriod: p2.find( '[name=piriod]').val()};
        chrome.storage.local.set( store);
      });
      btn.click( function (e) {
        delete store[key];
        chrome.storage.local.set( options);
        chrome.storage.local.remove( world);
        div.remove();
      });
      $( '#worldList').append( div.append( btn, p, p2));
    });
  }
});