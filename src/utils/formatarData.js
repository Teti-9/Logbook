const formatarData = (date) => {

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }
    
    return new Intl.DateTimeFormat('pt-BR', options).format(date).replace(',', '')
}

export { formatarData }