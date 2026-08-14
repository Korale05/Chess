import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
    const navigate = useNavigate();

    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    async function Login(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const emailValue = email.current?.value.trim();
        const passwordValue = password.current?.value;

        if (!emailValue || !passwordValue) {
            alert("Email and password are required");
            return;
        }

        try {
            const response: any = await axios.post(
                "http://localhost:3000/api/auth/signin",
                {
                    email: emailValue,
                    password: passwordValue,
                },
                {
                    withCredentials: true,
                }
            );

            console.log(response.data);

            console.log(response.data.success);
            if (response.data.success) {
                alert("Login successful!");
                navigate("/game");
            } else {
                alert(JSON.stringify(response.message));
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data);

                alert(
                    error.response?.data?.message ||
                    "Login failed"
                );
            } else {
                console.error(error);
                alert("Something went wrong!");
            }
        }
    }

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center text-white"
            style={{
                background:
                    "radial-gradient(circle at 50% 35%, #18242b 0%, #0d1419 40%, #080d11 75%, #06090c 100%)",
            }}
        >
            <div className="w-full max-w-sm px-5">

                {/* Logo */}
                <div className="mb-4 text-center">
                    <div className="text-2xl font-bold">
                        <span className="text-[#7fa650]">♟</span>{" "}
                        Chess<span className="text-[#7fa650]">Arena</span>
                    </div>

                    <p className="mt-1 text-sm text-neutral-500">
                        Welcome back, player.
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm">

                    {/* Heading */}
                    <h1 className="text-xl font-bold text-white">
                        Sign In
                    </h1>

                    <p className="mt-1 text-sm text-neutral-500">
                        Sign in to continue playing chess.
                    </p>

                    {/* Form */}
                    <form
                        onSubmit={Login}
                        className="mt-5 space-y-4"
                    >

                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-sm text-neutral-300">
                                Email
                            </label>

                            <input
                                ref={email}
                                type="email"
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-white/[0.1] bg-[#0b1217] px-4 py-2.5 text-white outline-none placeholder:text-neutral-600 focus:border-[#81b64c]"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-sm text-neutral-300">
                                Password
                            </label>

                            <input
                                ref={password}
                                type="password"
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-white/[0.1] bg-[#0b1217] px-4 py-2.5 text-white outline-none placeholder:text-neutral-600 focus:border-[#81b64c]"
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[#81b64c] py-2.5 font-bold text-white transition hover:bg-[#8bc34a]"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Signup */}
                    <div className="mt-5 text-center text-sm text-neutral-500">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate("/signup")}
                            className="font-semibold text-[#81b64c] hover:text-[#8bc34a]"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* Back */}
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 block w-full text-center text-sm text-neutral-500 hover:text-white"
                >
                    ← Back to ChessArena
                </button>
            </div>
        </div>
    );
};