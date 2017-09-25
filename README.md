# Node-based
BP is based on nodes. Node is a simple function that accepts set of
streams and returns set of stream. Someone calls it "pipe".

# Define your node
To make `bp` know what is you node you should provide a descriptor
of you node's sources, sinks and function.
Source and sinks are descriptors of you input and output stream types.
Function is you node's function exactly. It should accept

# BP Result
In result you have generated stream-pipe application like:

```javascript
const node1Result = node1({});

const node2Source = {streamName: node1Result.name};
const node2Result = node2(node2Source);
```

There are no helping streams or such a thing. Minimal overhead.

# Design
 - Add node to scene
 - Convert descriptor to node
 - Validate lines (check that needed ports existed and remove line if not)
 - Remove node from scene
 - Move node (ui)
 - Connect ports if possible
   - check set of rules like maxLineNumber, same group etc
 - Add port if possible
 - Remove port if possible


------------------------------------------------------------------------
(?) When to choose socket connection type?
