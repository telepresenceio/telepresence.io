import React, { useReducer } from 'react';

import { initialStateApp, AppReducer } from './reducer';

const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();

export function useAppState() {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }

  return context;
}

export function useAppDispatch() {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }

  return context;
}

export const AppProvider = ({ children }) => {
  const [userInfo, dispatch] = useReducer(AppReducer, initialStateApp);

  return (
    <UserStateContext.Provider value={userInfo}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};
