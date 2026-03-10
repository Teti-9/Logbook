import mongoose from "mongoose"

const exercicioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    series: { type: Number, required: true },
    carga_anterior: { type: Number, default: 0 },
    carga_atual: { type: Number, required: true},
    repeticoes_alvo: { type: Number, required: true },
    repeticoes_anteriores: { type: Number, default: 0 },
    repeticoes_atuais: { type: Number, required: true },
    exercicio_criado_em: { type: Date, default: new Date() },
    exercicio_atualizado_em: { type: Date, default: new Date() },
    divisao: { type: mongoose.Schema.Types.ObjectId, ref: 'Divisao', required: true },
}, { versionKey: false })

const Exercicio = mongoose.model('Exercicio', exercicioSchema)

export default Exercicio