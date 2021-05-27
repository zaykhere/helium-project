const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Host'
    },
    referral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Referral' 
    },
    partner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner'
    },
    payment: {
        type: Number,
        required: true
    }
},{timestamps: true})

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;