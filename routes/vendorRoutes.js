var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../middleware/authVendor');
var vendorController = require('../controllers/vendorController');

router.post(
	'/register',
	vendorController.register
)

router.post(
	'/signIn',
	passport.authenticate("local-ven"),
	vendorController.signIn
)

router.patch(
	'/edit-vendor',
	authenticate.verifyVendor,
	vendorController.editVendor
)

router.post(
	'/addStockProduct',
	authenticate.verifyVendor,
	vendorController.addStockProduct
);

router.patch(
	'/editStockProduct/:id',
	authenticate.verifyVendor,
	vendorController.editStockProduct
);

router.delete(
	'/deleteStockProduct/:id',
	authenticate.verifyVendor,
	vendorController.deleteStockProduct
);

router.post(
	'/addStockCategory',
	authenticate.verifyVendor,
	vendorController.addStockProduct
);

router.patch(
	'/editStockCategory/:id',
	authenticate.verifyVendor,
	vendorController.editStockProduct
);

router.delete(
	'/deleteStockCategory/:id',
	authenticate.verifyVendor,
	vendorController.deleteStockProduct
);

router.get(
	'/viewStockProduct',
	authenticate.verifyVendor,
	vendorController.viewStockProduct
);

router.get(
	'/viewStockCategory',
	authenticate.verifyVendor,
	vendorController.viewStockProduct
);

module.exports = router;