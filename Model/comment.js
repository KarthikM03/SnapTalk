const Mongoose = require("mongoose")

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

const Comments = Mongoose.model("comments",CommentSchema)

module.exports = {Comments,CommentSchema}