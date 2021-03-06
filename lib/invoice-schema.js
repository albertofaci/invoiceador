var invoiceSchemaDefinition = {
	public_hash: String,
	private_data : {
		hash: String,
		revision: Number,
		created_date_time : Date,
		modified_date_time : Date,
	},
	invoice: {	
		number:  	String,
		date: 	String,
		is_vat:   Boolean,
		sender: 	{  
			company_name: String,
			company_registration_number: String,
			company_vat_registration: String
		}, 
		recipient: { 
			name: String, 
			address: {
				line1: String,
				line2: String,
				town: String,
				postcode: String,
				country: String
			}
		},
		vat_rate: Number,
		invoice_data: {
			items: [{
				description: String,
				price: Number,
				qty: Number,
				amount: Number
			}],
			subtotal: Number,
			vat: Number,
			total: Number
		},
		additional_info: String
	}
}

var blank_invoice = {
	private_data : {},
	invoice: {	
		sender: {}, 
		recipient: { address: {} },
		invoice_data: {items: []}}
}

module.exports.register = function(mongoose) {
		var Schema = mongoose.Schema;
		var Invoices = new Schema(invoiceSchemaDefinition);
		return mongoose.model('Invoice', Invoices);
}

module.exports.blank = blank_invoice;

