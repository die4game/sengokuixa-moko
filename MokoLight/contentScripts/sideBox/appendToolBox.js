$( '#sideboxTop').prepend(
  '<div id="mokoToolBox">' +
    '<ul>' +
      '<li class="list_img">' +
        '<a href="' + chrome.extension.getURL( 'moko/cardList/cardList.html') + '?' +
        location.host.match(/^\w+/)[0] + '" target="_new">武将リスト</a>' +
      '</li>' +
    '</ul>' +
  '</div>'
);
