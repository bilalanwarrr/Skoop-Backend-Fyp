var passport = require('passport');
var nodemailer = require('nodemailer');
var authenticate = require('../middleware/auth');
var asyncHandler = require('../middleware/asyncHandler');
var ErrorHandler = require('../utils/error');
var Vendor = require('../models/vendor');
var stockProduct = require('../models/stock_products');
var stockCategories = require('../models/stock_categories');

exports.register = async (req, res, next) => {
	var exists = await Vendor.findOne({ email: req.body.email });
	if (exists) {
		next(new ErrorHandler('Vendor already exists.', 409));
	} else {
		try {
			const vendor = await Vendor.register(
				new Vendor({
					name: req.body.name,
					email: req.body.email,
					phone_number: req.body.phone_number,
				}),
				req.body.password
			);
			if (vendor) {
				try {
					await vendor.save();
					passport.authenticate('local-ven')(req, res, () => {
						res.status(201).json({
							success: true,
							status: 'Vendor Registration Successful!',
						});
					});
				} catch (error) {
					return next(error);
				}
			}
		} catch (error) {
			return next(error);
		}
	}
};

exports.signIn = asyncHandler(async (req, res) => {
	let token = authenticate.getToken({ _id: req.user._id });
	res.status(200).json({
		success: true,
		token: token,
		vendor: req.user,
	});
});


exports.addStockProduct = asyncHandler( async(req, res, next) => {
    
    
    var exist = await stockProduct.findOne({
		
		name: req.body.name.toLowerCase(),
	});
    if (exist) {
		return res.status(409).json({ message: 'Already exists.' });
	}
    
	const item = await stockProduct.create({
		vendor: req.user._id,
		name: req.body.name.toLowerCase(),
        price: req.body.price,
		description: req.body.description,
        stockProduct_category: req.body.stockProduct_category,
		image: req.body.image,
        quantity: req.body.quantity,
		
	});
	return res.status(201).json({item});
})

exports.editStockProduct = asyncHandler(async (req, res, next) => {
	let findProduct =  await stockProduct.findById(req.params.id)

	if (findProduct !== null){
	let update = {
		vendor: req.user._id,
		name: req.body.name.toLowerCase(),
		price: req.body.price,
		description: req.body.description,
		stockProduct_category: req.body.stockProduct_category,
		image: req.body.image,
		quantity: req.body.quantity,	
	};

	await stockProduct.findByIdAndUpdate(req.params.id, update);
	res.status(201).json({update});
}
else{
	return res.status(404).json({
		"success": false,
		"message": "Not Found!"
	})
}
});

exports.viewStockProduct = asyncHandler(async (req, res, next) => {
	const stockProducts = await stockProduct.find({
		vendor: req.user._id,
	});
	res.status(200).json({ stockProducts });
});

exports.deleteStockProduct = asyncHandler(async (req, res, next) => {

	let findProduct =  await stockProduct.findById(req.params.id)

	if (findProduct !== null){
	await stockProduct.deleteOne({
		_id: req.params.id,
	});
	res.status(204).json({});
}
else{
	return res.status(404).json({
		"success": false,
		"message": "Not Found!"
	})
}
});


exports.addStockCategory = asyncHandler( async(req, res, next) => {
    
    
    var exist = await stockCategories.findOne({
		
		name: req.body.name.toLowerCase(),
	});
    if (exist) {
		return res.status(409).json({ message: 'Already exists.' });
	}
    
	const item = await stockCategories.create({
		vendor: req.user._id,
		title: req.body.title.toLowerCase(),
		description: req.body.description,
		image: req.body.image,
		
	});
	return res.status(201).json({item});
})

exports.editStockCategory = asyncHandler(async (req, res, next) => {
	let findCategories =  await stockCategories.findById(req.params.id)

	if (findCategories !== null){
	let update = {
		vendor: req.user._id,
		title: req.body.title.toLowerCase(),
		description: req.body.description,
		image: req.body.image,
	};

	await stockCategories.findByIdAndUpdate(req.params.id, update);
	res.status(201).json({update});
}
else{
	return res.status(404).json({
		"success": false,
		"message": "Not Found!"
	})
}
});

exports.viewStockCategory = asyncHandler(async (req, res, next) => {
	const stockCategories = await stockCategories.find({
		vendor: req.user._id,
	});
	res.status(200).json({ stockCategories });
});

exports.deleteStockCategory = asyncHandler(async (req, res, next) => {

	let findCategories =  await stockCategories.findById(req.params.id)

	if (findCategories !== null){
	await stockCategories.deleteOne({
		_id: req.params.id,
	});
	res.status(204).json({});
}
else{
	return res.status(404).json({
		"success": false,
		"message": "Not Found!"
	})
}
});