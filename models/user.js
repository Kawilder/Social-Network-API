const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: {
      validator: function(i) {
        return /.+\@.+\..+/.test(i)
      },
      message: email => `${email.value} is not a valid email!`
    },
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  thoughts: [
    {
      type: String,
      ref: 'Thought'
    }
  ]
},
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;