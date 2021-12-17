const jwt = require('jsonwebtoken');
const fs = require('fs')
const {secretKey} = require('../config')
module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
        const decodeData = jwt.verify(token, secretKey)
        let users = JSON.parse(fs.readFileSync('users.json', 'utf8'))
        const user = users.find(item => Number(item.id) === Number(decodeData.idUser))
        if (user === undefined)
        {
            return res.status(403).json({message: "Пользователь не найден 1"})
        }
            req.user = decodeData
        next()

    } catch (e) {
        return res.status(403).json({message: "Пользователь не авторизован"})
    }
}
