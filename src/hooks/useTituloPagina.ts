import { useEffect } from 'react'

/** Define o título da aba do navegador conforme a página visitada. */
export function useTituloPagina(titulo: string): void {
  useEffect(() => {
    document.title = `${titulo} — Estratificação de Risco Familiar (protótipo)`
  }, [titulo])
}
