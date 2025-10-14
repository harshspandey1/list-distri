const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AgentSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true }, // fixed spelling
    password: { type: String, required: true }
});

module.exports = mongoose.model('Agent', AgentSchema);
