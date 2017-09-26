import {INodeDescriptor} from '../src/interfaces/INodeDescriptor';

export const testNodes: INodeDescriptor[] = [
    {
        name: 'toUpperCase',
        sources: {
            text: 'string',
        },
        sinks: {
            text: 'string',
        },
        run: ({text}) => {
            return {
                text: text.map(text => text.toUpperCase()),
            };
        }
    },
    {
        name: 'toLowerCase',
        sources: {
            text: 'string',
        },
        sinks: {
            text: 'string',
        },
        run: ({text}) => {
            return {
                text: text.map(text => text.toLowerCase()),
            };
        }
    },
];