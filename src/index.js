import connectDB from "./db/index.js"
import { app } from './app.js'


const port = process.env.PORT || 5000;


connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.info(`Server is running on port ${port}`);
    })
}).catch((error)=>{
    console.error("MongoDB connection Failed: ",error);
})

