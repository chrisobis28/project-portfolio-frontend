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
    thumbnail:MediaFileContent | undefined

}

export interface Media {
    mediaId: string
    name: string
    path: string
    project: Project
    requestMediaProjects: RequestMediaProject[]
}

export interface EditMedia {
  media:Media|null
  mediaFileContent:MediaFileContent|null
  file:File|null
  delete:boolean
}

export interface ProjectsToAccounts {
    ptaId: string
    role: string
}
export interface MediaFileContent {
  fileName:string,
  filePath:string,
  fileContent:string
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
    media: Media
    request: Request
}

export interface RequestLinkProject {
    requestLinkProjectId: string
    isRemove: boolean
    link: Link
    request: Request

}

export interface Collaborator {
    collaboratorId: string
    name: string
    projectsToCollaborators: ProjectsToCollaborators[]
    requestCollaboratorsProjects: RequestCollaboratorsProjects[]
}

export interface CollaboratorTransfer {
    collaboratorId: string;
    name: string;
    role: string;
}


export interface Request {
    requestId: string
    newTitle: string
    newDescription: string
    isCounterOffer: boolean
    project: Project
    account: Account
    requestTagProjects: RequestTagProject[]
    requestMediaProjects: RequestMediaProject[]
    requestLinkProjects: RequestLinkProject[]
    requestCollaboratorsProjects: RequestCollaboratorsProjects[]
}

export interface Account {
    username: string
    name: string
    password: string
    role: string
    projectsToAccounts : ProjectsToAccounts[]
    requests: Request[]
}


export interface ProjectsToAccounts {
    ptaId: string
    role: string
    account: Account
    project: Project
}

export interface RequestCollaboratorsProjects {
    id: string
    isRemove: boolean
    collaborator: Collaborator
    request: Request
}

export interface RequestTagProject {
    requestTagProjectID: string
    isRemove: boolean
    request: Request
    tag: Tag
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
    numberOfCollaborators: number | undefined
    projects: Project[]
    templateAdditions: TemplateAddition[]
}

export interface TemplateAddition {
    templateAdditionId: string
    templateAdditionName: string
    media: boolean
    template: Template | null
}

export interface WebSocketStringMessage {
    message: string
}


export interface CollaboratorSelectEvent {
    value: CollaboratorTransfer
}

export interface TemplateSelectEvent {
    value: string
}
