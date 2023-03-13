import React from "react";
import AlignRight from "./AlignRight";
import Row from "./Row";
import rightArrow from "bootstrap-icons/icons/chevron-right.svg";

type RowLinkProps = React.PropsWithChildren<{
    onClick: () => void;
}>;

const RowLink: React.FC<RowLinkProps> = ({ children, onClick }) => {
    return (
        <Row onClick={onClick}>
            <span>{children}</span>
            <AlignRight style={{ display: "flex" }}>
                <img src={rightArrow} alt="Högerpil" style={{ height: "20px" }} />
            </AlignRight>
        </Row>
    );
};

export default RowLink;