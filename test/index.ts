import {IScene} from '../src/interfaces/IScene';
import {SceneUtil} from '../src/util/SceneUtil';
import {simpleNodeHandler} from '../src/nodeHandlers/simpleNodeHandler';
import {compile} from '../src/util/compile';
import {ILine} from '../src/interfaces/ILine';
import {renderEditor} from '../src/editor/renderEditor';

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
            position: {x: 80, y: 80}
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
                    type: 'string',
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
            position: {x: 120, y: 200}
        },
        {
            id: 'test3',
            name: 'userTitle',
            handler: 'default',
            sources: [
                {
                    name: 'name',
                    type: 'string',
                    group: 'sources',
                    nodeId: 'test3',
                },
                {
                    name: 'age',
                    type: 'string',
                    group: 'sources',
                    nodeId: 'test3',
                },
            ],
            sinks: [
                {
                    name: 'title',
                    type: 'string',
                    group: 'sinks',
                    nodeId: 'test3',
                },
            ],
            position: {x: 300, y: 180}
        }
    ],
    lines: [],
    nodeHandlers: {
        'default': simpleNodeHandler,
    },
};


renderEditor(scene);
