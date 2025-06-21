import { Link } from "react-router-dom";

import { useState } from "react";
import { Fraction } from "fraction.js";
import shuffle from "lodash/shuffle";
import "../../assets/css/modal.css"; // Asegúrate de tener estilos para el modal

interface Producto {
  id: number;
  nombre: string;
  precio: Fraction;
  imagen?: string;
}


interface Seleccion {
  id: number;
  cantidad: Fraction;
}

const nombres = [
  "Manzanas", "Pan", "Leche", "Chocolate", "Queso",
  "Arroz", "Huevos", "Carne", "Jugo", "Yogur",
  "Cereal", "Galletas", "Mantequilla", "Pollo", "Pasta",
  "Frijoles", "Helado", "Aceite", "Sal", "Azúcar"
];


const obtenerRutaImagen = (nombre: string) => {
  const map: Record<string, string> = {
    Manzanas: "apple.svg",
    Pan: "bread.svg",
    Leche: "milk.svg",
    Chocolate: "chocolate.svg",
    Queso: "cheese.svg",
    Arroz: "rice.svg",
    Huevos: "eggs.svg",
    Carne: "meat.svg",
    Jugo: "juice.svg",
    Yogur: "yogurt.svg",
    Cereal: "cereal.svg",
    Galletas: "cookies.svg",
    Mantequilla: "butter.svg",
    Pollo: "chicken.svg",
    Pasta: "spaghetti.svg",
    Frijoles: "beans.svg",
    Helado: "icecream.svg",
    Aceite: "oil.svg",
    Sal: "salt.svg",
    Azúcar: "sugar.svg",
  };

  return `/src/assets/img/productos/${map[nombre] || "default.svg"}`;
};


const generarFraccionAleatoria = () => {
  const num = Math.floor(Math.random() * 8) + 1;
  const den = Math.floor(Math.random() * 8) + 1;
  return new Fraction(num, den);
};

export const DonFraccionGame = () => {
  const [fase, setFase] = useState<1 | 2 | 3 | 4>(1);
  const [productos, setProductos] = useState<Producto[]>(
    nombres.map((nombre, idx) => ({
      id: idx,
      nombre,
      precio: generarFraccionAleatoria(),
      imagen: obtenerRutaImagen(nombre),
    }))
  );


  const [productosFase2, setProductosFase2] = useState<Producto[]>(() => shuffle(productos).slice(0, 8));
  const [seleccionados, setSeleccionados] = useState<Seleccion[]>([]);
  const [dinero] = useState<Fraction>(new Fraction(Math.floor(Math.random() * 10) + 3));
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const handleCantidadChange = (id: number, value: string) => {
    const cantidad = new Fraction(value || 0);
    setSeleccionados((prev) => {
      const existe = prev.find((p) => p.id === id);
      if (existe) {
        return prev.map((p) => (p.id === id ? { ...p, cantidad } : p));
      } else if (prev.length < 5) {
        return [...prev, { id, cantidad }];
      }
      return prev;
    });
  };

  const calcularTotal = () => {
    return seleccionados.reduce((acc, item) => {
      const prod = productos.find((p) => p.id === item.id);
      if (!prod) return acc;
      return acc.add(prod.precio.mul(item.cantidad));
    }, new Fraction(0));
  };

  const total = calcularTotal();
  const dineroRestante = dinero.sub(total);

  if (dineroRestante.equals(0) && !mostrarResumen) {
    setMostrarResumen(true);
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-700 to-yellow-600 p-6">
      <h1 className="text-white text-3xl font-bold mb-6">🛒 La Tienda de Don Fracción</h1>

      {/* Fases */}
      <div className="flex gap-4 mb-6">
        {[1, 2, 3, 4].map((f) => (
          <button
            key={f}
            onClick={() => setFase(f as 1 | 2 | 3 | 4)}
            className={`px-4 py-2 rounded ${fase === f ? "bg-blue-600 text-white" : "bg-white/20 text-white hover:bg-white/40"}`}
          >
            {f === 1 ? "Tienda" : f === 2 ? "Comprar Productos" : f === 3 ? "Ofertas" : "Venta"}
          </button>
        ))}
      </div>

      {/* Dinero */}
      <div className="text-white font-semibold mb-4 text-xl">
        💰 Dinero disponible: {dinero.toFraction(true)} $
      </div>

      {/* Fase 1 */}
      {fase === 1 && (
        <div className="w-full max-w-3xl bg-white/10 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-white">📦 Productos de la Tienda</h2>
          <ul className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {productos.map((prod) => (
              <li key={prod.id} className="bg-white/10 rounded p-3 text-white shadow-md">
                <img src={prod.imagen} alt={prod.nombre} className="w-16 h-16 mx-auto mb-2" />
                <div className="font-semibold">{prod.nombre}</div>
                <div className="text-sm">Precio: {prod.precio.toFraction(true)} $</div>
              </li>
            ))}
          </ul>
          <Link to="/" className="mt-4 text-sm text-white underline hover:text-yellow-300">⬅ Volver al inicio</Link>
        </div>
      )}

      {/* Fase 2 */}
      {fase === 2 && (
        <>
          <button
            onClick={() => {
              setProductosFase2(shuffle(productos).slice(0, 8));
              setSeleccionados([]);
              setMostrarResumen(false);
            }}
            className="mb-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
          >
            🔄 Recargar productos para la compra
          </button>

          <div className="w-full max-w-7xl bg-white/10 p-6 rounded shadow grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Productos */}
            <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {productosFase2.map((prod) => (
                <div key={prod.id} className="bg-white/10 p-4 rounded shadow text-white">
                  <div className="font-semibold">{prod.nombre}</div>
                  <div className="text-sm mb-2">Precio: {prod.precio.toFraction(true)} $</div>
                  <input
                    type="text"
                    placeholder="Cantidad"
                    className="w-full px-2 py-1 text-black text-center rounded text-sm"
                    onChange={(e) => handleCantidadChange(prod.id, e.target.value)}
                  />
                </div>
              ))}
              
            </div>

            {/* Resumen */}
            
            <div className="flex flex-col justify-center bg-green-500 backdrop-blur-md rounded-xl text-white gap-4 p-4 shadow-lg">
              <h3 className="text-lg font-bold mb-2">🧮 Resumen</h3>
              <p>Total de la compra: <strong>{total.toFraction(true)} $</strong></p>
              <p className={dineroRestante.compare(0) < 0 ? "text-red-400" : "text-green-300"}>
                Dinero restante: {dineroRestante.toFraction(true)} $
              </p>
              {dineroRestante.compare(0) < 0 && (
                <p className="text-red-500 mt-2 font-bold">❌ ¡No tienes suficiente dinero!</p>
              )}
              {dineroRestante.equals(0) && (
                <p className="text-green-400 mt-2 font-bold">🎉 ¡Has gastado todo tu dinero justo!</p>
              )}
            </div>
            
          </div>

          {/* Modal resumen */}
          {mostrarResumen && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
                <h2 className="text-xl font-bold mb-4">🧾 Resumen de la Compra</h2>
                <ul className="space-y-2">
                  {seleccionados.map((item) => {
                    const producto = productos.find((p) => p.id === item.id);
                    return (
                      producto && (
                        <li key={item.id} className="flex justify-between">
                          <span>{producto.nombre} × {item.cantidad.toFraction(true)}</span>
                          <span>= {producto.precio.mul(item.cantidad).toFraction(true)} $</span>
                        </li>
                      )
                    );
                  })}
                </ul>
                <p className="mt-4 font-semibold">Total: {total.toFraction(true)} $</p>
                <button
                    onClick={() => {
                      setMostrarResumen(false);
                      setFase(1);
                      setSeleccionados([]);
                      setProductos(nombres.map((nombre, idx) => ({
                        id: idx,
                        nombre,
                        precio: generarFraccionAleatoria(),      
                        imagen: obtenerRutaImagen(nombre),
                      })));
                      setProductosFase2(shuffle(productos).slice(0, 8));
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Cerrar
                  </button>

              </div>
            </div>
          )}
        </>
      )}

      {/* Fases futuras */}
      {fase === 3 && (
        <p className="text-white text-lg bg-white/10 px-4 py-2 rounded">🎯 Fase 3: Ofertas y Descuentos</p>
      )}
      {fase === 4 && (
        <p className="text-white text-lg bg-white/10 px-4 py-2 rounded">💰 Fase 4: Vendiendo Productos</p>
      )}
    </div>
  );
};
