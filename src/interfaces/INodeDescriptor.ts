import {Stream} from 'most';
import {AsyncSubject} from 'most-subject';

export interface INodeDescriptor {
    name: string;
    sources: { [name:string]: string; };
    sinks: { [name:string]: string; };
    run: (sources: { [name:string]: AsyncSubject<any> }) => { [name:string]: Stream<any> };
}
