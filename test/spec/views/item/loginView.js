(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/loginView'
		],
		function( Loginview ) {

			describe('Loginview Itemview', function () {

				it('should be an instance of Loginview Itemview', function () {
					var loginView = new Loginview();
					expect( loginView ).to.be.an.instanceof( Loginview );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );