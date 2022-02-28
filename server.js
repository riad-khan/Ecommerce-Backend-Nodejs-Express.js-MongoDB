const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const mongoose = require('mongoose');

const DB = process.env.MONGODB_URL.replace('<PASSWORD>',process.env.DB_PASSWORD)
mongoose.connect(DB)
.then(()=>{
    console.log("database connected successfully")
})
.catch(error =>{
    console.log(error)
})

const port = process.env.PORT || 3001;

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})