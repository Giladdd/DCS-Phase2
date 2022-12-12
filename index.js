require("dotenv").config();
const express = require("express");
const cors = require("cors");
const  { userRouter }  = require("./routes/userRoutes");

// Configurations //
const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users', userRouter);

app.use((req, res) => {
    res.status(400).send('Something is broken!');
});

// Connection //
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));