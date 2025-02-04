const JWT = require('jsonwebtoken')
const secert_key = "Mk@123"


function GenerateToken(user) {
    const Userpayload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email
    }
    const Token = JWT.sign(Userpayload,secert_key)
    return Token
}


function GetUserPayload(Token){
    const Userpayload = JWT.verify(Token,secert_key)
    return Userpayload
}

module.exports = {GetUserPayload,GenerateToken}
