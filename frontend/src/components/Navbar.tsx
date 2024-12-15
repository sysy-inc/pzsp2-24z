import { Link } from '@tanstack/react-router'
import { FC } from 'react'
import { Button } from './ui/button'

const Navbar: FC = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to='/login'>
                        <Button>Login</Button>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

{/* <Link to="/" className="[&.active]:font-bold">
Home
</Link>{' '}
<Link to="/about" className="[&.active]:font-bold">
About
</Link> */}

export default Navbar
