import { use } from "react";
import { AuthContext } from "../contexts/AuthContext";



const UseAuth = () => {
  const context = use(AuthContext);

    return context
}

export default UseAuth;

