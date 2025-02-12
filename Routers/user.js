const express = require('express')
const USER = require("../Model/user")
const POST = require("../Model/post")
const {Room} = require("../Model/msg")
const helper = require("../extend")
const app = express.Router()


app.get("/",async (req,res)=>{
    const user = await USER.findOne({_id:req.user})
    
    const following = await USER.find({followers:req.user}).populate(["followers","following"])
    var posts = await POST.find({Createdby:{$in: following}}).sort({createdAt:-1})
        .populate(["Createdby"])
        .populate({path:"comment",populate:{path:"CommentBy",model:'users'}})

    if (posts.length == 0){
         posts = await POST.find({Createdby:{$ne:user}}).sort({createdAt:-1})
        .populate(["Createdby"])
        .populate({path:"comment",populate:{path:"CommentBy",model:'users'}})
    }
    res.render("Home",{
        Cuser:req.user,
        user,
        posts, 
        helper:helper,
    })

    
})  //profile
app.get("/profile",async(req,res)=>{
    const user = await USER.findOne({_id:req.user})
    const posts = await POST.find({Createdby:req.user}).populate("Createdby")
    res.render("Profile",{posts,user,helper,Cuser:req.user})

})
app.get("/profile/:id",async(req,res)=>{
    const email = req.params.id
    const user = await USER.findOne({email})
    const Cuser = await USER.findOne({_id:req.user})
    const posts = await POST.find({Createdby:user}).populate("Createdby")
    res.render("Profile",{posts,Cuser,helper,user})
})

//Followers & Following
app.get("/profile/:id/:f",async(req,res)=>{
    const email = req.params.id
    const f = req.params.f
    const user = await USER.findOne({email}).populate(["following","followers"])
    const Cuser = await USER.findOne({_id:req.user})
    res.render("Follower",{Cuser,user,helper,f})
})



//update post like
.post("/like/:id", async (req, res) => {
    const id = req.params.id
    const user = req.user

    if(!user) return res.redirect("/login")

    const like = await POST.findOne({ _id: id,Likedby: req.user })
    
    if (!like) {
        let post = await POST.findOneAndUpdate({ _id: id }, { $push: { Likedby: user._id } }, { upsert: true })
        // console.log("like",count)
        return  res.send({like:"like",len: post.Likedby.length +1})
    }
    else {
        let post = await POST.findOneAndUpdate({_id:id},{$pull:{Likedby:user._id}})
        // console.log("unlike",count)
        return  res.send({like:"unlike",len:post.Likedby.length -1})
    }

})

//COMMENT
.post("/comment/:id/:cmt", async (req, res) => {
    const id = req.params.id
    const cmt = req.params.cmt
    const user = req.user

    if(!user) return res.redirect("/login")
    
    await POST.updateOne({_id:id},{$push:{comment:{
        CommentBy:user._id,
        comment:cmt}}})

    return res.send('ok')
})

//FOLLOWERS AND FOLLOWING
.post("/follower/:id",async (req,res)=>{
    const Post_user_ID = req.params.id
    const Current_User_ID = req.user._id
    const foll =await USER.findOne({_id:Current_User_ID,following:Post_user_ID})

    if (!foll){
        await USER.findOneAndUpdate({_id:Current_User_ID},{$push:{following:Post_user_ID}},{upsert:true})
        await USER.findOneAndUpdate({_id:Post_user_ID},{$push:{followers:Current_User_ID}},{upsert:true})
        return res.send("Following")
    }
    else{
        await USER.findOneAndUpdate({_id:Current_User_ID},{$pull:{following:Post_user_ID}},{upsert:true})
        await USER.findOneAndUpdate({_id:Post_user_ID},{$pull:{followers:Current_User_ID}},{upsert:true})
        return res.send("Follow")
    }
    

})

//CHAT
.get("/chat",async (req,res)=>{
    var ReceiverName 
    if (req.query.user === undefined){
         ReceiverName = ""
    }
    else{
        ReceiverName = req.query.user
    }
    const user =await USER.findOne({_id:req.user}).populate(["followers","following"])
    const chatList = await Room.find({Persons:user}).sort({ updatedAt: -1 }).populate("Persons")
    const persons = await USER.find({$or:[{followers:user},{following:user}]})
    res.render("Chats",{
        Cuser:req.user,
        user,
        chatList,
        ReceiverName,
        persons,
        helper
        })
    })


module.exports = app