import mongoose from "mongoose"

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true, unique: true, required: true },
    senha: { type: String, required: true }
}, { versionKey: false, timestamps: true })

const Usuario = mongoose.model('Usuario', usuarioSchema)

export default Usuario