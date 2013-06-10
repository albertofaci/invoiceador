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

    $('.trigger').click(function () {
        $('.popover-markup > .trigger').not(this).popover('hide');
    });
 
    $('.popover-markup > .trigger').popover({ 
        html : true,
        title: function() { 
          return $(this).closest('.popover-markup').find('.head').html();
        },
        content: function() {
          return $(this).closest('.popover-markup').find('.content').html();
        }
    });

    $(this).delegate('.popoverclose', 'click', function() {
        var target = $(this).data("target");
        $("#"+target).popover('hide');
    });


    /** Save invoice **/
    $('.save-action').click(function() {
        var payload = collectPayload(invoiceProperties);
        $('#save-payload').val(payload);
        $('body').fadeOut('fast', function() {
            $('#saveForm').submit();
        });
    });

    $('.update-action').click(function() {
        var payload = collectPayload(invoiceProperties);
        $('#update-payload').val(payload);
        $('body').fadeOut('fast', function() {
            $('#updateForm').submit();
        });
    });

    $('.fork-action').click(function() {
        var payload = collectPayload(invoiceProperties);
        $('#fork-payload').val(payload);
        $('body').fadeOut('fast', function() {
            $('#forkForm').submit();
        });
    });

    $('.main-alert').delay(3000).fadeOut('slow');

});