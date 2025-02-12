const {CHATS,Room}  = require("./Model/msg")
const USER = require("./Model/user")
const moment = require('moment')
const asia = require("moment-timezone")

module.exports = {
    CheckPostLike(post,user){
        const like = post.Likedby.includes(user._id)
        const l = post.Likedby
        const u = user._id
        // console.log("Like =>",l,"==>",u)

        if (!like) {return "bi bi-heart"}
        
        else {return "bi bi-heart-fill"}
    },
    CheckFollow(Createdby,user){
        
        if (Createdby.email === user.email) return 
        const foll = Createdby.followers.includes(user._id)
        
        if(foll) return "Following"

        return "Follow"
    },
    
    async hello(RoomId) {
        const chats = await CHATS.find({RoomId})
        return chats
    },

    async getUserId(Name){
        const id = await USER.findOne({fullName:Name})
        return id._id

    },
    async GetRoomID(SN,RN){
        const roomID = await Room.findOne({$and:[
            {Persons:SN},
            {Persons:RN}
        ]})
        return roomID
    },
    async CreateRoom(SN,RN){
       const room = await Room.create({
            roomName: "",
            Persons:[SN,RN],
        })
        
        return room._id.toString()
        
    },

    checkTime(Recv_Time){
        const date = moment().tz("Asia/Kolkata").format('L')
        Recv_Time = Recv_Time.split(",")

        if(date === Recv_Time[1]){
           let time = moment(`${Recv_Time[0]}`,"h:mm a").tz("Asia/Kolkata").fromNow()
           return time
        }
        else{
            let days= moment(`${Recv_Time[1]}`,"MM/DD/YYYY").tz("Asia/Kolkata").fromNow()
            return days
        }
    },

    async GetUserProfile(name){
        if(name==="m k"){
            name = 'm k '
        }
        let user = await USER.findOne({fullName:name})
        return user.profile
    },

    async updateRoom(id){
        await Room.findOneAndUpdate({_id:id},{$set:{updatedAt:moment().tz("Asia/Kolkata").format()}})
    },

    async updateChatBg(img,name){
        if(name==="m k"){
            name = 'm k '
        }
        
        await USER.findOneAndUpdate({fullName:name},{$set:{chatBg:img}})
    }
}




