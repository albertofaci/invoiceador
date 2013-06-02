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


    $('.dropdown-button').dropdownButton();


    /** Save invoice **/
    $('.save').click(function() {
        var payload = collectPayload(invoiceProperties);
         $('#payload').val(payload);
        $('body').fadeOut('fast', function() {
            $('#myForm').submit();
        });
       
    });

});