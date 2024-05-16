import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect("mongodb+srv://akshitacbrainerhub:a@cluster0.a33aefi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        const connection = mongoose.connection

        connection.on("connected", () => {
            console.log("MongoDB connected successfully")
        })
        connection.on('error', () => {
            console.log("MongoDB connection error")
            process.exit()
        })
    }
    catch (error) {
        console.log("Something went wrong in connecting to database")
        console.log(error)
    }
}
