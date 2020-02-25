const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/ShoppingCart")

const Product = require('../models/product')


const newProduct = [
    new Product({
        name: 'Bag',
        price: 100,
        description: 'Good Stuff',
        imageUrl: '/images/product/item-05.webp'
    }),
    new Product({
        name: 'Test',
        price: 100,
        description: 'Good Stuff',
        imageUrl: '/images/product/item-05.webp'
    }),
    new Product({
        name: 'Stem',
        price: 100,
        description: 'Good Stuff',
        imageUrl: '/images/product/item-05.webp'
    }),
    new Product({
        name: 'Keep',
        price: 100,
        description: 'Good Stuff',
        imageUrl: '/images/product/item-05.webp'
    }),
    new Product({
        name: 'Stuff',
        price: 100,
        description: 'Good Stuff',
        imageUrl: '/images/product/item-05.webp'
    }),
]

let done = 0;
for (let index = 0; index < newProduct.length; index++) {
    newProduct[index].save((err, result)=>{
        done++
        if(done === newProduct.length){
            exit();
        }
    })
}

function exit(){
    mongoose.disconnect();
}


