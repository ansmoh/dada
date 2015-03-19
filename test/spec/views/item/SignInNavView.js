(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/SignInNavView'
		],
		function( Signinnavview ) {

			describe('Signinnavview Itemview', function () {

				it('should be an instance of Signinnavview Itemview', function () {
					var _SignInNavView = new Signinnavview();
					expect(_SignInNavView ).to.be.an.instanceof( Signinnavview );
				});
			});

		});

}).call( this );