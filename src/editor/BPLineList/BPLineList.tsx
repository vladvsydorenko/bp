import * as React from 'react';
import {IScene} from '../../interfaces/IScene';
import {BPNode} from '../BPNode/BPNode';
import {AsyncSubject} from 'most-subject';
import {ISocketPositions} from '../../interfaces/ISocketPositions';
import {ISocket} from '../../interfaces/ISocket';
import {merge} from 'most';
const css = require('./BPLineList.scss');

export interface IBPLineListProps {
    scene: IScene;
    selectedSinkSocket: ISocket | null;
    socketPositions$: AsyncSubject<ISocketPositions>;
    onSelect: (id: string) => void;
}
export interface IBLineListState {
    positions: ISocketPositions;
}

export class BPLineList extends React.Component<IBPLineListProps, IBLineListState> {
    constructor(props) {
        super(props);
        this.state = {
            positions: {},
        };
    }

    public componentDidMount() {
        const self = this;
        // todo: unsubscribe on unmount
        merge(
            this.props.socketPositions$.throttle(30),
            this.props.socketPositions$.debounce(50),
        )
            .observe(positions => self.setState({positions}));
    }

    // public shouldComponentUpdate(nextProps: IBPLineListProps, nextState) {
    //     return nextProps.scene.lines.length !== 0;
    // }

    public render() {
        const {scene, selectedSinkSocket, onSelect} = this.props;
        const {positions} = this.state;
        const lineElements = scene.lines.map(({id, sourceSocket, sinkSocket}) => {
            if (!positions[sourceSocket.nodeId] || !positions[sinkSocket.nodeId]) return;
            const sourceContainer = positions[sourceSocket.nodeId]['sources'];
            const sinkContainer = positions[sinkSocket.nodeId]['sinks'];
            if (!positions[sourceSocket.nodeId] || !positions[sinkSocket.nodeId]) return;

            const sourcePosition = sourceContainer[sourceSocket.name];
            const sinkPosition = sinkContainer[sinkSocket.name];

            if (!sourcePosition || !sinkPosition) return;

            const onMouseDown = event => {
                event.stopPropagation();
                onSelect(id);
            };

            const isSelected = !!selectedSinkSocket &&
                selectedSinkSocket.nodeId === sinkSocket.nodeId &&
                selectedSinkSocket.name === sinkSocket.name;

            let className = `${css.line} ${css[`type_${sourceSocket.type}`]} `;
            if (selectedSinkSocket && !isSelected) className += css.unselected;

            return <line key={id} className={className}
                         x1={sinkPosition.x} y1={sinkPosition.y}
                         x2={sourcePosition.x} y2={sourcePosition.y}
                         onMouseDown={onMouseDown} />;
        });
        return (
            <svg className={css.canvas}>{lineElements}</svg>
        );
    }
}
