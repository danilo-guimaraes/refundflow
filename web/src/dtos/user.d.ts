type UserAPIRole = "employee" | "manager"

type UserApiResponse = {
    token: string
    user:{
        id:string
        name:string
        email:string
        role: UserAPIRole
    }
}
