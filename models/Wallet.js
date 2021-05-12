const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
    wallet: {
        type: String
    }
});

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;