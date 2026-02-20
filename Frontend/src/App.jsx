import { BrowserRouter } from "react-router"
import { AppRouter } from "./AppRouter"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SocketProvider } from "./context/SocketProvider"
import { NotificacionProvider } from "./context/NotificacionProvider"
import ErrorBoundary from "./components/ErrorBoundary"

const queryClient = new QueryClient()

function App() {

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SocketProvider>
            <NotificacionProvider>
              <AppRouter />
            </NotificacionProvider>
          </SocketProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
