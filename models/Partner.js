const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
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

const Partner = mongoose.model("Partner", partnerSchema);
module.exports = Partner;