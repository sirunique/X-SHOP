const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
            qty: {
                type: Number,
            },
            price: {
                type: Number,
            }
        }],
        totalQty: {
            type: Number,
        },
        totalPrice: {
            type: Number,
        }
    }
})

accountSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex(cp =>{
        return cp.productId._id.toString() === product._id.toString();
    });

    let newQty = 1;
    let updatedCartItems = [...this.cart.items] || [];
    let updatedCartTotalQty = this.cart.totalQty || 0;
    let updatedCartTotalPrice = this.cart.totalPrice || 0;

    // return 0 product already exist in cart .. update the qty
    if(cartProductIndex >= 0){
        updatedCartItems[cartProductIndex].qty = this.cart.items[cartProductIndex].qty + newQty
        updatedCartItems[cartProductIndex].price = this.cart.items[cartProductIndex].price + product.price 
        updatedCartTotalQty += newQty
        updatedCartTotalPrice += product.price
    } 
    // return -1  product does not exist insert new product to the cart
    else{
        updatedCartItems.push({
            productId: product._id,
            qty: newQty,
            price: product.price * newQty,
        });
        updatedCartTotalQty += newQty
        updatedCartTotalPrice += product.price
    }

    const updateCart = {
        items: updatedCartItems,
        totalQty: updatedCartTotalQty,
        totalPrice: updatedCartTotalPrice
    };
    this.cart = updateCart;
    return this.save();
}

accountSchema.methods.addSessionCartToDB = function(cart){
    
    let updatedCartItems = [...this.cart.items] || [];
    let updatedCartTotalQty = this.cart.totalQty || 0;
    let updatedCartTotalPrice = this.cart.totalPrice || 0;


    for (let i = 0; i < cart.length; i++) {
        const cartProductIndex = this.cart.items.findIndex(cp =>{
            return cp.productId._id.toString() === cart[i].productId._id.toString();
        })
        if(cartProductIndex >= 0){
            updatedCartTotalPrice -= this.cart.items[cartProductIndex].price;
            
            updatedCartItems[cartProductIndex].qty = this.cart.items[cartProductIndex].qty + cart[i].qty;
            updatedCartItems[cartProductIndex].price = this.cart.items[cartProductIndex].qty * cart[i].productId.price;
            updatedCartTotalQty += cart[i].qty;
            updatedCartTotalPrice += this.cart.items[cartProductIndex].price;
        } 
        else{
            updatedCartItems.push({
                productId: cart[i].productId,
                qty: cart[i].qty,
                price: cart[i].productId.price * cart[i].qty
            });
            updatedCartTotalQty += cart[i].qty;
            updatedCartTotalPrice += cart[i].price; 
        }
    }

    const updateCart ={
        items: updatedCartItems,
        totalQty: updatedCartTotalQty,
        totalPrice: updatedCartTotalPrice
    }

    // return updateCart;

    this.cart = updateCart;
    return this.save();
}


accountSchema.methods.reUpdateCart = function(cart){
    // return cart;
    let updatedCartItems = [...this.cart.items] || [];
    let updatedCartTotalQty = this.cart.totalQty || 0;
    let updatedCartTotalPrice = this.cart.totalPrice || 0;

    for(let i=0; i< cart.length; i++){
        updatedCartItems.push({
            productId: cart[i].productId,
            qty: cart[i].qty,
            price: cart[i].price * cart[i].qty
        });
        updatedCartTotalQty += cart[i].qty;
        updatedCartTotalPrice += cart[i].price;
    }
    const updateCart = {
        items: updatedCartItems,
        totalQty: updatedCartTotalQty,
        totalPrice: updatedCartTotalPrice
    }
    this.cart = updateCart;
    return this.save()
}

accountSchema.methods.update = function(product, qty){
    const cartProductIndex = this.cart.items.findIndex(cp =>{
        return cp.productId._id.toString() === product._id.toString();
    });

    let newQty = qty;
    let updatedCartItems = [...this.cart.items] || [];
    let updatedCartTotalQty = this.cart.totalQty || 0;
    let updatedCartTotalPrice = this.cart.totalPrice || 0;

    if(cartProductIndex >= 0){
        updatedCartTotalQty -= this.cart.items[cartProductIndex].qty
        updatedCartTotalPrice -= this.cart.items[cartProductIndex].price;

        updatedCartItems[cartProductIndex].qty = newQty;
        updatedCartItems[cartProductIndex].price = product.price * this.cart.items[cartProductIndex].qty;  
        updatedCartTotalQty += newQty;
        updatedCartTotalPrice += this.cart.items[cartProductIndex].price;
    } 
    else{
        updatedCartItems.push({
            productId: product,
            qty: newQty,
            price: product.price * newQty
        });
        updatedCartTotalPrice += product.price * newQty;
        updatedCartTotalQty += newQty;
    }
   
    const updateCart = {
        items: updatedCartItems,
        totalQty: updatedCartTotalQty,
        totalPrice: updatedCartTotalPrice
    }

    this.cart = updateCart;
    return this.save();
}

accountSchema.methods.removeItem = function(product){
    const cartProductIndex = this.cart.items.findIndex(cp =>{
        return cp.productId._id.toString() === product._id.toString();
    });

    const newCart = this.cart.items.filter(cb=>{
        return cb.productId._id.toString() !== product._id.toString();
    })

    let updatedCartItems = [...this.cart.items] 
    let updatedCartTotalQty = this.cart.totalQty 
    let updatedCartTotalPrice = this.cart.totalPrice

    if(cartProductIndex >= 0){
        updatedCartTotalQty -= updatedCartItems[cartProductIndex].qty
        updatedCartTotalPrice -= updatedCartItems[cartProductIndex].price
    }

    const updateCart = {
        items: newCart,
        totalQty: updatedCartTotalQty,
        totalPrice: updatedCartTotalPrice
    }
    this.cart = updateCart
    return this.save()
}

accountSchema.methods.clearCart = function(){
    this.cart = {
        items: [],
        totalQty: 0,
        totalPrice: 0,
    };
    return this.save()
}

accountSchema.methods.generateArray = ()=>{
    let arr = []
    for(let id in this.cart.items){
        arr.push(this.items[id])
    }
    return arr;
}

accountSchema.methods.encryptPassword = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

accountSchema.methods.comparePassword = (password, hashedPassword)=>{
    return bcrypt.compareSync(password, hashedPassword);
}

module.exports = mongoose.model('Account', accountSchema);