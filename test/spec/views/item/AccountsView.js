(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/AccountsView'
		],
		function( Accountsview ) {

			describe('Accountsview Itemview', function () {

				it('should be an instance of Accountsview Itemview', function () {
					var AccountsView = new Accountsview();
					expect( AccountsView ).to.be.an.instanceof( Accountsview );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );