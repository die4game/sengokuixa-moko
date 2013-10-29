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
    options.world[val] = 0;
    chrome.storage.local.set( options);
    initOption( options.world);
  });

  function initOption( world) {
    $.each( world, function ( key, val) {
      var div = $( '<div>ワールド'+key+'</div>'),
          p = $( '<p>兵1セットリンクの兵科選択<br></p>'),
          input = $( '<label><input type="radio" name="hei1setlink" value="0">騎馬兵</label>'+
                     '<label><input type="radio" name="hei1setlink" value="1">精鋭騎馬</label>');
      input.find( ':radio').eq(val).prop('checked',true);
      p.append( input).change( function (e) {
        world[key] = input.find( ':checked').val();
        chrome.storage.local.set( { world: world});
      })
      $( '#worldList').append( div.append( p));
    });
  }
});