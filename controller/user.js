const UserModel = require('../models/User');
const jwt = require('jsonwebtoken')
class User {
    constructor(id, token) {
        this.id = id
        this.token = token
    }

    async verifyToken() {
        try {
            const decoded = jwt.verify(this.token, process.env.TOKEN)
            const id = decoded.user.id
            if (!id) return false
            return await this.verifyUserFromDB(id)

        } catch (error) {
            return false
        }
    }

    async verifyUserFromDB(id = "") {
        try {
            if (id === "" && !this.id) {
                return false
            }
            const userId = id === "" ? this.id : id
            let user = await UserModel.findById(userId)

            if (!user) return false
            return true
        } catch (error) {
            return false
        }
    }

}

module.exports = User