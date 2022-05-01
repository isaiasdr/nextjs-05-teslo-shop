import { FC, useReducer } from 'react';

import { UIContext, UIReducer } from './';


export interface UIState {
    isMenuOpen: boolean;
};

const UI_INITIAL_STATE: UIState = {
    isMenuOpen: false,
};

export const UIProvider:FC = ({ children }) => {

    const [state, dispatch] = useReducer( UIReducer , UI_INITIAL_STATE );

    const toogleSideMenu = () => {
        dispatch({
            type: '[UI] - ToggleMenu'
        });
    };

    return (
        <UIContext.Provider value = {{
            ...state,

            //methods
            toogleSideMenu,
        }}>
            { children }
        </UIContext.Provider>
    );
};