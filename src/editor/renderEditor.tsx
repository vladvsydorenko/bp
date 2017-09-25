import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IScene} from '../interfaces/IScene';
import {BPNode} from './BPNode/BPNode';
import {BPNodeList} from './BPNodeList/BPNodeList';
import {async} from 'most-subject';
import {ISocketPositions} from '../interfaces/ISocketPositions';
import {BPLineList} from './BPLineList/BPLineList';

export function renderEditor(scene: IScene) {
    const socketPositions$ = async<ISocketPositions>();
    ReactDOM.render((
        <div style={{width: '100%', height: '100%'}}>

            <BPNodeList scene={scene} socketPositions$={socketPositions$} />
        </div>
    ), document.getElementById('app'));
    console.log(scene)
}
