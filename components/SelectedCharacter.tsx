'use client'

import { characterType } from "@/types"
import { IoClose } from "react-icons/io5"
import { useContext } from "react"
import { SearchComponentContext } from "@/components/SearchComponent"
import { searchComponentContextType } from "@/components/SearchComponent"









export default function SelectedCharacter({ character }: { character: characterType }) {

    /* Parent componentte açıkladığım useContext hookuna bu component içerisinde erişildi. */
    const {
        setSelectedCharacters
    }: searchComponentContextType = useContext(SearchComponentContext)
    return(
        <div className="flex flex-row gap-2 bg-slate-300 rounded-xl p-2">
            <label>
                {character.name}
            </label>
            <button className="flex flex-shrink-0 w-6 h-6 rounded-md items-center justify-center bg-slate-500 text-white" type="button" onClick={unSelectCharacter}>
                <IoClose/>
            </button>
        </div>
    )

    function unSelectCharacter() {
        setSelectedCharacters((oldCharacters) => [...oldCharacters.filter((c) => c.id != character.id)])
    }
}