import mongoose from 'mongoose';

const databaseConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true
        })
        console.log("Database connected");
    } catch (e) {
        console.log(e.message);
    }
}

export default databaseConnection;
