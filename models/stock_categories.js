var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockCategory = new Schema ({
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    image: { 
        type: String, 
        default: null 
    },
    vendor: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Vendor' 
    },
});

module.exports = mongoose.model('stockCategory', stockCategory); 
