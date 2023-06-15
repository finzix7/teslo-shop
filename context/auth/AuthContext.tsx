import { IUser } from '@component/interfaces';
import { createContext } from 'react';


interface ContextProps {
    isLoaded: boolean;
    isLoggedIn: boolean;
    user?: IUser;

    //mehods
    loginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{ hasError: boolean; message?: string }>;
    logout: () => void;
}


export const AuthContext = createContext({} as ContextProps);   