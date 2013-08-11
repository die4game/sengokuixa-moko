$('div.subserver').on('click', function (e) {
  var $this = $(this),
    world = $this.parent().prop('title'),
    season = this.className.match(/\d+/)[0],
    piriod = $this.find('span.flag_s>img').prop('src').match(/\d+/)[0],
    store = {};

  store[world] = { season: season, piriod: piriod};
  chrome.storage.local.set( store);
})