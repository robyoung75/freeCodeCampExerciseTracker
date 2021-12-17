const validDate = (req, res, next) => {
  let dateString;
  let dateRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
  let regexTest = dateRegex.test(req.body.date)

  if (req.body.date === "" || req.body.date === undefined || !regexTest) {
    dateString = new Date()
  } else {
    dateString = new Date(req.body.date)
  }

  req.body.date = dateString;
  next()
}

module.exports = validDate