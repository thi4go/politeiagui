import { useSelector } from "src/redux";
import * as sel from "src/selectors";

export const useUserOnboard = () => {
  const currentUser = useSelector(sel.currentUser);
  return {
    firstUserAccess: !!currentUser && !currentUser.lastlogintime
  };
};
