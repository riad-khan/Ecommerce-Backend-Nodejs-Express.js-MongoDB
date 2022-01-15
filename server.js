const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_LOCAL_URL)
.then(()=>{
    console.log("database connected successfully")
})
.catch(error =>{
    console.log("Db connection Failed")
})

const port = process.env.PORT || 3001;

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})