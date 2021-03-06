const mongoose = require( 'mongoose' );
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

const schema = new Schema({
  description: {
    type: String,
    required: true
  },
  duedate: {
    type: String
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  contextId: {
    type: Schema.Types.ObjectId,
    ref: 'Context'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Task', schema);
