import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Workspace from './pages/Workspace'
import SnippetStudio from './pages/SnippetStudio'
import TagLibrary from './pages/TagLibrary'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Workspace />} />
          <Route path="/tags" element={<TagLibrary />} />
        </Route>
        <Route path="/snippet/:id?" element={<SnippetStudio />} />
      </Routes>
    </BrowserRouter>
  )
}
