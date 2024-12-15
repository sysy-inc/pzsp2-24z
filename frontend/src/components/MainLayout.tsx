import { Outlet } from "react-router";
import { ThemeProvider } from "./theme-provider";

export default function MainLayout() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="bg-background min-h-[100vh]">
                <Outlet />
            </div>
        </ThemeProvider>
    );
}
