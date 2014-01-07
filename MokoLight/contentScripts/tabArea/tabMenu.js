( function () {
	window.addEventListener("DOMContentLoaded", function () {
		function addFunction(callback) {
		  var script = document.createElement("script");
	    script.textContent = "(" + callback.toString() + ")(j$);";
	    document.body.appendChild(script);
		}

		function windowMenu($) {
			window.menu = {

			  gMenu: null,

				st: function (idx) {
					var numlist = [1,2,5,7,8],
					  gMenu = $('.gMenu0'+numlist[idx]).find('ul').css({opacity:'1', width: numlist[idx]>1? '110px': '200px'});
					if ( arguments[1]) {
					  this.openMenu( gMenu);
				  } else {
				    this.closetime( gMenu);
				  }
				},

				openMenu: function( gMenu) {
					this.closetimeC();
					if ( this.gMenu && this.gMenu.parent().attr( 'class') !== gMenu.parent().attr( 'class')) {
					  this.closeMenu( this.gMenu);
					}
				  this.gMenu = gMenu;
					gMenu.fadeIn(100);
				
				},

				closeMenu: function( gMenu) {
				  gMenu.fadeOut(100);
				},

				closeTimer: null,

				closetime: function( gMenu) {
				  this.closetimeC();
					this.closeTimer = window.setTimeout(this.closeMenu, 30, gMenu);
				},

				closetimeC: function() {
					if (this.closeTimer) {
						window.clearTimeout(this.closeTimer);
						this.closeTimer = null;
					}
				}
			};
		}

		addFunction( windowMenu);
	});
}());