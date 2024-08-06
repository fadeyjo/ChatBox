import s from "./HeaderButton.module.css";

export default function HeaderButton({children,onClick}) {
    return (
        <button
            onClick={onClick}
            className={s.button}
        >
            {children}
        </button>
    )
}