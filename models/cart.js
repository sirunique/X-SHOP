
module.exports = function Cart(oldCart){
    this.items = oldCart.items || []
    this.totalQty = oldCart.totalQty || 0   
    this.totalPrice = oldCart.totalPrice || 0


    this.add = (product)=>{
        const cartProductIndex = this.items.findIndex(cp =>{
            return cp.productId._id.toString() === product._id.toString();
        })

        let newQty = 1;
        let updatedCartItems = [...this.items]
        let updatedCartTotalQty = this.totalQty
        let updatedCartTotalPrice = this.totalPrice

        if(cartProductIndex >= 0){
            updatedCartItems[cartProductIndex].qty = this.items[cartProductIndex].qty + newQty;
            updatedCartItems[cartProductIndex].price = this.items[cartProductIndex].price + product.price;
            updatedCartTotalQty += newQty;
            updatedCartTotalPrice += product.price

        } else {
            updatedCartItems.push({
                productId: product,
                qty: newQty,
                price: product.price * newQty
            });
            updatedCartTotalQty += newQty;
            updatedCartTotalPrice += product.price 
        }
        const updateCart = {
            items: updatedCartItems,
            totalQty: updatedCartTotalQty,
            totalPrice: updatedCartTotalPrice
        }
        return updateCart
    }

    // Update Cart
    this.update = (product, qty)=>{
        const cartProductIndex = this.items.findIndex(cp =>{
            return cp.productId._id.toString() === product._id.toString();
        })

        let newQty = qty;
        let updatedCartItems = [...this.items];
        let updatedCartTotalQty = this.totalQty;
        let updatedCartTotalPrice = this.totalPrice;

        if(cartProductIndex >= 0){
            updatedCartTotalQty -= this.items[cartProductIndex].qty
            updatedCartTotalPrice -= this.items[cartProductIndex].price
            
            updatedCartItems[cartProductIndex].qty = newQty;
            updatedCartItems[cartProductIndex].price = product.price * this.items[cartProductIndex].qty
            updatedCartTotalQty += newQty
            updatedCartTotalPrice += this.items[cartProductIndex].price
        }
        else{
            updatedCartItems.push({
                productId: product,
                qty: newQty,
                price: product.price * newQty
            });
             updatedCartTotalPrice += product.price
             updatedCartTotalQty += newQty
        }
        const updateCart = {
            items: updatedCartItems,
            totalQty: updatedCartTotalQty,
            totalPrice: updatedCartTotalPrice
        }
        return updateCart
    }

    this.removeItem = function(product){
        const cartProductIndex = this.items.findIndex(cp =>{
            return cp.productId._id.toString() === product._id.toString();
        })

        const newCart = this.items.filter(cb=>{
            return cb.productId._id.toString() !== product._id.toString()
        })

        let updatedCartItems = [...this.items];
        let updatedCartTotalQty = this.totalQty;
        let updatedCartTotalPrice = this.totalPrice;

        if(cartProductIndex >= 0){
            updatedCartTotalQty -= updatedCartItems[cartProductIndex].qty
            updatedCartTotalPrice -= updatedCartItems[cartProductIndex].price
        } 
        const updateCart = {
            items: newCart,
            totalQty: updatedCartTotalQty,
            totalPrice: updatedCartTotalPrice
        }
        return updateCart
    }

    this.generateArray = ()=>{
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id])
        }
        return arr;
    }
    
}