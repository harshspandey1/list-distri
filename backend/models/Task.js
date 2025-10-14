const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    firstName: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
    // Add this status field
    status: { type: String, enum: ['active', 'completed'], default: 'active' }
}, { timestamps: true }); // Add timestamps for creation date

module.exports = mongoose.model('Task', TaskSchema);