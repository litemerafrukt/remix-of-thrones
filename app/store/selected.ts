import { atom } from "jotai"

export const selectedAtom = atom<number | null>(null)

export const selectAtom = atom<null, number | null>(
  null,
  (_get, set, update) => {
    set(selectedAtom, () => update)
  }
)
