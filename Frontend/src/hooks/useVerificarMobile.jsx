import { useEffect, useState } from "react";

export const useVerificarMobile = () => {
  const [esMobile, setEsMobile] = useState(false);

  useEffect(() => {
    const verificarMobile = () => {
      setEsMobile(window.innerWidth < 768);
    }

    window.addEventListener("resize", verificarMobile);
    verificarMobile();

    return () => {
      window.removeEventListener("resize", verificarMobile);
    };
  }, []);

  return esMobile;
};
