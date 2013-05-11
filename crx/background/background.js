// メッセージを受け取ってオブジェクトを返す
// CRXMOKODATA:moko/data.js, Moko_main:moko/sengokuixa-moko.js, tableSorter_&tablesorter_pager_plugin:plugin/Tablesorter.js
chrome.runtime.onMessage.addListener( function( msg, sender, fnc) {
//  console.log( msg, sender);
  switch ( msg) {
    case 'fire':
    if ( sender.tab.url.match(/sengokuixa\.jp/)) { 
      chrome.pageAction.show(sender.tab.id);
    }
    break;

    case 'send CRXMOKODATA':
    fnc( JSON.stringify( CRXMOKODATA));
    break;

    case 'send Moko_main':
    fnc( Moko_main.toString());
    break;

    case 'send tableSorter_':
    fnc( tableSorter_.toString());
    break;

    case 'send tablesorter_pager_plugin':
    fnc( tablesorter_pager_plugin.toString());

    default:
    break;
  }
});
chrome.tabs.onUpdated.addListener( function ( tabId, info, tab) {
  //console.log( tabId, info, tab);
  if ( info.status === 'complete' && tab.url.match(/sengokuixa\.jp/))
    chrome.pageAction.show( tabId);
});
