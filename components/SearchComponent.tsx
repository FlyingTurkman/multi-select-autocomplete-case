'use client'

import { characterType } from "@/types"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { FaCaretDown } from "react-icons/fa"
import SelectedCharacter from "@/components/SelectedCharacter"
import CharacterListItem from "@/components/CharacterListItem"
import { searchByTerm } from "@/actions/searchByTerm"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { createContext } from "react"





export type searchComponentContextType = {
    selectedCharacters: characterType[],
    setSelectedCharacters: Dispatch<SetStateAction<characterType[]>>,
    filteredCharacters: characterType[],
    setFilteredCharacters: Dispatch<SetStateAction<characterType[]>>
}


/* Componentlerde selectedCharacters ve filteredCharacters statelerine erişebilmek için useContext hookunu kullanmayı tercih ettim.
selectedCharacters, setSelectedCharacters, filteredCharacters, setFilteredCharacters direkt olarak componentlere prop olarak da gönderilebilir ama
ilerleyen dönemlerde componentlerde meydana gelen güncellemelerin daha sağlıklı ve hızlı gerçekleşebilmesi için useContext ile yapmayı tercih ettim.
*/
export const SearchComponentContext = createContext<searchComponentContextType>({
    selectedCharacters: [],
    setSelectedCharacters: () => {},
    filteredCharacters: [],
    setFilteredCharacters: () => {}
})


export default function SearchComponent() {

    //Kullanıcıya fetch işleminin devam ettiği geri bildirimini gösterebilmek için loading isimli bir state eklendi
    const [loading, setLoading] = useState<boolean>(false)

    //Arama terimini bu statede tutuyoruz
    const [term, setTerm] = useState<string>('')

    //Seçilen karakterleri bu state içerisinde array olarak tutuyoruz
    const [selectedCharacters, setSelectedCharacters] = useState<characterType[]>([])

    //Arama sonuçlarını bu state içerisinde array olarak tutuyoruz
    const [filteredCharacters, setFilteredCharacters] = useState<characterType[]>([])

    /* Tasarımın ekran görüntüsünde gördüğüm ok işaretinin filtrelenen karakterleri açıp kapattığını düşündüğüm için
    ilgili componenti açıp kapatan bir state ekledim */
    const [listOpen, setListOpen] = useState<boolean>(false)

    //Fetch işleminde hata meydana gelmesi ihtimaline karşılık kullanıcıya bir geri bildirim gönderebilmek adına hata mesajını bu state ile kullanıcıya gösteriyorum.
    const [searchError, setSearchError] = useState<string | undefined>(undefined)

    /* 
    Hem form submit edildiğinde hem de term stateinde değişiklik meydana geldiğinde arama fonksiyonunu tetiklemek için useEffect kullandım.
    */
    useEffect(() => {

        /* Fetch işleminde kullanıcı hareketlerinin maaliyeti arttırmaması için termin başı ve sonundaki boşlukları sildiğimde eğer
        termin length değeri 0'a eşit oluyorsa gereksiz fetch işlemlerinden kaçındım. */
        if (term.trim().length == 0) {
            setListOpen(false)
        } else {
            searchByTermFunction()
        }
    }, [term])

    const contextValue: searchComponentContextType = {
        selectedCharacters,
        setSelectedCharacters,
        filteredCharacters,
        setFilteredCharacters
    }
    return(
        <SearchComponentContext.Provider value={contextValue}>
            <form className="flex flex-col gap-2 p-2 mx-auto max-w-[600px]"  onSubmit={((e) => searchByTermFunction(e))}>

                {/* Input ve unselect kısmı */}
                <div className="flex flex-row gap-2 p-2 rounded-xl border-gray-600 border shadow-sm shadow-gray-300">
                    <div className="flex flex-1 flex-row flex-wrap gap-2">

                        {/* Seçilen karakterler burada mapleniyor. */}
                        {selectedCharacters.map((character) => {
                            return(
                                <SelectedCharacter 
                                key={`selectedCharacter${character.id.toString()}`}
                                character={character}
                                />
                            )
                        })}
                        <input placeholder="Type a name" className="flex flex-1 w-full" defaultValue={term} onChange={((e) => setTerm(e.target.value))}/>
                    </div>
                    <button className="flex ml-auto items-center justify-center" type="button" onClick={() => setListOpen((isOpen) => !isOpen)}>
                        <FaCaretDown className={`${listOpen? 'rotate-180': 'rotate-0'} transition-all`}/>
                    </button>
                </div>

                {/* Karakter listesi açma ve kapatma işlemi */}
                {listOpen && (
                    <div className="flex flex-col gap-2 p-2 border bg-gray-100 border-gray-600 rounded-xl max-h-[600px] overflow-auto scrollbar-thin">

                        {/* Api fetch işlemi esnasında kullanıcıya geri bildirim yapmak için yükleme animasyonu eklendi ve loading isimli değişkene bağlandı.
                        Loading true olduğunda div render olacak ve yükleniyor animasyonu çalışacak */}
                        {loading && (
                            <div className="flex items-center justify-center">
                                <AiOutlineLoading3Quarters className="animate-spin text-xl"/>
                            </div>
                        )}

                        {/* Fetch işleminde bir hata olması durumunda kullanıcıya geri bildirim gönderildi */}
                        {searchError && (
                            <label className="text-red-800">{searchError}</label>
                        )}
                        
                        {/* Arama sonuçları burada gösterildi. */}
                        {filteredCharacters.map((character, index) => {

                            /* Component içerisinde karakter isimlerinin bir kısmı kalın yazdırılacağı için term değişkeni componente gönderildi */
                            return(
                                <div className="flex flex-col">
                                    <CharacterListItem 
                                    key={`characterListItem${character.id.toString()}`}
                                    character={character}
                                    term={term}
                                    />
                                    {index != filteredCharacters.length - 1 && (
                                        <div className="h-px bg-gray-600 w-full"/>
                                    )}
                                </div>
                            )
                        })}

                        {/* Hiç sonuç bulamaması durumunda kullanıcıya geri bildirim sağlanması için bir label eklendi */}
                        {filteredCharacters.length == 0 && (
                            <label className="text-gray-600">No results found</label>
                        )}
                    </div>
                )}
            </form>
        </SearchComponentContext.Provider>
    )

    async function searchByTermFunction(e?: FormEvent<HTMLFormElement>) {

        /* Yukarıda useEffect ile de fonksiyonu tetikleyebilmek için
        e değişkeninin tipi FormEvent<HTMLFormElement> veya undefined olarak belirtildi. Eğer form submit ile tetiklenirse preventDefault çalışacak.*/
        if (e) {
            e.preventDefault()
        } 


        //Başlangıç ve bitişte bulunan gereksiz boşluklar temizlendi
        if (term.trim().length == 0) return

        //Yükleniyor animasyonu içeren componentin renderı gerçekleşti
        setLoading(true)

        /* Next.js ile geliştirme yaparken server action kullanmayı tercih ediyorum.
        Klasik react ile geliştirme yapsaydım server actionda gerçekleştirdiğim fetch işlemini burada gerçekleştirirdim. */
        const response = await searchByTerm(term)

        if (response.status) {
            setFilteredCharacters(response.characters)
            setListOpen(true)
            setSearchError(undefined)
        } else {
            setFilteredCharacters([])
            setSearchError(response?.message)
        }

        //Yükleme tamamlandığı için yükleniyor animasyonu kaldırıldı
        setLoading(false)
    }
}