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

   // $('.dropdown-button').dropdownButton();

    $('.trigger').click(function () {
        $('.popover-markup > .trigger').not(this).popover('hide');
    });
 
    $('.popover-markup > .trigger').popover({ 
        html : true,
        title: function() {
          return $(this).parent().find('.head').html();
        },
        content: function() {
          return $(this).parent().find('.content').html();
        }
    });

    $(this).delegate('.popoverclose', 'click', function() {
        var target = $(this).data("target");
        $("#"+target).popover('hide');
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