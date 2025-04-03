
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors())
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get('/', (req,res) =>{
    res.send('hello world!')
});

export default app;