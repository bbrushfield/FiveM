
const mongoose = require('mongoose')
const { MONGOURI } = require('./../config');
module.exports = async () => {
  await mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  console.log('Mongoose Connected Successfully.')
  return mongoose
}

