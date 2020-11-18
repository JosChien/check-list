import { IClass } from 'src/app/_models/iclass'
export class IUser {
    id: string;
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    email?: string;
    token: string;
    role: string;
    classes: Array<IClass>;
    useShortName?: boolean;
    language?:boolean
}