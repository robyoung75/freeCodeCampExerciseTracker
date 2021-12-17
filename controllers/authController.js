const UserModel = require("../models/user");
const ExerciseModel = require("../models/exercise")

// error handling
const handleErrors = (err) => {

  console.log({
    "err.code from handleErrors": err.code,
    "error.message from handleErrors": err.message,
  });

  // errors object returned 
  let errors = {
    users: "",
    message: "",
    exerciseDescription: "",
    exerciseDuration: "",
    exerciseIdParam: "",
  };

  // validation errors from UserSchema validators
  if (err.message.includes("user validation failed")) {
    // console.log("ERR.ERRORS ===>", err.errors)
    // console.log("ERR.ERRORS OBJECT VALUES", Object.values(err.errors))
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  // getAllUsers, no user collection found error
  if (err.message === "No user collection found") {
    errors.users = err.message
  }

  // exercise__POST no user found with query _id
  if (err.message.includes("Cast to ObjectId failed for value")) {
    errors.exerciseIdParam = "Query id cannot be found"
  }

  // exercise__POST description is required validated with schema
  if (err.message.includes("Please enter exercise description")) {
    errors.exerciseDescription = err.message
  }
  // exercise__POST duration is required validated with schema
  if (err.message.includes("Please enter a valid number representing minutes")) {
    errors.exerciseDuration = err.message
  }
  console.log(errors)
  return errors
}

// create 
// The returned response from POST /api/users with form data username will be an object with username and _id properties.

module.exports.createNewUser = async (req, res) => {
  let username = req.body.username


  try {
    let doc = await UserModel.create({ username: username })
    res.json(doc)

  } catch (err) {
    let errors = handleErrors(err)
    res.json({ errorMessage: errors })
  }

}

// get all users
// Each element in the array returned from GET /api/users is an object literal containing a user's username and _id.

module.exports.getAllUsers = async (req, res) => {
  try {
    let docs = await UserModel.find({});
    if (docs.length === 0 || !docs) {
      throw { message: "No user collection found" }
    } else {

      res.json(docs)
    }

  } catch (err) {
    let errors = handleErrors(err)
    res.json(errors)
  }
}

// You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
// The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.

module.exports.exercise_POST = async (req, res) => {
  let id = req.params._id
  // let id = "61bce9c61f53f7efaf9a73d0"
  const { description, duration, date, } = req.body;
  // console.log("exercise_POST", date)
  try {
    const userDoc = await UserModel.findById(id);

    const exercise = await ExerciseModel.create({
      username: userDoc.username,
      description: description,
      duration: duration,
      date: date,
    })

    const response = { username: userDoc.username, description: exercise.description, duration: exercise.duration, date: req.body.date.toDateString(), _id: id }

    console.log("exercise_POST", response);
    res.json(response);
  } catch (err) {
    handleErrors(err)
  }

}

// You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.

module.exports.exercises_GET = async (req, res) => {

  try {
    let exerciseDocs;

    let { from, to, limit } = req.query;
    // console.log(req.query)
    const userDoc = await UserModel.findById(req.params._id);

    if (from && to) {
      exerciseDocs = await ExerciseModel.find({ username: userDoc.username, date: { $gte: new Date(from), $lte: new Date(to) } }).limit(limit ? Number(limit) : 0)
    } else if (from) {
      exerciseDocs = await ExerciseModel.find({ username: userDoc.username, date: { $gte: new Date(from) } }).limit(limit ? Number(limit) : 0)
    } else if (to) {
      exerciseDocs = await ExerciseModel.find({ username: userDoc.username, date: { $lte: new Date(to) } }).limit(limit ? Number(limit) : 0)
    } else {
      exerciseDocs = await ExerciseModel.find({ username: userDoc.username }).limit(limit ? Number(limit) : 0)
    }


    let count = exerciseDocs.length;

    let exercisesReturn = await exerciseDocs.map(item => {
      return (
        {
          description: item.description,
          duration: item.duration,
          date: new Date(item.date).toDateString()
        }
      )
    });

    let response = { username: userDoc.username, count: count, _id: userDoc._id, log: exercisesReturn }
    console.log("USER_EXERCISE_RESPONSE >>>>>", response)

    res.json(response)

  } catch (err) {
    handleErrors(err)
  }

}
