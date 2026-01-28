/* eslint-disable no-unused-vars */
import React from 'react'
import { useFormLogin } from '../hook/useFormLogin'
import { LogIn, UtensilsCrossed } from 'lucide-react'
import { motion } from 'motion/react'
import { useAppForm } from '../../../components/form'

export const LoginPage = () => {
  const { iniciarSesion, logindataValues, loginSquema, iniciandoSesion } = useFormLogin()
  const form = useAppForm({
    defaultValues: logindataValues.defaultValues,
    onSubmit: ({ value }) => {
      iniciarSesion(value)
      form.reset()
    },
    validators: {
      onChange: loginSquema
    }
  })

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-blue-700 to-blue-500 p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl shadow-lg bg-white">
        <div className="flex flex-col items-center justify-center text-white p-10 bg-gradient-to-b from-blue-700 to-blue-500">
          <motion.div
            initial={{ y: 0 }}
            animate={{
              y: [-10, 10, -10] // Movimiento de flotación suave
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bg-white rounded-full p-4 mb-4">
              <UtensilsCrossed className="h-12 w-12 text-blue-600" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Bienvenido a</h1>
          <h2 className="text-3xl font-extrabold mb-4">El Asador</h2>
          <p className="text-center max-w-sm opacity-80">
            Sistema de información para la gestion de inventario, usuarios, productos y ventas para el restaurante El Asador.
          </p>
        </div>

        <div className="flex flex-col justify-center p-8">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-2">Iniciar Sesión</h2>
            <p className="text-gray-500 mb-6">Accede a tu cuenta</p>
            <form className='space-y-4' onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}>
              <form.AppField
                name='usuario'
                children={(field) => (<field.TextField type='text' label={'Usuario'} placeholder='juan...' />)}
              />
              <form.AppField
                name='password'
                children={(field) => (<field.TextField type='password' label={'Contraseña'} placeholder='********' />)}
              />
              <div className='w-full '>
                <form.AppForm>
                  <form.BotonSubmit isLoading={iniciandoSesion}>
                    Iniciar Sesión <LogIn className='ml-2 h-5 w-5' />
                  </form.BotonSubmit>
                </form.AppForm>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div >
  )
}
