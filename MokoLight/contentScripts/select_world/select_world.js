$('div.subserver').on('click', function (e) {
  var $this = $(this),
    world = $this.parent().prop('title'),
    season = this.className.match(/\d+/)[0],
    period = $this.find('span.flag_s>img').prop('src').match(/\d+/)[0],
    store = {};

  chrome.storage.local.get( world, function ( store) {
    if ( !store)
      store = {};
    if ( !store[world])
      store[world] = {};
    store[world].season = season;
    store[world].period = period;
    chrome.storage.local.set( store);
    console.log( store, season, period);
  });
})