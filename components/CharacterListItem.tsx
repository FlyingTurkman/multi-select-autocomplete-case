'use client'

import { characterType } from "@/types"
import { imageLoader } from "@/utils/imageLoader"
import Image from "next/image"
import { useContext } from "react"
import { SearchComponentContext, searchComponentContextType } from "./SearchComponent"
import { partialBold } from "@/utils/partialBold"











export default function CharacterListItem({
    character,
    term
}: {
    character: characterType,
    term: string
}) {

    /* Parent component içerisinde açıkladığım useContext hookuna erişim gerçekleştirildi. */
    const {
        selectedCharacters,
        setSelectedCharacters
    }: searchComponentContextType = useContext(SearchComponentContext)

    return(
        <button type='button' className="flex flex-row items-center gap-2 p-2" onClick={toggleCharacter}>

            {/* Tipi checkbox olan input readOnlu olarak kullanıldı.
            Bunun kullanılmasının sebebi ise check işleminin inputun parenti olan buttona tıklandığında gerçekleşmesidir.
            */}
            <input type="checkbox" checked={selectedCharacters.includes(character)} readOnly/>
            <div className="flex flex-row gap-2 items-center">
                <div className="rounded-lg items-center justify-center bg-gray-300">

                    {/* Next.js kullanırken görsellerin optimizasyonu için Image componentini kullanıyorum.
                    React js ile yapsaydım standart img etiketiyle bunu gerçekleştirirdim.
                    */}
                    <Image
                    src={character.image}
                    alt={`${character.name} image`}
                    width={40}
                    height={40}
                    loading="lazy"
                    loader={imageLoader}
                    className="object-contain rounded-lg"
                    />
                </div>
                <div className="flex flex-col items-start">

                    {/* 
                    labelda dangerouslySetInnerHtml kullanılmasının sebebi labelin içerisindeki yazının bir kısmını kalın yapan fonksiyonun html kodu şeklinde yanıt vermesidir.
                    Bu kısımda bir güvenlik zaafiyeti vardır. Eğer kullanıcılar karakter ekleyebilseler ve bu karakterler ararsında aram gerçekleştirseydim
                    js simgelerinin karakter isminde kullanılmasını yasaklar aynı zamanda karakter isminde bir maxLength sınırlaması yapardım.
                    Ancak bu case içerisinde veriler kullanıcılar tarafından düzenlenebilir olmadığı için güvenlik önlemi alma gereği duymadım.
                    */}
                    <label className="cursor-pointer" dangerouslySetInnerHTML={{__html: partialBold(character.name, term)}}></label>

                    {/* Filtrelenen karakter 1 bölümde oynamışsa Episode 1'den fazla bölümde oynamışsa Episodes şeklinde yazarak İngilizce gramer kurallarına daha uygun bir hale dönüştürdüm. */}
                    <label className="text-gray-600 cursor-pointer text-sm">{character.episode.length} Episode{character.episode.length > 1 ? 's': ''}</label>
                </div>
            </div>
        </button>
    )

    function toggleCharacter() {

        /* useContext hookunu kullanarak componentin kapsayıcısı olan buttona tıklandığında eğer karakter seçilenler listesinde varsa listeden çıkardım yoksa listeye ekledim. */
        setSelectedCharacters((oldCharacters) => oldCharacters.includes(character)? [...oldCharacters.filter((c) => c.id != character.id)]: [...oldCharacters, character])
    }
}