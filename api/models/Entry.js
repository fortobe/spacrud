const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EntrySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Entry = mongoose.model('entries', EntrySchema);

module.exports = Entry;