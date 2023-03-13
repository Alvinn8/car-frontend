import noConnectionIcon from "bootstrap-icons/icons/wifi-off.svg";
import Button from "./components/Button";
import css from "./page.module.css";

interface NoCarProps {
    onOpenTasks: () => void;
    onTryAgain: () => void;
}

const NoCar: React.FC<NoCarProps> = ({ onOpenTasks, onTryAgain }) => {
    return (
        <div className={css.container}>
            <img src={noConnectionIcon} alt="No Connection" className={css.icon} />
            <h2>Bilen är inte här!</h2>
            <p>Kunde inte ansluta till bilen. Detta betyder oftast att bilen inte är hemma.</p>
            <p>
                <Button onClick={onOpenTasks}>Schemaläggning</Button>
            </p>
            <p>
                <Button onClick={onTryAgain}>Försök igen</Button>
            </p>
        </div>
    );
};

export default NoCar;