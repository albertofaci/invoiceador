(function ( $ ) {



    $.fn.dropdownButton = function() {
		this.click(function() {
	        var clicked = $(this);
	        $(this).closest('li').siblings().each(function(){
	            $(this).removeClass('open'); 
	             var target = $(this).find('a').data('target');
	            $('#'+target).hide();
	        });

	        $(this).siblings().each(function(){
	             var target = $(this).data('target');
	            $('#'+target).hide();
	        });

	        $(this).closest('li').toggleClass('open');
	        var target = $(this).data('target');
	        $('#'+target).toggle();
	    });
    }




}( jQuery ));