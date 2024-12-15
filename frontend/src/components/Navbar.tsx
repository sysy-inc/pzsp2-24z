import { NavLink, Outlet } from "react-router";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
    return (
        <>
            <nav className="flex items-center justify-center">
                <div className="max-w-screen-lg w-full flex items-center justify-end">
                    <NavLink to="/" end>
                        <Button variant={'ghost'} >
                            Home
                        </Button>
                    </NavLink>
                    <NavLink to="/login" end>
                        <Button variant={'ghost'}>
                            Login
                        </Button>
                    </NavLink>
                    <ModeToggle />
                </div>
            </nav>
            <Outlet />
        </>
    );
}
