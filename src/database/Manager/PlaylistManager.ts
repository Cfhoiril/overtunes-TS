import mongoose from "mongoose";

export = mongoose.model('playlist', new mongoose.Schema({
    Song: { type: Array },
    User: { type: String },
    Playlist: { type: String }
}));