import { useState } from "react";
import { apiPost, ApiResponse } from "./api/api";
import useCarStatus from "./api/status";
import AlignRight from "./components/AlignRight";
import Button from "./components/Button";
import GroupSelect from "./components/GroupSelect";
import Row from "./components/Row";
import ToggleButton from "./components/ToggleButton";

const Ac = () => {
    const carStatus = useCarStatus();
    const [mode, setMode] = useState<ApiResponse.AcMode>(carStatus.status.acMode);
    const [minutes, setMinutes] = useState<number>(carStatus.status.acMinutes);

    async function send(on: boolean) {
        await apiPost("ac", {
            type: mode,
            on: on,
            minutes: minutes
        }).catch(err => alert(err));
    }

    async function toggleAc() {
        await send(!carStatus.status.acOn);
    }

    async function applyChanges() {
        await send(true);
    }

    return (
        <div>
            <div className="padding8">

                <span>Typ av luft</span>
                <GroupSelect
                    options={[
                        ["cooling", "Kyla"],
                        ["heating", "Värme"],
                        ["windscreen", "Vindruta"]
                    ] as [ApiResponse.AcMode, string][]}
                    value={mode}
                    onChange={mode => setMode(mode)}
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
                    value={minutes}
                    onChange={minutes => setMinutes(minutes)}
                />
            </div>
            <br />
            <Row>
                <span>AC</span>
                <AlignRight>
                    <ToggleButton checked={carStatus.status.acOn} onToggle={toggleAc} />
                </AlignRight>
            </Row>
            {carStatus.status.acOn && (carStatus.status.acMode != mode || carStatus.status.acMinutes != minutes) && (
                <>
                    <br />
                    <Button onClick={applyChanges}>Tillämpa ändringar</Button>
                </>
            )}
        </div>
    );
};

export default Ac;