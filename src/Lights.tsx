import Row from "./components/Row";
import ToggleButton from "./components/ToggleButton";
import { apiPost, ApiResponse } from "./api/api";
import useCarStatus from "./api/status";
import AlignRight from "./components/AlignRight";

const Lights = () => {
    const carStatus = useCarStatus();

    async function toggle(type: ApiResponse.LightType, currentValue: boolean) {
        await apiPost("lights", {
            type: type,
            on: !currentValue
        }).catch(err => alert(err));
    }

    const toggleHeadLights = async () => await toggle("head", carStatus.status.headLightsOn);
    const toggleParkingLights = async () => await toggle("parking", carStatus.status.parkingLightsOn);

    return (
        <div>
            <Row>
                <span>Headlights</span>
                <AlignRight>
                    <ToggleButton checked={carStatus.status.headLightsOn} onToggle={toggleHeadLights} />
                </AlignRight>
            </Row>
            <Row>
                <span>Parking lights</span>
                <AlignRight>
                    <ToggleButton checked={carStatus.status.parkingLightsOn} onToggle={toggleParkingLights} />
                </AlignRight>
            </Row>
        </div>
    );
};

export default Lights;