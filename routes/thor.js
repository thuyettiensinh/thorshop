var express = require('express');
var router = express.Router();

const ThorMiddleWare = require('../middlewares/thor')
const ThorController = require('../controllers/thor')

/**
 * Home
 */
router.get('/', ThorMiddleWare.auth, ThorController.index)

/**
 * Authentication
 */
router.get('/login', ThorMiddleWare.isLoggedIn, ThorController.showLogin)
router.post('/login', ThorController.login)
router.get('/logout', ThorController.logout)

/**
 * Category management
 */
router.get('/category', ThorMiddleWare.auth, ThorController.indexCategory)
router.get('/category/create', ThorMiddleWare.auth, ThorController.createCategory)
router.post('/category/store', ThorMiddleWare.auth, ThorController.storeCategory)
router.get('/category/edit/:id', ThorMiddleWare.auth, ThorController.editCategory)
router.post('/category/update/:id', ThorMiddleWare.auth, ThorController.updateCategory)
router.get('/category/delete/:id', ThorMiddleWare.auth, ThorController.deleteCategory)


/**
 * Product management
 */
router.get('/product', ThorMiddleWare.auth, ThorController.indexProduct)
router.get('/product/create', ThorMiddleWare.auth, ThorController.createProduct)
router.post('/product/store', ThorMiddleWare.auth, ThorController.storeProduct)
router.get('/product/edit/:id', ThorMiddleWare.auth, ThorController.editProduct)
router.post('/product/update/:id', ThorMiddleWare.auth, ThorController.updateProduct)
router.get('/product/delete/:id', ThorMiddleWare.auth, ThorController.deleteProduct)
router.all('/product/import', ThorMiddleWare.auth, ThorController.importProduct)

/**
 * Sell, sold management
 */
router.get('/sell', ThorMiddleWare.auth, ThorController.indexSell)
router.post('/sell/store', ThorMiddleWare.auth, ThorController.storeSell)
router.get('/sold', ThorMiddleWare.auth, ThorController.indexSold)
router.get('/sold/delete/:id', ThorMiddleWare.auth, ThorController.deleteOrder)
router.get('/sold/edit/:id', ThorMiddleWare.auth, ThorController.editOrder)
router.post('/sold/edit/:id', ThorMiddleWare.auth, ThorController.updateOrder)
router.get('/sold/pay-debt/:id', ThorMiddleWare.auth, ThorController.payInDebt)

module.exports = router;