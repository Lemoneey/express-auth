const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const PORT = process.env.PORT || 5005;
const dotenv = require('dotenv');

dotenv.config()

const app = express();

app.use(express.json());
app.use("/auth", authRouter)

async function bootstrap() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PSWD}@cluster0.vrqjs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)

        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
    } catch (err) {
        console.error(err);
    }
}

bootstrap()