import { useEffect } from "react";
import { getFromStorage, storageKeys } from "../utils/storage";
import { useGetUser } from "../server/react-query/useUser";
import { router } from "expo-router";

export const useCheckAuthFirst = () => {
  const { refetch: getUser } = useGetUser();

  useEffect(() => {
    checkAuthFirst();
  }, []);

  const checkAuthFirst = async () => {
    const accessToken = await getFromStorage(storageKeys.accessToken);

    if (accessToken) {
      getUser().then(() => {
        router.replace({ pathname: "/home" });
      });
    }
  };
};
