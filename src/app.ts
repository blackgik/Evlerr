import express, {Request, Response} from "express";


const app = express();
const port  = process.env.PORT ||3000;


//routing
app.get("/", (req: Request,res:Response)=> {
    res.send("hello world")
})

app.listen(port, ()=> {
    console.log(`server is up on port ${port}`)
})