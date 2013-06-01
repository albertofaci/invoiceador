$(document).ready(function () {

    var invoiceProperties = {};
    invoiceProperties["hasVat"] = true;
    invoiceProperties["currency"] = "gbp";
    invoiceProperties["hash"] = $('#hash').val();


    refreshButtons();
    refreshNumbers(invoiceProperties);
    initializeInvoiceadorForm(invoiceProperties);

    $('a.prevent-default').click(function(e) {
        e.preventDefault();
    });

    $('.select-auto').mouseup(function(e){
        e.preventDefault();
    });
    $('.select-auto').focus(function() {
        $(this).select();
    });


    $('.dropdown-button').click(function() {
        var clicked = $(this);
        $(this).closest('li').siblings().each(function(){
            $(this).removeClass('active'); 
             var target = $(this).find('a').data('target');
            $('#'+target).hide();
           
        });
         $(this).siblings().each(function(){
             var target = $(this).data('target');
            $('#'+target).hide();
         });

        $(this).closest('li').toggleClass('active');
        var target = $(this).data('target');
        $('#'+target).toggle();
    });
    
    /** sticky navbar on scroll**/
    $(document).scroll(function(){
        var elem = $('.alberto-nav');
        if (!elem.attr('data-top')) {
            if (elem.hasClass('navbar-fixed-topx'))
                return;
             var offset = elem.offset()
            elem.attr('data-top', offset.top);
        }
        if (elem.attr('data-top') - elem.outerHeight() <= $(this).scrollTop() - $(elem).outerHeight()) {
            elem.addClass('navbar-fixed-topx');
        } 
        else {
            elem.removeClass('navbar-fixed-topx');
        }
    });

    /** Save invoice **/
    $('.save').click(function() {
        var payload = collectPayload(invoiceProperties);
         $('#payload').val(payload);
        $('body').fadeOut('fast', function() {
            $('#myForm').submit();
        });
       
    });

});