const Mongoose = require('mongoose')

const CommentSchema = new Mongoose.Schema({
    PostId:{
        type: Mongoose.Schema.Types.ObjectId,
        ref: "posts"
    },
    comment:{
        type:String
    },
    CommentBy:{
        type: Mongoose.Schema.ObjectId,
        ref: 'users'
    }
})

const PostsSchema = new Mongoose.Schema({
    image:{
        type:String,
        required: true
    },
    desc:{
        type: String
    },
    tags:[{
        type:String
    }],
    Createdby:{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    Likedby:[{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    comment:[CommentSchema],
    createdAt:{
        type:String,
        required: true
    }
})

const POSTS = Mongoose.model("posts",PostsSchema)

module.exports = POSTS