// Document ready
$(document).ready(function(event) {
	// Leah TODO: For some reason, items below will only load with this alert at the top??? Troubleshoot...
	alert('');
});

// Focus styling for categories on task form
$(function() {
	$("input#category").focus(function() {
		$('#category-select').addClass('focus').fadeIn();
	});
	$("input#category").focusout(function() {
		$('#category-select').removeClass('focus');
	});
});

// Mmenu configuration
$(function() {
	$('a#open-icon').click(function( e ) {
		e.stopImmediatePropagation();
		e.preventDefault();
		$('nav#menu').trigger( 'toggle.mm' );
	});
	$('nav#menu').mmenu();
});

// Date picker
$(function() {
	$("input#start_date").datepicker();
	$("input#due_date").datepicker();
});