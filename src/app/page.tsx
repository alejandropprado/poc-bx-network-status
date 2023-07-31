"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined);
  const [networkQuality, setNetworkQuality] = useState<
    "desconocido" | "buena" | "media" | "mala" | "desconectado" | "excelente"
  >("desconocido");

  const handleOffline = () => {
    setIsOnline(false);
  };

  const handleOnline = () => {
    setIsOnline(true);
  };

  const checkNetworkQuality = (event: Event) => {
    const downlink = (event?.target as any)?.downlink;

    console.log({ event });

    if (downlink === undefined) {
      setNetworkQuality("desconocido");
      return;
    }

    if (downlink === 0) {
      setNetworkQuality("desconectado");
      return;
    } else if (downlink < 1) {
      setNetworkQuality("mala");
      return;
    } else if (downlink < 2) {
      setNetworkQuality("media");
      return;
    } else if (downlink < 3) {
      setNetworkQuality("buena");
      return;
    } else if (downlink >= 3) {
      setNetworkQuality("excelente");
      return;
    }
  };

  useEffect(() => {
    const connection =
      navigator?.connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (!connection) {
      throw new Error("El navegador no soporta la API de conexión");
    }

    if (connection) {
      connection.addEventListener("change", checkNetworkQuality);
    }
    setIsOnline(navigator?.onLine);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      if (connection) {
        connection.removeEventListener("change", checkNetworkQuality);
      }
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div>
      {isOnline === undefined ? (
        <p>Verificando conexión</p>
      ) : isOnline ? (
        <p>Conexión a Internet activa</p>
      ) : (
        <p>Sin conexión a Internet</p>
      )}
      <p>Calidad de la conexión: {networkQuality}</p>
    </div>
  );
}
