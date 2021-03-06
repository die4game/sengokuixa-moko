var world = location.host.split( '.')[0] + 'ワールド';
chrome.storage.local.get( world, function ( item) {
  var season = item[ world]? ( item[ world].season? item[ world].season: '7'): '7';
    $( function () {
			var br3 = {

			  //6章
			  FORTCOORD_6: [ 
					[ 12, 28], [ 28, 12], [ 12, 52], [ 36, 36], [ 52, 12], [ 12, 76], [ 36, 60], [ 60, 36], [ 76, 12], [ 12,100],
					[ 36, 84], [ 60, 60], [ 84, 36], [100, 12], [ 12,124], [ 36,108], [ 60, 84], [ 84, 60], [108, 36], [124, 12],
					[ 36,132], [ 60,108], [ 84, 84], [108, 60], [132, 36], [ 60,132], [ 84,108], [108, 84], [132, 60], [ 84,132],
					[108,108], [132, 84], [108,132], [132,108], [132,132]
				],

			  //7章
			  FORTCOORD_7: [
					[ 12, 28], [ 28, 12], [ 12, 52], [ 36, 36], [ 52, 12], [ 12, 76], [ 36, 60], [ 60, 36], [ 76, 12], [ 12,100],
					[ 36, 84], [ 60, 60], [ 84, 36], [100, 12], [ 12,124], [ 36,108], [ 60, 84], [ 84, 60], [108, 36], [124, 12],
					[ 12,148], [ 36,132], [ 60,108], [ 84, 84], [108, 60], [132, 36], [148, 12], [ 36,156], [ 60,132], [ 84,108],
					[108, 84], [132, 60], [156, 36], [ 60,156], [ 84,132], [108,108], [132, 84], [156, 60], [ 84,156], [108,132],
					[132,108], [156, 84], [108,156], [132,132], [156,108], [132,156], [156,132], [156,156]
				],

			  // 東西戦砦座標
			  EW_FORT_MAP: [ 
					[ [-121,101], [-121,1], [-101,-79], [119,121], [99,1], [119,-99] ],
					[
						[-141, 121], [-121, 141], [-101, 121], [ -81, 101], [-101,  81],
						[ -61, 141], [ -41, 121], [ -21, 101], [ -41,  81], [ -41,  61],

						[-121,  41], [-101,  21], [ -81,   1], [ 101, -19], [-121, -39],
						[ -61,  41], [ -41,  21], [ -41,   1], [ -21, -19], [ -61, -39],

						[-101, -59], [ -81, -79], [ -81, -99], [-101,-119], [-121, -99],
						[ -41, -59], [ -41, -79], [ -21, -99], [ -41,-119], [ -21,-139],

						[ 139, 101], [ 119, 101], [  99, 101], [  99, 121], [  79, 141],
						[  19, 141], [  39, 121], [  19, 101], [  39,  81], [  59,  81],

						[  99,  41], [  79,  21], [  79,   1], [  79, -19], [  99, -39],
						[  39,  41], [  19,  21], [  39,   1], [  19, -19], [  39, -39],

						[ 139,-119], [ 119,-139], [  99,-119], [  79, -99], [  99, -79],
						[  39, -59], [  59, -79], [  39, -99], [  39,-119], [  59,-119],
					]
				],

				runMenu: function() {
					/*砦*/
					var menu = [];
					if ( parseInt( season) < 7 ) {
						menu = this.FORTCOORD_6;
					}
					else {
						menu = this.FORTCOORD_7;
					}
					this.makeMapMenu(menu, 'gMenu03');
					$('.gMenu03 > a')
					.mouseover(function() { br3.openMenu(); })
					.mouseout(function() { br3.closetime(); });
				},

				makeMapMenu: function(arr, target) {
				  var c_code, submenu, fort_target, $table, i, $td, dir, j, x, y, href, text, $a, k;
					c_code = this.getCountryCode();
					
					submenu = document.createElement('div');
					submenu.id = target;
					submenu.style.position = "absolute";
					submenu.style.zIndex = 200000;
					submenu.style.background = "rgba(0,0,0,0.8)";
					submenu.style.display = "none";
					submenu.style.overflowY = "auto"
					submenu.style.overflowX = "hidden"
					submenu.style.maxHeight = "230px";
					submenu.style.minWidth = "300px";
					$("." + target).append(submenu);
					
					$(submenu)
					.mouseover( function() { br3.closetimeC(); } )
					.mouseout(  function() { br3.closetime(); } );
					
					fort_target = $(submenu);
					$table = $('<table id="fort_list"><tbody><tr>');
					if ( c_code.match(/20|21/)) {
  					submenu.style.maxHeight = "254px";
				    arr = this.EW_FORT_MAP;
					  for ( i=0; i<6; i++) {
					    $td = $( '<td>');
							href = "/map.php?x=" + arr[0][i][0] + "&y=" + arr[0][i][1] + c_code;
							text = ( i<3? '西': '東') + '大殿' + ( i%3 + 1);
					    $a = $( '<a class="fort_no" href="'+href+'">'+text+'</a>');
					    $td.append( $a);
					    for ( j=0; j<10; j++) {
					      k = i*10+j;
  							href = "/map.php?x=" + arr[1][k][0] + "&y=" + arr[1][k][1] + c_code;
  							text = '砦' + ( j + 1);
  					    $a = $( '<a class="fort_no" href="'+href+'">'+text+'</a>');
  					    $td.append( $a);
					    }
  						$table.find('tr').append( $td );
  						fort_target.append( $table );
					  }
					} else
  					for (i = 0; i < 4; i++) {
  						$td = $('<td>');
  						dir, x, y;
  						
  						switch (i) {
  							case 0: dir = "北東"; x =  1; y =  1; break;
  							case 1: dir = "南東"; x =  1; y = -1; break;
  							case 2: dir = "南西"; x = -1; y = -1; break;
  							case 3: dir = "北西"; x = -1; y =  1; break;
  						}
  						
  						for (j = 0; j < arr.length; j++) {
  							href = "/map.php?x=" + arr[j][0] * x + "&y=" + arr[j][1] * y + c_code;
  							text = dir + (j + 1);
  							$a = $('<a class="fort_no" href="' +href+ '">' + text + '</a>');
  							$td.append( $a );
  						}
  						$table.find('tr').append( $td );
  						fort_target.append( $table );
  					}
				},

				getCountryCode: function () {
				  var c = '';
				  if (location.pathname === '/map.php') {
				    c = '&c=' + $('#ig_map_movepanel input[name=c]').val();
				  }
				  return c;
				},

				openMenu: function(obj) {
					this.closetimeC();
					$("#gMenu03").fadeIn(100);
				
				},

				closeMenu: function() {
					$("#gMenu03").fadeOut(100);
				},

				closeTimer: null,

				closetime: function() {
					this.closeTimer = window.setTimeout(this.closeMenu, 30);
				},

				closetimeC: function() {
					if (this.closeTimer) {
						window.clearTimeout(this.closeTimer);
						this.closeTimer = null;
					}
				}
			};

			br3.runMenu();
		});
});