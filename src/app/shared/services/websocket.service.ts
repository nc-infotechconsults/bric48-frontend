import { inject, Injectable } from "@angular/core";
import { Client, messageCallbackType } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import { AppConfigService } from "./app-config.service";
import { v4 as uuidv4 } from 'uuid';

export interface TopicTask {
    topic: string;
    callback: messageCallbackType
}

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    private appConfigService = inject(AppConfigService);

    private isConnecting: boolean = false;
    private stompClient: Client;
    private serverUrl = '/api/ws';

    connect(id: string, tasks: TopicTask[]) {
        if (!this.isConnecting) {
            this.isConnecting = true;
            this.stompClient = new Client({
                brokerURL: undefined, // Important for SockJS
                webSocketFactory: () => new SockJS(this.serverUrl),
                connectHeaders: {
                    Authorization: "Bearer " + this.appConfigService.getAccessToken().token
                },
                debug: (msg: string) => console.log(msg), // Enable debugging logs
                reconnectDelay: 5000, // Attempt to reconnect after 5 seconds if disconnected
            });

            this.stompClient.onConnect = (frame) => {
                console.log('Connected: ', frame);
                this.isConnecting = false;
                const randomid = uuidv4();
                tasks.forEach((x,i) => {
                    // Subscribe to a topic
                    this.stompClient.subscribe(x.topic, x.callback, { id: `${id}_${randomid}_${i}`});
                })
            };

            this.stompClient.onStompError = (error) => {
                console.error('STOMP Error: ', error);
                this.isConnecting = false;
            };

            this.stompClient.activate(); // Activate the STOMP client
        }
    }

    sendMessage(message: string) {
        if (this.stompClient.connected) {
            this.stompClient.publish({
                destination: '/app/message',
                body: message,
            });
        } else {
            console.error('Unable to send message, client is not connected.');
        }
    }

    disconnect() {
        if (this.stompClient && this.stompClient.active) {
            this.stompClient.deactivate().then(() => {
                console.log('Disconnected from WebSocket');
            });
        }
    }
}