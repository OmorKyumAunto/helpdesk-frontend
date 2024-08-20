/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatQueryParams(params: any) {
    const searchParams = new URLSearchParams();
  
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key]) {
        searchParams.append(key, params[key]);
      }
    });
  
    return searchParams.toString();
  }