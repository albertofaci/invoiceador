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
    
   $('#fields').delegate('.price', 'blur', function() {
         $(this).data('value', $(this).val());
         $(this).formatCurrency({region: invoiceProperties.currency});
   });
   $('#fields').delegate('.price', 'focus', function() {
         $(this).val($(this).data('value'))
   });
  
    /** Button delegates **/
    
    $('#fields').delegate('.del:not(.disabled)', 'click', function() {
        $(this).closest(".sheet_row").remove();
        refreshButtons();
    });
    
    $('#fields').delegate('.up:not(.disabled)', 'click', function () {
        moveUp($(this).closest('.sheet_row'))
        refreshButtons();
         $(this).focus();
    });
    
    $('#fields').delegate('.down:not(.disabled)', 'click', function () {
        moveDown($(this).closest('.sheet_row'));
        refreshButtons();
         $(this).focus();
    });
    
    /** Number representation delegates **/
    
    $('#fields').delegate('.sensitive', 'keyup', function() {
        $(this).data('value', $(this).val());
        refreshNumbers(invoiceProperties);
    });

    $('#addRow').click(function () {
        $(generateRow(findNextRownum())).insertBefore('#lastRow');
        refreshButtons(invoiceProperties);
    });
        
    /** Object synch delegates **/
    
    
    
    $('#fields').delegate('.itemField', 'keyup', function() {
        var fieldName = $(this).data('field-name');
        var rownum = $(this).closest('tr').data('rownum');
        //sheet_.items[rownum][fieldName] = $(this).val();
    });

    //$('#addRow').click(function () {
    //    sheet_.items.push(new InvoiceItem("", 0, 0)) 
    //});
    
    /** Navigation **/

    $('#fields').delegate('tr', 'mouseover', function() {
            $(this).find('.controls').show();
    });
    $('#fields').delegate('tr', 'mouseout', function() {
            $(this).find('.controls').hide();
    });

    
    $('#fields').delegate('.navigable', 'keydown', function(e) {
         if (e.keyCode == 37) { //left 
            $(this).closest('td').prev().find('.navigable').focus(); 
         }
        else if(e.keyCode == 39) { //right
             $(this).closest('td').next().find('.navigable').focus();   
        }
        else if(e.keyCode == 38) { //up
              var index = $(this).closest('td').index();
              $($(this).closest('tr').prev().find('td')[index]).find('.navigable').focus();  
        }
        else if(e.keyCode == 40) { //down
              var index = $(this).closest('td').index();
              $($(this).closest('tr').next().find('td')[index]).find('.navigable').focus();  
        }                  
        
    });
    
    /** VAT toggling **/
    $('#hasVat').click(function () {
        $(".hasVat").toggle(this.checked);
        invoiceProperties.hasVat = this.checked;
        refreshNumbers(invoiceProperties);
    });
    
    /** Currency **/
    $('#currencySelect').change(function() {
        $("#currencySelect option:selected").each(function () {
           invoiceProperties.currency = $(this).val();
            refreshNumbers(invoiceProperties);
       }); 
    });

	/** TODO: is this used? */
    $('.editable').click(function() {
        $(this).css('display', 'none');
        var tag_template  = '<input type="text" class="feo" value="{0}"/>';
        var input = $(tag_template.f($(this).text()));
        $(this).after(input);
        input.focus();
        input.blur(function() {
            var content = $(this).prev()
            content.text($(this).val());
            content.css('display', 'block');
            $(this).remove();
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
        var index = $(this).closest('tr').data("rownum");
        var qty = $('#qty' + index).data('value');
        var price = $('#price' + index).data('value');
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

    var vat_rate = convert($('#invoice_vat_rate'), numberPattern);

   
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

function isValid(str, pattern) {
    return str.match(pattern);
}

function convert(element, pattern) {
    if (!element.val()) {
        element.removeClass('invalid');
    } else if (!element.val().match(pattern)) {
        element.addClass('invalid');
        return null;
    } else {
        element.removeClass('invalid');
    }
    return element.val();

}

function refreshButtons() {
    //var class_ = 'noclick';
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

String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

function generateRow(rownum) {
    return '<tr class="sheet_row" data-rownum="{0}"> \
        <td><input id="description{0}" class="description navigable itemField" data-field-name="description" type="text" /></td>\
        <td><input id="qty{0}" class="navigable sensitive number qty itemField" data-field-name="qty" type="text" /></td>\
        <td><input id="price{0}" class="navigable sensitive number price itemField" data-field-name="price" type="text" /></td>\
        <td><input id="amount{0}" class="navigable sensitive amount number itemField" data-field-name="amount" type="text" /></td>\
        <td class="right">\
            <div class="btn-group controls">\
                <a class="up navigable btn btn-small"><i class="icon-arrow-up"></i></a>\
                <a class="down navigable btn btn-small"><i class="icon-arrow-down"></i></a>\
                <a class="del navigable btn btn-small btn-danger" data-index="{0}" type="button"><i class="icon-trash icon-white"></i></a>\
                </div>\
                </td>\
        </tr>'.f(rownum);
}

function populateRow(rownum, description, qty, price, amount) {
    $('#description'+rownum).val(description);
    $('#qty'+rownum).val(qty);
    $('#qty'+rownum).data('value',qty);
    $('#price'+rownum).val(price);
    $('#price'+rownum).data('value',price);
}

function findNextRownum() {
    var rownums = $.map($('.sheet_row'), function (it, index) {
        return $(it).data('rownum')
    });
    return Math.max.apply(null, rownums) + 1;
}

function moveUp(a) {
    if (a.prev() != null) {
        a.insertBefore(a.prev())
    }
}

function moveDown(a) {
    if (a.next() != null) {
        a.insertAfter(a.next())
    }
}

    

  function collectPayload(invoiceProperties) {
    var items = [];

    $('.sheet_row').each(function() {
         var fields = new Object();
         fields["description"] = $(this).find("input[id^=description]").val();
         fields["qty"] = $(this).find("input[id^=qty]").val();
         fields["price"] = $(this).find("input[id^=price]").data("value");
         fields["amount"] = $(this).find("input[id^=amount]").data("value");
         items.push(fields);
    });
   
    
    var sender = {
        "company_name": $('#company_name').val(),
        "company_registration_number": $('#company_reg').val(),
    }
    if($('#company_vat').val()) {
        sender["company_vat_registration"] = $('#company_vat').val()
    }

   // alert(JSON.stringify(sender));


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

function populatePayload(invoiceJson, invoiceProperties) {
    $('#company_name').val(invoiceJson.sender.company_name);
    $('#company_reg').val(invoiceJson.sender.company_registration_number);
    $('#company_vat').val(invoiceJson.sender.company_vat_registration);

    $('#invoice_number').val(invoiceJson.number);
    $('#invoice_date').val(invoiceJson.date);

    invoiceProperties.hasVat = invoiceJson.is_vat;

    var i = 0;
    $.each(invoiceJson.invoice_data.items, function(item){
        generateRow(i);
        populateRow(i, item.description, item.qty, item.price, item.amount);
        i++;
    });


    $('#client_name').val(invoiceJson.recipient.name);
    $('#client_address_1').val(invoiceJson.recipient.address.line1);
    $('#client_address_2').val(invoiceJson.recipient.address.line2);
    $('#client_town').val(invoiceJson.recipient.address.town);
    $('#client_postcode').val(invoiceJson.recipient.address.postcode);
    $('#client_country').val(invoiceJson.recipient.address.country);
    $('#invoice_vat_rate').data('value', invoiceJson.vat_rate);

    refreshNumbers(invoiceProperties);

}

