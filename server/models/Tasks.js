import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    status: { 
        type: String, enum: ['Active', 'Pending', 'Done'], default: 'Active' },
});

const TaskModel = mongoose.model("Task", TaskSchema)


export {TaskModel as Task}