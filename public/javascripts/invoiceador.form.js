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

function initializeInvoiceadorForm(sheet_) {

 	$('#invoice_date').val(getTodayDate());
    $('.datepicker').datepicker();
    
   /** currency formatting **/
    
   $('#fields').delegate('.price', 'blur', function() {
         $(this).data('value', $(this).val());
         $(this).formatCurrency({region: sheet_.currency});
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
        refreshNumbers(sheet_);
    });

    $('#addRow').click(function () {
        $(generateRow(findNextRownum())).insertBefore('#lastRow');
        refreshButtons(sheet_);
    });
        
    /** Object synch delegates **/
    
    
    
    $('#fields').delegate('.itemField', 'keyup', function() {
        var fieldName = $(this).data('field-name');
        var rownum = $(this).closest('tr').data('rownum');
        sheet_.items[rownum][fieldName] = $(this).val();
    });

    $('#addRow').click(function () {
        sheet_.items.push(new InvoiceItem("", 0, 0)) 
    });
    
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
        sheet_.hasVat = this.checked;
        refreshNumbers(sheet_);
    });
    
    /** Currency **/
    $('#currencySelect').change(function() {
        $("#currencySelect option:selected").each(function () {
           sheet_.currency = $(this).val();
            refreshNumbers(sheet_);
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


function refreshNumbers(sheet_) {
    
    $(".amount").each(function () {
        var index = $(this).closest('tr').data("rownum");
        var qty = $('#qty' + index).data('value');
        var price = $('#price' + index).data('value');
        if (qty && price) {
            var amount = round(qty * price);
            $(this).data('value', amount);
            $(this).val(amount);    
            $(this).formatCurrency({region: sheet_.currency}); 
        } else {
            $(this).val("");
        }
    });

 
    var subtotal = 0.0;
    $.each($('.amount'), function () {
        subtotal += round($(this).data('value')) || 0.0;
    });
    sheet_.subtotal = subtotal
    $('#subtotal').data('value', subtotal);
    $('#subtotal').val(subtotal);
    $('#subtotal').formatCurrency({region: sheet_.currency}); 

    var vat_rate = convert($('#vat_rate'), numberPattern);

   
    if(sheet_.hasVat) {
        var vat = round(subtotal * vat_rate / 100);
        sheet_.vat = vat;
        $('#vat').data('value', vat)
        $('#vat').val(vat);
        $('#vat').formatCurrency({region: sheet_.currency}); 
    }
    var total = sheet_.subtotal
    if(sheet_.hasVat) {
        total += sheet_.vat
    }
    sheet_.total = total;
    $('#total').data('value', total)
    $('#total').val(total);  
    $('#total').formatCurrency({region: sheet_.currency}); 
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

    

  function collectPayload(sheet_) {
    var items = [];
    for(var i=0; i<sheet_.items.length; i++) {
        var fields = new Object();;
        fields["description"] = sheet_.items[i]["description"]
        fields["qty"] = sheet_.items[i]["qty"]
        fields["price"] = sheet_.items[i]["price"]
        fields["amount"] = sheet_.items[i]["amount"]
        items.push(fields);
    }
   
    
    var sender = {
        "company_name": $('#company_name').val(),
        "company_registration_number": $('#company_reg').val(),
    }
    if($('#company_vat').val()) {
        sender["company_vat_registration"] = $('#company_vat').val()
    }


    var payload = JSON.stringify({
            "number": $('#invoice_number').val(),
            "date": $('#invoice_date').val(),
            "is_vat": sheet_.hasVat,
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
            "vat_rate": sheet_.vat_rate,
            "invoice_data": {
               "items": items,
               "subtotal": sheet_.subtotal,
               "vat": sheet_.vat,
               "total": sheet_.total, 
            }

    });
    return payload;
}

