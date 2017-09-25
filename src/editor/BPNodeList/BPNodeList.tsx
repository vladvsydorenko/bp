import * as React from 'react';
import {IScene} from '../../interfaces/IScene';
import {BPNode} from '../BPNode/BPNode';
import {async, AsyncSubject} from 'most-subject';
import {ISocketPositions} from '../../interfaces/ISocketPositions';
import {SceneUtil} from '../../util/SceneUtil';
import {INode} from '../../interfaces/INode';
import {t_position} from '../../interfaces/types';
import {compile} from '../../util/compile';
import {BPLineList} from '../BPLineList/BPLineList';
import {ISocket} from '../../interfaces/ISocket';
import {UID} from '../../util/uid';
const css = require('./BPNodeList.scss');

export interface IBPNodeListProps {
    scene: IScene;
    socketPositions$: AsyncSubject<ISocketPositions>;
}
export interface IBPNodeListState {
    canvasPosition: t_position;
}

export class BPNodeList extends React.Component<IBPNodeListProps, IBPNodeListState> {
    private selectedNode: INode | null;
    private selectedSinkSocket: ISocket | null;
    private selectedSourceSocket: ISocket | null;
    private isCanvasSelected: boolean = false;
    private lastMousePosition: t_position | null = null;
    private updateState$ = async();

    private onMouseMoveFn = this.onMouseMove.bind(this);
    private onNodeSelectFn = this.onNodeSelect.bind(this);
    private onSocketSelectFn = this.onSocketSelect.bind(this);
    private onLineSelectFn = this.onLineSelect.bind(this);
    private onCanvasSelectFn = this.onCanvasSelect.bind(this);
    private unselectAllFn = this.unselectAll.bind(this);
    private stopDragFn = this.stopDrag.bind(this);

    constructor(props) {
        super(props);

        this.state = {
            canvasPosition: {x: 0, y: 0},
        };
    }

    public render() {
        const {scene, socketPositions$} = this.props;
        const {canvasPosition} = this.state;

        const nodeElements = scene.nodes.map(node => {
            const isSelected = !!this.selectedNode && node.id === this.selectedNode.id;
            return <BPNode key={node.id}
                           node={node}
                           isSelected={isSelected}
                           selectedSinkSocket={this.selectedSinkSocket}
                           onNodeSelect={this.onNodeSelectFn}
                           onSocketSelect={this.onSocketSelectFn}/>
        });
        const style = {
            transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
        };

        return (
            <div id="canvas" className={css.nodeList}
                 onMouseDown={this.onCanvasSelectFn}
            >
                <BPLineList scene={scene}
                            selectedSinkSocket={this.selectedSinkSocket}
                            socketPositions$={socketPositions$}
                            onSelect={this.onLineSelectFn}
                />
                <div style={style}>{nodeElements}</div>
            </div>
        );
    }

    public componentDidUpdate() {
        this.updateSocketPositions_DIRTY();
    }
    public componentDidMount() {
        const self = this;
        this.updateState$.throttle(10).observe(state => self.setState(state));
        this.updateState$.debounce(10).observe(state => self.setState(state));
        this.updateSocketPositions_DIRTY();
        // document.addEventListener('mousedown', this.onCanvasSelectFn);
    }
    private updateSocketPositions_DIRTY() {
        const elements = document.querySelectorAll('[data-socket]');
        const positions = {};
        elements.forEach((element: HTMLElement) => {
            const rec = element.getBoundingClientRect();
            const data = element.dataset;
            const nodeId = data.nodeId as string;

            positions[nodeId] = positions[nodeId] || {};
            positions[nodeId][data.name as string] = {
                x: rec.left + (element.offsetWidth / 2),
                y: rec.top + (element.offsetHeight / 2)
            };
        });
        this.props.socketPositions$.next(positions);
    }

    private onCanvasSelect(event: MouseEvent) {
        this.isCanvasSelected = true;
        this.unselectAll();
        this.startDrag();
    }
    private onNodeSelect(id: string) {
        const node = SceneUtil.findNodeById(id, this.props.scene);
        if (!node) return;
        this.selectedNode = node;
        if (this.selectedSinkSocket && this.selectedSinkSocket.nodeId !== node.id)
            this.selectedSinkSocket = null;
        this.startDrag();
        this.updateState$.next(this.state);
    }
    private onLineSelect(id: string) {
        SceneUtil.removeLineById(id, this.props.scene);
        this.updateState$.next(this.state);
    }
    private onSocketSelect(socket: ISocket) {
        if (socket.group === 'sinks') {
            this.selectedSinkSocket = socket;
            this.onNodeSelect(socket.nodeId);
        }
        else if (socket.group === 'sources' && this.selectedSinkSocket)
            this.selectedSourceSocket = socket;

        if (this.selectedSinkSocket && this.selectedSourceSocket) {
            const {scene} = this.props;
            const line = {
                id: UID('line'),
                sinkSocket: this.selectedSinkSocket,
                sourceSocket: this.selectedSourceSocket
            };
            if (SceneUtil.canAddLine(line, scene))
                SceneUtil.addLine(line, this.props.scene);
            this.selectedSourceSocket = null;
            // this.selectedSinkSocket = null;
        }
        this.updateState$.next(this.state);
    }
    private unselectAll() {
        this.selectedNode = null;
        this.selectedSinkSocket = null;
        this.selectedSourceSocket = null;
        this.updateState$.next(this.state);
    }

    private startDrag() {
        document.addEventListener('mousemove', this.onMouseMoveFn);
        document.addEventListener('mouseup', this.stopDragFn);
        document.addEventListener('mouseleave', this.stopDragFn);
    }
    private stopDrag() {
        this.lastMousePosition = null;
        this.isCanvasSelected = false;
        document.removeEventListener('mousemove', this.onMouseMoveFn);
        document.removeEventListener('mouseup', this.stopDragFn);
        document.removeEventListener('mouseleave', this.stopDragFn);
    }

    private onMouseMove({x, y}: MouseEvent) {
        if (!this.lastMousePosition) this.lastMousePosition = {x, y};
        const deltaX = x - this.lastMousePosition.x;
        const deltaY = y - this.lastMousePosition.y;

        if (this.isCanvasSelected) {
            const {canvasPosition} = this.state;
            this.state.canvasPosition.x = canvasPosition.x + deltaX;
            this.state.canvasPosition.y = canvasPosition.y + deltaY;
        }
        else if(this.selectedNode) {
            const {position} = this.selectedNode;
            this.selectedNode.position = {
                x: position.x + deltaX,
                y: position.y + deltaY,
            };
        }

        this.updateState$.next(this.state);
        this.lastMousePosition = {x, y};
    }
}
