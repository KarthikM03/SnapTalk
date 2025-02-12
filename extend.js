const {CHATS,Room}  = require("./Model/msg")
const USER = require("./Model/user")
const moment = require('moment')

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
        
        try {
            const id = await USER.findOne({fullName:Name})
            return id._id
            
        } catch (error) {
            
        }
        
        
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
        const date = moment().format('L')
        Recv_Time = Recv_Time.split(",")

        if(date === Recv_Time[1]){
           let time = moment(`${Recv_Time[0]}`,"h:mm A").fromNow()
            console.log("time",time)
           return time
        }
        else{
            let days= moment(`${Recv_Time[1]}`,"MM/DD/YYYY").fromNow()
            return days
        }
    },

    async GetUserProfile(name){
        
        let user = await USER.findOne({fullName:name})
        return user.profile
    },

    async updateRoom(id){
        await Room.findOneAndUpdate({_id:id},{$set:{updatedAt:moment().format()}})
    },

    async updateChatBg(img,name){
        
        await USER.findOneAndUpdate({fullName:name},{$set:{chatBg:img}})
    }
}




