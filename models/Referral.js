const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
    name:{
        type: String,
        required: true,
        maxLength: 80
    },
    email: {
        type: String,
        maxLength: 40
    },
    hntAddress: {
        type: String,
        maxLength: 80
    },
    mobile: {
        type: String,
        maxLength: 12
    },
    toBePaid: {
        type: Number,
    },
    paid: {
        type: Number
    }
});

const Referral = mongoose.model("Referral", referralSchema);
module.exports = Referral;