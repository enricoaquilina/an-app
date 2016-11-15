export class Hub{
    constructor (
        public title: string, 
        public description: string,  
        public _id ?: string, 
        public owner?: {
            _id: string,
            username: string    
        }) {};
}