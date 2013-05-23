function InvoiceItem(description, qty, price) {
    this.description = description;
    this.qty = qty;
    this.price = price;
}   
InvoiceItem.prototype = {
    get amount() {
        return this.qty * this.price;
    }
}

function InvoiceSheet() {
   this.items = new Array();
}
InvoiceSheet.prototype = {
    get shortid() {
        return this._shortid;
    },
    set shortid(val) {
        this._shortid = val;
    },
    get currency() {
        return this._currency;
    },
    set currency(val) {
        this._currency = val;
    },
    get hasVat() {
        return this._hasVat;
    },
    set hasVat(val) {
        this._hasVat = val;
    },
    get subtotal() {
        return this._subtotal;
    },
    set subtotal(val) {
        this._subtotal = val;
    },
    get vat() {
        return this._vat;
    },
    set vat(val) {
        this._vat = val;
    },
    get total() {
        return this._total;
    },
    set total(val) {
        this._total = val;
    }
}

InvoiceSheet.prototype.addItem = function(item) {
    this.items.push(item);
}  
InvoiceSheet.prototype.items = function() {
   return this.items;  
}