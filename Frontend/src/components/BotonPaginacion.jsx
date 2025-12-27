import { ChevronLeft, ChevronRight } from "lucide-react";

export const BotonPaginacion = ({ anterior, siguiente, pagina }) => {
  return (
    <div className="w-full border-t border-gray-200">
      <div className="flex place-content-center p-4 space-x-4">
        <button disabled={pagina === 1} onClick={anterior}
          className={`border border-gray-300 rounded-md p-2 `}>
          <ChevronLeft className={`${pagina === 1 ? "text-gray-300" : ""}`} size={16} />
        </button>
        <p className="mt-1 font-semibold">{pagina}</p>
        <button onClick={siguiente} className="border border-gray-300 rounded-md p-2"><ChevronRight size={16} /></button>
      </div>
    </div>
  )
}
