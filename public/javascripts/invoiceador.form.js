$(document).ready(function () {

 	$.formatCurrency.regions['gbp'] = {
        symbol: '£',
        positiveFormat: '%s%n',
        negativeFormat: '%s-%n',
        decimalSymbol: '.',
        digitGroupSymbol: ',',
        groupDigits: true
    };
    $.formatCurrency.regions['usd'] = {
        symbol: '$',
        positiveFormat: '%s%n',
        negativeFormat: '%s-%n',
        decimalSymbol: '.',
        digitGroupSymbol: ',',
        groupDigits: true
    };
    $.formatCurrency.regions['eur'] = {
        symbol: '€',
        positiveFormat: '%n %s',
        negativeFormat: '%s-%n',
        decimalSymbol: '.',
        digitGroupSymbol: ',',
        groupDigits: true
    };
    $.formatCurrency.regions['chf'] = {
        symbol: 'Fr.',
        positiveFormat: '%s %n',
        negativeFormat: '%s-%n',
        decimalSymbol: ',',
        digitGroupSymbol: ' ',
        groupDigits: true
    };

});

var moneyPattern = /^\d+(,\d{3})*(\.\d*)?$/;
var numberPattern = /^\d+$/;

function initializeInvoiceadorForm(invoiceProperties) {



 	$('#invoice_date').val(getTodayDate());
    $('.datepicker').datepicker();

   /** currency formatting **/
   $('.currency').each(function() {
        $(this).formatCurrency({region: invoiceProperties.currency});
   });
   $('.price').each(function() {
        $(this).formatCurrency({region: invoiceProperties.currency});
   });
    
   $('#fields').delegate('.price', 'blur', function() {
         $(this).data('value', $(this).val());
         $(this).formatCurrency({region: invoiceProperties.currency});
   });
   $('#fields').delegate('.price', 'focus', function() {
         $(this).val($(this).data('value'))
   });
  
    /** action Button delegates **/

    $('#fields').showCellContentOnHoverOnly({ buttonsClass: 'controls', selectorAncestor: 'tr'});

    $('#fields').actionButtons(
        {
            rowClass: 'sheet_row', 
            actionCallback: function(elem) {
                $('#fields').trigger($.Event('buttons'));
                elem.focus();
            }
        }
    );
    
    /** Number representation delegates **/

    $('#fields').bind('numbers', function() {
        refreshNumbers(invoiceProperties);
    });
    $('#fields').bind('buttons', function() {
        refreshButtons(invoiceProperties);
    });
    
    $('#fields').delegate('.sensitive', 'keyup', function() {
        $(this).data('value', $(this).val());
        $('#fields').trigger($.Event('numbers'));
    });

    /** new row **/
    /*$('#fields').registerAddRow({
        buttonId : "#addRow", 
        rowClass: ".sheet_row", 
        itemClass: ".itemField", 
        dataAttribute: "value"})
*/
    $('#addRow').click(function () {
        var newRow = $('.sheet_row:last').clone();
        newRow.find('.itemField').each(function() {
            $(this).val("");
            $(this).data('value', '')
        })
        newRow.insertBefore('#lastRow');
        $('#fields').trigger($.Event('buttons'));
    });

    /** Navigation **/


    $('#fields').navigableTable();

    
  
    
    /** VAT toggling **/
    $('#hasVat').click(function () {
        $(".hasVat").toggle(this.checked);
        invoiceProperties.hasVat = this.checked;
        $('#fields').trigger($.Event('numbers'));
    });
    
    /** Currency **/
    $('#currencySelect').change(function() {
        $("#currencySelect option:selected").each(function () {
           invoiceProperties.currency = $(this).val();
           $('#fields').trigger($.Event('numbers'));
       }); 
    });

}

function getTodayDate() {
    var myDate = new Date();
    return ('0' + myDate.getDate()).slice(-2) 
        + '/'
        + ('0' + (myDate.getMonth()+1)).slice(-2) 
        + '/'
        + myDate.getFullYear();
}


function refreshNumbers(invoiceProperties) {
    
    $(".amount").each(function () {
        var tr = $(this).closest('tr')
        var index = $(this).closest('tr').data("rownum");
        var qty = tr.find('.qty').data('value');
        var price = tr.find('.price').data('value');

        if (qty && price) {
            var amount = round(qty * price);
            $(this).data('value', amount);
            $(this).val(amount);    
            $(this).formatCurrency({region: invoiceProperties.currency}); 
        } else {
            $(this).val("");
        }
    });

 
    var subtotal = 0.0;
    $.each($('.amount'), function () {
        subtotal += round($(this).data('value')) || 0.0;
    });

    $('#invoice_subtotal').data('value', subtotal);
    $('#invoice_subtotal').val(subtotal);
    $('#invoice_subtotal').formatCurrency({region: invoiceProperties.currency}); 

    var vat_rate = $('#invoice_vat_rate').val();

   
    if(invoiceProperties.hasVat) {
        var vat = round(subtotal * vat_rate / 100);
        //sheet_.vat = vat;
        $('#invoice_vat').data('value', vat)
        $('#invoice_vat').val(vat);
        $('#invoice_vat').formatCurrency({region: invoiceProperties.currency}); 
    }
    var total = $('#invoice_subtotal').data('value');
    if(invoiceProperties.hasVat) {
        total += $('#invoice_vat').data('value');
    }
    // sheet_.total = total;
    $('#invoice_total').data('value', total)
    $('#invoice_total').val(total);  
    $('#invoice_total').formatCurrency({region: invoiceProperties.currency}); 
}


function round(amount) {
    return Math.round(amount * 100) / 100;
}

//---- TODO: review
function isValid(str, pattern) {
    return str.match(pattern);
}

function refreshButtons() {
    var disabledClass = 'disabled';
    if ($(".sheet_row").size() == 1) {
        $(".del").addClass(disabledClass);            
    } else {
        $(".del").removeClass(disabledClass);
    }
    $('.up').removeClass(disabledClass);        
    $('.up').first().addClass(disabledClass);        
    $('.down').removeClass(disabledClass);        
    $('.down').last().addClass(disabledClass);         
}




function collectPayload(invoiceProperties) {
    var items = [];

    $('.sheet_row').each(function() {
         var fields = new Object();
         fields["description"] = $(this).find("input[id^=description]").val();
         fields["qty"] = $(this).find("input[id^=qty]").val();
         fields["price"] = $(this).find("input[id^=price]").data("value");
         fields["amount"] = $(this).find("input[id^=amount]").data("value");
         if(fields["qty"] && fields["price"] && fields["description"]) {
            items.push(fields);
         }
         
    });
   
    
    var sender = {
        "company_name": $('#company_name').val(),
        "company_registration_number": $('#company_registration_number').val(),
    }
    if($('#company_vat_registration').val()) {
        sender["company_vat_registration"] = $('#company_vat_registration').val()
    }

    var payload = JSON.stringify({
            "number": $('#invoice_number').val(),
            "date": $('#invoice_date').val(),
            "is_vat": invoiceProperties.hasVat,
            "sender": sender,
            "recipient": {
                "name": $('#client_name').val(),
                "address": {
                    "line1":  $('#client_address_1').val(),
                    "line2":  $('#client_address_2').val(),
                    "town":   $('#client_town').val(),
                    "postcode":  $('#client_postcode').val(),
                    "country":  $('#client_country').val()
                }
            },
            "vat_rate": $('#invoice_vat_rate').data('value'),
            "invoice_data": {
               "items": items,
               "subtotal": $('#invoice_subtotal').data('value'),
               "vat": $('#invoice_vat').data('value'),
               "total": $('#invoice_total').data('value'), 
            }

    });
    return payload;
}



