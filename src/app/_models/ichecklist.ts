import { IMemberAbsent } from './imembersAbsent';

export class IChecklist {
    id: string;
    course: string
    dates: Array<string>;
    class: { id: string };
    members: Array<IMemberAbsent>;
}
