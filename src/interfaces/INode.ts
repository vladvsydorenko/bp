import {ISocket} from './ISocket';
import {t_position} from './types';

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
    // node position on the scene
    position: t_position;
}
