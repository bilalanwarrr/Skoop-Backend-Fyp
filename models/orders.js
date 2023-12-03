var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Order = new Schema(
	{
		scooper: { type: mongoose.Types.ObjectId, ref: 'Customer' },
		customer: { type: mongoose.Types.ObjectId, ref: 'Customer' },
		address: { type: mongoose.Types.ObjectId, ref: 'DeliveryAddress' },
		status: { type: Number, default: 0 },
		delivery_charges: { type: Number, default: 0 },
		tip: { type: Number, default: 0 },
		special_instructions: { type: String },
		requests: {
			type: [
				{
					user: {
						type: mongoose.Types.ObjectId,
						ref: 'Customer',
					},
					distance: {
						type: Number,
						default: 0,
					}
				},
			],
		},
		time: {
			default: null,
			type: Number,
		},
		requested: {
			type: Boolean,
			default: false,
		},
		foodItems: {
			type: [
				{
					item: {
						type: mongoose.Types.ObjectId,
						ref: 'FoodItem',
					},
					quantity: {
						type: Number,
					},
					price: {
						type: Number,
					},
				},
			],
		},
		tax: { type: Number },
		total: { type: Number },
		subtotal: { type: Number },
		cancelReason: { type: String, default: null },
		scooperReview: {
			reviewer: { type: mongoose.Types.ObjectId, ref: 'Customer' },
			rating: { type: Number, default: 0 },
			message: { type: String, default: '' },
		},
		restaurantTime: { type: Date, default: null },
		completeTime: { type: Date, default: null },
		remainingTime: { type: 'String', default: '' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', Order);
