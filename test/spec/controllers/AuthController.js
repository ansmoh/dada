(function() {
	'use strict';

	var root = this;

	root.define([
		'controllers/AuthController'
		, 'test_user'
		],
		function( 
			Authcontroller
			, TestUser
			 ) {

			describe('Authcontroller Controller', function () {
				before(function(done){
					//create test user
					TestUser.LoginTestStaffUser(done)				
				})
				after(function(done){
					//delete test user
					TestUser.Delete(done)
				})
				it('should be an instance of Authcontroller Controller', function () {
					var authController = new Authcontroller();
					expect(authController ).to.be.an.instanceof( Authcontroller );
				});
				it('should return set Authorization in localstorage using given login info.', function (done) {
					var authController = new Authcontroller()
					authController.initialize()
					done(null)
				});
			});
		});

}).call( this );