(function() {
	'use strict';

	var root = this;

	root.define([
		'views/layout/AppLayout'
		, 'test_user'
		],
		function( 
			Applayout
			, TestUser
			 ) {

			describe('Applayout Layout', function () {
				before(function(done){
					TestUser.LoginTestStaffUser(done)
				})
				after(function(done){
					TestUser.Delete(done)
				})
				it('should be an instance of Applayout Layout', function () {
					var appLayout = new Applayout();
					expect(appLayout ).to.be.an.instanceof( Applayout );
				});
				it('should render Practice Info in header', function (done) {
					var appLayout = new Applayout()
					appLayout.on('render', function(){
						// console.log('##Render');
					})
					appLayout.initialize()
					done(null)
				});
			});

		});

}).call( this );