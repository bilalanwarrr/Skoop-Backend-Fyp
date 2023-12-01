var passport = require('passport');
var nodemailer = require('nodemailer');
var authenticate = require('../middleware/auth');
var asyncHandler = require('../middleware/asyncHandler');
var ErrorHandler = require('../utils/error');
var Vendor = require('../models/vendor');
var stockProduct = require('../models/stock_products');
var stockCategory = require('../models/stock_categories');
var Order = require('../models/orders');

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

exports.editVendor = asyncHandler(async (req, res, next) => {
	console.log("Hello fuck")
	let update = {
		name: req.body.name,
		email: req.body.email,
		phone_number: req.body.phone_number,
		description: req.body.description,
		address: req.body.address,
		picture: req.body.picture,
	};
	if (req.user.email !== req.body.email) {
		var exists = await Vendor.findOne({
			email: req.body.email,
		});
		if (exists) {
			return res.status(409).json({
				message: 'Email already associated with a restaurant.',
			});
		}
	}
	await Vendor.findByIdAndUpdate(req.user._id, update);
	res.status(204).json();
});

exports.getVendor = asyncHandler(async (req, res) => {
	res.json({ vendor: req.user });
});


exports.addStockProduct = asyncHandler( async(req, res, next) => {
    
    
    var exist = await stockProduct.findOne({
		
		name: req.body.name,
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
    
    
    var exist = await stockCategory.findOne({
		
		title: req.body.title
	});
    if (exist) {
		return res.status(409).json({ message: 'Already exists.' });
	}
    
	const item = await stockCategory.create({
		vendor: req.user._id,
		title: req.body.title,
		description: req.body.description,
		image: req.body.image,
		
	});
	return res.status(201).json({item});
})

exports.editStockCategory = asyncHandler(async (req, res, next) => {
	let findCategories =  await stockCategory.findById(req.params.id)

	if (findCategories !== null){
	let update = {
		vendor: req.user._id,
		title: req.body.title,
		description: req.body.description,
		image: req.body.image,
	};

	await stockCategory.findByIdAndUpdate(req.params.id, update);
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
	const stockCategories = await stockCategory.find({
		vendor: req.user._id,
	});
	res.status(200).json({ stockCategories });
});

exports.deleteStockCategory = asyncHandler(async (req, res, next) => {

	let findCategories =  await stockCategory.findById(req.params.id)

	if (findCategories !== null){
	await stockCategory.deleteOne({
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

exports.predictionFunc = asyncHandler(async (req, res) => {
	
	const orders = await Order.find({}).populate('foodItems.item');

	const foodItemsData = {};
	orders.forEach(order => {
		order.foodItems.forEach(foodItem => {
			const itemId = foodItem.item.toString();
			const restaurantId = foodItem.item.restaurant.toString();
			if (restaurantId === req.params.id) {
				if (!foodItemsData[itemId]) {
					foodItemsData[itemId] = {
						totalItems: 0,
						time: 0,
					};
				}

				const timeTaken = `${order.createdAt.getUTCHours()}:${order.createdAt.getMinutes()}`;
				const [hoursStr, minutesStr] = timeTaken.split(':');
				const hours = parseInt(hoursStr, 10);
				const minutes = parseInt(minutesStr, 10);
				foodItemsData[itemId].time += hours * 60 + minutes;
				foodItemsData[itemId].totalItems += 1;
			}
		});
	});

	const foodItemNamesWithAvgTime = {};
	Object.keys(foodItemsData).forEach(itemId => {
		const itemData = foodItemsData[itemId];
		const time = itemData.time / itemData.totalItems;
		const hours = Math.floor(time / 60);
		const remainingMinutes = itemData.time % 60;
		const itemName = orders
			.flatMap(order =>
				order.foodItems.filter(item => item.item.toString() === itemId)
			)
			.map(item => item.item.name)[0];
		if (itemName) {
			foodItemNamesWithAvgTime[itemName] = `${hours}:${remainingMinutes}`;
		}
	});

	res.status(200).json({ data: foodItemNamesWithAvgTime });
});