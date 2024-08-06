import s from "./Button.module.css";

export default function Button({children, onClick, type}) {
    return (
        <button
            onClick={onClick}
            className={s.button}
            type={type}
        >
            {children}
        </button>
    )
}