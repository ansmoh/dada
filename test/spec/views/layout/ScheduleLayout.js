(function() {
	'use strict';

	var root = this;

	root.define([
		'views/layout/ScheduleLayout'
		],
		function( Schedulelayout ) {

			describe('Schedulelayout Layout', function () {

				it('should be an instance of Schedulelayout Layout', function () {
					var ScheduleLayout = new Schedulelayout();
					expect( ScheduleLayout ).to.be.an.instanceof( Schedulelayout );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );