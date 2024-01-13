import { QueryClientProvider } from "@tanstack/react-query";
import { Slot, Stack, Tabs } from "expo-router";
import { queryClient } from "../server/react-query/queryClient";
import { useEffect } from "react";
import { getFromStorage, storageKeys } from "../utils/storage";
import { useGetUser } from "../server/react-query/useUser";

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
    // <Stack
    //   screenOptions={{
    //     title: "Sign In",
    //     headerStyle: {
    //       backgroundColor: "#667ED5",
    //     },
    //     headerTintColor: "#fff",
    //     headerTitleStyle: {
    //       fontWeight: "bold",
    //     },
    //     contentStyle: { padding: 12, flex: 1 },
    //     // headerShown: false,
    //     // headerTranspa/rent: true,
    //     // title: "",
    //   }}
    // />
  );
};

export default RootLayout;
