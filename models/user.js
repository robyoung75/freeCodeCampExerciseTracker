const mongoose = require('mongoose');
const ExerciseModel = require("./user")

const Schema = mongoose.Schema;

const userSchema = new Schema ({
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    lowercase: true,
    maxlength: 50,
    minLength: 6,
  },
 
});


// mongoose middleware
// this function will fire just before the document is created
userSchema.pre('save', async function(next) {
  console.log('New user is going to be saved');
  next();
});

// this function will fire just after the document is create
userSchema.post("save", function(doc, next) {
  console.log("A new user was saved", doc);
  next();
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel