import type { Project } from '../project/project-types'

interface Compound {
    id: number | string
    project: Project
    smiles: string
    mw: number | null
    logD: number | null
    logP: number | null
}

interface GetCompoundsData {
    compounds: Compound[]
}

export type { Compound, GetCompoundsData }
