import { User } from "@/types";

let accessToken: string | null = null;
let user: User | null = null;

export const setAuth = (token: string, userData: User) => {
  accessToken = token;
  user = userData;
};

export const clearAuth = () => {
  accessToken = null;
  user = null;
};

export const getAccessToken = () => accessToken;
export const getUser = () => user;
export const isAuthenticated = () => !!accessToken;
