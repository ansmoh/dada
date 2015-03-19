(function() {
	'use strict';

	var root = this;

	root.define([
		'views/layout/Search'
		],
		function( Search ) {

			describe('Search Layout', function () {

				it('should be an instance of Search Layout', function () {
					var Search = new Search();
					expect( Search ).to.be.an.instanceof( Search );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );