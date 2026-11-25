const { kMaxLength } = require('buffer');
const mongoose=require('mongoose')

const CommentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const PostSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
        trim:true,
        MaxLength:5000
    },
    image:{
        type:String,
        default:""
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comments:[CommentSchema]
},{timestamps:true});

module.exports = mongoose.model("post",PostSchema)