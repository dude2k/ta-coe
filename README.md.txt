# ioBroker.coe

## CAN over Ethernet (CoE) adapter for ioBroker

This adapter for ioBroker receives data from "Technische Alternative" C.M.I. devices via the "CAN over Ethernet" protocol.

## Description

The adapter opens a UDP server on port 5441 and listens for incoming data packets from one or more C.M.I. devices. Based on the documentation, the receiving device (in this case, the ioBroker adapter) must have a fixed IP address.

The adapter will create ioBroker objects and states based on the received data. The object structure is as follows:

`coe.0.cmi_[IP_ADDRESS].node_[VIRTUAL_NODE].[analog/digital]_[NETWORK_OUTPUT]`

**IMPORTANT**: The CoE protocol is not publicly documented in detail. The data parsing logic in this adapter is based on an assumed packet structure. You will need to adjust the `processCoEMessage` function in `main.js` to match the actual protocol specification from the manufacturer.

## Configuration

In the adapter settings, you can provide a comma-separated list of IP addresses of the C.M.I. devices that will be sending data. This is currently for informational purposes and to help structure the objects.

## Changelog

### 0.0.1
* (Your Name) initial release

## License
MIT License

Copyright (c) 2025 Your Name <you@example.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.