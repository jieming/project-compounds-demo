interface Project {
    id: string
    name: string
    description: string
}

interface GetProjectsData {
    projects: Project[]
}

export type { Project, GetProjectsData }
