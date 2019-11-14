import React, { createContext, useReducer, useContext } from "react";
import { userInitialState, userActions } from "./userActions";
import { notificationInitialState, notificationActions } from "./notificationActions";


const initialState = {
    ...userInitialState,
    ...notificationInitialState
}

const StoreContext = createContext(initialState);

const Actions = {
    ...userActions,
    ...notificationActions
}

const reducer = (state, action) => {
    const act = Actions[action.type];
    const update = act(state, action.params);
    return { ...state, ...update };
  };

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = store => {
    const { state, dispatch } = useContext(StoreContext);
    return { state, dispatch };
};