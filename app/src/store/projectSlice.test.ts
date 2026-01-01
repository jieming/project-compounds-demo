import projectReducer, { setCurrentProject, type Project } from './projectSlice'

describe('projectSlice', () => {
    const mockProject: Project = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
    }

    describe('initial state', () => {
        it('should return initial state', () => {
            const state = projectReducer(undefined, { type: 'unknown' })
            expect(state).toEqual({
                currentProject: undefined,
            })
        })
    })

    describe('setCurrentProject', () => {
        it('should set current project', () => {
            const state = projectReducer(
                undefined,
                setCurrentProject(mockProject)
            )
            expect(state.currentProject).toEqual(mockProject)
        })

        it('should set current project to undefined', () => {
            const previousState = {
                currentProject: mockProject,
            }
            const state = projectReducer(
                previousState,
                setCurrentProject(undefined)
            )
            expect(state.currentProject).toBeUndefined()
        })

        it('should replace existing current project', () => {
            const existingProject: Project = {
                id: '2',
                name: 'Existing Project',
                description: 'Existing Description',
            }
            const previousState = {
                currentProject: existingProject,
            }
            const state = projectReducer(
                previousState,
                setCurrentProject(mockProject)
            )
            expect(state.currentProject).toEqual(mockProject)
            expect(state.currentProject).not.toEqual(existingProject)
        })
    })
})
