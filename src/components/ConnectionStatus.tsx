import React, { useEffect, useState } from "react";
import { carStatusManager } from "../api/status";
import Button from "./Button";
import css from "./ConnectionStatus.module.css";

interface ConnectionStatusProps {
    onTryAgain: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ onTryAgain }) => {
    const [connected, setConnected] = useState(true);

    const update = () => {
        setConnected(carStatusManager.getWebsocketStatus() == WebSocket.OPEN);
    }
    
    useEffect(() => {
        const handleDisconnect = () => {
            update();
        };

        carStatusManager.addListener("disconnect", handleDisconnect);
        return () => {
            carStatusManager.removeListener("disconnect", handleDisconnect);
        };
    }, []);

    useEffect(() => {
        const id = setInterval(() => {
            update();
        }, 5000);
        return () => {
            clearInterval(id);
        };
    }, []);

    if (connected) return null;

    return (
        <div className={css.connectionstatus}>
            <h2>Ej ansluten!</h2>
            <Button onClick={onTryAgain}>Återanslut</Button>
        </div>
    );
};

export default ConnectionStatus;