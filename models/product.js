const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const productSchema = new Schema({
    name: {
        type: String, required: true
    },
    price: {
        type: Number, required: true
    },
    // total:{
    //     type: Number, required: true
    // },
    // category:{
    //     type: Number, // required: true
    // },
    description:{
        type: String, // required: true
    },
    imageUrl: {
        type: String, // required: true
    },
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Admin',
    //     required: true
    // }
});

module.exports = mongoose.model('Product', productSchema);