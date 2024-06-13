import { Nullable } from "primeng/ts-helpers"
import { Project } from "../../projects/models/project-models"

export interface Account {
    username: string
    role: string
    project: {id: string, title: string}[]
}

export interface AccountProject {
    id: string
    title: string
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