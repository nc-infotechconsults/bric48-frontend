import { inject, Injectable } from "@angular/core";
import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import { AppConfigService } from "./app-config.service";

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    private appConfigService = inject(AppConfigService);

    private stompClient: Client;
    private serverUrl = 'http://localhost:4200/api/ws';

    connect() {
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

            // Subscribe to a topic
            this.stompClient.subscribe('/topic/messages', (message) => {
                console.log('Received: ', message.body);
            });
        };

        this.stompClient.onStompError = (error) => {
            console.error('STOMP Error: ', error);
        };

        this.stompClient.activate(); // Activate the STOMP client
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
        if (this.stompClient.active) {
            this.stompClient.deactivate().then(() => {
                console.log('Disconnected from WebSocket');
            });
        }
    }
}