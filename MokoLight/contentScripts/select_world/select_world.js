$('div.subserver').on('click', function (e) {
  var $this = $(this),
    world = $this.parent().prop('title'),
    season = this.className.match(/\d+/)[0],
    period = $this.find('span.flag_s>img').prop('src').match(/\d+/)[0],
    store = {};

  store[world] = { season: season, period: period};
  chrome.storage.local.set( store);
})