(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/WaitingRoomView'
		],
		function( Waitingroomview ) {

			describe('Waitingroomview Itemview', function () {

				it('should be an instance of Waitingroomview Itemview', function () {
					var WaitingRoomView = new Waitingroomview();
					expect( WaitingRoomView ).to.be.an.instanceof( Waitingroomview );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );