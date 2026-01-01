const parseCSV = (
    text: string
): Array<{
    smiles: string
    mw: number | null
    logD: number | null
    logP: number | null
}> => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []

    const compounds: Array<{
        smiles: string
        mw: number | null
        logD: number | null
        logP: number | null
    }> = []

    lines.slice(1).forEach(line => {
        if (!line) {
            return
        }

        const values = line.split(',').map(val => val.trim())

        // check column length match header length
        if (values.length < 5) {
            return
        }

        const [, smiles, mw, logD, logP] = values

        // handle invalid numeric values by returning null
        const parseFloatOrNull = (value: string): number | null => {
            if (!value || value.trim() === '') return null
            const parsed = parseFloat(value)
            return isNaN(parsed) ? null : parsed
        }

        compounds.push({
            smiles: smiles || '',
            mw: parseFloatOrNull(mw),
            logD: parseFloatOrNull(logD),
            logP: parseFloatOrNull(logP),
        })
    })

    return compounds
}

export { parseCSV }
