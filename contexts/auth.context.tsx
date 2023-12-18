import { createContext } from "react";

export type AuthContextProps = {};
export type AuthProviderProps = { children: any };

export const AuthContext = createContext<AuthContextProps>(
  // @ts-ignore
  {}
);

export const AuthProvider = (props: AuthProviderProps) => {
  const context = {};

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};
