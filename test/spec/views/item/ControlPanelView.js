(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/ControlPanelView'
		],
		function( Controlpanelview ) {

			describe('Controlpanelview Itemview', function () {

				it('should be an instance of Controlpanelview Itemview', function () {
					var ControlPanelView = new Controlpanelview();
					expect( ControlPanelView ).to.be.an.instanceof( Controlpanelview );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );