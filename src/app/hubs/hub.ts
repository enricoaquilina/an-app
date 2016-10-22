export class Hub{
    constructor (
        public title: string, 
        public description: string, 
        public ownerUsername?: string, 
        public hubId?: string, 
        public ownerId?: string) {};
}