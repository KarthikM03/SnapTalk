const Mongoose = require('mongoose')
const {createHmac,randomBytes} = require('crypto')
const {GenerateToken} = require('../service/auth')

const UserSchema = new Mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        require:true
    },
    profile:{
        type: String,
        default: "/Public/UserProfiles/default.png",
    },
    salt:{
        type: String
    },
    followers:[{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"users"
    }],
    following:[{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"users"
    }],
    chatBg:{
        type:String,
        default:"/Public/bg/default.png"
    }
})


UserSchema.pre("save",function(next){
    const user = this

    if(!user.isModified("password")) return 

    const salt = randomBytes(16).toString()
    const HassedPassword = createHmac("sha256",salt)
        .update(user.password)
        .digest("hex")

    this.salt = salt
    this.password = HassedPassword

    return next()
})

UserSchema.static("MatchPassword",async function(email,password){

    const user = await this.findOne({email})

    if (!user) throw new Error("user not found")

    const givenPassword = createHmac("sha256",user.salt)
        .update(password)
        .digest("hex")

    if (givenPassword !== user.password) throw new Error("Incorrect password")

    const Token = GenerateToken(user)
    return Token
})

UserSchema.static("CheckValidMail",async function (email,fullName) {
    if(fullName == "" && email == "") throw new Error("Enter Your Details")
    if(fullName == "") throw new Error("Enter Your UserName in the form")
    if(email=="") throw new Error("Enter your Email in the form")

    const user = await this.findOne({$or:[{email},{fullName}]})

    if(user){
        const mail = await this.findOne({email})
        if(!mail) {throw new Error("UserName is already Used")}
        else{
            throw new Error("Email is already Used")
        }
    }

    return {email,fullName}
})

const USER = Mongoose.model('users',UserSchema)

module.exports = USER