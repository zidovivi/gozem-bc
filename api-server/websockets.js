const WebSocket = require("ws");
const queryString = require('query-string');
const Delivery = require('./models/deliveries');

function onMessageHandler(message, webSocketClient, websocketServer) {
    try {
        const parsedMessage = JSON.parse(message);
        console.log('New message: ' + JSON.stringify(parsedMessage));
        let event = parsedMessage['event'];
        if (!event) {
            webSocketClient.send(JSON.stringify({status: 'error', message: 'No event found'}));
            return;
        }
        let deliveryId = parsedMessage['delivery_id'];
        if (!deliveryId) {
            webSocketClient.send(JSON.stringify({status: 'error', message: 'deliveryId not set'}))
            return;
        }

        Delivery
            .findOne({delivery_id: deliveryId})
            .exec((err, delivery) => {
                    if (!delivery) {
                        webSocketClient.send(JSON.stringify({status: 'error', message: 'delivery not found'}))
                        return;
                    } else if (err) {
                        webSocketClient.send(JSON.stringify({
                            status: 'error',
                            message: 'delivery not found',
                            data: err
                        }))
                        return;
                    }

                    if (event.toLowerCase() === 'location_changed') {
                        let lat = parseFloat(parsedMessage['location']['lat']);
                        let lng = parseFloat(parsedMessage['location']['lng']);
                        delivery.location = {
                            lat: lat,
                            lng: lng
                        }

                    }

                    if (event.toLowerCase() === 'status_changed') {
                        // check valid status
                        let status = parsedMessage['status'];
                        if (!status) {
                            webSocketClient.send(JSON.stringify({
                                status: 'error',
                                message: 'status not provided'
                            }))
                            return;
                        }
                        status = status.toLowerCase();
                        console.log('Update delivery with new status - ' + status)
                        if (delivery.status.toLowerCase() === 'open' && status === 'picked-up') {
                            delivery.status = status.toLowerCase();
                            delivery.pickup_time = Date.now();
                        }

                        if (delivery.status.toLowerCase() === 'picked-up' && status === 'in-transit') {
                            delivery.status = status;
                            delivery.start_time = Date.now();
                        }

                        if (delivery.status.toLowerCase() === 'in-transit' && (status === 'delivered' || status === 'failed')) {
                            delivery.status = status;
                            delivery.end_time = Date.now();
                        }

                    }

                    delivery.save().then((savedDelivery) => {
                        let data = JSON.stringify({
                            status: 'success',
                            data: {event: 'delivery_updated', delivery_object: savedDelivery}
                        });

                        websocketServer.clients.forEach(function each(client) {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(data);
                            }
                        });
                        console.log("Broadcast delivery updates to clients. Data = " + JSON.stringify(data));

                    }).catch(err => {
                        console.log(JSON.stringify(err))
                        webSocketClient.send(JSON.stringify({
                            status: 'error',
                            message: 'delivery update failed',
                            data: err.toString()
                        }))
                    });
                }
            );
    } catch (e) {
        console.error(JSON.stringify(e));
        webSocketClient.send(JSON.stringify({status: 'error', data: e.toString()}))
    }
}

module.exports = function(expressServer) {
    let websocketServer = new WebSocket.Server({ server: expressServer });
    let channelRegistrations = {};
    channelRegistrations.any=[];
    websocketServer.on('connection', (webSocketClient, connectionRequest) => {
        //send feedback to the incoming connection
        //const [_path, params] = connectionRequest?.url?.split("?");
        //const connectionParams = queryString.parse(params);

        //console.log(connectionParams);
        webSocketClient.send('{ "connection" : "ok"}');

        webSocketClient.on('message', (message) => {
            onMessageHandler(message, webSocketClient, websocketServer);
        });
    });

    return websocketServer;
}
