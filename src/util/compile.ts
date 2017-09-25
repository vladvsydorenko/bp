import {IScene} from '../interfaces/IScene';
import {INode} from '../interfaces/INode';
import {ILine} from '../interfaces/ILine';
import {SceneUtil} from './SceneUtil';

function compileSources({sources}: INode, id) {
    let text = `const ${id}Sources = {`;
    text += sources.reduce((text, {name}, index: number) => {
        return text + `\n    ${name}: hold(1, async())` + (index + 1 < sources.length ? ',' : '');
    }, '');
    text += '\n};';

    text += sources.reduce((text, {name, type, value}, index: number) => {
        if (typeof value !== 'undefined') {
            const compiledValue = type === 'number' ? value : `'${value}'`;
            return text + `\n${id}Sources.${name}.next(${compiledValue});\n`;
        }
        return text + '\n';
    }, '');
    return text;
}

function compileSinks({sinks, name}: INode, id) {
    return `const ${id}Sinks = nodes[${name}].run(${id}Sources);`;
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

    return `${sinkId}Sinks.${sinkName}.observe(function(value) {${sourceId}Sources.${sourceName}.next(value);});`;
}

export function compile(scene: IScene) {
    let text = '';
    text += scene.nodes.reduce((text, node, index) => {
        return text + compileSources(node, `node${index}`);
    }, '');
    text += scene.nodes.reduce((text, node, index) => {
        return text + '\n' + compileSinks(node, `node${index}`);
    }, '');
    text += '\n' + scene.lines.reduce((text, line, index) => {
        return text + '\n' + compileLine(line, scene);
    }, '');

    return text;
}
