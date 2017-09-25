import {ISocket} from './ISocket';

export interface INode {
    // unique id
    id: string;
    // human-readable name
    name: string;
    // node handler
    handler: string;
    // source sockets
    sources: ISocket[];
    // source sockets
    sinks: ISocket[];
}
