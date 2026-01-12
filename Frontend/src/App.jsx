import { BrowserRouter, Routes , Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup.jsx'
import Chat from './pages/Chat.jsx'
import ChatHistory from './pages/ChatHistory.jsx'
import UploadDocument from './pages/UploadDocuments.jsx'
import ProtectedRoute from './components/ProtectedRoutes.jsx'

export default function App(){
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/chat" element={ <ProtectedRoute><Chat /></ProtectedRoute>}/>
      <Route path="/history" element={<ProtectedRoute><ChatHistory /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadDocument /></ProtectedRoute>} />
    </Routes>
    </BrowserRouter>
  )
}