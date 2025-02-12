const { Router } = require('express')
const USER = require("../Model/user")
const POST = require("../Model/post")
const helper = require('../extend')
const moment = require('moment')

const multer = require('multer')
const path = require('path')
const { error } = require('console')


//Profiles
const ProfileStrorage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './Public/UserProfiles')
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
        return cb(null, './Public/Posts/')
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + ".png"
        
        return cb(null, filename)
    },
})

const Posts = multer({
    storage: PostStrorage,
    fileFilter: (req, file, cb) => {
        
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);

        } else {
            return cb(new Error("Invalid file type"));
        }
    },
})


const route = Router()


const profileImg = Profile.single('profile')
const PostImg = Posts.single('post')

route
    .get("/", async (req, res) => {
        if(req.user) return res.redirect("/user")

        const posts = await POST.find({})
            .populate(["Createdby", "Likedby"])
            .populate({ path: "comment", populate: { path: "CommentBy", model: 'users' } })

        res.render("Home", {
            Cuser: req.user,
            user:req.user,
            posts,
            helper: helper,
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
            return res.render("Login", { error })
        }

    })

    //SIGNUP
    .get("/signup", (req, res) => { res.render("Signup") })
    .post("/signup",async (req, res) => {
        profileImg(req,res,async function(err){
            if(err){
               return res.render("Signup",{error:err})  
            }
            
            const { fullName, email, password } = req.body 
            
               await USER.CheckValidMail(email,fullName)
                if (req.file) {
                    USER.create({
                        fullName,
                        email,
                        password,
                        profile: `/Public/UserProfiles/${req.file.filename}`
                    })
                return res.redirect("/login")
                    
                    }
                else {
                    USER.create({
                        fullName,
                        email,
                        password,
                    })
                }
                return res.redirect("/login")
            
        })

    })

    //add posts
    .get("/user/addpost", (req, res) => { res.render("AddPost", { Cuser: req.user, user: req.user }) })
    .post("/user/addpost",async (req, res) => {
        PostImg(req,res, function(err){
            if(err){
                return res.render("AddPost",{Cuser: req.user, user: req.user,error:err})
            }
            const { desc, tags } = req.body
            const tag = tags.split(" ")
            const Ctime = moment().format('LT')
            const date = moment().format('L')
            const time = Ctime + "," + date
            console.log("err",err)
            if(req.file){
                POST.create({
                desc,
                tags: tag,
                Createdby: req.user,
                Likedby: [],
                comment: [],
                image: `/Public/Posts/${req.file.filename}`,
                createdAt: time
            })
                return res.redirect("/user")
            }
            return res.render("AddPost",{Cuser: req.user, user: req.user,error:"Add a Image"})
        })
        
        
    })

    //logout
    .get("/logout", (req, res) => {
        res.clearCookie("Token").redirect("/login")
    })

    //search
    .get("/search", async (req, res) => {
        const posts = await POST.find({}).populate("Createdby")
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
            search
        })
    })


    //post by id
    .get("/post/:id", async (req, res) => {
        const post_ID = req.params.id
        const user = await USER.findOne({ _id: req.user })
        const post = await POST.findOne({ _id: post_ID })
                        .populate(["Createdby", "Likedby"])
                        .populate({ path: "comment", populate: { path: "CommentBy", model: 'users' } })
                        
        res.render("post", {
            post,
            Cuser: req.user,
            user,
            helper
        })
    })


module.exports = route