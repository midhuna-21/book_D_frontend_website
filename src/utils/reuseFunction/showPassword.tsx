import React, {
    forwardRef,
    useRef,
    useState,
    useImperativeHandle,
} from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface PasswordFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    passwordError?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    ({ value, onChange, passwordError, ...props }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => inputRef.current!);

        const onClickReveal = () => {
            setIsOpen(!isOpen);
            if (inputRef.current) {
                inputRef.current.focus({ preventScroll: true });
            }
        };

        return (
            <div
                className={`form-control ${
                    passwordError ? "text-red-500" : ""
                }`}>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="relative mt-1">
                    <input
                        id="password"
                        ref={inputRef}
                        name="password"
                        type={isOpen ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className={`block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            passwordError
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : ""
                        }`}
                        value={value}
                        onChange={onChange}
                        {...props}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            aria-label={
                                isOpen ? "Mask password" : "Reveal password"
                            }
                            onClick={onClickReveal}>
                            {isOpen ? <HiEyeOff /> : <HiEye />}
                        </button>
                    </div>
                </div>
                {passwordError && (
                    <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                )}
            </div>
        );
    }
);

PasswordField.displayName = "PasswordField";
