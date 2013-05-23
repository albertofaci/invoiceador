$(document).ready(function () {

    var sheet = new InvoiceSheet();
    sheet.hasVat = true;
    sheet.items[0] = new InvoiceItem("", 0, 0);
    $(generateRow(0)).insertBefore('#lastRow');

    refreshButtons();
    refreshNumbers(sheet);

    $('a.prevent-default').click(function(e) {
        e.preventDefault();
    });

    initializeInvoiceadorForm(sheet);

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
        var payload = collectPayload(sheet);

        if(sheet.shortid) {
            $.ajax({
                type: "PUT",
                url: "/invoices/"+sheet.shortid,
                // The key needs to match your method's input parameter (case-sensitive).
                data: payload,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    $('body').fadeOut('fast', function() {
                        window.location.href = "/"+sheet.shortid;
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
                success: function(data){
                    $('body').fadeOut('fast', function() {
                        window.location.href = "/"+data;
                    });
                },
                failure: function(errMsg) {
                    alert("The invoice could not be recorded due to an error. Try again later");
                }
            });

        }

       
    });


    


    function loadIfNecessary(hash) {

            $.ajax({
                type: "GET",
                url: "/invoices/"+hash,
                // The key needs to match your method's input parameter (case-sensitive).
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    alert(data+" "+data.number)
                },
                failure: function(errMsg) {
                    alert("The invoice could not be retrieved due to an error. Try again later");
                }
            });

    }

      $('#load').click(function() {
            var hash = $(this).data("hash");
            alert('load is '+hash)
            loadIfNecessary(hash);
      });

});