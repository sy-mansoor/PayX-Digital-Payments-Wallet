
const mongoose = require('mongoose');
    const NotificationSchema = new mongoose.Schema({
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who receives the notification
        required: true
      },
      type: {
        type: String,
        enum: ['request'],
        required: true
      },
      message: {
        type: String,
        required: true
      },
      relatedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user related to the notification (e.g., sender)
        required: true
      },
       amount: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    });
    module.exports = mongoose.model('Notification', NotificationSchema);
