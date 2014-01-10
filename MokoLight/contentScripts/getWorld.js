var world = location.host.match( /^\w\d\{3}/);
if ( world) {
  world = world + 'ワールド';
  chrome.storage.local.get( world, function ( item) {
    if ( !item[ world]) {
      item[world] = {};
      chrome.storage.local.set( item);
    }
  });
}