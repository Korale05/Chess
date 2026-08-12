
import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const navigate = useNavigate();

    const username = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const confirmpassword = useRef<HTMLInputElement>(null);
    
    async function createAccont(){
        const usernameValue = username?.current?.value.trim();
        const emailValue = email?.current?.value.trim();
        const passwordValue = password.current?.value;
        const confirmPasswordValue = confirmpassword.current?.value;

        // Check empty fields
        if (
            !usernameValue ||
            !emailValue ||
            !passwordValue ||
            !confirmPasswordValue
        ) {
        alert("Missing Information!");
        return;
        }
        
        // Check password match
        if (passwordValue !== confirmPasswordValue) {
            alert("Passwords do not match!");
            return;
        }

        // Check password length
        if (passwordValue.length < 6) {
            alert("Password must be at least 6 characters!");
            return;
        }

        try{
            const responce = await axios.post("http://localhost:3000/auth/signup",{
                usernameValue,
                emailValue,
                passwordValue
            },{
                withCredentials : true
            });

            console.log(responce.data);

            alert(responce.data);

            navigate("/signin");
        }catch(error){
            if(axios.isAxiosError(error)){
                console.log(error);
                alert("Signup Failed !");
            }
            else{
                console.log("Something went Wrong")
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
        <div className="w-full max-w-md px-6">
            {/* Logo */}
            <div className="mb-8 text-center">
            <div className="text-2xl font-bold">
                <span className="text-[#7fa650]">♟</span>{" "}
                Chess<span className="text-[#7fa650]">Arena</span>
            </div>

            <p className="mt-2 text-sm text-neutral-500">
                Create your chess account.
            </p>
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-white">
                Create Account
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
                Join ChessArena and start playing.
            </p>

            <form className="mt-7 space-y-5">
                {/* Username */}
                <div>
                <label className="mb-2 block text-sm text-neutral-300">
                    Username
                </label>

                <input
                    ref={username}
                    type="text"
                    placeholder="Your username"
                    className="w-full rounded-lg border border-white/[0.1] bg-[#0b1217] px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-[#81b64c]"
                />
                </div>

                {/* Email */}
                <div>
                <label className="mb-2 block text-sm text-neutral-300">
                    Email
                </label>

                <input
                    ref={email}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/[0.1] bg-[#0b1217] px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-[#81b64c]"
                />
                </div>

                {/* Password */}
                <div>
                <label className="mb-2 block text-sm text-neutral-300">
                    Password
                </label>

                <input
                    ref={password}
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-white/[0.1] bg-[#0b1217] px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-[#81b64c]"
                />
                </div>

                {/* Confirm Password */}
                <div>
                <label className="mb-2 block text-sm text-neutral-300">
                    Confirm Password
                </label>

                <input
                    ref={confirmpassword}
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-white/[0.1] bg-[#0b1217] px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-[#81b64c]"
                />
                </div>

                {/* Button */}
                <button
                    onClick={createAccont}
                    type="submit"
                    className="w-full rounded-lg bg-[#81b64c] py-3 font-bold text-white transition hover:bg-[#8bc34a]"
                >
                Create Account
                </button>
            </form>

            {/* Signin */}
            <div className="mt-6 text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <button
                onClick={() => navigate("/signin")}
                className="font-semibold text-[#81b64c] hover:text-[#8bc34a]"
                >
                Sign In
                </button>
            </div>
            </div>

            {/* Back */}
            <button
            onClick={() => navigate("/")}
            className="mt-6 block w-full text-center text-sm text-neutral-500 hover:text-white"
            >
            ← Back to ChessArena
            </button>
        </div>
        </div>
    );
};