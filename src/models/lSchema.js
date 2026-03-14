import mongoose from "mongoose"

const logbookSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    carga: { type: Number, required: true },
    repeticoes: { type: Number, required: true },
    data: { type: Date, default: new Date() },
    sincronizado: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    exercicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercicio', required: true, index: true },
}, { versionKey: false, timestamps: true })

logbookSchema.index({ userId: 1, exercicio: 1 })

const LogBook = mongoose.model('LogBook', logbookSchema)

export default LogBook