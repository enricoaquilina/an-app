import {Hub} from '../hubs/hub';

export class User{
    constructor (
        public username: string,
        public password: string, 
        public email?: string,
        public ownedHubs?: Hub[],
        public subbedHubs?: Hub[],
        public firstName?: string,
        public lastName?: string,
        public isAdmin?: boolean,
        public identifier?: number,
        ) {};
}