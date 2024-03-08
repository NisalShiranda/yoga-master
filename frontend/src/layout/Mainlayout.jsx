import { Outlet } from "react-router-dom"


const Mainlayout = () => {
  return (
    <div>
        <nav>Navbar</nav>
        <Outlet/>
        <footer>Footer</footer>
    </div>
  )
}

export default Mainlayout