import Exercicio from '../models/eSchema.js'
import LogBook from '../models/lSchema.js'

async function sincronizarExercicioComLogBook(id_exercicio) {

    const exercicioExiste = await Exercicio.findById(id_exercicio)

    if (!exercicioExiste) {
        throw new Error('Exercício não encontrado.')
    }

    const logbookExiste = await LogBook.findOne({
        exercicio: exercicioExiste._id,
        sincronizado: false
    })

    if (!logbookExiste) {
        throw new Error('Logbook não encontrado para este exercício.')
    }

    const dados = {
        carga_anterior: exercicioExiste.carga_atual,
        carga_atual: logbookExiste.carga,
        repeticoes_anteriores: exercicioExiste.repeticoes_atuais,
        repeticoes_atuais: logbookExiste.repeticoes,
        exercicio_atualizado_em: logbookExiste.data
    }

    const exercicioAtualizado = await Exercicio.findByIdAndUpdate(
        id_exercicio,
        dados,
        { returnDocument: 'after' }
    )

    if (!exercicioAtualizado) {
        throw new Error('Erro ao atualizar o exercício')
    }

    const sincronizado =
        exercicioAtualizado.carga_atual === (logbookExiste.carga) &&
        exercicioAtualizado.repeticoes_atuais === (logbookExiste.repeticoes)

    if (!sincronizado) {
        const erro = new Error('Erro ao sincronizar o logbook com o exercício.')
        erro.logbook_id = logbookExiste._id
        throw erro
    }

    await LogBook.findByIdAndUpdate(logbookExiste._id, { sincronizado: true })

    return {
        ...exercicioAtualizado._doc
    }
}

export default sincronizarExercicioComLogBook