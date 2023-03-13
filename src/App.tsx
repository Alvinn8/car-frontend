import Lights from "./Lights";
import useCarStatus from "./api/status";
import { useState } from "react";
import RowLink from "./components/RowLink";
import Battery from "./components/Battery";
import Ac from "./Ac";
import RegisterData from "./RegisterData";
import Tasks from "./Tasks";

type Tab = "main" | "lights" | "ac" | "tasks" | "registry";

function App() {
    const carStatus = useCarStatus();
    const [tab, setTab] = useState<Tab>("main");

    if (tab == "main") {
        return (
            <div className="max-width">
                <div className="padding8">
                    <Battery />
                    <p>Hej {carStatus.status.client}!</p>
                </div>
                <RowLink onClick={() => setTab("lights")}>Lampor</RowLink>
                <RowLink onClick={() => setTab("ac")}>AC</RowLink>
                <RowLink onClick={() => setTab("tasks")}>Schemaläggning</RowLink>
                <RowLink onClick={() => setTab("registry")}>Rå registerdata</RowLink>
            </div>
        );
    }

    let content: JSX.Element | null = null;

    switch (tab) {
        case "lights": content = <Lights />; break;
        case "ac": content = <Ac />; break;
        case "tasks": content = <Tasks />; break;
        case "registry": content = <RegisterData />; break;
    }

    let maxWidth = true;
    if (tab == "registry") {
        maxWidth = false;
    }

    return (
        <div className={maxWidth ? "max-width" : ""}>
            <RowLink onClick={() => setTab("main")}>Tillbaka</RowLink>
            <br />
            {content}
        </div>
    );
}

export default App;
