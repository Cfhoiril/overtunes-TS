import mongoose from "mongoose";

export = mongoose.model('setting', new mongoose.Schema({
    Guild: { type: String },
    Stay: { type: Boolean, default: false },
    Announce: { type: Boolean, default: true },
    Dj: { type: Boolean, default: false },
    Message: { type: String, default: null },
    Channel: { type: String, default: null },
    Volume: { type: Number, default: 75 },
    Locale: { type: String, default: "en" }
}));