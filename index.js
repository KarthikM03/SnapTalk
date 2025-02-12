require('dotenv').config()
const express = require('express')
const path = require("path")
const {connectDB} = require("./ConnectDB")
const {checkUser,userAuth} = require('./middleware/auth')
const cookieParser = require('cookie-parser')

const {Server} = require('socket.io')
const {createServer} = require('http')

const app = express()
const Port = process.env.PORT || "8080"

const server = createServer(app)
const io = new Server(server)

var roomId = ''
const moment = require('moment')
const {hello,GetRoomID,getUserId,CreateRoom,GetUserProfile,updateRoom, updateChatBg} = require('./extend')
const {CHATS} = require('./Model/msg')

io.on('connection',(socket)=>{

    async function RcvrPfle(name){
      return await GetUserProfile(name)
    }

    async function setRoomID(id,RN){
        if(roomId===''){
            roomId = id
            socket.join(roomId)
        }
        else{
            socket.leave(roomId)
            roomId = id
            socket.join(roomId)
        }
        const chats = await hello(roomId)
       let rcvrPrfle =  await RcvrPfle(RN)
        // LOAD MSGS
        socket.emit("loadMsgs",chats,rcvrPrfle)
    }

    //DIRECT MSG
    socket.on("Directmsg",async(SN,RN)=>{
        const S = await getUserId(SN)
        const R = await getUserId(RN)
        const room = await GetRoomID(S,R)

        if (room !== null){
            setRoomID(room._id,RN)
            
        }
        else{

            if(R == null || R==undefined){
                pass
            }
            else{
                var id = await CreateRoom(S,R)
                setRoomID(id,RN)
                let rcvrPrfle =  await RcvrPfle(RN)
                socket.emit("setProfile",(rcvrPrfle))
            }
        }
        
    })

    // SET ROOM ID
    socket.on("setRoomId",async (id,RN)=>{
        setRoomID(id,RN)
    })

    // SENDING MSG
    socket.on("SendingMsg",async(Message,receiverId,senderId)=>{
        const Ctime = moment().tz("Asia/Kolkata").format('LT')
        const date = moment().tz("Asia/Kolkata").format('L')
        const time = Ctime+","+date
        CHATS.create({
            Message,
            RoomId:roomId,
            receiverId,
            senderId,
            createdAt: time
        })
        socket.broadcast.to(roomId).emit("msg",Message,time)
        updateRoom(roomId)
    })

    socket.on("chatIMG",(img,name)=>{
        updateChatBg(img,name)
    })
})


app.use(express.static(path.join(__dirname, 'Public')))

const StaticRouter = require('./Routers/static')
const UserRouter = require('./Routers/user')
connectDB(process.env.MONGO_Url )

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use("/Public",express.static("Public"))

app.use(checkUser("Token"))

app.set("view engine","ejs")
app.set("views",path.join(__dirname, 'views'))

app.use("/",StaticRouter)
app.use("/user",userAuth(),UserRouter)

server.listen(Port,()=>{console.log(`client started at ${Port}`)})
