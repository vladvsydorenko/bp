import {ISocket} from '../interfaces/ISocket';
import {IScene} from '../interfaces/IScene';
import {ILine} from '../interfaces/ILine';
import {INode} from '../interfaces/INode';

export namespace SceneUtil {
    export function findNodeBySocket({nodeId}: {nodeId: string} | ISocket, scene: IScene): INode | undefined {
        return scene.nodes.find(node => node.id === nodeId);
    }

    export function canAddLine(line: ILine, scene: IScene): boolean {
        const sinkNode = SceneUtil.findNodeBySocket(line.sinkSocket, scene);
        if (!sinkNode) return false;

        const nodeHandler = scene.nodeHandlers[sinkNode.handler];
        if (!nodeHandler) return false;

        return nodeHandler.canAddLine(line, sinkNode, scene);
    }
}
