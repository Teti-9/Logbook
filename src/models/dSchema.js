import mongoose from "mongoose"

const divisaoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    dia: { 
        type: String,
        enum: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'], 
        required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    exercicios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercicio', index: true }]
}, { versionKey: false, timestamps: true })

const Divisao = mongoose.model('Divisao', divisaoSchema)

export default Divisao