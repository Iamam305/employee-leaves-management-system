// app/providers.tsx
"use client";

import { CurrentUserProvider } from "@/context/CurrentUser";
import store from "@/store/store";

import { NextUIProvider } from "@nextui-org/react";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
const queryClient = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <Provider store={store}>
        <CurrentUserProvider>
          <QueryClientProvider client={queryClient}>
            <Suspense>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </Suspense>
          </QueryClientProvider>
        </CurrentUserProvider>
      </Provider>
    </NextUIProvider>
  );
}
