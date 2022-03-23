const mongoose = require('mongoose')
const connectionString = ''
const {Schema} = mongoose
//conexion a mongodb

mongoose.connect(connectionString).then(() => {
    console.log('database connected');
}).catch(err =>{
    console.log(err);
})


const noteSchema = new Schema({
    content: String,
    date: Date,
    important: Boolean,
})
