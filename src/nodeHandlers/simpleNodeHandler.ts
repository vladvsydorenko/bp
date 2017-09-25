import {INodeHandler} from '../interfaces/INodeHandler';
import {IScene} from '../interfaces/IScene';
import {INode} from '../interfaces/INode';
import {ILine} from '../interfaces/ILine';

export const simpleNodeHandler: INodeHandler = {
    canAddLine: ({sinkSocket, sourceSocket}: ILine, sinkNode: INode, scene: IScene) => {
        const hasDifferentNodes = sinkSocket.nodeId !== sourceSocket.nodeId;
        const hasRightGroups = sinkSocket.group === 'sinks' && sourceSocket.group === 'sources';
        const hasRightTypes = sourceSocket.type === 'any' || sinkSocket.type === sourceSocket.type;

        return hasDifferentNodes && hasRightGroups && hasRightTypes;
    }
};
