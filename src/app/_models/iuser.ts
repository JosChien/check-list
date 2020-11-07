export class IUser {
    id: string;
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    token: string;
    permission: string;
    shortName?: boolean;
    language?:boolean
}