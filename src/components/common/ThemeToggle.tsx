import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const key = 'axciom_theme'

export function ThemeToggle() {
    const [dark, setDark] = useState<boolean>(false)
    useEffect(() => {
        const saved = localStorage.getItem(key)
        if (saved === 'dark') {
            document.documentElement.classList.add('dark')
            setDark(true)
        }
    }, [])
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem(key, 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem(key, 'light')
        }
    }, [dark])
    return (
        <button
            onClick={() => setDark(d => !d)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/50 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
        >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            <span className="hidden sm:inline">{dark ? 'Light' : 'Dark'} Mode</span>
        </button>
    )
}


