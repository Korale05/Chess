import axios from "axios";


const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


export default async function useUserInfo(){

    const user = await axios.get(`${BACKEND_URL}/api/auth/me`,
        {
            withCredentials: true,
        }
    );
    return user.data;
}