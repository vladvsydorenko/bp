import {IScene} from '../../interfaces/IScene';
import {INode} from '../../interfaces/INode';
import {ILine} from '../../interfaces/ILine';
import {SceneUtil} from '../SceneUtil';

function compileSources({sources}: INode, id) {
    let text = `const ${id}Sources = {`;
    text += sources.reduce((text, {name, type, value}, index: number) => {
        const compiledValue = type === 'number' ? value : `\`${value}\``;
        if (typeof value !== 'undefined')
            return text + `\n    ${name}: new BehaviourSubject(${compiledValue})` + (index + 1 < sources.length ? ',' : '');

        return text + `\n    ${name}: new Subject()` + (index + 1 < sources.length ? ',' : '');
    }, '');
    text += '\n};\n';

    return text;
}

function compileSinks({sinks, name}: INode, id) {
    return `const ${id}Sinks = nodes.${name}.run(${id}Sources);`;
}

function compileLine({sourceSocket, sinkSocket}: ILine, scene: IScene) {
    const sourceNode = SceneUtil.findNodeById(sourceSocket.nodeId, scene);
    const sinkNode = SceneUtil.findNodeById(sinkSocket.nodeId, scene);
    if (!sourceNode || !sinkNode) return '';
    const sourceIndex = scene.nodes.indexOf(sourceNode);
    const sinkIndex = scene.nodes.indexOf(sinkNode);
    const sourceId = `node${sourceIndex}`;
    const sinkId = `node${sinkIndex}`;
    const sourceName = sourceSocket.name;
    const sinkName = sinkSocket.name;

    return `${sinkId}Sinks.${sinkName}.subscribe(function(value) {${sourceId}Sources.${sourceName}.next(value);});`;
}

export function compileRxJs(scene: IScene) {
    const preNoteComment = `/*
 * How does it works
 * In few words - create one subject for each source socket (on the left side in Editor)
 * If user specified value for socket directly in editor (for string, number or boolean types) push it value to subject
 * 
 * Current compiler based on RxJs (https://github.com/Reactive-Extensions/RxJS)
 * It's not very complicated to make compiler for any reactive library
 * But developers should write their nodes according to it
 * 
 * This code doesn't include code of nodes, you should provide it by hands
 * 
 * Some notes
 * hold(1, async()) in most.js is like BehaviourSubject in rxjs
 */\n\n`;

    const subjectComment = `//-------------------------------------------------------
// Make subjects as sources of nodes
//-------------------------------------------------------
`;

    const runComment = `\n
//-------------------------------------------------------
// Run node to get their sinks
//-------------------------------------------------------`;

    const lineComment = `
//-------------------------------------------------------
// Connect sources and sinks
//-------------------------------------------------------`;

    let text = '';
    if (scene.nodes.length !== 0) {
        text += preNoteComment;
        text += scene.nodes.reduce((text, node, index) => {
            return text + compileSources(node, `node${index}`);
        }, subjectComment);
        text += scene.nodes.reduce((text, node, index) => {
            return text + '\n' + compileSinks(node, `node${index}`);
        }, runComment);
    }
    if (scene.lines.length !== 0) {
        text += '\n\n' + scene.lines.reduce((text, line, index) => {
            return text + '\n' + compileLine(line, scene);
        }, lineComment);
    }

    if (scene.nodes.length !== 0 && scene.lines.length === 0)
        text += `\n\n
//-------------------------------------------------------
// No lines - no honey
// This app has no effects
//-------------------------------------------------------`;

    return text;
}
