import mongoose from "mongoose";

export const DBConnection = async () => {
    try {

        const connectionInstance = await mongoose.connect(process.env.DB_URI);
        console.log(connectionInstance.connection.host + " DBConnected");
        
        
    } catch (error) {
        console.error("Error: " , error);
        process.exit(1);
    }
}

// export default DBConnection;