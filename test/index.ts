import {INode} from '../src/interfaces/INode';
import {IScene} from '../src/interfaces/IScene';
import {SceneUtil} from '../src/util/SceneUtil';
import {simpleNodeHandler} from '../src/nodeHandlers/simpleNodeHandler';
import {ILine} from '../src/interfaces/ILine';

const node: INode = {
    id: 'test',
    name: 'userTitle',
    handler: 'default',
    sources: [
        {
            name: 'name',
            type: 'string',
            group: 'sources',
            nodeId: 'test',
        },
        {
            name: 'age',
            type: 'number',
            group: 'sources',
            nodeId: 'test',
        },
    ],
    sinks: [
        {
            name: 'title',
            type: 'string',
            group: 'sinks',
            nodeId: 'test',
        },
    ],
};
const scene: IScene = {
    nodes: [node],
    lines: [],
    nodeHandlers: {
        'default': simpleNodeHandler,
    },
};

const line: ILine = {
    id: 'line_test1',
    sinkSocket: node.sinks[0],
    sourceSocket: node.sources[0],
};

