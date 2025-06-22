// app.js

// Página index.html
if (window.location.pathname.includes("index.html")) {
  window.guardarNombre = function () {
    const nombre = document.getElementById('inputNombre').value.trim();
    if (nombre !== "") {
      localStorage.setItem("ecoUsuario", nombre);
      window.location.href = "menu.html";
    } else {
      alert("Por favor, ingresa tu nombre.");
    }
  }
}

// Página menu.html
if (window.location.pathname.includes("menu.html")) {
  const usuario = localStorage.getItem("ecoUsuario") || "Usuario";
  document.getElementById("nombreUsuario").textContent = "Hola, " + usuario;

  const tareas = [
    "Regar Plantas", "Tirar Basura", "Reutilizar Materiales", "Plantar Árboles",
    "Separar Residuos Orgánicos", "Separar Residuos Inorgánicos",
    "Cuidar el Pasto y Áreas Verdes", "Participar en Creación de Composta",
    "Recoger Basura de Áreas Verdes"
  ];

  tareas.forEach(t => {
    const btn = document.createElement("button");
    btn.className = "boton";
    btn.innerText = t;
    btn.onclick = () => seleccionarTarea(t);
    document.getElementById("tareasContainer").appendChild(btn);
  });

  function seleccionarTarea(tarea) {
    localStorage.setItem("ecoTarea", tarea);
    window.location.href = "camara.html";
  }

  window.irAHistorial = () => window.location.href = "historial.html";
}

// Página camara.html
if (window.location.pathname.includes("camara.html")) {
  let stream;
  const usuario = localStorage.getItem("ecoUsuario") || "Usuario";
  const tarea = localStorage.getItem("ecoTarea") || "Tarea";
  document.getElementById("tituloTarea").textContent = `Tarea: ${tarea}`;

  iniciarCamara();

  function iniciarCamara() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } }
    })
    .then(s => {
      stream = s;
      video.srcObject = stream;
    })
    .catch(() => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          stream = s;
          video.srcObject = stream;
        })
        .catch(() => alert("No se pudo acceder a la cámara."));
    });
  }

  window.capturar = function () {
    const canvas = document.getElementById('canvas');
    const video = document.getElementById('video');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const dataURL = canvas.toDataURL('image/png');

    let historial = JSON.parse(localStorage.getItem("ecoHistorial") || "[]");
    historial.push({ tarea, imagen: dataURL, fecha: new Date().toLocaleString() });
    localStorage.setItem("ecoHistorial", JSON.stringify(historial));

    detenerCamara();
    alert("¡Tarea guardada exitosamente!");
    window.location.href = "menu.html";
  }

  function detenerCamara() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    document.getElementById('video').srcObject = null;
  }

  window.volverAlMenu = () => {
    detenerCamara();
    window.location.href = "menu.html";
  }
}

// Página historial.html
if (window.location.pathname.includes("historial.html")) {
  window.mostrarHistorial = function () {
    const contenedor = document.getElementById("historialFotos");
    const historial = JSON.parse(localStorage.getItem("ecoHistorial") || "[]");
    contenedor.innerHTML = "";

    if (historial.length === 0) {
      contenedor.innerHTML = '<p>No hay tareas guardadas aún.</p>';
    } else {
      historial.forEach((item, index) => {
        const div = document.createElement("div");
        div.style.marginBottom = "20px";
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.borderRadius = "8px";
        div.innerHTML = `
          <p><strong>${item.tarea}</strong> <em>${item.fecha || ''}</em></p>
          <img src="${item.imagen}" class="imagenGuardada" style="max-width:100%; height:auto;">
          <br>
          <button class="boton" style="background-color:#e74c3c; margin-top:8px;" onclick="borrarTarea(${index})">Borrar</button>
        `;
        contenedor.appendChild(div);
      });
    }
  }

  window.borrarTarea = function (indice) {
    let historial = JSON.parse(localStorage.getItem("ecoHistorial") || "[]");
    historial.splice(indice, 1);
    localStorage.setItem("ecoHistorial", JSON.stringify(historial));
    mostrarHistorial();
  }

  window.volverAlMenu = () => window.location.href = "menu.html";

  window.onload = mostrarHistorial;
}
