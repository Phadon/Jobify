import { Outlet } from 'react-router-dom'

const HomeLayout = () => {
  return (
    <>
      {/* add things like Navbar */}
      {/* <h1>home layout</h1> */}
      {/* <nav>navbar</nav> */}
      <Outlet />
    </>
  )
}
export default HomeLayout
