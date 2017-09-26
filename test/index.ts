import {IScene} from '../src/interfaces/IScene';
import {simpleNodeHandler} from '../src/nodeHandlers/simpleNodeHandler';
import {renderEditor} from '../src/editor/renderEditor';
import {testNodes} from './testNodes';

const scene: IScene = {
    nodes: [],
    lines: [],
    nodeHandlers: {
        'default': simpleNodeHandler,
    },
    nodeDescriptors: testNodes,
};

renderEditor(scene, document.getElementById('app'), scene => {
    console.log('scene changed', scene);
});
