import React from "react";
import css from "./Row.module.css";

type RowProps = React.PropsWithChildren<{
    onClick?: () => void;
}>;

const Row: React.FC<RowProps> = ({ children, onClick }) => {
    return (
        <div className={css.row} onClick={onClick}>
            {children}
        </div>
    );
};

export default Row;