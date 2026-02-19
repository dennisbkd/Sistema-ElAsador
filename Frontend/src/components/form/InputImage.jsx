import { useEffect } from "react"
import { useFieldContext } from "."
import { FieldErrors } from "./FieldErrors"
import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { getProductImageUrl } from "../../utils/imageURL"

export const InputImage = ({
  label,
  accept = "image/*",
  maxSizeMB = 5,
  placeholder = "Haz clic para subir una imagen",
  previewHeight = "h-64",
  previewWidth = "w-full"
}) => {
  const field = useFieldContext()
  const fileInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(field.state.value || null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (file) => {
    if (!file) return

    // Validar tamaño
    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      field.setError(`La imagen no debe superar los ${maxSizeMB}MB`)
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      field.setError('Por favor, sube solo archivos de imagen')
      return
    }

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      setPreviewUrl(result)
      field.handleChange(file) // Envía el archivo completo para FormData
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileChange(file)
    }
  }


  useEffect(() => {
    if (typeof field.state.value === 'string') {
      setPreviewUrl(getProductImageUrl(field.state.value))
    }
  }, [field.state.value])


  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    field.handleChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        id={field.name}
        accept={accept}
        onChange={handleInputChange}
        onBlur={field.handleBlur}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative group">
          <div className={`${previewWidth} ${previewHeight} rounded-lg overflow-hidden border-2 border-gray-300`}>
            <img
              src={previewUrl}
              alt="Vista previa"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Botones de acción sobre la imagen */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleButtonClick}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Cambiar
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleButtonClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`${previewWidth} ${previewHeight} border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
            ${dragActive
              ? 'border-indigo-500 bg-indigo-50 border-solid'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }`}
        >
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="p-3 rounded-full bg-gray-100 mb-3">
              {dragActive ? (
                <Upload className="h-8 w-8 text-indigo-500 animate-pulse" />
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {dragActive ? "Suelta la imagen aquí" : placeholder}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF hasta {maxSizeMB}MB
            </p>
            <button
              type="button"
              className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
            >
              Seleccionar imagen
            </button>
          </div>
        </div>
      )}

      {/* Información del archivo seleccionado */}
      {field.state.value instanceof File && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700 truncate">
                  {field.state.value.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(field.state.value.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              Listo para subir
            </span>
          </div>
        </div>
      )}

      <FieldErrors meta={field.state.meta} />
    </div>
  )
}