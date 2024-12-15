import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import PlatformInfo from './components/PlatformInfo.tsx'
import { Navbar } from './components/Navbar.tsx'
import MainLayout from './components/MainLayout.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route element={<Navbar />}>
                        <Route path="/" element={<div>this is home</div>} />
                        <Route path="login" element={<div>this is login</div>} />
                        <Route path="platform/:platformId/" element={<PlatformInfo />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
