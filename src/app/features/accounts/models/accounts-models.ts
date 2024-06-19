import { Nullable } from "primeng/ts-helpers"
import { Project, ProjectsToAccounts } from "../../projects/models/project-models"

export interface AccountTransfer {
    username: string
    admin: boolean
    pm: boolean
    projects: ProjectTransfer[]
}

export interface ProjectTransfer {
    projectId: string
    name: string
    roleInProject: string
}

export interface RegisterUserRequest {
    username: Nullable<string>
    name: Nullable<string>
    password: Nullable<string>
}

export interface LoginUserRequest {
    username: Nullable<string>
    password: Nullable<string>
}


export enum RoleInProject {
    PM = "PM",
    EDITOR = "EDITOR",
    CONTENT_CREATOR = "CONTENT_CREATOR"
}

export interface AccountDisplay {
    username: string
    name: string
    role: RoleInProject
}