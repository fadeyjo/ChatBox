import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import s from "./CodeForm.module.css";
import ICodeForm from "../../interfaces/IProps/ICodeForm";

export const CodeForm: React.FC<ICodeForm> = (isOpened) => {
    const [inputs, setInputs] = useState<string[]>(Array(3).fill(""));
    const refs = useRef<(HTMLInputElement | null)[]>(Array(3).fill(null));

    useEffect(() => {
        if (isOpened) {
            refs.current[0]?.focus();
        }
    }, [isOpened]);

    return (
        <div className={s.code_input}>
            {inputs.map((input, index) => (
                <input
                    className={s.code}
                    key={index}
                    ref={(ref) => (refs.current[index] = ref)}
                    type="text"
                    value={input}
                    onChange={(event) => {
                        if (index + 1 !== inputs.length) {
                            refs.current[index + 1]?.focus();
                        }
                        setInputs((prev) =>
                            prev.map((inputValue, inputIndex) =>
                                inputIndex === index && prev[index] === ""
                                    ? event.target.value
                                    : inputValue
                            )
                        );
                        if (index + 1 === inputs.length) {
                            console.log(
                                [
                                    ...inputs.slice(0, -1),
                                    event.target.value,
                                ].join("")
                            );
                        }
                    }}
                />
            ))}
        </div>
    );
};
