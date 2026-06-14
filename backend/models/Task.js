const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    description:{
        type:String
    },

    status:{
        type:String,
        default:"Pending"
    },

    priority:{
        type:String,
        default:"Medium"
    },

    dueDate:{
        type:Date
    },

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

});

module.exports =
mongoose.model("Task",TaskSchema);