var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockProduct = new Schema({
	name: { type: String, defualt: '' },
	price: { type: Number },
	stockProduct_category: {
		type: mongoose.Types.ObjectId,
		ref: 'stockCategory',
	},
    quantity: {type: Number, default: 0},
	vendor: { type: mongoose.Types.ObjectId, ref: 'Vendor' },
});

module.exports = mongoose.model('stockProduct', stockProduct);
