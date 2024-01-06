import Layout from '@components/layout'
import { useAuth } from '../../context/AuthContext'

import '@styles/pages/App.scss'

// INSTALL PACKAGES: npm install react-google-login gapi-script --legacy-peer-deps

function App() {
  const {authData} = useAuth();

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
