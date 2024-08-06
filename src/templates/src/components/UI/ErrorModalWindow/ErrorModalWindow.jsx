import Button from "../Button/Button";
import s from "./ErrorModalWindow.module.css";

export default function ErrorModalWindow({error, setError}) {
    return (
        <div className={error ? [s.modal, s.open].join(" ") : s.modal}>
            <div className={s.content}>
                <h1 className={s.title}>ERROR</h1>
                <div className={s.error}>
                    {error}
                </div>
                <div className={s.button}>
                    <Button onClick={() => {
                        setError("")
                    }}>Close</Button>
                </div>
            </div>
        </div>
    )
}