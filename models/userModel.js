import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    image: {
        type: String,
        required: true 
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true 
    },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
