const mongoose = require('mongoose')
const connectionString = 'mongodb+srv://guillermo:OtC5FEYz9qSDYwUC@cluster0.qxuyg.mongodb.net/notes?retryWrites=true&w=majority'
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