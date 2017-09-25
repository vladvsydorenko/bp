import {ILine} from './ILine';
import {INode} from './INode';
import {IScene} from './IScene';

export interface INodeHandler {
    canAddLine: (line: ILine, sinkNode: INode, scene: IScene) => boolean;
}