import useCarStatus from "../api/status";
import batteryIcon from "bootstrap-icons/icons/battery-full.svg";
import chargingBatteryIcon from "bootstrap-icons/icons/battery-charging.svg";
import css from "./Battery.module.css";

const Battery = () => {
    const carStatus = useCarStatus();

    const icon = carStatus.status.charging ? chargingBatteryIcon : batteryIcon;

    return (
        <div className={css.battery}>
            <img src={icon} alt="Batteri" className={css.icon} />
            <div className={css.progress}>
                <div className={css.progressbar} style={{
                    width: carStatus.status.batteryLevel + "%"
                }}>
                    {carStatus.status.batteryLevel}%
                </div>
            </div>
        </div>
    );
};

export default Battery;