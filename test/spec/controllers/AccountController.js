(function() {
	'use strict';

	var root = this;

	root.define([
		'controllers/AccountController'
		],
		function( Accountcontroller ) {

			describe('Accountcontroller Controller', function () {

				it('should be an instance of Accountcontroller Controller', function () {
					var _AccountController = new Accountcontroller();
					expect(_AccountController ).to.be.an.instanceof( Accountcontroller );
				});
			});

		});

}).call( this );