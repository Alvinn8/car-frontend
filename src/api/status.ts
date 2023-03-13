import EventEmitter from "eventemitter3";
import { useEffect, useState } from "react";
import { apiGet, ApiResponse } from "./api";
import { getAuthKey } from "./auth";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

class CarStatus extends EventEmitter {
    private status: ApiResponse.Status | null = null;
    private websocket: WebSocket | null = null;

    public connectToWebSocket() {
        if (this.websocket) {
            this.websocket.close();
        }
        this.websocket = new WebSocket(WEBSOCKET_URL);
        this.websocket.onopen = e => {
            this.websocket?.send(getAuthKey()!);
        };
        this.websocket.onmessage = e => {
            this.setCarStatus(JSON.parse(e.data));
        };
        this.websocket.onclose = e => {
            this.emit("disconnect");
        };
        // @ts-ignore
        window.debug_websocket = this.websocket;
    }

    public getCurrentStatus(): ApiResponse.Status {
        if (this.status == null) {
            throw new Error("No status has been set yet!");
        }
        return this.status;
    }

    public setCarStatus(status: ApiResponse.Status) {
        this.status = status;
        this.emit("change");
    }

    public refetch() {
        console.log("requesting status");
        apiGet("status")
        .then(carStatus => {
            this.setCarStatus(carStatus);
        })
        .catch(err => alert("failed to fetch status: " + err)); // TODO error handling
    }

    public getWebsocketStatus() {
        if (this.websocket == null) {
            return WebSocket.CLOSED;
        }
        return this.websocket.readyState;
    }
}

export const carStatusManager = new CarStatus();

/**
 * Use the car status, and change whenever the car status is updated.
 * 
 * @returns The car status.
 */
export default function useCarStatus() {
    const [status, setStatus] = useState<ApiResponse.Status>(carStatusManager.getCurrentStatus());

    useEffect(() => {
        function onChange() {
            setStatus(carStatusManager.getCurrentStatus());
        };

        carStatusManager.addListener("change", onChange);
        return () => {
            carStatusManager.removeListener("change", onChange);
        }
    }, []);

    return status;
}