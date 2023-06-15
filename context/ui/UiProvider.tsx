import { FC, useReducer } from 'react';
import { UiContext, uiReducer } from './';

export interface UiState {
    isMenuOpen: boolean;
}

interface Props {
    children?: React.ReactNode | undefined;
}

const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false,
}

export const UiProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);


    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - ToggleMenu' });
    }

    return (
        <UiContext.Provider value={{
            ...state,

            //metodos
            toggleSideMenu,
        }}>
            {children}
        </UiContext.Provider>
    )
};