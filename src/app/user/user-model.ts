import {Hub} from '../hubs/hub';

export class User{
    constructor (
        public username: string,
        public password: string, 
        public ownedHubs?: Hub[],
        public subbedHubs?: Hub[],
        public email?: string,
        public firstName?: string,
        public lastName?: string,
        public isAdmin?: boolean,
        public identifier?: number,
        ) {};
}