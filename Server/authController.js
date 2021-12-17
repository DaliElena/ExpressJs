const fs = require('fs')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult}=require('express-validator')
const{secretKey}=require('./config')
function generateAccessToken(idUser){
    const payload={
        idUser
    }
    return jwt.sign(payload,secretKey,{expiresIn:'1h'})
}
class authController {
    async registration(req, res) {
        try {
            const  errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Ошибка при регистрации",errors})
            }
            const {username, password} = req.body
            let users = JSON.parse(fs.readFileSync('users.json', 'utf8'))
            let candidate = users.find(item => item.username === username)
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }
            const hashPassword= bcrypt.hashSync(password,7)
            const user={
                id:users.reduce((max, item) => item.id > max ? item.id : max, 0) + 1,
                username:username,
                password:hashPassword
            }
            users.unshift(user)
            fs.writeFileSync('users.json', JSON.stringify(users))
            return res.json({message:"Пользователь успешно зарегистрирован"})
        } catch (e) {
            res.status(400).json({message: "Ошибка регестрации"})
        }

    }

    async login(req, res) {
        try {const {username, password} = req.body
            let users = JSON.parse(fs.readFileSync('users.json', 'utf8'))
            let candidate = users.find(item => item.username === username)
            if (!candidate) {
                return res.status(400).json({message: "Пользователь не найден"})
            }
            const validPassword=bcrypt.compareSync(password,candidate.password)
            if(!validPassword){
                return res.status(400).json({message:"Введен неверный пароль"})
            }
            const token= generateAccessToken(candidate.id)
            return res.json({token})
        } catch (e) {

        }

    }
    async token (req,res){
        try{
            return res.status(200).json({message:"Успешно"})
        }
        catch(e){

        }
    }
}

module.exports = new authController()
