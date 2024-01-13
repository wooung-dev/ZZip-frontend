import { useMutation } from "@tanstack/react-query";
import { publicAxiosInstance } from "../axios/axios";

interface SigninResponse {
  processType: string;
  accessToken: string;
  refreshToken: string;
}

// POST /signin/apple
const postSigninApple = async (params: {
  identityToken: string;
  fullName?: string;
}): Promise<SigninResponse> => {
  const res = await publicAxiosInstance.post("/signin/apple", {
    ...params,
  });

  return res.data;
};

export const mutateSigninApple = () => {
  const { mutate, data, isSuccess, isError, isPending } = useMutation({
    mutationFn: postSigninApple,
  });

  return { mutate, data, isSuccess, isError, isPending };
};

// POST /signin/naver
const postSigninNaver = async (code: string): Promise<SigninResponse> => {
  const res = await publicAxiosInstance.post("/signin/naver", {
    code,
  });

  return res.data;
};

export const mutateSigninNaver = () => {
  const { mutate, data, isSuccess, isError, isPending } = useMutation({
    mutationFn: postSigninNaver,
  });

  return { mutate, data, isSuccess, isError, isPending };
};
