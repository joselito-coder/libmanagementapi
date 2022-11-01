const mongoose = require('mongoose');

const connectDb = (connectionString)=>{

   return mongoose.connect(connectionString);

}

module.exports = connectDb;