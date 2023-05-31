import mongoose from 'mongoose'
import usersModel from './model/users.js'


export default async function () {
  await mongoose.connect('mongodb+srv://m74:jerry123@cluster0.pm0jwkh.mongodb.net/facebook?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  return { usersModel }
}
