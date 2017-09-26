import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {combine, from, periodic} from 'most';
import {DemoBody, DemoFooter, DemoTitle} from '../src/editor/Demo/Demo';

export const baseDescriptors = {
    log: {
        name: 'log',
        sources: {
            value: 'any',
            prefix: {
                type: 'string',
                initialValue: '',
            },
        },
        sinks: {},
        run: ({value, prefix}) => {
            combine((prefix, value) => console.log(`${prefix ? prefix + ': ' : ''}${value}`), prefix, value)
                .drain();
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
    },
    conditionalString: {
        name: 'conditionalString',
        sources: {
            string: 'string',
            isPassed: 'boolean',
        },
        sinks: {
            string: 'string',
        },
        run: ({string, isPassed}) => {
            return {
                string: isPassed.filter(passed => !!passed).chain(() => string),
            };
        }
    },

    number: {
        name: 'number',
        sources: {
            number: 'number',
        },
        sinks: {
            number: 'number',
        },
        run: ({number}) => {
            return {
                number,
            };
        }
    },
    filterGreaterThan: {
        name: 'filterGreaterThan',
        sources: {
            number: 'number',
            compare: 'number',
        },
        sinks: {
            number: 'number',
            passed: 'boolean',
        },
        run: ({number, compare}) => {
            return {
                number: compare.chain(compare => number.filter(number => number > compare)),
                passed: compare.chain(compare => number.map(number => number > compare)),
            };
        }
    },
    floor: {
        name: 'floor',
        sources: {
            number: 'number',
        },
        sinks: {
            number: 'number',
        },
        run: ({number}) => {
            return {
                number: number.map(Math.floor)
            };
        }
    },
    randomNumber: {
        name: 'randomNumber',
        sources: {
            interval: {
                type: 'number',
                initialValue: 0,
            },
        },
        sinks: {
            randomNumber: 'number',
        },
        run: ({interval}) => {
            return {
                randomNumber: interval.chain(interval => {
                    return interval <= 0 ?
                        from([Math.random() * Math.random() * 100]) :
                        periodic(interval).map(() => Math.random() * 100)
                }),
            };
        }
    },

    welcomeMessage: {
        name: 'welcomeMessage',
        sources: {
            name: 'string',
            age: 'number',
        },
        sinks: {
            message: 'string',
        },
        run: ({name, age}) => {
            return {
                message: combine((name, age) => {
                    return `Hello, ${name}, ${age} old`;
                }, name, age),
            };
        }
    },

    toLowerCase: {
        name: 'toLowerCase',
        sources: {
            original: 'string',
        },
        sinks: {
            lowerCased: 'string',
        },
        run: ({original}) => {
            return {
                lowerCased: original.map(original => original.toLowerCase()),
            };
        }
    },
    toUpperCase: {
        name: 'toUpperCase',
        sources: {
            original: 'string',
        },
        sinks: {
            upperCased: 'string',
        },
        run: ({original}) => {
            return {
                upperCased: original.map(original => original.toUpperCase()),
            };
        }
    },

    render: {
        name: 'render',
        sources: {
            head: 'component',
            body: 'component',
            footer: 'component',
            elementId: 'string',
        },
        sinks: {},
        run: ({head, body, footer, elementId}) => {
            combine((head, body, footer, elementId: string) => {
                console.log('here');
                ReactDOM.render(<div children={[head, body, footer]}/>, document.getElementById(elementId));
            }, head, body, footer, elementId)
                .drain();

            return {};
        }
    },

    headComponent: {
        name: 'headComponent',
        sources: {
            title: 'string',
        },
        sinks: {
            component: 'component'
        },
        run: ({title}) => {
            return {
                component: title.map(title => <DemoTitle title={title} />)
            };
        }
    },

    bodyComponent: {
        name: 'bodyComponent',
        sources: {
            isOld: 'boolean'
        },
        sinks: {
            component: 'component'
        },
        run: ({isOld}) => {
            return {
                component: isOld.map(isOld => <DemoBody isOld={isOld} />),
            };
        }
    },

    footerComponent: {
        name: 'footerComponent',
        sources: {
            message: 'string',
        },
        sinks: {
            component: 'component'
        },
        run: ({message}) => {
            return {
                component: message.map(message => <DemoFooter message={message} />)
            };
        },
    },


};


