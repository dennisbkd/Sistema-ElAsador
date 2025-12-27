import { AlertTriangle, X, Trash2 } from "lucide-react"
import { BotonAccion } from "../../ui/boton/BotonAccion"
import { Modal } from "./Modal"

export const ModalEliminar = ({ abrir, cerrar, confirmarEliminar, tipo, nombre }) => {
  return (
    <Modal size="xs" abierto={abrir} cambiarEstado={cerrar} titulo={`Eliminar ${tipo}`}>
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-md">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <p className="text-gray-700">
          ¿Estás seguro de que deseas eliminar este {tipo}? <strong>{nombre}</strong><br />
          <span className="text-sm text-gray-500">Esta acción no se puede deshacer.</span>
        </p>
      </div>
      <div className="flex justify-end mt-6 gap-3">
        <BotonAccion
          onClick={cerrar}
          icon={X}
          label="Cancelar"
          variant=""
        />

        <BotonAccion
          onClick={confirmarEliminar}
          icon={Trash2}
          label="Eliminar"
          variant="danger"
        />
      </div>
    </Modal>
  )
}
