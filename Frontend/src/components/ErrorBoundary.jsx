/* eslint-disable no-undef */
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Solo loguear en modo desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('Error capturado:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{
              fontSize: '24px',
              marginBottom: '16px',
              color: '#dc3545'
            }}>
              Algo salió mal
            </h1>
            <p style={{
              marginBottom: '24px',
              color: '#6c757d'
            }}>
              La aplicación encontró un error. Por favor, recarga la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Recargar página
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginTop: '24px',
                textAlign: 'left',
                fontSize: '12px',
                color: '#6c757d'
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                  Detalles del error
                </summary>
                <pre style={{
                  overflow: 'auto',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
