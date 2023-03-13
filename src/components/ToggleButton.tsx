import css from "./ToggleButton.module.css";

interface ToggleButtonProps {
    checked: boolean;
    onToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ checked, onToggle }) => {
    const classes = [css.togglebutton];
    if (checked) {
        classes.push(css.active);
    }
    return (
        <div className={classes.join(" ")} onClick={onToggle}>
            <div className={css.slider}></div>
        </div>
    );
};

export default ToggleButton;