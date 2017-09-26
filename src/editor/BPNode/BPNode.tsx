import * as React from 'react';
import {INode} from '../../interfaces/INode';
import {ISocket} from '../../interfaces/ISocket';
import {IScene} from '../../interfaces/IScene';
import {SceneUtil} from '../../util/SceneUtil';
const css = require('./BPNode.scss');

export interface IBPNodeProps {
    node: INode;
    scene: IScene;
    isSelected: boolean;
    onNodeSelect: (id: string) => void;
    onSocketSelect: (socket: ISocket) => void;
    onValueChange: (value, socket: ISocket) => void;
    selectedSinkSocket: ISocket | null;
}

export function renderSockets(sockets: ISocket[], scene: IScene, selectedSinkSocket: ISocket|null,
                              onSocketSelect, onValueChange: IBPNodeProps['onValueChange']) {
    return sockets.map((socket) => {
        const {name, nodeId, group, type} = socket;
        const onMouseDown = event => {
            event.stopPropagation();
            onSocketSelect(socket);
        };
        const onChange = event => {
            onValueChange(event.target[type === 'number' ? 'valueAsNumber' : 'value'], socket);
        };
        const isSelected = selectedSinkSocket &&
            selectedSinkSocket.nodeId === socket.nodeId &&
            selectedSinkSocket.group === socket.group &&
            selectedSinkSocket.name === socket.name;

        let className = `${css.socketCircle} ${css[`type_${type}`]}`;
        if (isSelected)
            className += ` ${css.selected}`;

        const isConnected = scene.lines.some(line => line.sourceSocket.nodeId === nodeId &&
            line.sourceSocket.name === name);

        const socketCircle = <div key={0}
                                  className={className}
                                  data-socket={true}
                                  data-name={name}
                                  data-group={group}
                                  data-node-id={nodeId}
                                  onMouseDown={onMouseDown} />;
        const socketTitle = <h3 className={`${css.socketTitle} ${css[`type_${type}`]}`}>{name}</h3>;
        const socketInput = <input className={css.socketInput}
                                   type={type === 'number' ? 'number' : 'text'}
                                   value={socket.value || ''} onChange={onChange}/>;
        const titleContainer = (
            <div key={1} className={css.socketTitleContainer}>
                {socketTitle}
                {!isConnected && group === 'sources' && socketInput}
            </div>
        );
        const elements = group === 'sources' ? [socketCircle, titleContainer] : [titleContainer, socketCircle];

        return (
            <div key={name} className={css.socket}>
                {elements}
            </div>
        );
    });
}

export function BPNode({node, scene, isSelected, selectedSinkSocket,
                           onNodeSelect, onSocketSelect, onValueChange}: IBPNodeProps) {
    const {id, sources, sinks, position} = node;
    const style = {
        transform: `translate(${position.x}px, ${position.y}px)`,
    };
    const onMouseDown = event => {
        event.stopPropagation();
        onNodeSelect(id);
    };

    let className = css.node;
    if (isSelected) className += ' ' + css.selected;
    if (selectedSinkSocket) {
        const lines = scene.lines.filter(line => line.sinkSocket.nodeId === selectedSinkSocket.nodeId &&
            line.sinkSocket.name === selectedSinkSocket.name);
        const isConnected = lines.some(line => line.sourceSocket.nodeId === node.id);
        if (selectedSinkSocket.nodeId !== node.id && !isConnected) className += ' ' + css.inactive;
    }

    return (
        <div className={className} style={style} onMouseDown={onMouseDown}>
            <h2 className={css.nodeTitle}>{node.name}</h2>
            <div className={css.sources}>
                {renderSockets(sources, scene, selectedSinkSocket, onSocketSelect, onValueChange)}
            </div>
            <div className={css.sinks}>
                {renderSockets(sinks, scene, selectedSinkSocket, onSocketSelect, onValueChange)}
            </div>
        </div>
    );
}