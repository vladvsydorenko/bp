import {INode} from './INode';
import {ILine} from './ILine';
import {INodeHandler} from './INodeHandler';
import {INodeDescriptor} from './INodeDescriptor';

export interface IScene {
    nodes: INode[];
    lines: ILine[];
    nodeHandlers: { [id:string]: INodeHandler };
    nodeDescriptors: INodeDescriptor[];
}
