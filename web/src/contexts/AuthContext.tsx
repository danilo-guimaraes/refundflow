import { createContext, ReactNode, useState, useEffect } from "react";
import { api } from "../services/api";
type AuthContext = {
  isLoading: boolean;
  session: null | UserApiResponse;
  save: (data: UserApiResponse) => void;
  remove: () => void;
};
const LOCAL_STORGE_KEY = "@refund";
export const AuthContext = createContext({} as AuthContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<null | UserApiResponse>(null);
  const [isLoading, setIsLoading] = useState(true);

  function save(data: UserApiResponse) {
    localStorage.setItem(`${LOCAL_STORGE_KEY}:user`, JSON.stringify(data.user));
    localStorage.setItem(`${LOCAL_STORGE_KEY}:token`, data.token);

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
    setSession(data);
  }

  function remove() {
    setSession(null);
    localStorage.removeItem(`${LOCAL_STORGE_KEY}:user`);
    localStorage.removeItem(`${LOCAL_STORGE_KEY}:token`);

    window.location.assign(import.meta.env.BASE_URL);
  }
  function loadUser() {
    const user = localStorage.getItem(`${LOCAL_STORGE_KEY}:user`);
    const token = localStorage.getItem(`${LOCAL_STORGE_KEY}:token`);

    if (token && user) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setSession({
        token,
        user: JSON.parse(user),
      });
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ session, save, isLoading, remove }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
