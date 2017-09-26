import * as most from 'most';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IScene} from '../src/interfaces/IScene';
import {simpleNodeHandler} from '../src/nodeHandlers/simpleNodeHandler';
import {renderEditor} from '../src/editor/renderEditor';
import {baseDescriptors} from './testNodes';
import {SceneUtil} from '../src/util/SceneUtil';
import {compileMostJs} from '../src/util/compile/compileMostJs';
import {async, hold} from 'most-subject';
import {INodeDescriptor} from '../src/interfaces/INodeDescriptor';
import {BPCodeViewer} from '../src/editor/BPCodeViewer/BPCodeViewer';
import {compileRxJs} from '../src/util/compile/compileRxjsJs';
import {testScene} from './testScene';

function makeDescriptorFromCode(code) {
    eval(`window.recentDescriptor = ${code}`);
    return window['recentDescriptor'];
}

function makeScene(): IScene {
    let serialized = localStorage.getItem('scene');
    if (!serialized) {
        serialized = testScene;
        localStorage.setItem('scene', serialized);
    }
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
function isCode(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code');
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

    const onDescriptorRemove = (descriptor: INodeDescriptor) => {
        delete window['descriptors'][descriptor.name];
        delete scene.nodeDescriptors[descriptor.name];
        const savedDescriptors = window['savedDescriptors'];
        delete window['savedDescriptors'][descriptor.name];
        localStorage.setItem('savedDescriptors', JSON.stringify(savedDescriptors));
        SceneUtil.fixScene(scene);
        onSceneChange(scene);
        updateDate();
    };

    renderEditor(scene, document.getElementById('app'), onSceneChange, onDescriptorAdd, onDescriptorRemove);
    (document.querySelector('title') as any).innerText = 'BP: Editor';
}
else if (isCode()) {
    let updated = localStorage.getItem('updated');

    const run = () => {
        localStorage.setItem('compiledMostJs', compileMostJs(scene));
        localStorage.setItem('compiledRxJs', compileRxJs(scene));

        const codeMostJs = localStorage.getItem('compiledMostJs');
        const codeRxJs = localStorage.getItem('compiledRxJs');
        if (!codeMostJs || !codeRxJs) return;
        ReactDOM.render(<BPCodeViewer codeRxJs={codeRxJs} codeMostJs={codeMostJs} />, document.getElementById('app'));
   };

    const check = () => {
        const date = localStorage.getItem('updated');
        if (date !== updated) window.location.reload();
        updated = date;
        setTimeout(check, 1000);
    };
    check();
    run();
    window['hljs'].initHighlightingOnLoad();
    (document.querySelector('title') as any).innerText = 'BP: Code Viewer';
}
else {
    let updated = localStorage.getItem('updated');

    const run = () => {
        const compiled = compileMostJs(scene);
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
        updated = date;
        setTimeout(check, 1000);
    };
    check();
    run();
    (document.querySelector('title') as any).innerText = 'BP: App';
}
