import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    lastName: {
      type: String,
      default: 'lastName',
    },
    location: {
      type: String,
      default: 'my city',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: String,
    avatarPublicId: String,
  },
  { timestamps: true }
)

UserSchema.methods.toJSON = function () {
  // turn the current user instance to a JS object
  var obj = this.toObject()
  // remove the password property in the JS object to hide the password
  delete obj.password
  // Note: the user password in the database is not deleted
  return obj
}

export default mongoose.model('User', UserSchema)
