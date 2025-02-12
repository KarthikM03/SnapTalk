const {GetUserPayload} = require('../service/auth')

function checkUser(Token){
    return (req,res,next)=>{
        const cookieValue = req.cookies[Token]

        if (!cookieValue) return next()
        
        try {
            const userpayload =  GetUserPayload(cookieValue)
            req.user = userpayload
        } catch (error) {
            
        }
        return next()
    }

}

function userAuth(){
    return (req,res,next)=>{
        const user = req.user

        if(!user) return res.redirect("/login")

        next()
    }

}

module.exports = {checkUser,userAuth}