export const fotmat = (value: number) => {

    const formatter = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

    return formatter.format(value);
}