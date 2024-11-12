import React, { useContext, useEffect, useRef, useState } from "react";
import s from "./CodeForm.module.css";
import ICodeForm from "../../interfaces/IProps/ICodeForm";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const CodeForm: React.FC<ICodeForm> = ({ isOpened, length, email }) => {
    const [error, setError] = useState("");

    const { store } = useContext(Context);

    const [inputs, setInputs] = useState<string[]>(Array(length).fill(""));
    const refs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null));

    useEffect(() => {
        if (isOpened) {
            refs.current[0]?.focus();
        }
    }, [isOpened]);

    const block = (refIndex: number) => {
        const ref = refs.current[refIndex];
        if (ref) {
            const length = ref.value.length;
            ref.setSelectionRange(length, length);
        }
    };

    return (
        <div className={s.code_input}>
            {inputs.map((input, index) => (
                <input
                    className={s.code}
                    key={index}
                    ref={(ref) => (refs.current[index] = ref)}
                    type="text"
                    value={input}
                    onKeyDown={() => block(index)}
                    onMouseDown={() => block(index)}
                    onFocus={() => block(index)}
                    onChange={(event) => {
                        setError("");
                        const eventValue = event.target.value;
                        if (index + 1 !== inputs.length && eventValue != "") {
                            refs.current[index + 1]?.focus();
                        }
                        setInputs((prev) =>
                            prev.map((inputValue, inputIndex) =>
                                inputIndex === index
                                    ? eventValue.length == 2
                                        ? eventValue[0] == inputValue
                                            ? eventValue.slice(1)
                                            : eventValue.slice(0, 1)
                                        : eventValue === "" || inputValue == ""
                                        ? eventValue
                                        : inputValue
                                    : inputValue
                            )
                        );
                        const bufInputs = inputs.map((input) =>
                            input === "" ? "!" : input
                        );
                        if (eventValue.length < 2) {
                            bufInputs[index] = eventValue;
                        }
                        if (eventValue === "") {
                            bufInputs[index] = "!";
                        }
                        const code = bufInputs.join("");
                        if (new RegExp("^[0-9]{6}$").test(code)) {
                            try {
                                store.checkCode(
                                    email,
                                    Number(code),
                                    refs.current,
                                    setError,
                                    setInputs
                                );
                            } catch (error) {
                                setError("Incorrect code format");
                            }
                        } else if (
                            !new RegExp("^[0-9]{6}$").test(code) &&
                            !code.includes("!")
                        ) {
                            setError("Incorrect code format");
                        }
                    }}
                />
            ))}
            <div className={s.error}>{error}</div>
        </div>
    );
};

export default observer(CodeForm);
