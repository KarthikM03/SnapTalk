const { Router } = require('express')
const USER = require("../Model/user")
const POST = require("../Model/post")
const helper = require('../extend')
const moment = require('moment')

const multer = require('multer')
const path = require('path')


//Profiles
const ProfileStrorage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null,path.join(__dirname,'/Public/UserProfiles'))
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + ".png"
        return cb(null, filename)
    },
    
})

const Profile = multer({ 
    storage: ProfileStrorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            return cb(new Error("Invalid file type"));
        }
    },
 })

//Posts
const PostStrorage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, path.join(__dirname,'/Public/Posts'))
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + ".png"
        return cb(null, filename)
    },
    
})

var Posts = multer({ 
    storage: PostStrorage,
    fileFilter: (req,file,cb)=>{
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"))
            
        }
    }
 })


const route = Router()


route
    .get("/", async (req, res) => {
        const posts = await POST.find({})
            .populate(["Createdby","Likedby"])
            .populate({path:"comment",populate:{path:"CommentBy",model:'users'}})

        
        res.render("Home", {
            Cuser: req.user,
            user: req.user,
            posts,
            helper:helper,
        })
    })

    //LOGIN
    .get("/login", (req, res) => { res.render("Login") })
    .post("/login", async (req, res) => {
        const { email, password } = req.body
        try {
            const Token = await USER.MatchPassword(email, password)
            
            return res.cookie('Token', Token).redirect('/user')
        } catch (error) {
            return res.render("Login",{error})
        }

    })

    //SIGNUP
    .get("/signup", (req, res) => { res.render("Signup") })
    .post("/signup", Profile.single('profile'), async (req, res) => {
        const { fullName, email, password } = req.body
        try {
        if (req.file) {
            USER.create({
                fullName,
                email,
                password,
                profile: `/Public/UserProfiles/${req.file.filename}`
            })
            console.log("with profile")
        }
        else {
           USER.create({
                fullName,
                email,
                password,
            })
            console.log("without profile")
        }
        return res.redirect("/login")
        } catch (error) {
            res.render("Signup",{error})
        }
        
    })

    //add posts
    .get("/user/addpost", (req, res) => { res.render("AddPost", { Cuser: req.user,user: req.user }) })
    .post("/user/addpost",Posts.single('image'),async(req, res) => {
            try {
                const { desc, tags } = req.body
                const tag = tags.split(" ")
                const Ctime = moment().format('LT')
                const date = moment().format('L')
                const time = Ctime+","+date

                POST.create({
                    desc,
                    tags: tag,
                    Createdby: req.user,
                    Likedby:[],
                    comment:[],
                    image: `/Public/Posts/${req.file.filename}`,
                    createdAt: time
                })
                
                res.redirect("/user")
            } catch (error) {
                res.json(error)
            }

    })

    //logout
    .get("/logout", (req, res) => {
        res.clearCookie("Token").redirect("/login")
    })

    //search
    .get("/search", async(req, res) => {
        const posts = await POST.find({ }).populate("Createdby")
        res.render("search", {
            Cuser: req.user,
            posts,

        })
     })
    .post("/search", async (req, res) => {
        const { search } = req.body
        const tags = search.split(" ")
        const posts = await POST.find({ tags: { $in: tags } }).populate("Createdby")
        res.render("search", {
            Cuser: req.user,
            posts,

        })
    })
    

    //post by id
    .get("/post/:id",(req,res)=>{})
    .post("/post/:id",async(req,res)=>{
        const post_ID = req.params.id
        const user = await USER.findOne({_id:req.user})
        const post = await POST.findOne({_id:post_ID}).populate("Createdby")
        res.render("post",{
            post,
            Cuser:req.user,
            user,
            helper})
    })
   

module.exports = route