"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser, faPhone, faUserTag, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface ComponentsAuthActivateFormProps {
    onError: (error: string) => void;
}

const ComponentsAuthActivateForm = ({ onError }: ComponentsAuthActivateFormProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [activationCode, setActivationCode] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [userType, setUserType] = useState(""); // Default: Employee
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const code = searchParams.get("code");
        if (code) {
            setActivationCode(code);
        }
    }, [searchParams]);

    // Password validation function
    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    };

    const verifyUser = async () => {
        try {
            setError("");
            setLoading(true);
            onError("");

            console.log("Verifying user:", { email, contact, activationCode });

            const response = await fetch("/api/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, contact, activationCode }),
            });

            if (response.ok) {
                setIsVerified(true);
                console.log("User verified successfully");
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || "Verification failed. Please try again.";
                setError(errorMessage);
                onError(errorMessage);
                console.error("Verification failed:", errorMessage);
            }
        } catch (error: any) {
            console.error("Verification error:", error);
            setError("Verification failed. Please try again.");
            onError("Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const activateUser = async () => {
        try {
            setError("");
            setLoading(true);
            onError("");

            // Validate required fields
            if (!email || !contact || !username || !password || !confirmPassword || !userType) {
                setError("All fields are required");
                setLoading(false);
                onError("All fields are required");
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                setLoading(false);
                onError("Passwords do not match");
                return;
            }

            if (!validatePassword(password)) {
                setError("Password must be at least 6 characters, include 1 uppercase, 1 number, and 1 special character.");
                setLoading(false);
                onError("Password must be at least 6 characters, include 1 uppercase, 1 number, and 1 special character.");
                return;
            }

            console.log("Activating user:", { email, contact, username, password, userType, activationCode });

            const response = await fetch("/api/activate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    contact,
                    username,
                    password,
                    userType: parseInt(userType), // Ensure it's a number
                    activationCode,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Activation successful");
                router.push("/auth/login");
            } else {
                const errorMessage = data.error || "Activation failed. Please try again.";
                setError(errorMessage);
                onError(errorMessage);
                console.error("Activation failed:", errorMessage);
            }
        } catch (error: any) {
            console.error("Activation error:", error);
            setError("Activation failed. Please try again.");
            onError("Activation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Submit clicked - isVerified:", isVerified);

        if (!isVerified) {
            await verifyUser();
        } else {
            await activateUser();
        }
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setContact(value);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleBlur = (fieldName: string) => {
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    };

    const getFieldClassName = (fieldName: string, value: string, isSelect: boolean = false) => {
        const baseClasses = isSelect ? "form-select ps-10 placeholder:text-white-dark" : "form-input ps-10 placeholder:text-white-dark";
        const validationClasses = touchedFields[fieldName] && !value ? 'ring-1 ring-red-500' : '';
        return `${baseClasses} ${validationClasses}`.trim();
    };

    return (
        <div>
            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit}>
                <div className="relative text-white-dark">
                    <input
                        id="Email"
                        type="email"
                        placeholder="Enter email"
                        className={getFieldClassName('email', email)}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleBlur('email')}
                        disabled={isVerified}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-white-dark" />
                    </span>
                </div>

                <div className="relative text-white-dark">
                    <input
                        id="Contact"
                        type="text"
                        placeholder="Enter contact"
                        className={getFieldClassName('contact', contact)}
                        value={contact}
                        onChange={handleContactChange}
                        onBlur={() => handleBlur('contact')}
                        disabled={isVerified}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-white-dark" />
                    </span>
                </div>

                {isVerified && (
                    <>
                        <div className="relative text-white-dark">
                            <select
                                id="UserType"
                                className={getFieldClassName('userType', userType, true)}
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                                onBlur={() => handleBlur('userType')}
                            >
                                <option value="">Select user type</option>
                                <option value="1">Employee</option>
                                <option value="2">Non-Employee</option>
                            </select>
                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                <FontAwesomeIcon icon={faUserTag} className="h-5 w-5 text-white-dark" />
                            </span>
                        </div>

                        <div className="relative text-white-dark">
                            <input
                                id="Username"
                                type="text"
                                placeholder="Enter username"
                                className={getFieldClassName('username', username)}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={() => handleBlur('username')}
                            />
                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white-dark" />
                            </span>
                        </div>

                        <div className="relative text-white-dark">
                            <input
                                id="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                className={getFieldClassName('password', password)}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => handleBlur('password')}
                            />
                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-white-dark" />
                            </span>
                            <span className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={toggleShowPassword}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5 text-white-dark" />
                            </span>
                        </div>
                        <small className="text-red-500 font-semibold">Password must be at least 6 characters long, include 1 uppercase letter, 1 number, and 1 special character.</small>

                        <div className="relative text-white-dark">
                            <input
                                id="ConfirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                className={getFieldClassName('confirmPassword', confirmPassword)}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={() => handleBlur('confirmPassword')}
                            />
                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-white-dark" />
                            </span>
                        </div>
                    </>
                )}

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading ? (isVerified ? "Activating..." : "Verifying...") : isVerified ? "Activate" : "Verify"}
                </button>
            </form>
        </div>
    );
};

export default ComponentsAuthActivateForm;