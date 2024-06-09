export interface Project {
    projectId: string;
    title: string
    description: string;
    archived: boolean
    template: Template | null
    media: Media[]
    projectsToAccounts: ProjectsToAccounts[]
    projectsToCollaborators: ProjectsToCollaborators[]
    tagsToProjects: TagToProject[]
    links: Link[]
    requests: Request[]
    collaboratorNames: string[]
    tagNames: string[]
    tags: Tag[]
    tmb:MediaFileContent | undefined

}

export interface Media {
    mediaId: string
    name: string
    path: string
    project: Project
    requestMediaProjects: RequestMediaProject[]
}

export interface ProjectsToAccounts {
    ptaId: string
    role: string
}
export interface MediaFile {
  a: string;
  b: string;
  c: string;
}
export interface MediaFileContent {
  a: string;
  b: string;
}

export interface ProjectsToCollaborators {
    ptcId: string
    role: string
}

export interface TagToProject {
    tagToProjectId: string
}

export interface Link {
    linkId: string
    name: string
    url: string
    requestLinkProjects: RequestLinkProject[]
}

export interface RequestMediaProject {
    requestMediaProjectId: string
    isRemove: boolean
}

export interface RequestLinkProject {
    requestLinkProjectId: string
    isRemove: boolean

}

export interface Collaborator {
    collaboratorId: string
    name: string
    projectsToCollaborators: ProjectsToCollaborators[]
    requestCollaboratorsProjects: RequestCollaboratorsProjects[]
}

export interface Request {
    requestId: string
    newTitle: string
    newDescription: string
    newBibtex: string
    isCounterOffer: boolean
    requestTagProjects: RequestTagProject[]
    requestMediaProjects: RequestMediaProject[]
    requestLinkProjects: RequestLinkProject[]
    requestCollaboratorsProjects: RequestCollaboratorsProjects[]
}

export interface RequestCollaboratorsProjects {
    id: string
    isRemove: boolean
}

export interface RequestTagProject {
    requestTagProjectID: string
    isRemove: boolean

}

export interface Tag {
    tagId: string
    name: string
    color: string
    requestTagProjects: RequestTagProject[]
    tagsToProjects: TagToProject[]
}

export interface Template {
    templateName: string
    standardDescription: string
    standardBibtex: string
    numberOfCollaborators: number
    projects: Project[]
    templateAdditions: TemplateAddition[]
}

export interface TemplateAddition {
    templateAdditionId: string
    templateAdditionName: string
    media: boolean
    template: Template
}

export interface WebSocketStringMessage {
    message: string
}

