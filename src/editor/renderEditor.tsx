import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IScene} from '../interfaces/IScene';
import {BPEditor} from './BPEditor/BPEditor';
import {async} from 'most-subject';
import {ISocketPositions} from '../interfaces/ISocketPositions';

export function renderEditor(scene: IScene, element, onChange, onDescriptorAdd, onDescriptorRemove) {
    const socketPositions$ = async<ISocketPositions>();
    ReactDOM.render(<BPEditor scene={scene} socketPositions$={socketPositions$}
                              onChange={onChange}
                              onDescriptorAdd={onDescriptorAdd}
                              onDescriptorRemove={onDescriptorRemove}/>, element);
}
