import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, ApiResponse } from "./api/api";
import Button from "./components/Button";
import ConnectingIcon from "./components/ConnectingIcon";
import GroupSelect from "./components/GroupSelect";
import css from "./page.module.css";
import css2 from "./Tasks.module.css";

type Page = "tasks" | "new-task";

const Router = () => {
    const [page, setPage] = useState<Page>("tasks");

    let content: JSX.Element;
    switch (page) {
        case "tasks": content = <Tasks newTask={() => setPage("new-task")} />; break;
        case "new-task": content = <NewTask showTasks={() => setPage("tasks")} />; break;
    }

    return (
        <div className={css.container}>
            {content}
        </div>
    );
};

type TasksProps = {
    newTask: () => void;
};

const Tasks: React.FC<TasksProps> = ({ newTask }) => {
    const [tasks, setTasks] = useState<ApiResponse.Tasks | null>(null);

    async function update() {
        const tasks = await apiGet("tasks").catch(err => alert(err));
        setTasks(tasks);
    }

    async function removeTask(taskId: number) {
        await apiDelete("task/" + taskId);
        await update();
    }

    useEffect(() => {
        update();
    }, []);

    if (tasks == null) {
        return (
            <div className={css.container}>
                <ConnectingIcon className={css.icon} />
            </div>
        );
    }

    return (
        <div>
            <h2>Schemaläggning</h2>
            <Button onClick={newTask}>Ny uppgift</Button>
            <h3>Schemalagda uppgifter</h3>
            {tasks.map((task, index) => (
                <div key={index} className={css2.task}>
                    <p>{task.executionTime}</p>
                    {task.retries > 0 && (
                        <p>Antal återförsök: {task.retries}</p>
                    )}
                    <p>{formatTaskSummary(task)}</p>
                    <Button onClick={() => removeTask(task.id)}>Ta bort uppgift</Button>
                    <br />
                    <br />
                </div>
            ))}
            {tasks.length == 0 && (
                <em>Det finna inga schemalagda uppgifter.</em>
            )}
        </div>
    );
};

function formatTaskSummary(task: ApiResponse.Task) {
    if (task.ac) {
        const action = task.ac.on ? "Sätt på AC" : "Stäng av AC";
        let type;
        switch (task.ac.type) {
            case "heating": type = "med varm luft"; break;
            case "cooling": type = "med kall luft"; break;
            case "windscreen": type = "för vindrutan"; break;
        }
        const minutes = `i ${task.ac.minutes} minuter`;
        return `${action} ${type} ${minutes}.`;
    } else if (task.lights) {
        const action = task.lights.on ? "Sätt på" : "Stäng av";
        let type;
        switch (task.lights.type) {
            case "head": type = "headlights"; break;
            case "parking": type = "parking lights"; break;
        }
        return `${action} ${type}.`;
    } else {
        return "Invalid task.";
    }
}

type NewTaskProps = {
    showTasks: () => void;
};

type Action = "ac" | "lights";

type LightsPayload = {
    type: ApiResponse.LightType;
    on: boolean;
};

type AcPayload = {
    type: ApiResponse.AcMode;
    on: boolean;
    minutes: number;
};

const NewTask: React.FC<NewTaskProps> = ({ showTasks }) => {
    const [date, setDate] = useState(() => {
        const now = new Date();
        return now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + now.getDate().toString().padStart(2, "0");
    });
    const [time, setTime] = useState(() => {
        const now = new Date();
        return now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
    });
    const [action, setAction] = useState<Action>("lights");
    const [lightsPayload, setLightsPayload] = useState<LightsPayload>({
        type: "head",
        on: true
    });
    const [acPayload, setAcPayload] = useState<AcPayload>({
        type: "heating",
        on: true,
        minutes: 30
    });

    async function create() {
        await apiPost("task", {
            executionTime: date + " " + time,
            lights: action == "lights" ? lightsPayload : null,
            ac: action == "ac" ? acPayload : null
        });
        showTasks();
    }

    return (
        <div>
            <Button onClick={showTasks}>Tillbaka</Button>
            <br />
            <span>När?</span>
            <br />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <input type="time" value={time} onChange={e => setTime(e.target.value)} />
            <br />
            <span>Vad?</span>
            <GroupSelect
                options={[
                    ["lights", "Lampor"],
                    ["ac", "AC"]
                ] as [Action, string][]}
                value={action}
                onChange={value => setAction(value)}
            />
            <br />
            {action == "lights" && (
                <>
                    <span>Vilken lampa?</span>
                    <GroupSelect
                        options={[
                            ["head", "Headlights"],
                            ["parking", "Parking lights"]
                        ] as [ApiResponse.LightType, string][]}
                        value={lightsPayload.type}
                        onChange={type => setLightsPayload({ ...lightsPayload, type })}
                    />
                    <br />
                    <span>Gör vad?</span>
                    <GroupSelect
                        options={[
                            [true, "Sätt på"],
                            [false, "Stäng av"]
                        ] as [boolean, string][]}
                        value={lightsPayload.on}
                        onChange={on => setLightsPayload({ ...lightsPayload, on })}
                    />
                </>
            )}
            {action == "ac" && (
                /* TODO duplicate code */
                <>
                    <span>Typ av luft</span>
                    <GroupSelect
                        options={[
                            ["cooling", "Kyla"],
                            ["heating", "Värme"],
                            ["windscreen", "Vindruta"]
                        ] as [ApiResponse.AcMode, string][]}
                        value={acPayload.type}
                        onChange={type => setAcPayload({ ...acPayload, type })}
                    />
                    <br />
                    <span>Antal minuter</span>
                    <GroupSelect
                        options={[
                            [10, "10"],
                            [20, "20"],
                            [30, "30"],
                            [40, "40"],
                            [50, "50"],
                            [60, "60"],
                        ]}
                        value={acPayload.minutes}
                        onChange={minutes => setAcPayload({ ...acPayload, minutes })}
                    />
                    <br />
                    <span>Gör vad?</span>
                    <GroupSelect
                        options={[
                            [true, "Sätt på AC"],
                            [false, "Stäng av AC"]
                        ] as [boolean, string][]}
                        value={acPayload.on}
                        onChange={on => setAcPayload({ ...acPayload, on })}
                    />
                </>
            )}
            <br />
            <Button onClick={create}>Skapa schemalagd uppgift</Button>
        </div>
    );
};

export default Router;