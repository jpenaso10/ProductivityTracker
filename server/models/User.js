    import mongoose from "mongoose";

    const UserSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        status: { type: String, enum: ['Production','Meeting','Coaching', 'Lunch', 'Break', 'Unavailable'], default: 'Unavailable' },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
        role: { type: String, enum: ['Admin', 'Employee'], required: true },
        contactNumber: { type: String, required: true },
        profilePicture: { type: String }  // URL or path to the profile picture
    });

    const UserModel = mongoose.model("User", UserSchema)

    const AdminSchema = new mongoose.Schema({
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    })

    const AdminModel = mongoose.model("Admin", AdminSchema)

export {UserModel as User}
export {AdminModel as Admin}