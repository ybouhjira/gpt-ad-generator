"use client";

import React from "react";
import {Inter} from 'next/font/google';
import {useEffect, useState} from "react";
import Skeleton from "@/app/Skeleton";

const inter = Inter({subsets: ['latin']})

type Language = 'english' | 'french' | 'arabic'

export default function Home() {
    const [description, setDescription] = useState<string>('')
    const [language, setLanguage] = useState<Language>('english')
    const [text, setText] = useState<any>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [number, setNumber] = useState<number>(1)
    const debouncedDescription = useDebounce(description, 1000)

    useEffect(() => {
        if (language && debouncedDescription) {
            setLoading(true)
            fetchText(debouncedDescription, language, number).then(setText).catch(setText).finally(() => setLoading(false))
        }
    }, [debouncedDescription, language, number])

    return (
        <main className={`flex min-h-screen flex-col items-center gap-8 p-4 md:p-24 ${inter.className}`}>
            <div className="flex gap-2 w-full flex-col">
                <input type="text" value={description} onChange={e => setDescription(e.target.value)}
                       className="input grow-[5] border border-red-700"/>
                <select name="language" id="language" className="input "
                        onChange={e => setLanguage(e.target.value as Language)}>
                    <option value="english">
                        English
                    </option>
                    <option value="french">
                        French
                    </option>
                    <option value="arabic">
                        Arabic
                    </option>
                </select>
                <select name="number" id="number" className="input" onChange={e => setNumber(parseInt(e.target.value))} value={number}>
                    {Array.from({length: 10}).map((_, i) => (
                        <option value={i + 1} key={i}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>
            {!description ? (
                <div className="text-gray-500">
                    Write necklace description...
                </div>
            ) : (
                loading ? (
                    <div className="text-gray-500 w-full">
                        <Skeleton />
                    </div>
                ) : (
                    <div className="text-gray-500">
                        {typeof text === 'string' ? text.split('\n').map(t => <div className="mb-4" key={t}>{t}</div>) : text.statusText || JSON.stringify(text)}
                    </div>
                )
            )}
        </main>
    )
}

const fetchText = async (description: string, language: Language, n: number) => {
    const res = await fetch('/api/gpt', {
        method: 'POST',
        body: JSON.stringify({
            description,
            language,
            number: n,
        })
    })

    return await res.text()
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value])

    return debouncedValue
}
