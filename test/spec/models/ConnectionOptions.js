(function() {
	'use strict';

	var root = this;

	root.define([
		'models/ConnectionOptions'
		],
		function( Connectionoptions ) {

			describe('Connectionoptions Model', function () {

				it('should be an instance of Connectionoptions Model', function () {
					var ConnectionOptions = new Connectionoptions();
					expect( ConnectionOptions ).to.be.an.instanceof( Connectionoptions );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );