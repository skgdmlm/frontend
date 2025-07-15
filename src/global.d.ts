
declare global {    enum UserRole {
        ADMIN = 'ADMIN',
        USER = 'USER'
    }
    interface UserProfileData {
        _id: string,
        email: string,
        userName: string,
        phone: string,
        firstName: string,
        lastName: string,
        role: UserRole
    }
}
export { }