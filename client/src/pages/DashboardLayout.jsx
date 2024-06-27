/* eslint-disable react-refresh/only-export-components */
import { Outlet, redirect, useLoaderData } from 'react-router-dom'

import Wrapper from '../assets/wrappers/Dashboard'
import { Navbar, BigSidebar, SmallSidebar } from '../components'
import { useState, createContext, useContext } from 'react'
import { checkDefaultTheme } from '../App'

import customFetch from '../utils/customFetch'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const loader = async () => {
  try {
    const { data } = await customFetch('/users/current-user')
    return data
  } catch (error) {
    return redirect('/')
  }
}

const DashboardContext = createContext()

// eslint-disable-next-line react/prop-types
const DashboardLayout = () => {
  const navigate = useNavigate()
  const { user } = useLoaderData()

  // temp
  // const user = { name: 'john' }

  const [showSidebar, setShowSidebar] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme())

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme
    setIsDarkTheme(newDarkTheme)
    // access vanilla js and add a class name based on a boolean value
    document.body.classList.toggle('dark-theme', newDarkTheme)
    // making the theme data persist after refreshing the page
    // localStorage data can be found at application > storage > local storage in the chrome devtools
    localStorage.setItem('darkTheme', newDarkTheme)
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const logoutUser = async () => {
    navigate('/')
    await customFetch.get('/auth/logout')
    toast.success('Logging out...')
  }

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className='dashboard'>
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className='dashboard-page'>
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  )
}

// export a custom hook
export const useDashboardContext = () => useContext(DashboardContext)

export default DashboardLayout
