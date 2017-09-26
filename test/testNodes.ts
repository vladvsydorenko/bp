// import {INodeDescriptor} from '../src/interfaces/INodeDescriptor';
// import {combine, from} from 'most';

export const baseDescriptors = {
    logNode: {
        name: 'log',
        sources: {
            value: 'any',
        },
        sinks: {},
        run: ({value}) => {
            value.observe(value => console.log(value));
            return {};
        }
    },
    string: {
        name: 'string',
        sources: {
            string: 'string',
        },
        sinks: {
            string: 'string',
        },
        run: ({string}) => {
            return {
                string,
            };
        }
    }
};


