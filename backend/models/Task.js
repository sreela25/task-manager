const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    description:String,

    status:{
        type:String,
        default:"Pending"
    },

    dueDate:Date,

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

});

module.exports = mongoose.model("Task",TaskSchema);