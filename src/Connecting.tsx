import ConnectingIcon from "./components/ConnectingIcon";
import css from "./page.module.css";

const Connecting = () => {
    return (
        <div className={css.container}>
            <ConnectingIcon className={css.icon} />
            <h2>Ansluter</h2>
            <p>Ansluter till bilen...</p>
        </div>
    );
};

export default Connecting;