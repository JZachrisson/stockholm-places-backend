const mongoose = require('mongoose');
const uniqueValidator = require('moongose-unique-validator');

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [
    {
      type: moongose.Types.ObjectId,
      required: true,
      ref: 'Place',
    },
  ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
