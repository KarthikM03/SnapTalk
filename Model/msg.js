const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    Persons:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required:true
        }],
    roomName:{
        type: String
        },
    
},{timestamps:true})

const Room = mongoose.model("roomid",RoomSchema)

const chatsSchema = new mongoose.Schema({
    Message:{
        type:String,
        required: true
    },
    senderId:{
        type:String,
        required: true
    },
    receiverId:{
        type:String,
        required: true
    },
    RoomId:{
        type: String,
        required: true
    },   
    createdAt:{
        type: String,
    }
})

const CHATS = mongoose.model("chats",chatsSchema)

module.exports = {CHATS,Room}

