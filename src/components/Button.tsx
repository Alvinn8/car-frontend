import React from "react";
import css from "./Button.module.css";

type ButtonProps  = React.PropsWithChildren<{
    onClick: () => void;
}>;

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
    return (
        <button onClick={onClick} className={css.button}>
            {children}
        </button>
    );
};

export default Button;