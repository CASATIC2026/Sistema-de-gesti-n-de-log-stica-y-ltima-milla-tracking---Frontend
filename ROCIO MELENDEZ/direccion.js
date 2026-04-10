
let map = L.map('map').setView([13.4833, -88.1833], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let clienteMarker;
let repartidor;
window.onload = iniciarAuto;

async function iniciarAuto() {

  let direccion = localStorage.getItem("direccionCliente");

  if (!direccion) {
    alert("No hay dirección guardada");
    return;
  }

  document.getElementById("estado").innerText = "Estado: Empaquetando 📦";

  let cliente = await geocodificar(direccion);
  if (!cliente) return;

  // Aquí sigue tu código normal 👇
  if (clienteMarker) map.removeLayer(clienteMarker);
  clienteMarker = L.marker(cliente).addTo(map).bindPopup("🏠 Cliente");

 let urlRuta = `https://router.project-osrm.org/route/v1/driving/-88.1833,13.4833;${cliente[1]},${cliente[0]}?overview=full&geometries=geojson`;

  let res = await fetch(urlRuta);
  let data = await res.json();

  let ruta = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);

  L.polyline(ruta, {color: 'orange'}).addTo(map);

  repartidor = L.marker(ruta[0]).addTo(map).bindPopup("🚚");

  setTimeout(() => {
    document.getElementById("estado").innerText = "Estado: En camino 🚚";
    mover(ruta);
  }, 3000);
}
async function geocodificar(direccion) {
  let url = `https://nominatim.openstreetmap.org/search?format=json&q=${direccion}`;
  
  let res = await fetch(url);
  let data = await res.json();

  if (data.length === 0) {
    alert("Dirección no encontrada");
    return null;
  }

  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}
function mover(ruta) {

  let i = 0;

  let intervalo = setInterval(() => {

    if (i >= ruta.length) {
      clearInterval(intervalo);
      document.getElementById("estado").innerText = "Estado: Entregado ✅";
      return;
    }

    repartidor.setLatLng(ruta[i]);

    if (i > ruta.length * 0.8) {
      document.getElementById("estado").innerText = "Estado: Cerca del destino 📍";
    }

    i++;

  }, 150);
}