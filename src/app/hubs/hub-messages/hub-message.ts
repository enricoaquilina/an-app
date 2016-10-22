export class HubMessage{
    constructor (
        public content: string, 
        public writer: string, 
        public parentHub: string,
        public creationDate?: string) {};
}