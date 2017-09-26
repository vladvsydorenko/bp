import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IScene} from '../interfaces/IScene';
import {BPNode} from './BPNode/BPNode';
import {BPEditor} from './BPEditor/BPEditor';
import {async} from 'most-subject';
import {ISocketPositions} from '../interfaces/ISocketPositions';
import {BPLineList} from './BPLineList/BPLineList';
import {compile} from '../util/compile';

export function renderEditor(scene: IScene, element, onChange) {
    const socketPositions$ = async<ISocketPositions>();
    ReactDOM.render((
        <div style={{width: '100%', height: '100%'}}>
            <BPEditor scene={scene} socketPositions$={socketPositions$}  onChange={onChange}/>
        </div>
    ), element);
    console.log(scene)
}
