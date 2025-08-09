import { App } from './main.js'
import { Usuario, Rol } from './model/index.js'
import { UsuarioServicio } from './services/usuario.js'

const usuarioServicio = new UsuarioServicio({ modelUsuario: Usuario, modelRol: Rol })

App({ usuarioServicio })
