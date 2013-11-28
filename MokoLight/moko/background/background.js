chrome.runtime.onMessage.addListener( function ( mes, sndr) {
  chrome.tabs.create( { url:mes});
});