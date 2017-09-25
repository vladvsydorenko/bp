import {INode} from './INode';
import {ILine} from './ILine';
import {INodeHandler} from './INodeHandler';

export interface IScene {
    nodes: INode[];
    lines: ILine[];
    nodeHandlers: { [id:string]: INodeHandler };
}
