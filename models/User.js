const { Schema, model } = require('mongoose');clearImmediate
const mongoose=require('mongoose')

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['alumni', 'alumni_manager'], required: true },
});

const User = model('User', userSchema);

// export default User;
module.exports=mongoose.model('User',userSchema)
