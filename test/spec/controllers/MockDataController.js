(function() {
	'use strict';

	var root = this;

	root.define([
		'controllers/MockDataController'
		, 'date-utils'
		],
		function( Mockdatacontroller ) {

			describe('Mockdatacontroller Controller', function () {
				var _MockDataController
				it('should be an instance of Mockdatacontroller Controller', function () {
					_MockDataController = new Mockdatacontroller();
					expect( _MockDataController ).to.be.an.instanceof( Mockdatacontroller );
				});
				it('should return an array with daily production values', function () {
					_MockDataController._productionData()
				});
				it('should return an array with daily production values', function () {
						var d = _MockDataController._productionTotalByDateRange({from: new Date('2014-05-01'), to: new Date()})
						// console.log(d);
				});
				it('should return list of appointments', function () {
					var a = _MockDataController._appointments()
					// console.log(a.length);
				});
				it('should return an array with appointments', function () {
						var d = _MockDataController.appointmentsByDateRange({from: (new Date()).addDays(-1), to: new Date()})
						// console.log(d);
				});
			});

		});

}).call( this );