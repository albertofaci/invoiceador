(function ( $ ) {

    function moveUp(a) { if (a.prev() != null) a.insertBefore(a.prev()) }
	function moveDown(a) { if (a.next() != null) a.insertAfter(a.next()) }

	$.fn.showCellContentOnHoverOnly = function(m) {
		var map = m || {};
		var selectorAncestor = map.selectorAncestor;
		var buttonsClass = "." + (map.buttonsClass || "buttons");

		this.on('mouseover', selectorAncestor, function() {  
        	$(this).find(buttonsClass).show(); 
    	}).on('mouseout', selectorAncestor, function() {  
        	$(this).find(buttonsClass).hide(); 
    	});
	};

	$.fn


    $.fn.actionButtons = function(m) {

    	var map = m || {};
    	var rowClass = "." + (map.rowClass || "row");
    	var actionCallback = map.actionCallback || $.noop();

    

	    //actions
    	this.delegate('.del:not(.disabled)', 'click', function() {
	        $(this).closest(rowClass).remove();
	        actionCallback(this);
	    });
	    
	    this.delegate('.up:not(.disabled)', 'click', function () {
	        moveUp($(this).closest(rowClass))
	        actionCallback(this);
	    });
	    
	    this.delegate('.down:not(.disabled)', 'click', function () {
	        moveDown($(this).closest(rowClass));
	        actionCallback(this);
	    });
    }

   $.fn.navigableTable = function(m) {

   	var map = m || {};

   	 var navigableClass = "." + (map.navigableClass || "navigable")

   	 this.delegate('.navigable', 'keydown', function(e) {

        switch(e.keyCode) {
            case 37: $(this).closest('td').prev().find(navigableClass).focus();  break;
            case 39: $(this).closest('td').next().find(navigableClass).focus();  break;
            case 38: var index = $(this).closest('td').index();
                     $($(this).closest('tr').prev().find('td')[index]).find(navigableClass).focus(); 
                     break;
            case 40: var index = $(this).closest('td').index(); 
                     $($(this).closest('tr').next().find('td')[index]).find(navigableClass).focus();  
                     break;
            default:
        }    
    });

    
   }


}(jQuery));