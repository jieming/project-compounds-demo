import { parseCSV } from './file-parser-utils'

describe('parseCSV', () => {
    it('should parse valid CSV with all fields', () => {
        const csvText = `Compound_Name,SMILES,MW,LogD,LogP
Aspirin,CC(=O)OC1=CC=CC=C1C(=O)O,180.16,-0.73,1.19
Caffeine,CN1C=NC2=C1C(=O)N(C(=O)N2C)C,194.19,-0.07,-0.07`

        const result = parseCSV(csvText)

        expect(result).toHaveLength(2)
        expect(result[0]).toEqual({
            smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
            mw: 180.16,
            logD: -0.73,
            logP: 1.19,
        })
        expect(result[1]).toEqual({
            smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
            mw: 194.19,
            logD: -0.07,
            logP: -0.07,
        })
    })

    it('should parse CSV with nullable fields (empty values)', () => {
        const csvText = `Compound_Name,SMILES,MW,LogD,LogP
Compound1,CCO,46.07,,
Compound2,CCN,,0.15,
Compound3,CC(=O)O,,,-1.76`

        const result = parseCSV(csvText)

        expect(result).toHaveLength(3)
        expect(result[0]).toEqual({
            smiles: 'CCO',
            mw: 46.07,
            logD: null,
            logP: null,
        })
        expect(result[1]).toEqual({
            smiles: 'CCN',
            mw: null,
            logD: 0.15,
            logP: null,
        })
        expect(result[2]).toEqual({
            smiles: 'CC(=O)O',
            mw: null,
            logD: null,
            logP: -1.76,
        })
    })

    it('should parse CSV with whitespace in values', () => {
        const csvText = `Compound_Name,SMILES,MW,LogD,LogP
Aspirin,CC(=O)OC1=CC=CC=C1C(=O)O, 180.16 , -0.73 , 1.19`

        const result = parseCSV(csvText)

        expect(result).toHaveLength(1)
        expect(result[0]).toEqual({
            smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
            mw: 180.16,
            logD: -0.73,
            logP: 1.19,
        })
    })

    it('should return empty array when CSV has only header', () => {
        const csvText = `Compound_Name,SMILES,MW,LogD,LogP`

        const result = parseCSV(csvText)

        expect(result).toEqual([])
    })

    it('should return empty array when CSV is empty', () => {
        const csvText = ''

        const result = parseCSV(csvText)

        expect(result).toEqual([])
    })

    it('should skip empty lines', () => {
        const csvText = `Compound_Name,SMILES,MW,LogD,LogP

Aspirin,CC(=O)OC1=CC=CC=C1C(=O)O,180.16,-0.73,1.19

Caffeine,CN1C=NC2=C1C(=O)N(C(=O)N2C)C,194.19,-0.07,-0.07
`

        const result = parseCSV(csvText)

        expect(result).toHaveLength(2)
        expect(result[0].smiles).toBe('CC(=O)OC1=CC=CC=C1C(=O)O')
        expect(result[1].smiles).toBe('CN1C=NC2=C1C(=O)N(C(=O)N2C)C')
    })

    it('should skip lines with insufficient columns', () => {
        const csvText = `Compound_Name,SMILES,MW,LogD,LogP
Aspirin,CC(=O)OC1=CC=CC=C1C(=O)O,180.16
Caffeine,CN1C=NC2=C1C(=O)N(C(=O)N2C)C,194.19,-0.07,-0.07`

        const result = parseCSV(csvText)

        expect(result).toHaveLength(1)
        expect(result[0].smiles).toBe('CN1C=NC2=C1C(=O)N(C(=O)N2C)C')
    })

    it('should handle lines with whitespace-only values', () => {
        const csvText = `Compound_Name,SMILES,MW,LogD,LogP
Compound1,CCO,   ,  ,  `

        const result = parseCSV(csvText)

        expect(result).toHaveLength(1)
        expect(result[0]).toEqual({
            smiles: 'CCO',
            mw: null,
            logD: null,
            logP: null,
        })
    })

    it('should handle invalid numeric values by returning null', () => {
        const csvText = `Compound_Name,SMILES,MW,LogD,LogP
Compound1,CCO,invalid,not-a-number,also-invalid`

        const result = parseCSV(csvText)

        expect(result).toHaveLength(1)
        expect(result[0]).toEqual({
            smiles: 'CCO',
            mw: null,
            logD: null,
            logP: null,
        })
    })

    it('should handle empty smiles field by using empty string', () => {
        const csvText = `Compound_Name,SMILES,MW,LogD,LogP
Compound1,,46.07,-0.31,-0.31`

        const result = parseCSV(csvText)

        expect(result).toHaveLength(1)
        expect(result[0]).toEqual({
            smiles: '',
            mw: 46.07,
            logD: -0.31,
            logP: -0.31,
        })
    })

    it('should parse multiple compounds correctly', () => {
        const csvText = `Compound_Name,SMILES,MW,LogD,LogP
Aspirin,CC(=O)OC1=CC=CC=C1C(=O)O,180.16,-0.73,1.19
Caffeine,CN1C=NC2=C1C(=O)N(C(=O)N2C)C,194.19,-0.07,-0.07
Paracetamol,CC(=O)NC1=CC=CC=C1O,151.16,0.91,0.91
Ibuprofen,CC(C)CC1=CC=C(C=C1)C(C)C(=O)O,206.28,0.45,3.97`

        const result = parseCSV(csvText)

        expect(result).toHaveLength(4)
        expect(result[0].smiles).toBe('CC(=O)OC1=CC=CC=C1C(=O)O')
        expect(result[1].smiles).toBe('CN1C=NC2=C1C(=O)N(C(=O)N2C)C')
        expect(result[2].smiles).toBe('CC(=O)NC1=CC=CC=C1O')
        expect(result[3].smiles).toBe('CC(C)CC1=CC=C(C=C1)C(C)C(=O)O')
    })

    it('should handle CSV with trailing newline', () => {
        const csvText = `Compound_Name,SMILES,MW,LogD,LogP
Aspirin,CC(=O)OC1=CC=CC=C1C(=O)O,180.16,-0.73,1.19
`

        const result = parseCSV(csvText)

        expect(result).toHaveLength(1)
        expect(result[0].smiles).toBe('CC(=O)OC1=CC=CC=C1C(=O)O')
    })

    it('should handle CSV with leading/trailing whitespace in text', () => {
        const csvText = `   Compound_Name,SMILES,MW,LogD,LogP   
Aspirin,CC(=O)OC1=CC=CC=C1C(=O)O,180.16,-0.73,1.19   `

        const result = parseCSV(csvText)

        expect(result).toHaveLength(1)
        expect(result[0].smiles).toBe('CC(=O)OC1=CC=CC=C1C(=O)O')
    })
})
