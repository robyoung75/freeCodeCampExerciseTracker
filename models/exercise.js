const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    lowercase: true,
    maxlength: 50,
    minLength: 6,
  },

  description: {
    type: String,
    required: [true, "Please enter exercise description"],
    lowercase: true,
    maxlength: 200,
    minLength: 2,
  },
  duration: {
    type: Number,
    required: [true, "Please enter a valid number representing minutes"],
  }, 
  date: {
    type: Date,
    default: Date.now,
  },
 
});


// mongoose middleware
// this function will fire just before the document is created
exerciseSchema.pre('save', async function(next) {
  console.log('New exercise data is about to be saved');
  next();
});

// this function will fire just after the document is create
exerciseSchema.post("save", function(doc, next) {
  console.log("New exercise data saved", doc);
  next();
});

const ExerciseModel = mongoose.model("exercise", exerciseSchema);

module.exports = ExerciseModel;