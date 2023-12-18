import { createContext } from "react";

export type OrganizationsProviderProps = { children: any };

export const OrganizationsContext = createContext<{}>({});

export const OrganizationsProvider = (props: OrganizationsProviderProps) => {
  const context = {};
  return (
    <OrganizationsContext.Provider value={context}>
      {props.children}
    </OrganizationsContext.Provider>
  );
};

export const useOrganizations = () => createContext(OrganizationsContext);
