import {Stream} from 'most';
import {AsyncSubject} from 'most-subject';

export interface INodeDescriptor {
    name: string;
    descriptor?: string;
    sources: { [name:string]: string | {type: string, initialValue: any} };
    sinks: { [name:string]: string; };
    run: (sources: { [name:string]: AsyncSubject<any> }) => { [name:string]: Stream<any> };
}
