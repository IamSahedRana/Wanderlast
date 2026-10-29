import * as React from "react"

import { loadHighlighter } from "@/lib/highlighter"

export function useHighlightedCode(value: string, language: string) {
  // A trailing newline would render as an extra empty line.
  const code = value.endsWith("\n") ? value.slice(0, -1) : value

  const [loaded, setLoaded] = React.useState<{
    language: string
    highlighter: Awaited<ReturnType<typeof loadHighlighter>>
  } | null>(null)

  const highlighter = loaded?.language === language ? loaded.highlighter : null

  React.useEffect(() => {
    let cancelled = false

    loadHighlighter(language)
      .then((next) => {
        if (!cancelled) {
          setLoaded({ language, highlighter: next })
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [language])

  // Compute cached/incremental highlighted lines safely via useMemo
  // instead of invoking setState during render.
  return React.useMemo(() => {
    if (!highlighter) {
      return code.split("\n")
    }

    const end = code.lastIndexOf("\n") + 1
    const completedText = code.slice(0, end)
    const tail = code.slice(end)

    // Highlight completed lines incrementally
    const result = highlighter.highlight(
      completedText.slice(0, end > 0 ? end - 1 : 0),
      undefined
    )

    const lines = result?.lines || []

    // The last line is still being written, so it is tokenized on every render.
    const tailResult = highlighter.highlight(tail, result?.state)

    return [...lines, ...(tailResult?.lines || [tail])]
  }, [code, highlighter])
}