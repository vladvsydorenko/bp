import * as React from 'react';
import {INode} from '../../interfaces/INode';
import {ISocket} from '../../interfaces/ISocket';
const css = require('./BPNode.scss');

export interface IBPNodeProps {
    node: INode;
    isSelected: boolean;
    onNodeSelect: (id: string) => void;
    onSocketSelect: (socket: ISocket) => void;
    selectedSinkSocket: ISocket | null;
}

export function renderSockets(sockets: ISocket[], selectedSinkSocket: ISocket | null, onSocketSelect) {
    return sockets.map((socket) => {
        const {name, nodeId, group, type} = socket;
        const onMouseDown = event => {
            event.stopPropagation();
            onSocketSelect(socket);
        };
        const isSelected = selectedSinkSocket &&
            selectedSinkSocket.nodeId === socket.nodeId &&
            selectedSinkSocket.name === socket.name;

        let className = `${css.socketCircle} ${css[`type_${type}`]}`;
        if (isSelected)
            className += ` ${css.selected}`;

        const socketCircle = <div key={0}
                                  className={className}
                                  data-socket={true}
                                  data-name={name}
                                  data-node-id={nodeId}
                                  onMouseDown={onMouseDown} />;
        const socketTitle = <h3 key={1}
                                className={`${css.socketTitle} ${css[`type_${type}`]}`}>{name}</h3>;
        const elements = group === 'sources' ? [socketCircle, socketTitle] : [socketTitle, socketCircle];

        return (
            <div key={name}>
                {elements}
            </div>
        );
    });
}

export function BPNode({node, isSelected, selectedSinkSocket, onNodeSelect, onSocketSelect}: IBPNodeProps) {
    const {id, sources, sinks, position} = node;
    const style = {
        transform: `translate(${position.x}px, ${position.y}px)`,
    };
    const onMouseDown = event => {
        event.stopPropagation();
        onNodeSelect(id);
    };
    return (
        <div className={`${css.node} ${isSelected ? css.selected : ''}`} style={style} onMouseDown={onMouseDown}>
            <h2 className={css.nodeTitle}>{node.name}</h2>
            <div className={css.sources}>{renderSockets(sources, selectedSinkSocket, onSocketSelect)}</div>
            <div className={css.sinks}>{renderSockets(sinks, selectedSinkSocket, onSocketSelect)}</div>
        </div>
    );
}