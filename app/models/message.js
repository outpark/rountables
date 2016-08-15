const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: implement this
const messageSchema = new Schema({
  groupchatId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  color: String,
  created_at {type:Date, default:Date.now},
});


const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
