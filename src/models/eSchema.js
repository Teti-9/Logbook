import mongoose from "mongoose"

const exercicioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    series: { type: Number, required: true },
    carga_anterior: { type: Number, default: 0 },
    carga_atual: { type: Number, required: true},
    repeticoes_alvo: { type: Number, required: true },
    repeticoes_anteriores: { type: Number, default: 0 },
    repeticoes_atuais: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    divisao: { type: mongoose.Schema.Types.ObjectId, ref: 'Divisao', required: true, index: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { versionKey: false, timestamps: true })

exercicioSchema.index({ userId: 1, divisao: 1 })

const Exercicio = mongoose.model('Exercicio', exercicioSchema)

export default Exercicio