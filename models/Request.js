const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
    networkName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 24 * 60 * 60 * 1000,
        default: Date.now
    }
});

RequestSchema.statics.isExistingRequest = async function isValidRequest(networkName, userId, callback) {
    return this.count({networkName: networkName, userId: userId}, callback);
};

RequestSchema.statics.storeRequest = async function storeRequest(networkName, userId, callback) {
    const request = new this({
        networkName: networkName,
        userId: userId,
    });
    return request.save();
};




module.exports = mongoose.model('Request', RequestSchema);