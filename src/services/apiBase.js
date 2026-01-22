import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setUser } from "./userSlice";
import { showToast } from "../componets/common/Toast";


const createBaseQueryWithAuth = (baseUrl) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.user?.token || localStorage.getItem("token");
      const companyId = getState()?.user?.currentCompany?.id || localStorage.getItem("companyId");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      if (companyId) {
        headers.set("x-company-id", companyId || "");
      }

      return headers;
    },
  });
  return async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      const errorData = result.error.data;
      console.log('Token expiration detected:', errorData);

      const refreshToken = localStorage.getItem("refreshToken");
      
      if (refreshToken) {
          try {
            const refreshResult = await baseQuery({
                url: "/auth/refresh",
                method: "POST",
                body: { refreshToken }
            }, api, extraOptions);

            if (refreshResult.data && refreshResult.data.success) {
                const newAccessToken = refreshResult.data.data.accessToken;
                const user = api.getState().user.user || JSON.parse(localStorage.getItem("user"));
                
                if (user) {
                    api.dispatch(setUser({ user, token: newAccessToken }));
                    localStorage.setItem("token", newAccessToken);
                    
                    // Retry the original query
                    result = await baseQuery(args, api, extraOptions);
                    return result;
                }
            }
         } catch (refreshError) {
             console.log("Refresh failed", refreshError);
         }
      }
      
      if (
        errorData?.code === "TOKEN_EXPIRED" ||
        errorData?.message?.includes("expired") ||
        errorData?.message?.includes("Token has expired") ||
        errorData?.message?.includes("Token has been revoked") ||
        errorData?.message?.includes("Invalid token") ||
        result.error.statusText === "Unauthorized"
      ) {
        console.log('Logging out due to token expiration');
        showToast("Session expired. Please login again.", { type: "warning" });
        api.dispatch(logout());

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
        return result;
      }
    }

    return result;
  };
};
export { createBaseQueryWithAuth };
