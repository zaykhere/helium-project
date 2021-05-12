const mongoose = require("mongoose");

const hotspotSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
    hotspot: {
        type: String
    }
});

const Hotspot = mongoose.model("Hotspot", hotspotSchema);
module.exports = Hotspot;