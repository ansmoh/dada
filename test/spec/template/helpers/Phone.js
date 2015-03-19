(function() {
	'use strict';

	var root = this;

	root.define([
		'template/helpers/Phone'
		, 'test_user'
		],
		function( 
			Phone
			, TestUser
			 ) {

			describe('Phone Template helper', function () {
				it('should return formatted phone number', function () {
					var res = Phone(TestUser.User.Phone)
					expect(res).to.be.equal('(707)000-0000')
				});
			});

		});

}).call( this );