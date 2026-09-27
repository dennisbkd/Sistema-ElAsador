import { BrowserRouter } from "react-router"
import { AppRouter } from "./AppRouter"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SocketProvider } from "./context/SocketProvider"
import { NotificacionProvider } from "./context/NotificacionProvider"
import ErrorBoundary from "./components/ErrorBoundary"
import { useSessionRenewal } from "./hooks/useSessionRenewal"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
    },
  },
})

function App() {
  useSessionRenewal()

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
