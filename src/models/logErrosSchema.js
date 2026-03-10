import mongoose from "mongoose"

const logErrosSchema = new mongoose.Schema({
    exercicio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercicio', required: true },
    logbook_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LogBook' },
    erro: { type: String, required: true },
    data: { type: Date, default: new Date() },
    resolvido: { type: Boolean, default: false },
}, { versionKey: false })

const LogErros = mongoose.model('LogErros', logErrosSchema)

export default LogErros