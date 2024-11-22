import React, { useState, useEffect } from "react";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import Swal from "sweetalert2";

interface User {
    newPassword: string;
    currentPassword: string;
    confirmPassword: string;
}
const ChangePasswordForm: React.FC = () => {
    const initialFormData: User = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    };
    const user = useSelector((state: RootState) => state?.user?.userInfo?.user);
    const userId = user?._id;

    const [formData, setFormData] = useState<User>(initialFormData);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const passwordRegex =
            /^(?=.*[a-zA-Z])(?=.*[\W_])(?=.*\d)(?!.*\s).{6,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
            setError("Passwords must be strong.");
            return;
        }
        setError(null);
        try {
            const currentPassword = formData.currentPassword;

            const isPassword = await userAxiosInstance.get(
                `/user/check-current-password/${userId}/${currentPassword}`
            );

            if (isPassword?.data.compare == true) {
                const response = await userAxiosInstance.put(
                    "/profile/update-password",
                    {
                        userId,
                        newPassword: formData.newPassword,
                    }
                );

                Swal.fire({
                    icon: "success",
                    title: "Password Updated!",
                    text: "Your password has been successfully updated.",
                    confirmButtonText: "OK",
                });

                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                setError("current password is incorrect");
            }
        } catch (error: any) {
            setError(error.message || "An unexpected error occurred.");
        }
    };

    useEffect(() => {
        const hasChanges = Object.keys(formData).some((key) => {
            const currentValue = formData[key as keyof User];
            const initialValue = initialFormData[key as keyof User];

            if (
                typeof currentValue === "string" &&
                typeof initialValue === "string"
            ) {
                return currentValue.trim() !== initialValue.trim();
            }

            if (
                typeof currentValue === "object" &&
                typeof initialValue === "object" &&
                currentValue !== null &&
                initialValue !== null
            ) {
                return Object.keys(currentValue).some((nestedKey) => {
                    const nestedCurrentValue =
                        currentValue[nestedKey as keyof typeof currentValue];
                    const nestedInitialValue =
                        initialValue[nestedKey as keyof typeof initialValue];

                    return nestedCurrentValue !== nestedInitialValue;
                });
            }

            return currentValue !== initialValue;
        });

        setIsFormChanged(hasChanges);
    }, [formData, initialFormData]);

    return (
        <>
            <div className="bg-white p-7 w-full md:w-1/2 mx-auto">
                <h2 className="text-lg font-bold mb-5 text-gray-700">
                    Change Password
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="currentPassword"
                            className="block text-gray-600 font-semibold text-sm mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border p-2 h-9 bg-white border-gray-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="newPassword"
                            className="block text-gray-600 font-semibold text-sm mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border p-2 h-9 bg-white border-gray-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-gray-600 font-semibold text-sm mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border p-2 h-9 bg-white border-gray-500"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && (
                        <p className="text-green-500 text-sm">{success}</p>
                    )}
                    <button
                        type="submit"
                        className={`bg-green-950 rounded-md p-1 px-2 font-semibold text-white ${
                            !isFormChanged
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                        disabled={!isFormChanged}>
                        {" "}
                        Update Password
                    </button>
                </form>
            </div>
        </>
    );
};

export default ChangePasswordForm;
