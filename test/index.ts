import {INode} from '../src/interfaces/INode';
import {IScene} from '../src/interfaces/IScene';
import {SceneUtil} from '../src/util/SceneUtil';
import {simpleNodeHandler} from '../src/nodeHandlers/simpleNodeHandler';
import {ILine} from '../src/interfaces/ILine';

const scene: IScene = {
    nodes: [
        {
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
        },
        {
            id: 'test2',
            name: 'userTitle',
            handler: 'default',
            sources: [
                {
                    name: 'name',
                    type: 'string',
                    group: 'sources',
                    nodeId: 'test2',
                },
                {
                    name: 'age',
                    type: 'number',
                    group: 'sources',
                    nodeId: 'test2',
                },
            ],
            sinks: [
                {
                    name: 'title',
                    type: 'string',
                    group: 'sinks',
                    nodeId: 'test2',
                },
            ],
        }
    ],
    lines: [],
    nodeHandlers: {
        'default': simpleNodeHandler,
    },
};

const line: ILine = {
    id: 'line_test1',
    sinkSocket: scene.nodes[0].sinks[0],
    sourceSocket: scene.nodes[1].sources[0],
};

const scene2 = SceneUtil.canAddLine(line, scene) ? SceneUtil.addLine(line, scene) : scene;
console.log(scene2);
const scene3 = SceneUtil.removeNodeById('test', scene);
console.log(scene3);

