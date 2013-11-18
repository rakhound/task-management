// Document ready
$(document).ready(function(event) {
	// Leah TODO: For some reason, items below will only load with this alert at the top??? Troubleshoot...
	alert('temp alert for Jquery load');
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

// Masonry
$(function() {
	var $container = $('#category-circles');
	$container.masonry({
	  itemSelector: '.category-circle',
	  columnWidth: 1,
	});
});

//
//$(function() {
//	$('.category-circle').click(function() {
//		$(this).css("width", "2000px").css({width: '2000px', height: '2000px'})
//	});
//});

// Highcharts
$(function () {

	Highcharts.setOptions({
    	colors: ['#e74c3c', '#c0392b']
    });

    $('#hours-chart').highcharts({
        data: {
            table: document.getElementById('hours')
        },
        title: {
            text: ''
        },
        chart: {
            backgroundColor: 'transparent',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            height: 200,
        },    
        credits: {
      		enabled: false
  		}, 
  		navigation: {
            buttonOptions: {
                enabled: false
            }
        },
        tooltip: {

        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },  
        series: [{
            type: 'pie'
        }]              
    });

});







