import {ISocket} from '../interfaces/ISocket';
import {IScene} from '../interfaces/IScene';
import {ILine} from '../interfaces/ILine';
import {INode} from '../interfaces/INode';
import {INodeDescriptor} from '../interfaces/INodeDescriptor';
import {UID} from './uid';

function makeSockets(sockets: INodeDescriptor['sources'], group: string, nodeId: string): ISocket[] {
    return Object.keys(sockets).map(name => {
        return {
            name,
            type: sockets[name],
            nodeId,
            group
        };
    });
}

export namespace SceneUtil {
    export function findNodeById(id: string, scene: IScene): INode | undefined {
        return scene.nodes.find(node => node.id === id);
    }
    export function findLineById(id: string, scene: IScene): ILine | undefined {
        return scene.lines.find(line => line.id === id);
    }

    export function canAddNode(node: INode, scene: IScene): boolean {
        return !SceneUtil.findNodeById(node.id, scene);
    }
    export function addNode(node: INode, scene: IScene): IScene {
        scene.nodes.push(node);
        return scene;
    }
    export function removeNodeById(id: string, scene: IScene): IScene {
        const node = SceneUtil.findNodeById(id, scene);
        if (!node) return scene;
        const index = scene.nodes.indexOf(node);
        const lines = scene.lines.filter(line => line.sinkSocket.nodeId === id || line.sourceSocket.nodeId === id);
        lines.forEach(line => SceneUtil.removeLineById(line.id, scene));
        scene.nodes.splice(index, 1);
        return scene;
    }

    export function canAddLine(line: ILine, scene: IScene): boolean {
        const sinkNode = SceneUtil.findNodeById(line.sinkSocket.nodeId, scene);
        if (!sinkNode) return false;

        const nodeHandler = scene.nodeHandlers[sinkNode.handler];
        if (!nodeHandler) return false;

        return nodeHandler.canAddLine(line, sinkNode, scene);
    }
    export function addLine(line: ILine, scene: IScene): IScene {
        scene.lines.push(line);
        if (typeof line.sourceSocket.value !== 'undefined')
            line.sourceSocket.value = undefined;
        return scene;
    }
    export function removeLineById(id: string, scene: IScene): IScene {
        const line = SceneUtil.findLineById(id, scene);
        if (!line) return scene;
        const index = scene.lines.indexOf(line);
        scene.lines.splice(index, 1);
        return scene;
    }

    export function makeNode({sources, sinks, name}: INodeDescriptor) {
        const id = UID('node');
        return {
            id,
            name,
            sources: makeSockets(sources, 'sources', id),
            sinks: makeSockets(sinks, 'sinks', id),
            handler: 'default',
            position: {x: 0, y: 0}
        };
    }
}
