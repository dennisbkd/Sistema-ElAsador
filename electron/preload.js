const { contextBridge, ipcRenderer } = require('electron')

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Funciones que podrías necesitar en el futuro
  platform: process.platform,
  version: process.versions.electron,
  
  // Ejemplo: enviar mensajes al proceso principal
  send: (channel, data) => {
    // Whitelist de canales permitidos
    const validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  
  // Ejemplo: recibir mensajes del proceso principal
  receive: (channel, func) => {
    const validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})
