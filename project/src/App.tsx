import { Routes, Route } from 'react-router-dom'
import IndexPage from './routes/index'
import LoginPage from './routes/login'
import AdminPage from './routes/admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}
