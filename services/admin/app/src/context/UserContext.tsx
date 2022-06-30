import * as React from 'react';

const USER_TOKEN_KEY = 'envo.user.token';

export interface UserContextType {
  getToken: () => string | undefined;
  setToken: (token?: string) => void;
  onChange: (listener: () => void) => () => void;
}

const UserContext = React.createContext<UserContextType>({
  getToken: () => undefined,
  setToken: () => {},
  onChange: () => () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const tokenRef = React.useRef<string | undefined>(
    sessionStorage.getItem(USER_TOKEN_KEY) ?? undefined
  );
  const listenersRef = React.useRef<Array<() => void>>([]);

  const getToken = React.useCallback(() => {
    return tokenRef.current;
  }, []);

  const setToken = React.useCallback((token?: string) => {
    tokenRef.current = token;
    if (token) {
      sessionStorage.setItem(USER_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(USER_TOKEN_KEY);
    }
    listenersRef.current.forEach((fn) => fn());
  }, []);

  const onChange = React.useCallback((listener: () => void) => {
    listenersRef.current.push(listener);

    return () => {
      listenersRef.current = listenersRef.current.filter(
        (fn) => fn !== listener
      );
    };
  }, []);

  return (
    <UserContext.Provider
      value={React.useMemo(
        () => ({
          getToken,
          setToken,
          onChange,
        }),
        []
      )}
    >
      {children}
    </UserContext.Provider>
  );
}

export interface UseUserOptions {
  subscribe?: boolean;
}

export function useUser({ subscribe }: UseUserOptions = {}) {
  const { getToken, setToken, onChange } = React.useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    Boolean(getToken())
  );

  React.useEffect(() => {
    if (subscribe) {
      return onChange(() => {
        setIsAuthenticated(Boolean(getToken()));
      });
    }
  }, []);

  return {
    getToken,
    setToken,
    isAuthenticated,
  };
}
