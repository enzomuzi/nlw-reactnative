import axios from "axios";

export const api = axios.create({
    baseURL: "http://172.19.1.71:3333",
    timeout: 700
})