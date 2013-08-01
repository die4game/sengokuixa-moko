$('div.subserver').on('click', function (e) {
  var $this = $(this),
    world = $this.parent().prop('title'),
    season = this.className.match(/\d+/)[0],
    piriod = $this.find('span.flag_s>img').prop('src').match(/\d+/)[0],
    store = {};

  e.preventDefault();
  //console.log(season, piriod, world );
  //chrome.runtime.sendMessage( 'Season and Piriod ' + season + piriod);
  store[world] = { season: season, piriod: piriod};
  chrome.storage.local.set( store);
  location.href = $this.parent().prop('href');
})