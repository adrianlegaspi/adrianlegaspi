import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { PortfolioProvider } from './providers/portfolio'

/**
 * One mounted city for every route: the URL only changes what is selected,
 * so navigating never reloads the scene.
 */
export function Router() {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <App />
      </PortfolioProvider>
    </BrowserRouter>
  )
}
