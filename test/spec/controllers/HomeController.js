(function() {
	'use strict';

	var root = this;

	root.define([
		'controllers/HomeController'
		],
		function( Homecontroller ) {

			describe('Homecontroller Controller', function () {

				it('should be an instance of Homecontroller Controller', function () {
					var _HomeController = new Homecontroller({region: new Backbone.Marionette.Region({el: '<div></div>'})});
					expect(_HomeController ).to.be.an.instanceof( Homecontroller );
				});
			});

		});

}).call( this );