import axios from "axios";


const BACKEND_URL = "ws://localhost:8080";
export default async function useUserInfo(){

    const user = await axios.get(`${BACKEND_URL}/api/auth/me`,
        {
            withCredentials: true,
        }
    );
    return user.data;
}