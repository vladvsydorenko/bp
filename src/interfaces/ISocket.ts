export interface ISocket {
    // human-readable name
    name: string;
    // value type
    type: string;
    // socket group (sources or sinks)
    group: string;
    // node id
    nodeId: string;
    // raw value
    value?: string|number;
}