import { useEffect, useState } from "react";
import bars1 from "bootstrap-icons/icons/wifi-1.svg";
import bars2 from "bootstrap-icons/icons/wifi-2.svg";
import bars3 from "bootstrap-icons/icons/wifi.svg";

const INTERVAL = 500;

interface ConnectingIconProps {
    className?: string;
};

const ConnectingIcon: React.FC<ConnectingIconProps> = ({ className }) => {
    const [state, setState] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setState((state + 1) % 3);
        }, INTERVAL);
        return () => {
            clearInterval(id);
        };
    }, [state]);

    let icon;
    switch (state) {
        case 0: icon = bars1; break;
        case 1: icon = bars2; break;
        case 2: icon = bars3; break;
    }

    return (
        <img src={icon} alt="Connecting" className={className} />
    );
};

export default ConnectingIcon;