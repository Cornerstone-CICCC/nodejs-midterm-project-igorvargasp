import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Workspace from './pages/Workspace'
import SnippetStudio from './pages/SnippetStudio'
import TagLibrary from './pages/TagLibrary'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import SignUp from './pages/SignUp'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/tags" element={<TagLibrary />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/snippet/:id?" element={<ProtectedRoute><SnippetStudio /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
