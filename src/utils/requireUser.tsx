import { Navigate, useLocation } from "react-router-dom";
import GlobalLoader from "../components/loader/GlobalLoader";
import ServerUnreachable from "../components/serverError/ServerUnreachable";
import { userApi } from "../app/api/userApi";
import { isNetworkError } from "../app/slice/baseQuery";
import { IUser } from "../auth/types/loginTypes";
import { TOKEN } from "../helper/constant";

const RequireUser = ({
  allowedRoles,
  children,
}: {
  allowedRoles?: string[];
  children: JSX.Element;
}): any => {
  const location = useLocation();

  const { isLoading, error, refetch } = userApi.endpoints.getMe.useQuery(
    undefined,
    {
      skip: false,
      refetchOnMountOrArgChange: true,
    }
  );
  const storedUser = localStorage?.getItem(TOKEN);
  const token = storedUser ? storedUser : null;

  // const loading = isLoading || isFetching;

  const profileData = userApi.endpoints.getMe.useQueryState(undefined, {
    selectFromResult: (cache) => {
      const data = cache.data?.data;
      let profileData: IUser = {} as IUser;
      if (data) {
        profileData = data;
      }
      return profileData;
    },
  });

  if (isLoading) {
    return <GlobalLoader />;
  }

  // Server down / offline: still logged in (token present) but the request
  // never reached the server. Show a retry page instead of bouncing to /login.
  if (token && isNetworkError(error as any)) {
    return <ServerUnreachable onRetry={() => refetch()} />;
  }

  return token && profileData?.id ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
  // return token && profileData?.id ? (
  //   children
  // ) : token ? (
  //   <Navigate to="/unauthorized" state={{ from: location }} replace />
  // ) : (
  //   <Navigate to="/login" state={{ from: location }} replace />
  // );
};

export default RequireUser;
