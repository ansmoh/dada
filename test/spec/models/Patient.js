(function() {
	'use strict';

	var root = this;

	root.define([
		'models/Patient'
		],
		function( Patient ) {

			describe('Patient Model', function () {

				it('should be an instance of Patient Model', function () {
					var _Patient = new Patient();
					expect( _Patient ).to.be.an.instanceof( Patient );
				});
			});

		});

}).call( this );