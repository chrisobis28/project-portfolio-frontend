import { Nullable } from "primeng/ts-helpers"

export interface Account {
    username: string
    name: string
    password: string
    isAdministrator: boolean
    isPM: boolean
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