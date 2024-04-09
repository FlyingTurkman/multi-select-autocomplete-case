










export function partialBold(fullString: string, boldString: string) {
    const regex = new RegExp(`(${boldString})`, 'gi')

    if (fullString.match(regex)) {
        const array = fullString.split(regex)

        const boldLabel = array.map((a) => {
            if(a.match(regex)) {
                return `<b>${a}</b>`
            } else {
                return a
            }
        }).join('')

        return boldLabel
    } else {
        return fullString
    }
}