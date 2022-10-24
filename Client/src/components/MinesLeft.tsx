import React from 'react'
import { GlobalContext } from '../states'
import { BlockType } from '../types';
import Image from './Image'
import { MinesLeftType } from '../types'

const initialMinesLeftObj = {
    legendary:1,
    epic:2,
    rare:3,
    common:5,
}

export default function MinesLeft() {
    const { global_state } = React.useContext(GlobalContext);
    const { gameInfo } = global_state;
    const [ minesLeft, setMinesLeft ] = React.useState<MinesLeftType>(initialMinesLeftObj);
    React.useEffect(()=>{
        if (gameInfo.minesArray !== undefined) {
            const minesLeftObj:MinesLeftType = { ...initialMinesLeftObj }
            gameInfo.minesArray.forEach((block:BlockType)=>{
                if (block.type !== null && block.selected) {
                    minesLeftObj[block.type.toLowerCase()] = minesLeftObj[block.type.toLowerCase()]-1;
                }
            })
            setMinesLeft(minesLeftObj)
        }
    },[gameInfo.minesArray])
    return (
        <div className="text-white px-5 pb-5 pt-1 text-xl rounded-3xl bg-zinc-600 
        bg-opacity-60 w-[80%] m-auto">
            <div className="text-2xl pb-1 font-righteous text-zinc-200">MINES LEFT</div>
            <div className="bg-neutral-800 rounded-3xl p-3">
                <div className={`flex text-yellow-300 justify-between
                ${minesLeft.legendary===0?"brightness-50":null}`}>
                    <Image 
                        type="Legendary"
                        className="w-10 h-10"
                    />
                    <span className="my-auto">
                        Legendary Mine
                    </span>
                    <span className="my-auto">
                        x{minesLeft.legendary}
                    </span>
                </div>
                <div className={`flex text-red-300 justify-between
                ${minesLeft.epic===0?"brightness-50":null}`}>
                    <Image 
                        type="Epic"
                        className="w-10 h-10"
                    />
                    <span className="my-auto">
                        Epic Mine
                    </span>
                    <span className="my-auto">
                        x{minesLeft.epic}
                    </span>
                </div>
                <div className={`flex text-cyan-300 justify-between
                ${minesLeft.rare===0?"brightness-50":null}`}>
                    <Image 
                        type="Rare"
                        className="w-10 h-10"
                    />
                    <span className="my-auto">
                        Rare Mine
                    </span>
                    <span className="my-auto">
                        x{minesLeft.rare}
                    </span>
                </div>
                <div className={`flex text-neutral-300 justify-between
                ${minesLeft.common===0?"brightness-50":null}`}>
                    <Image 
                        type="Common"
                        className="w-10 h-10"
                    />
                    <span className="my-auto">
                        Common Mine
                    </span> 
                    <span className="my-auto">
                        x{minesLeft.common}
                    </span>
                </div>
            </div>
        </div>
    )
}
