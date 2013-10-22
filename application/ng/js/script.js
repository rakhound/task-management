// Mmenu configuration
$(function() {
	$('a#open-icon').click(function( e ) {
		e.stopImmediatePropagation();
		e.preventDefault();
		$('nav#menu').trigger( 'toggle.mm' );
	});
	$('nav#menu').mmenu();
});