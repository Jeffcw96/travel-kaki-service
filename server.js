const express = require('express');
const cors = require('cors');
const DB = require('./routes/db');
const app = express();
require('dotenv').config();
app.use(express.json({ extended: false }));
app.use(cors());
app.use("/api", require("./routes/google"));
app.use("/user", require("./routes/auth"));
app.use(require("./routes/user"))
app.get("/connection", (req, res) => {
    res.send("connection alive")
})
DB()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => { console.log(`Server is Running at PORT ${PORT}`) })