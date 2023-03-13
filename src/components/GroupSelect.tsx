import css from "./GroupSelect.module.css";

interface GroupSelectProps<T> {
    options: [T, string][];
    value: T;
    onChange: (t: T) => void;
}

const GroupSelect = <T extends unknown>({ options, value, onChange }: GroupSelectProps<T>) => {
    return (
        <div className={css.groupselect}>
            {options.map(([id, name], i) => {
                return (
                    <button
                        onClick={() => onChange(id)}
                        className={value == id ? css.active : ""}
                        key={i}
                    >
                        {name}
                    </button>
                );
            })}
        </div>
    );
};

export default GroupSelect;