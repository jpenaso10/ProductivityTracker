    import mongoose from "mongoose";

    const UserSchema = new mongoose.Schema({
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    })

    const UserModel = mongoose.model("User", UserSchema)

    const AdminSchema = new mongoose.Schema({
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    })

    const AdminModel = mongoose.model("Admin", AdminSchema)

export {UserModel as User}
export {AdminModel as Admin}