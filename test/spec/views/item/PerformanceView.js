(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/PerformanceView'
		],
		function( Performanceview ) {

			describe('Performanceview Itemview', function () {

				it('should be an instance of Performanceview Itemview', function () {
					var PerformanceView = new Performanceview();
					expect( PerformanceView ).to.be.an.instanceof( Performanceview );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );