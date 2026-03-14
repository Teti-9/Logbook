import mongoose from "mongoose"

const logErrosSchema = new mongoose.Schema({
    exercicio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercicio', required: true },
    logbook_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LogBook' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    erro: { type: String, required: true },
    resolvido: { type: Boolean, default: false },
}, { versionKey: false, timestamps: true })

const LogErros = mongoose.model('LogErros', logErrosSchema)

export default LogErros