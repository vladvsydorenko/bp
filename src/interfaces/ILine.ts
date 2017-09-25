import {ISocket} from './ISocket';

export interface ILine {
    // unique ids
    id: string;
    // socket which line is connected to
    sourceSocket: ISocket;
    // socket which line is connected from
    sinkSocket: ISocket;
}
