'use server'

import { apiResponseType, characterType } from "@/types";




/* Fetch işleminde hata gerçekleşmesi durumuna karşılık message isimli bir stringi server yanıtına ekledim */
type responseType = {
    status: boolean,
    characters: characterType[],
    message?: string
}





export async function searchByTerm(term: string): Promise<responseType> {
    try {
        

        /* Next.js ile geliştirme yaparken server action kullanmayı tercih ettiğim için fetch işlemini use server ile birlikte gerçekleştirdim.
        Eğer react js ile geliştirseydim fetch işlemini direkt ilgili componentte yapardım.
        */
        const res = await fetch(`${process.env.apiPath}?name=${term}`)

        const resJson: apiResponseType = await res.json()

        let characters: characterType[] = []

        if (resJson.results && resJson.results.length > 0) {
            characters = JSON.parse(JSON.stringify(resJson.results))
        }

        return { status: true, characters: characters }
    } catch (error) {
        console.log(error)


        return { status: false, characters: [], message: 'An error has occured' }
    }
}