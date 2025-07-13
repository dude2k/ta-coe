'use strict';

const utils = require('@iobroker/adapter-core');
const dgram = require('dgram');

class Coe extends utils.Adapter {

    constructor(options) {
        super({
            ...options,
            name: 'coe',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
        this.udpServer = null;
    }

    async onReady() {
        this.log.info('Starting CAN over Ethernet (CoE) adapter');
        this.startUdpServer();
    }

    onUnload(callback) {
        try {
            if (this.udpServer) {
                this.udpServer.close();
                this.log.info('UDP server stopped.');
            }
            callback();
        } catch (e) {
            callback();
        }
    }

    startUdpServer() {
        this.udpServer = dgram.createSocket('udp4');

        this.udpServer.on('error', (err) => {
            this.log.error(`UDP server error:\n${err.stack}`);
            this.udpServer.close();
        });

        this.udpServer.on('message', (msg, rinfo) => {
            this.log.debug(`Received message from ${rinfo.address}:${rinfo.port}`);
            this.processCoEMessage(msg, rinfo.address);
        });

        this.udpServer.on('listening', () => {
            const address = this.udpServer.address();
            this.log.info(`UDP server listening on ${address.address}:${address.port}`);
        });

        try {
            this.udpServer.bind(5441);
        } catch (e) {
            this.log.error(`Failed to bind UDP server on port 5441: ${e}`);
        }
    }

    async processCoEMessage(msg, ip) {
        // IMPORTANT: The following parsing logic is based on an assumed protocol.
        // You MUST adapt this to the actual CoE protocol specification.
        try {
            // Assumed structure: | Node (1 byte) | Output (1 byte) | Type (1 byte) | Value (4 bytes float) |
            if (msg.length < 7) {
                this.log.warn(`Received a malformed packet from ${ip}`);
                return;
            }

            const virtualNode = msg.readUInt8(0);
            const networkOutput = msg.readUInt8(1);
            const dataType = msg.readUInt8(2); // 0 = analog, 1 = digital
            const value = msg.readFloatBE(3);

            const deviceId = `cmi_${ip.replace(/\./g, '_')}`;
            const channelId = `${deviceId}.node_${virtualNode}`;
            const stateId = `${channelId}.${dataType === 0 ? 'analog' : 'digital'}_${networkOutput}`;

            // Create device object for the C.M.I. if it doesn't exist
            await this.setObjectNotExistsAsync(deviceId, {
                type: 'device',
                common: {
                    name: `C.M.I. at ${ip}`
                },
                native: {},
            });

            // Create channel object for the virtual node if it doesn't exist
            await this.setObjectNotExistsAsync(channelId, {
                type: 'channel',
                common: {
                    name: `Virtual Node ${virtualNode}`
                },
                native: {},
            });

            // Create state object
            await this.setObjectNotExistsAsync(stateId, {
                type: 'state',
                common: {
                    name: `Network Output ${networkOutput}`,
                    type: 'number',
                    role: 'value',
                    read: true,
                    write: false,
                    def: 0
                },
                native: {},
            });

            // Set the state value
            await this.setStateAsync(stateId, value, true);

        } catch (error) {
            this.log.error(`Error processing message: ${error.message}`);
        }
    }
}

if (require.main !== module) {
    module.exports = (options) => new Coe(options);
} else {
    new Coe();
}