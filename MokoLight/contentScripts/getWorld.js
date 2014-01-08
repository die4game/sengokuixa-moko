var world = location.host.replace( /^(.+?)\..+/, '$1') + 'ワールド';
chrome.storage.local.get( world, function ( item) {
  if ( !item[ world]) {
    item[world] = {};
    chrome.storage.local.set( item);
  }
});