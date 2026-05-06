import './MainLayout.css';
import Sidebar from '../components/Sidebar.jsx'

function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <div className="app-shell__body">
        <Sidebar />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
