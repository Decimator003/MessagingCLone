import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    message:{
        type:String,
        required:true,
    }
    //createdAt and updatedAt fields will be added automatically
},{timestamps:true});   //timestamps:true will add createdAt and updatedAt fields to the schema

const Message = mongoose.model("Message", messageSchema);

export default Message;