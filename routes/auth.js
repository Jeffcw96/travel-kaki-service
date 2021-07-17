const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
    const user = {}
    const { email, password } = req.body
    const isExist = await User.findOne({ email })
    if (isExist) {
        res.status(400).json({ error: [{ msg: 'User Existed', param: 'cPassword' }] })
        return
    }
    try {
        const salt = await bcrypt.genSalt(10);
        user.email = email;
        user.password = await bcrypt.hash(password, salt);

        const userDB = new User(user);
        await userDB.save()

        res.json({ status: 'Registration Successful' });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: [{ msg: 'DB error', param: 'cPassword' }] })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email })

        if (!user) {
            res.status(400).json({ error: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            res.status(400).json({ error: "Invalid Credentials" });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, process.env.TOKEN, { expiresIn: 60 * 60 * 24 * 1 }, (err, token) => {
            if (err) throw (err);
            res.json({ token })
        })

    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: "Invalid Credentials" })
    }
})



module.exports = router;