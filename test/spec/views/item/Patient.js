(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/Patient'
		],
		function( Patient ) {

			describe('Patient Itemview', function () {

				it('should be an instance of Patient Itemview', function () {
					var Patient = new Patient();
					expect( Patient ).to.be.an.instanceof( Patient );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );