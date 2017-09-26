import * as React from 'react';
import {IScene} from '../../interfaces/IScene';
import {BPNode} from '../BPNode/BPNode';
import {async, AsyncSubject} from 'most-subject';
import {ISocketPositions} from '../../interfaces/ISocketPositions';
import {SceneUtil} from '../../util/SceneUtil';
import {INode} from '../../interfaces/INode';
import {t_position} from '../../interfaces/types';
import {BPLineList} from '../BPLineList/BPLineList';
import {ISocket} from '../../interfaces/ISocket';
import {UID} from '../../util/uid';
import {merge} from 'most';
import {INodeDescriptor} from '../../interfaces/INodeDescriptor';
const css = require('./BPEditor.scss');

export interface IBPEditorProps {
    scene: IScene;
    socketPositions$: AsyncSubject<ISocketPositions>;
    onChange: (scene: IScene) => void;
}
export interface IBPEditorState {
    canvasPosition: t_position;
    isDialogOpen: boolean;
}

export class BPEditor extends React.Component<IBPEditorProps, IBPEditorState> {
    private selectedNode: INode | null;
    private selectedSinkSocket: ISocket | null;
    private selectedSourceSocket: ISocket | null;
    private dialogPosition: t_position | null;
    private isCanvasSelected: boolean = false;
    private lastMousePosition: t_position | null = null;
    private updateState$ = async();

    private onMouseMoveFn = this.onMouseMove.bind(this);
    private onNodeSelectFn = this.onNodeSelect.bind(this);
    private onSocketSelectFn = this.onSocketSelect.bind(this);
    private onLineSelectFn = this.onLineSelect.bind(this);
    private onCanvasSelectFn = this.onCanvasSelect.bind(this);
    private onValueChangeFn = this.onValueChange.bind(this);
    private stopDragFn = this.stopDrag.bind(this);
    private onContextMenuFn = this.onContextMenu.bind(this);
    private onAddNodeFn = this.onAddNode.bind(this);

    constructor(props) {
        super(props);

        this.state = {
            canvasPosition: {x: 0, y: 0},
            isDialogOpen: false,
        };
    }

    public render() {
        const {scene, socketPositions$} = this.props;
        const {canvasPosition, isDialogOpen} = this.state;

        const nodeElements = scene.nodes.map(node => {
            const isSelected = !!this.selectedNode && node.id === this.selectedNode.id;
            return <BPNode key={node.id}
                           node={node}
                           scene={scene}
                           isSelected={isSelected}
                           selectedSinkSocket={this.selectedSinkSocket}
                           onNodeSelect={this.onNodeSelectFn}
                           onSocketSelect={this.onSocketSelectFn}
                           onValueChange={this.onValueChangeFn} />
        });
        const style = {
            transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
        };

        return (
            <div id="canvas"
                 className={css.nodeList}
                 onMouseDown={this.onCanvasSelectFn}
                 onContextMenu={this.onContextMenuFn}
            >
                <BPLineList scene={scene}
                            selectedSinkSocket={this.selectedSinkSocket}
                            socketPositions$={socketPositions$}
                            onSelect={this.onLineSelectFn}
                />
                <div style={style}>{nodeElements}</div>
                {isDialogOpen && this.renderDialog()}
            </div>
        );
    }
    private renderDialog() {
        const {nodeDescriptors} = this.props.scene;
        const position = this.dialogPosition || {x: 80, y: 80};
        const style = {
            left: position.x,
            top: position.y,
        };

        const self = this;
        const nodeElements = nodeDescriptors.map((descriptor) => {
            const onMouseDown = event => {
                event.stopPropagation();
                self.onAddNode(descriptor);
            };
            return <div key={descriptor.name} className={css.descriptor} onMouseDown={onMouseDown}>{descriptor.name}</div>;
        });

        return (
            <div className={css.dialog} style={style}>
                {nodeElements}
            </div>
        );
    }

    public componentDidUpdate() {
        this.updateSocketPositions_DIRTY();
    }
    public componentDidMount() {
        const self = this;
        merge(this.updateState$.throttle(10), this.updateState$.debounce(10))
            .observe(state => self.setState(state));
        this.updateSocketPositions_DIRTY();
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    private updateSocketPositions_DIRTY() {
        const elements = document.querySelectorAll('[data-socket]');
        const positions = {};
        elements.forEach((element: HTMLElement) => {
            const rec = element.getBoundingClientRect();
            const data = element.dataset;
            const nodeId = data.nodeId as string;

            positions[nodeId] = positions[nodeId] || {
                sources: {},
                sinks: {}
            };
            positions[nodeId][data.group as string][data.name as string] = {
                x: rec.left + (element.offsetWidth / 2),
                y: rec.top + (element.offsetHeight / 2)
            };
        });
        this.props.socketPositions$.next(positions);
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.code === 'Delete' && this.selectedNode) {
            SceneUtil.removeNodeById(this.selectedNode.id, this.props.scene);
            this.updateState$.next(this.state);
        }
    }
    private onContextMenu(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
    }
    private onAddNode(descriptor: INodeDescriptor) {
        const node = SceneUtil.makeNode(descriptor);
        if (this.dialogPosition)
            node.position = {
                x: this.dialogPosition.x - this.state.canvasPosition.x,
                y: this.dialogPosition.y - this.state.canvasPosition.y,
            };
        (this.state as any).isDialogOpen = false;
        SceneUtil.addNode(node, this.props.scene);
        this.props.onChange(this.props.scene);
        this.updateState$.next(this.state);
    }
    private onValueChange(value: any, socket: ISocket) {
        const node = SceneUtil.findNodeById(socket.nodeId, this.props.scene);
        if (!node) return;
        const sourceSocket = node.sources.find(source => source.name === socket.name);
        (this.state as any).isDialogOpen = false;
        if (!sourceSocket) return;
        sourceSocket.value = value;
        this.props.onChange(this.props.scene);
        this.updateState$.next(this.state);
    }
    private onCanvasSelect(event) {
        if (event.nativeEvent.which === 3) {
            this.dialogPosition = {x: event.pageX, y: event.pageY};
            (this.state as any).isDialogOpen = true;
            this.updateState$.next(this.state);
        }
        else {
            this.isCanvasSelected = true;
            (this.state as any).isDialogOpen = false;
            this.unselectAll();
            this.startDrag();
        }
    }
    private onNodeSelect(id: string, doDrag = true) {
        const node = SceneUtil.findNodeById(id, this.props.scene);
        if (!node) return;
        this.selectedNode = node;
        (this.state as any).isDialogOpen = false;
        if (this.selectedSinkSocket && this.selectedSinkSocket.nodeId !== node.id)
            this.selectedSinkSocket = null;
        if (doDrag) this.startDrag();
        this.updateState$.next(this.state);
    }
    private onLineSelect(id: string) {
        SceneUtil.removeLineById(id, this.props.scene);
        (this.state as any).isDialogOpen = false;
        this.updateState$.next(this.state);
    }
    private onSocketSelect(socket: ISocket) {
        if (socket.group === 'sinks') {
            this.selectedSinkSocket = socket;
            this.onNodeSelect(socket.nodeId, false);
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
            this.props.onChange(this.props.scene);
        }
        this.updateState$.next(this.state);
    }
    private unselectAll() {
        this.selectedNode = null;
        this.selectedSinkSocket = null;
        this.selectedSourceSocket = null;
        (this.state as any).isDialogOpen = false;
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
        this.props.onChange(this.props.scene);
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
