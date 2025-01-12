import { connect, Types } from "mongoose";

export const connectDB = async () => {
    const URL = "mongodb+srv://bruno:1234@cluster0.dvwnb.mongodb.net/integrative_practice";
    try {
        await connect(URL);
        console.log("Conectado a MONGODB");
    } catch (error) {
        console.log("Error al conectar a MONGODB", error.message);
    }
};

export const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};