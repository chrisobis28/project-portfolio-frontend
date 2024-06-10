import { Nullable } from "primeng/ts-helpers"

export interface Account {
    username: string
    role: string
    projects: string[]
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