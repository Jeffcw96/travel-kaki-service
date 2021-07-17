const express = require('express');
const router = express.Router();
const User = require('../controller/user')

router.get('/verify', async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        const splitToken = authHeader.split("Bearer ");
        const token = splitToken[1];
        if (!token) {
            return false
        }

        const user = new User("", token)
        const isValid = await user.verifyToken()
        res.json({ isValid })

    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: "Invalid Credentials" })
    }
})



module.exports = router;