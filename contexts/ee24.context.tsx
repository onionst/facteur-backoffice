import { createContext } from 'react';

export type EE24ContextProps = {};
export const EE24Context = createContext<EE24ContextProps>(
  // @ts-ignore
  {}
);
export type EE24ProviderProps = {
  children: any;
};
export const EE24Provider = (props: EE24ProviderProps) => {
  const context = {};

  return <EE24Context.Provider value={context}>{props.children}</EE24Context.Provider>;
};
