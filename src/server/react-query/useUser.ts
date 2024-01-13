import { useQuery } from "@tanstack/react-query";
import {
  getJWTHeaderFromLocalStorage,
  privateAxiosInstance,
} from "../axios/axios";
import { queryKeys } from "./queryClient";

// GET /user
interface GetUserResponse {
  profileImage: {
    presignedUrl: string | null;
    contentType?: string;
  };
  user: {
    idx: number;
    marketing_agreed: number;
    register_type: "naver" | "apple" | "kakao" | "google";
    registered_date: string;
    user_email: string;
    user_name: string;
  };
}

const getUser = async (): Promise<GetUserResponse> => {
  const res = await privateAxiosInstance.get("/user", {
    headers: await getJWTHeaderFromLocalStorage(),
  });

  return res.data;
};

export const useGetUser = () => {
  const { data, isSuccess, isError, isPending, refetch } = useQuery({
    queryFn: getUser,
    queryKey: [queryKeys.user],
    enabled: false,
  });

  return { data, isSuccess, isError, isPending, refetch };
};
