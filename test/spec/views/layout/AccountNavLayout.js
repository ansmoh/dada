(function() {
	'use strict';

	var root = this;

	root.define([
		'views/layout/AccountNavLayout'
		],
		function( Accountnavlayout ) {

			describe('Accountnavlayout Layout', function () {

				it('should be an instance of Accountnavlayout Layout', function () {
					var _AccountNavLayout = new Accountnavlayout();
					expect(_AccountNavLayout ).to.be.an.instanceof( Accountnavlayout );
				});
			});

		});

}).call( this );