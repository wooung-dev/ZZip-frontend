import { QueryClient } from "@tanstack/react-query";

// async function queryErrorHandler(error: any) {
//   // error is type unknown because in js, anything can be an error (e.g. throw(5))
//   const errorMessage =
//     error instanceof Error
//       ? error.message
//       : "GET: 서버와의 연결에 실패했습니다";
//   console.log(`데이터 요청에 실패했습니다. ${errorMessage}`);
// }

// function mutationErrorHandler(error: unknown): void {
//   const errorMessage =
//     error instanceof Error ? error.message : "서버와의 연결에 실패했습니다";
//   console.log(`업데이트에 실패했습니다.
// ${errorMessage}`);
// }

const generateQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3 * 60 * 1000, // 3 minutes
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    },
  });
};

export const queryClient = generateQueryClient();

export const queryKeys = {
  oAuth: "OAuth",
  user: "user",
  calendar: "calendar",
};
