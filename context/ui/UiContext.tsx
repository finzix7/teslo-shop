import { createContext } from 'react';


interface ContextProps {
    isMenuOpen: boolean;

    //metodos
    toggleSideMenu: () => void;
}


export const UiContext = createContext({} as ContextProps);