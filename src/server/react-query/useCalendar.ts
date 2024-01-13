import { useQuery } from "@tanstack/react-query";
import {
  getJWTHeaderFromLocalStorage,
  privateAxiosInstance,
} from "../axios/axios";
import { queryKeys } from "./queryClient";

// GET /user
interface GetCalendarResponse {}

const getUser = async (params: {
  userEmail: string | null;
  year: number;
  month: number;
}): Promise<GetCalendarResponse> => {
  const res = await privateAxiosInstance.get("/calendar", {
    params,
    headers: await getJWTHeaderFromLocalStorage(),
  });

  return res.data;
};

export const useGetUser = (params: {
  userEmail: string | null;
  year: number;
  month: number;
}) => {
  const { data, isSuccess, isError, isPending, refetch } = useQuery({
    queryFn: () => getUser(params),
    queryKey: [queryKeys.calendar, params.userEmail, params.year, params.month],
  });

  return { data, isSuccess, isError, isPending, refetch };
};
