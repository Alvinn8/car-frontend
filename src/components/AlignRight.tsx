import React from "react";

type AlignRightProps = React.PropsWithChildren<{
    style?: React.CSSProperties;
}>;

const AlignRight: React.FC<AlignRightProps> = ({ style, children }) => {
    if (!style) style = {};
    return (
        <div style={{
            marginLeft: "auto",
            marginRight: "0px",
            width: "auto",
            ...style
        }}>
            {children}
        </div>
    );
};

export default AlignRight;