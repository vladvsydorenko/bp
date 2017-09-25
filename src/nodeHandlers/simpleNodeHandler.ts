import {INodeHandler} from '../interfaces/INodeHandler';
import {IScene} from '../interfaces/IScene';
import {INode} from '../interfaces/INode';
import {ILine} from '../interfaces/ILine';

export const simpleNodeHandler: INodeHandler = {
    canAddLine: ({sinkSocket, sourceSocket}: ILine, sinkNode: INode, scene: IScene) => {
        const hasDifferentNodes = sinkSocket.nodeId !== sourceSocket.nodeId;
        const hasRightGroups = sinkSocket.group === 'sinks' && sourceSocket.group === 'sources';
        const hasRightTypes = sourceSocket.type === 'any' || sinkSocket.type === sourceSocket.type;
        const isAlreadyAdded = scene.lines.some(line => {
            return line.sourceSocket.nodeId === sourceSocket.nodeId &&
                line.sinkSocket.nodeId === sinkSocket.nodeId &&
                line.sourceSocket.name === sourceSocket.name &&
                line.sinkSocket.name === sinkSocket.name;
        });

        return hasDifferentNodes && hasRightGroups && hasRightTypes && !isAlreadyAdded;
    }
};
