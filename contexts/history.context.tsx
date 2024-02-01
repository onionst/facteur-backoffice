import { useRouter } from 'next/router';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

export type HistoryContextProps = {
  history: string[];
  canGoBack: () => boolean;
};
export const HistoryContext = createContext<HistoryContextProps>(
  // @ts-ignore
  {}
);

export type HistoryProviderProps = {
  children: ReactNode;
};
export const HistoryProvider = (props: HistoryProviderProps) => {
  const router = useRouter();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const handleRouteChange = (url: any, { shallow }: any) => {
      if (!shallow) {
        setHistory(prevState => [...prevState, url]);
      }
    };

    router.beforePopState(() => {
      setHistory(prevState => prevState.slice(0, -2));
      return true;
    });

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    history.push(router?.basePath);
  }, [router.basePath]);

  const context = {
    history,
    canGoBack: () => history?.length > 1
  };
  return <HistoryContext.Provider value={context}>{props.children}</HistoryContext.Provider>;
};

export const useHistory = () => useContext(HistoryContext);
