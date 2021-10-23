 const mongoose = require('mongoose');
 
 const url = "mongodb+srv://gastro:Gastropods@brownberry@cluster0.zqpcx.mongodb.net/brownberry?retryWrites=true&w=majority"

 mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
      console.log("database connected")
  }).catch((err)=>{
      console.log(err)
  })
  
  process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose disconnected on app termination');
      process.exit(0);
    });
  });
 
 
const userSchema = new mongoose.Schema({
          userName: {type: String, required: true, trim: true},
          address: {type: String, required: true},
          landmark: {type: String, required: true},
          phone: {type: Number, required: true, minLength:9, maxLength:10, trim: true,},
          email: {type: String, required: true, lowercase: true, trim: true},
          password: {type: String, required: true},
          orderIds: [mongoose.Schema.Types.Mixed],
          registeredAt: {type: Date, required: true}


})

module.exports =new mongoose.model("user", userSchema)





