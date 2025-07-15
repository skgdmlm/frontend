import bg from "../assets/jpg/5068978.jpg"
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div
      className="m-0 p-0 h-screen w-full"
      style={{
        backgroundImage: `url(${bg})`
      }}
    >
      <Outlet />
    </div>
  )
}