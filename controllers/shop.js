const Product = require('../models/product')
const Cart = require('../models/cart')
const Order = require('../models/order')

exports.getIndex = (req, res, next)=>{
    res.render('shop/index')
}

exports.getProducts = (req, res, next)=>{
    Product.find()
    .select('_id name price description imageUrl').exec()
    .then(products=>{
        res.render('shop/products',{
            products: products
        })
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    });
}

exports.getProduct = (req, res, next)=>{
    res.render('shop/product-details')
}

exports.getCart = (req, res, next)=>{
    const cart = req.appCart;
    if(!cart || cart.items.length === 0 ){
        return res.render('shop/cart',{
            products: null
        })
    } 

    if(!req.isAuthenticated()){
        return res.render('shop/cart',{
            products: cart, 
            totalPrice: cart.totalPrice
        });
    }
    else{
        cart
            .populate('items.productId')
            .execPopulate()
            .then(populateCart =>{
                filterForDeletedProd = populateCart.items.filter(cb =>{
                    return cb.productId !== null;
                });
                if(cart.items.length === filterForDeletedProd.length){
                    return res.render('shop/cart',{
                        products: cart, 
                        totalPrice: cart.totalPrice
                    });
                } 
                return req.user.clearCart();
            })
            .then(result=>{
                if(!result){
                    return redirect('/products');
                }
                return req.user.reUpdateCart(filterForDeletedProd);
            })
            .then(result=>{
                console.log(result);
                return res.render('shop/cart',{
                    products: result.cart, 
                    totalPrice: result.cart.totalPrice
                })
            })
            .catch(err => {
                console.log(err);
                const error = new Error(err)
                error.httpStatusCode = 500;
                return next(error)
            });
    }
}

exports.getCheckout = (req, res, next)=>{
    const cart = req.appCart;
    if(!cart){
        return res.redirect('/')
    }else{
        res.render('shop/checkout',{
            totalPrice: cart.totalPrice
        })
    }
}

exports.postCheckout = (req, res, next)=>{
    if(!req.isAuthenticated()) return res.redirect('/')

    const cart = req.appCart;
    console.log(cart)
    if(!cart){
        return res.redirect('/')
    } else{
        const order = new Order({
            user: req.user,
            cart: cart.items,
            name: req.body.name,
            address: req.body.address,
            paymentId: Math.random(),
        });
        order.save()
        .then(result=>{
            return req.user.clearCart()
        })
        .then(resD=>{
            return res.redirect('/account')
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error)
        });
    }
}

exports.removeItem = (req, res, next)=>{
    const cart = req.appCart;
    const productId = req.params.id;
    
    Product.findById(productId)
    .then(product=>{
        if(req.isAuthenticated()){
            return req.user.removeItem(product);
        }
        else{
            const dCart = new Cart(cart ? cart : {});
            let newCart = dCart.removeItem(product);
            req.session.cart = newCart;
            return req.session.save();
        }
    })
    .then(result=>{
        res.redirect('/cart')
    })
    .catch(err=>{
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}

exports.changeQty = (req, res, next)=>{
    const cart = req.appCart;
    const productId = req.params.id
    const productQty = JSON.parse(req.body.qty)

    Product.findById(productId)
    .then(product=>{
        if(req.isAuthenticated()){
            return req.user.update(product, productQty)
        } else{
            if(!req.session.cart){
                return res.redirect('/')
            }
            const dCart = new Cart(req.session.cart)
            let newCart = dCart.update(product, productQty)
            req.session.cart = newCart
            return req.session.save()
        }
    })
    .then(result=>{
        res.status(200).json({
            status: true,
            message: 'cart updated successfully'
        })
    })
    .catch(err=>{
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}

exports.addToCart = (req, res, next)=>{
    const cart = req.appCart;
    const productId = req.params.id

    Product.findById(productId)
    .then(product=>{
        if(req.isAuthenticated()){
            return req.user.addToCart(product)
        } else{
            const dCart = new Cart(cart ? cart : {})
            let newCart = dCart.add(product)
            req.session.cart = newCart
            return req.session.save()
        }
    })
    .then(result =>{
        console.log(result)
        res.redirect('/products')
    })
    .catch(err=>{
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}

