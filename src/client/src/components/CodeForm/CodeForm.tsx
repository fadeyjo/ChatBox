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
        } else {
            clearInputs();
            setError("");
        }
    }, [isOpened]);

    const clearInputs = () => {
        setInputs((prev) => prev.map(() => ""));
    };

    const findCurrentStateValue = (index: number, eventValue: string) => {
        for (let i = 0; i < inputs.length; i++) {
            if (i !== index) {
                continue;
            }
            if (inputs[i] === "") {
                return eventValue;
            }
            if (eventValue !== "") {
                if (eventValue[0] === inputs[i]) {
                    return eventValue[1];
                }
                return eventValue[0];
            }
            return eventValue;
        }
        return "";
    };

    return (
        <div className={s.code_input}>
            <div className={s.inputs}>
                {inputs.map((input, index) => (
                    <input
                        className={s.code}
                        key={index}
                        ref={(ref) => (refs.current[index] = ref)}
                        type="text"
                        value={input}
                        onChange={(event) => {
                            setError("");
                            const eventValue = event.target.value;
                            let currentStateValue = findCurrentStateValue(
                                index,
                                eventValue
                            );
                            setInputs((prev) =>
                                prev.map((inputValue, inputIndex) =>
                                    inputIndex === index
                                        ? currentStateValue
                                        : inputValue
                                )
                            );
                            const nextRef = refs.current[index + 1];
                            if (eventValue.length !== 2 && nextRef) {
                                nextRef.focus();
                            }
                            const stringCode = inputs
                                .map((inputValue, inputIndex) =>
                                    inputIndex === index
                                        ? currentStateValue
                                        : inputValue
                                )
                                .join("");
                            if (stringCode.length === inputs.length) {
                                if (
                                    !new RegExp("^[0-9]{6}$").test(stringCode)
                                ) {
                                    setError("Incorrect code format");
                                } else {
                                    store.checkCode(
                                        email,
                                        Number(Number(stringCode)),
                                        refs.current,
                                        setError,
                                        clearInputs
                                    );
                                }
                            }
                        }}
                    />
                ))}
            </div>
            <div className={s.error}>{error}</div>
        </div>
    );
};

export default observer(CodeForm);
