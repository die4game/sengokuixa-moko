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

  function initOption( world) {
    var keys = Object.keys( world).sort();
    $.each( keys, function ( idx, key) {
      var div = $( '<div>ワールド'+key+'</div>'),
          btn = $( '<button>削除</button>'),
          p = $( '<p>兵1セットリンクの兵科選択<br></p>'),
          input = $( '<label><input type="radio" name="hei1setlink'+key+'" value="0">騎馬兵</label>'+
                     '<label><input type="radio" name="hei1setlink'+key+'" value="1">精鋭騎馬</label>');
      input.find( ':radio').eq(world[key]).prop('checked',true);
      p.append( input).change( function (e) {
        world[key] = input.find( ':checked').val();
        chrome.storage.local.set( { world: world});
      });
      btn.click( function (e) {
        delete world[key];
        chrome.storage.local.set( options);
        div.remove();
      });
      $( '#worldList').append( div.append( btn, p));
    });
  }
});