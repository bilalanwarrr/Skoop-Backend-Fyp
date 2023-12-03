var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../middleware/authRes');
var restaurantController = require('../controllers/restaurantController');

router.get('/otp/:email', restaurantController.getOtp);
router.get('/otpVerify/:email/:otp', restaurantController.verifyOtp);
router.get(
	'/restaurant',
	authenticate.verifyRestaurant,
	restaurantController.getRestaurant
);
router.get(
	'/get-singlefooditem/:id',
	authenticate.verifyRestaurant,
	restaurantController.getSingleFoodItem
);
router.get(
	'/get-ordersbystatus/:status',
	authenticate.verifyRestaurant,
	restaurantController.getOrdersByStatus
);
router.get(
	'/get-singleaddress/:id',
	authenticate.verifyRestaurant,
	restaurantController.getSingleAddress
);
router.get(
	'/get-customer/:id',
	authenticate.verifyRestaurant,
	restaurantController.getCustomerDetails
);
router.get(
	'/viewfoodcategory',
	authenticate.verifyRestaurant,
	restaurantController.viewFoodCategory
);

router.get(
	'/get-allfooditemsnames',
	authenticate.verifyRestaurant,
	restaurantController.viewFoodNamesOnly
);

router.get(
	'/viewallcategorynames',
	authenticate.verifyRestaurant,
	restaurantController.viewFoodCategoryNameOnly
);

router.get(
	'/viewfooditems',
	authenticate.verifyRestaurant,
	restaurantController.viewFoodItems
);
router.get(
	'/single-fooddeal/:id',
	authenticate.verifyRestaurant,
	restaurantController.getSingleDeal
);
router.get(
	'/all-fooddeals',
	authenticate.verifyRestaurant,
	restaurantController.getAllDeals
);
router.get(
	'/restaurant',
	authenticate.verifyRestaurant,
	restaurantController.getRestaurant
);
router.get(
	'/datalastweek',
	authenticate.verifyRestaurant,
	restaurantController.getOrdersOfLastWeek
);
router.get(
	'/withdraw',
	authenticate.verifyRestaurant,
	restaurantController.withdrawRestaurant
);
router.post('/register', restaurantController.register);
router.post(
	'/sign-in',
	passport.authenticate('local-res'),
	restaurantController.signIn
);
router.post(
	'/add-category',
	authenticate.verifyRestaurant,
	restaurantController.addCategory
);
router.post(
	'/add-fooditem',
	authenticate.verifyRestaurant,
	restaurantController.addFoodItem
);
router.post(
	'/add-fooddeal',
	authenticate.verifyRestaurant,
	restaurantController.addFoodDeal
);
router.patch(
	'/edit-restaurant',
	authenticate.verifyRestaurant,
	restaurantController.editRestaurant
);
router.patch(
	'/add-location',
	authenticate.verifyRestaurant,
	restaurantController.addLocation
);
router.patch(
	'/cancel-order/:id',
	authenticate.verifyRestaurant,
	restaurantController.cancelOrder
);
router.patch('/reset-password', restaurantController.passwordReset);
router.patch(
	'/change-password',
	passport.authenticate('local-res'),
	restaurantController.passwordChange
);
router.patch(
	'/edit-foodcategory/:id',
	authenticate.verifyRestaurant,
	restaurantController.editFoodCategory
);
router.patch(
	'/opening',
	authenticate.verifyRestaurant,
	restaurantController.openCloseRestaurant
);
router.patch(
	'/edit-fooditem/:id',
	authenticate.verifyRestaurant,
	restaurantController.editFoodItem
);
router.patch(
	'/edit-fooddeal/:id',
	authenticate.verifyRestaurant,
	restaurantController.editFoodDeal
);
router.patch(
	'/openinghours',
	authenticate.verifyRestaurant,
	restaurantController.addOpeningHours
);
router.patch(
	'/updatewallet',
	authenticate.verifyRestaurant,
	restaurantController.updateWallet
);
router.delete(
	'/delete-foodcategory/:fid',
	authenticate.verifyRestaurant,
	restaurantController.deleteCategory
);
router.delete(
	'/delete-fooditem/:fid',
	authenticate.verifyRestaurant,
	restaurantController.deleteFoodItem
);
router.delete(
	'/delete-fooddeal/:id',
	authenticate.verifyRestaurant,
	restaurantController.deleteFoodDeal
);
router.delete(
	'/delete/:id',
	authenticate.verifyRestaurant,
	restaurantController.deleteAccount
);

router.get(
	'vendorItem/:id',
	authenticate.verifyRestaurant,
	restaurantController.getVendorItems
);

router.get(
	'/all-vendors/',
	authenticate.verifyRestaurant,
	restaurantController.getAllVendors
);

router.get(
	'/all-products/',
	authenticate.verifyRestaurant,
	restaurantController.getAllProducts
);

router.post(
	'manualOrderStock/:id/:quantity',
	authenticate.verifyRestaurant,
	restaurantController.manualOrderStock
);

module.exports = router;
