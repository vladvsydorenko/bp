import * as most from 'most';
import {IScene} from '../src/interfaces/IScene';
import {simpleNodeHandler} from '../src/nodeHandlers/simpleNodeHandler';
import {renderEditor} from '../src/editor/renderEditor';
import {baseDescriptors} from './testNodes';
import {SceneUtil} from '../src/util/SceneUtil';
import {compile} from '../src/util/compile';
import {async, hold} from 'most-subject';

function makeDescriptorFromCode(code) {
    eval(`window.recentDescriptor = ${code}`);
    return window['recentDescriptor'];
}

function makeScene(): IScene {
    const serialized = localStorage.getItem('scene');
    const savedDescriptors: any = window['savedDescriptors'] = localStorage.getItem('savedDescriptors') ?
        JSON.parse(localStorage.getItem('savedDescriptors') as any) : {};
    let nodeDescriptors = window['descriptors'] = {...baseDescriptors} as any;
    Object.keys(savedDescriptors).forEach(key => {
        const descriptor = makeDescriptorFromCode(savedDescriptors[key]);
        nodeDescriptors[descriptor.name] = descriptor;
    });
    const {nodes, lines} = serialized ? JSON.parse(serialized) : { nodes: [], lines: [] };
    const validNodes = nodes.filter(node => !!nodeDescriptors[node.name]);
    const scene = {
        nodes: validNodes,
        lines,
        nodeHandlers: {
            'default': simpleNodeHandler,
        },
        nodeDescriptors,
    };

    return SceneUtil.fixScene(scene);
}

function isEditor(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('editor');
}

const scene = makeScene();
if (isEditor()) {
    const updateDate = () => {
        localStorage.setItem('updated', String(Date.now()));
    };

    const onSceneChange = (scene: IScene) => {
        const {nodes, lines} = scene;
        localStorage.setItem('scene', JSON.stringify({
            nodes,
            lines
        }));
        localStorage.setItem('compiled', compile(scene));
        updateDate();
    };
    const onDescriptorAdd = (code) => {
        const descriptor = makeDescriptorFromCode(code);
        const savedDescriptors = window['savedDescriptors'];
        savedDescriptors[descriptor.name] = code;
        localStorage.setItem('savedDescriptors', JSON.stringify(savedDescriptors));
        window['descriptors'][descriptor.name] = descriptor;
        SceneUtil.fixScene(scene);
        updateDate();
    };

    renderEditor(scene, document.getElementById('app'), onSceneChange, onDescriptorAdd);
}
else {
    const updated = localStorage.getItem('updated');

    const run = () => {
        const compiled = localStorage.getItem('compiled');
        if (!compiled) return;
        window['most'] = most;
        window['hold'] = hold;
        window['async'] = async;
        window['nodes'] = window['descriptors'];
        eval(compiled);
    };

    const check = () => {
        const date = localStorage.getItem('updated');
        if (date !== updated) window.location.reload();
        setTimeout(check, 500);
    };
    check();
    run();
}
