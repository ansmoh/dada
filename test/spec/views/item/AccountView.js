(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/AccountView'
		],
		function( Accountview ) {

			describe('Accountview Itemview', function () {

				it('should be an instance of Accountview Itemview', function () {
					var AccountView = new Accountview();
					expect( AccountView ).to.be.an.instanceof( Accountview );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );