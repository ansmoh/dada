(function() {
	'use strict';

	var root = this;

	root.define([
		'models/Account'
		, 'test_user'
		],
		function( 
			Account
			, TestUser
			 ) {

			describe('Account Model', function () {
				before(function(done){
					TestUser.LoginTestStaffUser(done)
				})
				after(function(done){
					TestUser.Delete(done)
				})
				it('should be an instance of Account Model', function () {
					var account = new Account();
					expect( account ).to.be.an.instanceof( Account );
				});
				
				it('should get account info from db', function (done) {
					var account = new Account();
					account.fetch({
						success:function(model, res, options){
						// console.log(model)
						done(null)
						}
						, error:function(model, res, options){
							// console.log(res);
							done(null)
						}})
				});
			});

		});

}).call( this );