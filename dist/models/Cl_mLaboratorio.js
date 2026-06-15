import Cl_sMockApi from "../services/Cl_sMockApi.js";
export default class Cl_mLaboratorio {
    examenesDisponibles = [];
    cargando = false;
    constructor() {
        this.cargarCatalogo();
    }
    async cargarCatalogo() {
        if (this.cargando)
            return;
        this.cargando = true;
        const resultado = await Cl_sMockApi.getCatalogo();
        if (resultado.ok && resultado.data && resultado.data.length > 0) {
            // Convertir el catálogo al formato que usa la app
            this.examenesDisponibles = resultado.data.map((ex) => ({
                id: ex.codigo || ex.id,
                nombre: ex.nombre,
                costo: ex.precio,
                valorReferencia: ex.valorReferencia || ""
            }));
            console.log(`Catálogo cargado: ${this.examenesDisponibles.length} exámenes`);
        }
        else {
            // Fallback: datos por defecto en caso de error de conexión
            console.warn("Usando catálogo por defecto (sin conexión a mockapi)");
            this.examenesDisponibles = [
                { id: "HEMO01", nombre: "Hemoglobina", costo: 15, valorReferencia: "" },
                { id: "GLUC02", nombre: "Glucosa", costo: 10, valorReferencia: "" },
                { id: "COL03", nombre: "Colesterol", costo: 20, valorReferencia: "" },
                { id: "UREA04", nombre: "Urea", costo: 12, valorReferencia: "" },
                { id: "CREA05", nombre: "Creatinina", costo: 18, valorReferencia: "" }
            ];
        }
        this.cargando = false;
    }
    getExamenesDisponibles() {
        return this.examenesDisponibles;
    }
    // Método para recargar el catálogo manualmente (si es necesario)
    async recargarCatalogo() {
        await this.cargarCatalogo();
    }
}
//# sourceMappingURL=Cl_mLaboratorio.js.map