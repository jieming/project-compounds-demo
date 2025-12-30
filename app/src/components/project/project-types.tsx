interface Project {
    id: number | string
    name: string
    description: string
}

interface GetProjectsData {
    projects: Project[]
}

export type { Project, GetProjectsData }
