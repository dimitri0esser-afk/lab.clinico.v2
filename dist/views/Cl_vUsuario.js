export default class Cl_vUsuario {
    // Formularios
    divPaciente;
    divEstudios;
    divResumen;
    // Campos paciente
    inputCedula;
    inputNombre;
    inputWhatsapp;
    inputEmail;
    // Botones
    btnGuardarDatos;
    btnGuardarEstudios;
    btnSaltarEstudios;
    // Callbacks
    onGuardarDatosCallback = null;
    onGuardarEstudiosCallback = null;
    onSaltarEstudiosCallback = null;
    // Exámenes disponibles
    // Exámenes disponibles (Actualizados)
    examenesDisponibles = [
        { id: "E01", nombre: "Hemograma Completo", valorReferencia: "N/A", costo: 15.00 },
        { id: "E02", nombre: "Glucosa Basal", valorReferencia: "70 - 100 mg/dL", costo: 8.00 },
        { id: "E03", nombre: "Colesterol Total", valorReferencia: "< 200 mg/dL", costo: 10.00 },
        { id: "E04", nombre: "Triglicéridos", valorReferencia: "< 150 mg/dL", costo: 10.00 },
        { id: "E05", nombre: "Ácido Úrico", valorReferencia: "3.4 - 7.0 mg/dL", costo: 7.50 },
        { id: "E06", nombre: "Creatinina", valorReferencia: "0.7 - 1.3 mg/dL", costo: 8.50 },
        { id: "E07", nombre: "Urea", valorReferencia: "15 - 45 mg/dL", costo: 8.00 },
        { id: "E08", nombre: "Perfil Tiroideo (TSH, T3, T4)", valorReferencia: "N/A", costo: 35.00 },
        { id: "E09", nombre: "Examen General de Orina", valorReferencia: "N/A", costo: 6.00 },
        { id: "E10", nombre: "Transaminasa TGO (AST)", valorReferencia: "8 - 33 U/L", costo: 9.00 },
        { id: "E11", nombre: "Transaminasa TGP (ALT)", valorReferencia: "4 - 36 U/L", costo: 9.00 },
        { id: "E12", nombre: "Bilirrubina Total", valorReferencia: "0.1 - 1.2 mg/dL", costo: 12.00 }
    ];
    constructor() {
        this.divPaciente = document.getElementById("formularioPaciente");
        this.divEstudios = document.getElementById("formularioEstudios");
        this.divResumen = document.getElementById("resumenDatos");
        this.inputCedula = document.getElementById("cedula");
        this.inputNombre = document.getElementById("nombre");
        this.inputWhatsapp = document.getElementById("whatsapp");
        this.inputEmail = document.getElementById("email");
        this.btnGuardarDatos = document.getElementById("btnGuardarDatos");
        this.btnGuardarEstudios = document.getElementById("btnGuardarEstudios");
        this.btnSaltarEstudios = document.getElementById("btnSaltarEstudios");
        this.setupEventListeners();
        this.cargarListaExamenes();
    }
    setupEventListeners() {
        if (this.btnGuardarDatos) {
            this.btnGuardarDatos.onclick = () => {
                if (this.onGuardarDatosCallback)
                    this.onGuardarDatosCallback();
            };
        }
        if (this.btnGuardarEstudios) {
            this.btnGuardarEstudios.onclick = () => {
                if (this.onGuardarEstudiosCallback)
                    this.onGuardarEstudiosCallback();
            };
        }
        if (this.btnSaltarEstudios) {
            this.btnSaltarEstudios.onclick = () => {
                if (this.onSaltarEstudiosCallback)
                    this.onSaltarEstudiosCallback();
            };
        }
    }
    cargarListaExamenes() {
        const container = document.getElementById("listaExamenes");
        if (!container)
            return;
        container.innerHTML = "";
        this.examenesDisponibles.forEach(examen => {
            const div = document.createElement("div");
            div.className = "examen-item";
            div.innerHTML = `
        <input type="checkbox" value="${examen.id}" data-costo="${examen.costo}" data-nombre="${examen.nombre}">
        <div class="examen-info">
          <div class="examen-nombre">${examen.nombre}</div>
          <div class="examen-costo">Bs. ${examen.costo}</div>
        </div>
      `;
            const checkbox = div.querySelector("input");
            if (checkbox) {
                checkbox.addEventListener("change", () => this.actualizarTotal());
            }
            container.appendChild(div);
        });
        this.actualizarTotal();
    }
    actualizarTotal() {
        const checkboxes = document.querySelectorAll("#listaExamenes input:checked");
        let total = 0;
        checkboxes.forEach((cb) => {
            total += parseInt(cb.dataset.costo || "0");
        });
        const totalSpan = document.getElementById("totalMonto");
        if (totalSpan)
            totalSpan.textContent = `Bs. ${total}`;
    }
    getDatosPaciente() {
        return {
            cedula: this.inputCedula?.value.trim() || "",
            nombre: this.inputNombre?.value.trim() || "",
            whatsapp: this.inputWhatsapp?.value.trim() || "",
            email: this.inputEmail?.value.trim() || ""
        };
    }
    getEstudiosSeleccionados() {
        const checkboxes = document.querySelectorAll("#listaExamenes input:checked");
        const estudios = [];
        checkboxes.forEach((cb) => {
            estudios.push({
                id: cb.value,
                nombre: cb.dataset.nombre,
                costo: parseInt(cb.dataset.costo)
            });
        });
        return estudios;
    }
    mostrarMensaje(mensaje, tipo) {
        const mensajeDiv = document.getElementById("mensaje");
        if (mensajeDiv) {
            mensajeDiv.textContent = mensaje;
            mensajeDiv.className = `mensaje ${tipo}`;
            mensajeDiv.style.display = "block";
            setTimeout(() => {
                mensajeDiv.style.display = "none";
            }, 3000);
        }
    }
    mostrarResumen(datos) {
        const divDatos = document.getElementById("datosGuardados");
        const divEstudios = document.getElementById("estudiosGuardados");
        const divTotal = document.getElementById("totalGuardado");
        if (divDatos && datos.paciente) {
            divDatos.innerHTML = `
        <p><strong> Nombre:</strong> ${datos.paciente.nombre}</p>
        <p><strong> Cédula:</strong> ${datos.paciente.cedula}</p>
        <p><strong> WhatsApp:</strong> ${datos.paciente.whatsapp}</p>
        ${datos.paciente.email ? `<p><strong> Email:</strong> ${datos.paciente.email}</p>` : ""}
      `;
        }
        if (divEstudios && datos.examenes) {
            if (datos.examenes.length > 0) {
                let html = '<p><strong>Exámenes solicitados:</strong></p><ul>';
                datos.examenes.forEach((e) => {
                    html += `<li>${e.nombre} - Bs. ${e.costo}</li>`;
                });
                html += "</ul>";
                divEstudios.innerHTML = html;
            }
            else {
                divEstudios.innerHTML = "<p><em>No seleccionó exámenes aún</em></p>";
            }
        }
        if (divTotal && datos.total !== undefined) {
            divTotal.innerHTML = `<div class="total"><h3>Total</h3><div class="monto">Bs. ${datos.total}</div></div>`;
        }
    }
    limpiarFormulario() {
        if (this.inputCedula)
            this.inputCedula.value = "";
        if (this.inputNombre)
            this.inputNombre.value = "";
        if (this.inputWhatsapp)
            this.inputWhatsapp.value = "";
        if (this.inputEmail)
            this.inputEmail.value = "";
        const checkboxes = document.querySelectorAll("#listaExamenes input");
        checkboxes.forEach((cb) => {
            cb.checked = false;
        });
        this.actualizarTotal();
    }
    onGuardarDatos(callback) {
        this.onGuardarDatosCallback = callback;
    }
    onGuardarEstudios(callback) {
        this.onGuardarEstudiosCallback = callback;
    }
    onSaltarEstudios(callback) {
        this.onSaltarEstudiosCallback = callback;
    }
    mostrarFormularioPaciente() {
        if (this.divPaciente)
            this.divPaciente.style.display = "block";
        if (this.divEstudios)
            this.divEstudios.style.display = "none";
        if (this.divResumen)
            this.divResumen.style.display = "none";
    }
    mostrarFormularioEstudios() {
        if (this.divPaciente)
            this.divPaciente.style.display = "none";
        if (this.divEstudios)
            this.divEstudios.style.display = "block";
        if (this.divResumen)
            this.divResumen.style.display = "none";
    }
    mostrarResumenVista() {
        if (this.divPaciente)
            this.divPaciente.style.display = "none";
        if (this.divEstudios)
            this.divEstudios.style.display = "none";
        if (this.divResumen)
            this.divResumen.style.display = "block";
    }
}
//# sourceMappingURL=Cl_vUsuario.js.map