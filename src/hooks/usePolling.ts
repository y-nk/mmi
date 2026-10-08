import { useCallback, useEffect, useState } from 'react'

/** Runs `load` now and every `intervalMs`. `load` must be stable (useCallback). */
export function usePolling<T>(load: () => Promise<T>, intervalMs: number) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<Error>()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    const run = () =>
      load().then(
        (value) => {
          if (cancelled) return
          setData(value)
          setError(undefined)
        },
        (err: Error) => !cancelled && setError(err),
      )
    run()
    const id = setInterval(run, intervalMs)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [load, intervalMs, tick])

  const refresh = useCallback(() => setTick((t) => t + 1), [])
  return { data, error, refresh }
}
