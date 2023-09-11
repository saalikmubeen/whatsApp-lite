import { Action, ThunkAction, configureStore  } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authSlice from "./authSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice
    }
});


// If using TypeScript:
export type ApplicationState = ReturnType<typeof store.getState>;
export type ApplicationDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<ApplicationState> = useSelector;
export const useAppDispatch: () => ApplicationDispatch = useDispatch;
// export const useAppDispatch = () => useDispatch<AppDispatch>();