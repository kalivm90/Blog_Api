import { useEffect } from 'react'

import Layout from '@components/layout'
import { useAuth } from '../../context/AuthContext'

import reactLogo from '@images/react.svg'
import viteLogo from '@images/vite.svg'
import Blog from "@images/blog2.png"

import '@styles/pages/App.scss'

// INSTALL PACKAGES: npm install react-google-login gapi-script --legacy-peer-deps

function App() {
  const {authData} = useAuth();

  console.log(authData)

  return (
    <Layout>
      <div className='App'>

        <header>
          <div>
            <h1>Welcome to Blog Api</h1>
            {authData?.isAuthenticated ? (
              <p>Looks like you are already logged in, go to your
                <a href="blog/dashboard?page=1"> Dashboard</a>
                .
              </p>
            ) : (
              <p>
                Not a member? Not a problem, 
                <a href="auth/register"> register here</a>
                .
              </p>
            )}
          </div>

          <div className='head-info'>
            <div className="info-1">
              <p>This app is built with a stateless server often refered to as a REST API.</p>
            </div>
            <div className="info-2">
              <p>The server does not keep track of sessions but instead uses JWTs.</p>
            </div>
          </div>
        </header>

        <div className="bg-img-container">
          <div className='content'>
            <div className="typewrite">
              <h1>Show the world you were here.</h1>
            </div>
            <div>
              <h1>Create your own blog today!</h1>
            </div>
          </div>
        </div>

      </div>
  </Layout>
  )
}

export default App


/* 
      <div className='logo-container'>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
    
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
*/