import { BrowserRouter } from "react-router"
import { AppRouter } from "./AppRouter"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SocketProvider } from "./context/SocketProvider"
import { NotificacionProvider } from "./context/NotificacionProvider"

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SocketProvider>
          <NotificacionProvider>
            <AppRouter />
          </NotificacionProvider>
        </SocketProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
