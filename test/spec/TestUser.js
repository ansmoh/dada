(function() {
	'use strict';

	var root = this;

	root.define([
		'test_user'
		],
		function( 
			test_user
			 ) {

			describe('TestUser', function () {
				before(function(){
					//create test user
				})
				after(function(){
					//delete test user
				})
				it('should contain #saveUser', function () {
					expect(_.isFunction(test_user.Save)).to.be.equal(true)
				});
				it('should create test user', function (done) {
					test_user.Save(function(err, result){
						if(err)return done(err)
						expect(result).to.be.deep.equal(test_user.User)
						done(null)
					})
				});
				it('should delete test user', function (done) {
					test_user.Delete(done)
				});
			});
		});

}).call( this );