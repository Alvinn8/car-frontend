import React, { useEffect, useState } from "react";
import useCarStatus from "./api/status";
import css from "./RegisterData.module.css";

const RegisterData = () => {
    const carStatus = useCarStatus();
    
    return (
        <div className="padding8">
            {Object.entries(carStatus.registers).map(([register, value]) => {
                return (
                    <Register register={register} value={value} key={register} />
                );
            })}
        </div>
    );
};

interface RegisterProps {
    register: string;
    value: string;
};

const Register: React.FC<RegisterProps> = ({ register, value }) => {
    const [oldValue, setOldValue] = useState(value);
    const [flashing, setFlashing] = useState(false);

    useEffect(() => {
        if (value != oldValue) {
            setFlashing(true);
            setOldValue(value);
            setTimeout(() => {
                setFlashing(false);
            }, 2100);
        }
    });

    const classes = [css.register];
    if (flashing) {
        classes.push(css.flashing);
    }

    return (
        <div className={classes.join(" ")}>
            <span className={css.id}>{register}: </span>
            <span>{value}</span>
        </div>
    );
};

export default RegisterData;