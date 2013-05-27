$(document).ready(function () {

    var invoiceProperties = {};
    invoiceProperties["hasVat"] = true;
    invoiceProperties["currency"] = "gbp";
    invoiceProperties["shortid"] = $('#shortid').val();


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

    $(generateRow(0)).insertBefore('#lastRow');
    

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




    $('.save').click(function() {
        var payload = collectPayload(invoiceProperties);

        if(invoiceProperties.shortid) {
            $.ajax({
                type: "PUT",
                url: "/invoices/"+invoiceProperties.shortid,
                // The key needs to match your method's input parameter (case-sensitive).
                data: payload,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    $('body').fadeOut('fast', function() {
                        window.location.href = "/edit/"+invoiceProperties.shortid;
                    });
                },
                failure: function(errMsg) {
                    alert("The invoice could not be recorded due to an error. Try again later");
                }
            });
        }
        else {

            $.ajax({
                type: "POST",
                url: "/invoices",
                // The key needs to match your method's input parameter (case-sensitive).
                data: payload,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(hash){
                    $('body').fadeOut('fast', function() {
                        window.location.href = "/edit/"+hash;
                    });
                },
                failure: function(errMsg) {
                    alert("The invoice could not be recorded due to an error. Try again later");
                }
            });
        }
    });


    if(invoiceProperties.shortid) {
    
            $.ajax({
                type: "GET",
                url: "/invoices/"+invoiceProperties.shortid,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                   populatePayload(data, invoiceProperties);
                },
                failure: function(errMsg) {
                    alert("The invoice could not be retrieved due to an error. Try again later");
                }
            });
    }

});