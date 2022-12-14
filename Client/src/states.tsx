import React from "react";
import { createContext } from "react";
import { initialState } from "./lib/defaults/Default";
import { ActionType, GlobalContextType, GlobalStateType } from "./types";

export const GlobalContext = createContext<GlobalContextType>(
    {} as GlobalContextType
);

const getSessionData = () => {
    const state = sessionStorage.getItem("fmm-state");
    if (state === null) {
        save(initialState);
        return initialState;
    } else {
        return load();
    }
};

const save = (state: GlobalStateType) => {
    sessionStorage.setItem("fmm-state", JSON.stringify(state));
};

const load = () => {
    const res = JSON.parse(sessionStorage.getItem("fmm-state") as string);
    //reset flags
    return { ...res, flags: initialState.flags };
};

export function GlobalStateProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const reducer = (state: GlobalStateType, action: ActionType) => {
        const newState = { ...state };
        switch (action.type) {
            case "set":
                if (action.field !== undefined) {
                    newState[action.field as string] = action.payload;
                    save(newState);
                    return newState;
                } else {
                    return action.payload;
                }
            case "multi-set":
                if (action.field !== undefined) {
                    for (let i = 0; i < action.field.length; i++) {
                        newState[action.field[i]] = action.payload[i];
                    }
                    save(newState);
                    return newState;
                } else return state;

            case "timer":
                newState.gameInfo = {
                    ...newState.gameInfo,
                    timer: action.payload,
                };
                save(newState);
                return newState;

            case "add game":
                if (!action.payload.roomID) return newState;
                if (newState.activeGames.includes(action.payload)) {
                    console.log("called");
                    save(newState);
                    return newState;
                } else {
                    newState.activeGames.push(action.payload);
                    save(newState);
                    return newState;
                }

            case "reset game":
                const filteredState = newState?.activeGames.filter(
                    (games) => games.roomID !== action.payload.gameInfo.roomID
                );

                return [...filteredState, action.payload];

            case "remove game":
                if (newState.activeGames?.length === 0) return newState;
                const removedState = newState.activeGames.filter(
                    (games) => games.roomID !== action.payload.gameInfo.roomID
                );
                newState.activeGames = removedState;
                save(newState);
                return newState;

            case "update game":
                const updatedGame = newState.activeGames.filter(
                    (games) => games.roomID === action.payload.gameInfo.roomID
                );
                updatedGame[0].scores = action.payload.gameInfo.scores;
                const oldState = newState.activeGames.filter(
                    (games) => games.roomID !== action.payload.gameInfo.roomID
                );
                oldState.push(updatedGame[0]);
                newState.activeGames = oldState;

                save(newState);
                return newState;
            default:
                return state;
        }
    };
    const [state, dispatch] = React.useReducer(reducer, getSessionData());
    return (
        <GlobalContext.Provider
            value={{
                global_state: state,
                dispatch: dispatch,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}
