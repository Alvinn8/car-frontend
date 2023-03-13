import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { ApiError, apiGet } from "./api/api";
import { hasAuthKey } from "./api/auth";
import { carStatusManager } from "./api/status";
import App from "./App";
import Auth from "./Auth";
import ConnectionStatus from "./components/ConnectionStatus";
import Connecting from "./Connecting";
import "./index.css";
import NoCar from "./NoCar";
import Tasks from "./Tasks";

type AppStatus = "connecting" | "auth" | "no-car" | "connected" | "tasks";

const Main = () => {
    const [appStatus, setAppStatus] = useState<AppStatus>("connecting");

    function tryConnect() {
        console.log("Trying to connect");
        setAppStatus("connecting");
        apiGet("status")
        .then(status => {
            console.log("Connected");
            carStatusManager.setCarStatus(status);
            carStatusManager.connectToWebSocket();
            setAppStatus("connected");
        })
        .catch(err => {
            console.log("status error: " + err);
            if (err instanceof ApiError) {
                if (err.statusCode == 500) {
                    setAppStatus("no-car");
                    return;
                } else if (err.statusCode == 401) {
                    setAppStatus("auth");
                    return;
                }
            }
            alert(err.message);
        });
    }

    useEffect(() => {
        const handleDisconnect = () => {
            if (document.hasFocus() && appStatus == "connected") {
                // tryConnect();
            }
        };
        carStatusManager.addListener("disconnect", handleDisconnect);

        return () => {
            carStatusManager.removeListener("disconnect", handleDisconnect);
        };
    }, []);

    useEffect(() => {
        if (!hasAuthKey()) {
            setAppStatus("auth");
        } else if (carStatusManager.getWebsocketStatus() != WebSocket.OPEN) {
            tryConnect();
        }
    }, []);

    if (appStatus == "connecting") {
        return <Connecting />;
    }

    if (appStatus == "auth") {
        return <Auth onDone={tryConnect} />;
    }

    if (appStatus == "no-car") {
        return <NoCar onOpenTasks={() => setAppStatus("tasks")} onTryAgain={tryConnect} />;
    }

    if (appStatus == "tasks") {
        return <Tasks />;
    }

    return (
        <div>
            <App />
            <ConnectionStatus onTryAgain={tryConnect} />
        </div>
    );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
    <>
        <Main />
    </>
    // </React.StrictMode>
);
