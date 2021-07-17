const crypto = require('crypto')

class Secure {
    constructor(message, cipher, key, randomBytes = 14, inputEncoding = "utf-8", outputEncoding = "hex") {
        this.message = message
        this.cipher = cipher
        this.key = key
        this.randomBytes = randomBytes
        this.inputEncoding = inputEncoding
        this.outputEncoding = outputEncoding
    }

    generateRandomBytes() {
        if (!this.randomBytes) {
            throw new Error("RANDOM BYTES LENGTH NOT FOUND")
        }
        return crypto.randomBytes(this.randomBytes)
    }

    generateKey() {
        return crypto.createHash('sha256').update(String(this.key)).digest('base64').substr(0, 32);
    }

    encryption() {
        try {
            if (!this.message || !this.cipher || !this.key) {
                throw new Error("Missing Crypto Params")
            }
            const randomBytes = crypto.randomBytes(16)
            let cipher = crypto.createCipheriv('aes-256-cbc', this.generateKey(), randomBytes)
            let encrpted = cipher.update(this.message, "utf-8", "hex")
            encrpted += cipher.final("hex")

            return [encrpted, randomBytes]
        } catch (error) {
            throw new Error(error)
        }
    }

    decryption() {
        try {
            if (!this.message || !this.cipher || !this.key) {
                throw new Error("Missing Crypto Params")
            }
            const decipher = crypto.createDecipheriv('aes-256-cbc', this.generateKey(), this.randomBytes)
            let decrpted = decipher.update(this.message, "hex", "utf-8")
            decrpted += decipher.final("utf-8")

            return decrpted
        } catch (error) {
            return error
        }
    }

}

module.exports = Secure