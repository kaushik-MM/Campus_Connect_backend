const mongoose=require('mongoose')
const MessageSchema=new mongoose.Schema(
    {
        clubId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Club",
            required:true
        },
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        message:{
            type:String,
            required:true,
            trim:true,
            maxlength:2000
        }
    },
{
    timestamps:true
})

const MessageModel=mongoose.model('Message',MessageSchema)
module.exports=MessageModel