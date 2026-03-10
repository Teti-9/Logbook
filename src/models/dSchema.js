import mongoose from "mongoose"

const divisaoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    dia: { 
        type: String,
        enum: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'], 
        required: true },
    exercicios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercicio' }]
}, { versionKey: false })

const Divisao = mongoose.model('Divisao', divisaoSchema)

export default Divisao