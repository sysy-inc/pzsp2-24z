import { Outlet } from "react-router";
import { ThemeProvider } from "./theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

export default function MainLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div className="bg-background min-h-[100vh]">
                    <Outlet />
                </div>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
