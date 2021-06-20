const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const conn = mongoose.connection;

conn.once('open', ()=>{
    console.log("MongoDB Connection established");
});

const eventRouter = require('./routes/event');
const attendanceRouter = require('./routes/attendance');
const userRouter = require('./routes/users');

app.use('/event',eventRouter);
app.use('/attendance',attendanceRouter);
app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})