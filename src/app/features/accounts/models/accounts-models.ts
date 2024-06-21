import { Nullable } from "primeng/ts-helpers"

export interface AccountTransfer {
    username: string
    admin: boolean
    pm: boolean
    projects: ProjectTransfer[]
}

export  interface Account {
    username: string
    name: string
    password: string
    role: string
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