const express = require('express')
const router = express.Router();

const isAuth = require('../middleware/is-auth')

const shopController = require('../controllers/shop')

router.get('/', shopController.getIndex)
router.get('/products', shopController.getProducts)
router.get('/product', shopController.getProduct)
router.get('/cart', shopController.getCart)
router.get('/checkout', isAuth.accountAuth, shopController.getCheckout)
router.post('/checkout', isAuth.accountAuth, shopController.postCheckout)

router.get('/addToCart/:id', shopController.addToCart)
router.get('/remove/:id', shopController.removeItem)
router.post('/changeQty/:id', shopController.changeQty)

module.exports = router;