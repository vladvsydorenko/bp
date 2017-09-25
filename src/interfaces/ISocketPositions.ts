import {t_position} from './types';

export interface ISocketPositions {
    [id:string]: {
        [name:string]: t_position;
    };
}
