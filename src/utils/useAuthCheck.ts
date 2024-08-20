import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userApi } from "../app/api/userApi";

export default function useAuthCheck() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  const storedUser = localStorage?.getItem("token");
  console.log(storedUser)
  useEffect(() => {

    if (storedUser) {
      const auth = JSON.parse(storedUser);
      if (auth.token) {
        userApi.endpoints.getMe.useQuery();
      }
    }
    setAuthChecked(true);
  }, [dispatch, setAuthChecked, storedUser]);

  return authChecked;
}
