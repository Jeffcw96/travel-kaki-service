const express = require('express');
const cors = require('cors');
const DB = require('./routes/db');
const app = express();
const corsOptions = {
    origin: 'https://travel-kaki.netlify.app',
    optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions));
// app.use(cors())
require('dotenv').config();
app.use(express.json({ extended: false }));

app.use("/api", require("./routes/google"));
app.use("/user", require("./routes/auth"));
app.use(require("./routes/user"))
app.get("/connection", (req, res) => {
    res.send("connection alive")
})
DB()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => { console.log(`Server is Running at PORT ${PORT}`) })