import { testloApi } from '@component/api';
import { IUser } from '@component/interfaces';
import axios from 'axios';
import Cookies from 'js-cookie';
import { signOut, useSession } from 'next-auth/react';
import { FC, useEffect, useReducer } from 'react';
import { AuthContext, AuthReducer } from './';

export interface AuthState {
    isLoaded: boolean;
    isLoggedIn: boolean;
    user?: IUser;
}

interface Props {
    children?: React.ReactNode | undefined;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoaded: false,
    isLoggedIn: false,
    user: undefined,
}

export const AuthProvider: FC<Props> = ({ children }) => {

    //const router = useRouter();
    const { data, status } = useSession();
    const [state, dispatch] = useReducer(AuthReducer, AUTH_INITIAL_STATE);

    // useEffect(() => {
    //     checkToken();
    // }, []);

    useEffect(() => {
        if (status === 'authenticated') {
            dispatch({ type: '[Auth] - Login', payload: data?.user as IUser });
        }
    }, [status, data])


    // const checkToken = async () => {

    //     if (!Cookies.get('token')) return;

    //     try {
    //         const { data } = await testloApi.get('/user/validate-token');
    //         const { token, user } = data;
    //         Cookies.set('token', token);
    //         dispatch({ type: '[Auth] - Login', payload: user });
    //         return;
    //     } catch (error) {
    //         Cookies.remove('token');
    //         return;
    //     }
    // }

    const loginUser = async (email: string, password: string): Promise<boolean> => {

        try {
            const { data } = await testloApi.post('/user/login', { email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return true;

        } catch (error) {
            return false;
        }
    }

    const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean, message?: string }> => {

        try {
            const { data } = await testloApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });

            return {
                hasError: false,
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear al usuario - intente nuevamente'
            }
        }
    }

    const logout = () => {
        Cookies.remove('cart');

        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('zip');
        Cookies.remove('city');
        Cookies.remove('country');
        Cookies.remove('phone');

        //Next Auth
        signOut();
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            //methods
            loginUser,
            registerUser,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
};