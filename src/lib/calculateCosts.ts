import { CONSTANTS, PRECIO_ACCESORIO } from "./calculations";
import { ProjectState, CostBreakdown } from "./types";


export const calculateCosts = (state: ProjectState): CostBreakdown => {
    let areaTotalM2 = 0;
    let perimetroTotalMl = 0;
    let costoHerrajes = 0;

    let totalModulos = 0;
    let totalBisagras = 0;
    let totalCorrederas = 0;
    let totalTiradores = 0;
    let totalPuertas = 0;
    let totalCajones = 0;

    state.modulos.forEach(modulo => {
        // Area calculations (in mm -> m2)
        // Laterales (2)
        let areaModuloMm2 = 2 * (modulo.alto * state.medidas.profundidad);

        // Base (1)
        areaModuloMm2 += (modulo.ancho * state.medidas.profundidad);

        // Amarres (2)
        areaModuloMm2 += 2 * (modulo.ancho * 100);

        // Tapa superior
        if (state.medidas.considerarTapaSuperior) {
            areaModuloMm2 += (modulo.ancho * state.medidas.profundidad);
        }

        // Fondo
        if (state.medidas.considerarFondo) {
            areaModuloMm2 += (modulo.ancho * modulo.alto * 0.2); // Assumed 3mm standard or full melamine, using same price for simplicity
        }

        // Divisiones
        areaModuloMm2 += modulo.divisionesHorizontales * (modulo.ancho * (state.medidas.profundidad - 50));
        areaModuloMm2 += modulo.divisionesVerticales * (modulo.alto * (state.medidas.profundidad - 50));

        // Cajones (solo frentes para el calculo rapido o todo el cajon? Vamos a usar frente + estructura base)
        // Simplification: cajon depth = profundidad - 50mm, width = ancho - 26mm
        modulo.cajones.forEach(c => {
            areaModuloMm2 += ((modulo.ancho - 26) * c.altura); // frente
            areaModuloMm2 += 2 * (c.altura * (state.medidas.profundidad - 50)); // laterales cajon
            areaModuloMm2 += ((modulo.ancho - 26) * c.altura); // trasera
            areaModuloMm2 += ((modulo.ancho - 26) * (state.medidas.profundidad - 50)) * 0.2; // fondo cajon
            areaModuloMm2 += (modulo.ancho * (c.altura + 10)); // tapa cajon;
        });

        // Puertas
        if (modulo.cantidadPuertas > 0) {
            areaModuloMm2 += (modulo.ancho * modulo.alto); // area of doors combined
        }

        const areaM2 = (areaModuloMm2 / 1000000) * modulo.cantidad;
        areaTotalM2 += areaM2;

        // Perimetro roughly based on areas (sqrt * 4 rule of thumb)
        const perimetroMl = (Math.sqrt(areaModuloMm2 / 1000000) * 4) * modulo.cantidad;
        perimetroTotalMl += perimetroMl;

        // Herrajes per module
        totalModulos += modulo.cantidad;
        totalPuertas += modulo.cantidadPuertas * modulo.cantidad;
        totalCajones += modulo.cantidadCajones * modulo.cantidad;

        const bisagrasPorPuerta = modulo.alto > 1500 ? 4 : modulo.alto > 900 ? 3 : 2;
        const bisagras = modulo.cantidadPuertas * bisagrasPorPuerta * modulo.cantidad;
        totalBisagras += bisagras;

        const costoBisagra = modulo.tipoBisagra === "Cierre suave" ? CONSTANTS.BISAGRA_CIERRE_SUAVE : CONSTANTS.BISAGRA_STANDARD;
        costoHerrajes += bisagras * costoBisagra;

        const correderas = modulo.cantidadCajones * modulo.cantidad;
        totalCorrederas += correderas;
        const costoCorredera = modulo.tipoCorredera === "Cierre suave" ? CONSTANTS.CORREDERA_CIERRE_SUAVE :
            modulo.tipoCorredera === "Telescópica push open" ? CONSTANTS.CORREDERA_PUSH_OPEN :
                CONSTANTS.CORREDERA_STANDARD;
        costoHerrajes += correderas * costoCorredera;

        const tiradores = (modulo.tipoTirador !== "Sin tirador (push open)" && modulo.tipoTirador !== "Tirador oculto")
            ? (modulo.cantidadPuertas + modulo.cantidadCajones) * modulo.cantidad : 0;

        totalTiradores += tiradores;

        const costoTirador = modulo.tipoTirador === "Tirador barra" ? CONSTANTS.TIRADOR_BARRA :
            modulo.tipoTirador === "Tirador botón" ? CONSTANTS.TIRADOR_BOTON :
                modulo.tipoTirador === "Sin tirador (push open)" ? CONSTANTS.TIRADOR_PUSH_OPEN :
                    CONSTANTS.TIRADOR_OCULTO;

        costoHerrajes += (modulo.cantidadPuertas + modulo.cantidadCajones) * costoTirador * modulo.cantidad;
    });

    // Global Zócalo
    if (state.medidas.zocalo) {
        const areaZocaloM2 = (state.medidas.anchoTotal * state.medidas.alturaZocalo) / 1000000 * 3;
        areaTotalM2 += areaZocaloM2;
    }

    // Precio del tablero según el color elegido
    const isDiseno = state.medidas.color === "Diseño";
    const precioTableroM2 = isDiseno
        ? CONSTANTS.PRECIO_MELAMINA_DISENO_M2
        : CONSTANTS.PRECIO_MELAMINA_M2;
    const costoTableros = areaTotalM2 * precioTableroM2;

    // Canteado lineal
    const canteadoAplicar = perimetroTotalMl * (state.medidas.porcentajeCanteado / 100);
    const costoCantos = canteadoAplicar * CONSTANTS.PRECIO_CANTO_ML;

    // Recargo por RH (Resistente a la humedad) — solo aplica a tableros y cantos
    let costoRH = 0;
    if (state.medidas.rh) {
        const recargoRH = isDiseno
            ? CONSTANTS.RECARGO_RH_DISENO
            : CONSTANTS.RECARGO_RH_BLANCO;
        costoRH = (costoTableros + costoCantos) * recargoRH;
    }

    const costoMateriales = costoTableros + costoCantos + costoHerrajes + costoRH;

    // Mano de Obra
    let costoManoObra = 0;
    if (state.manoObra.tipo === "Fija") {
        costoManoObra = state.manoObra.montoFijo || 0;
    } else if (state.manoObra.tipo === "Porcentaje") {
        costoManoObra = costoMateriales * ((state.manoObra.porcentaje || 0) / 100);
    } else {
        // Calculado
        costoManoObra += totalModulos * (state.manoObra.tarifaArmado || 0);
        costoManoObra += (totalBisagras + totalCorrederas + totalTiradores) * (state.manoObra.tarifaInstalacionHerrajes || 0);
        costoManoObra += (state.manoObra.diasInstalacion || 0) * (state.manoObra.tarifaDiasInstalacion || 0);
        costoManoObra += (totalPuertas + totalCajones) * (state.manoObra.tarifaAjusteFino || 0);
    }

    // Adicionales del proyecto
    const costoTransporte = state.adicionales.transporte || 0;
    const costoLED = (state.adicionales.metrosLED || 0) * CONSTANTS.PRECIO_LED_ML;

    const ad = state.adicionales;
    const costoAccesorios =
        (ad.canastillas.cantidad || 0) * PRECIO_ACCESORIO.canastillas[ad.canastillas.material] +
        (ad.condimentero.cantidad || 0) * PRECIO_ACCESORIO.condimentero[ad.condimentero.material] +
        (ad.escurridor.cantidad || 0) * PRECIO_ACCESORIO.escurridor[ad.escurridor.material];

    // Subtotal del proyecto antes de recargos
    const subtotalProyecto = costoMateriales + costoManoObra + costoTransporte + costoLED + costoAccesorios;

    // Recargo por urgencia y trabajo en altura (aplican a la sumatoria de todo el proyecto)
    const costoUrgencia = state.adicionales.recargoUrgencia
        ? subtotalProyecto * CONSTANTS.RECARGO_URGENCIA
        : 0;
    const costoAltura = state.adicionales.trabajoAltura
        ? CONSTANTS.TRABAJO_ALTURA_FIJO
        : 0;

    const subtotalConRecargos = subtotalProyecto + costoUrgencia + costoAltura;
    const costoImprevistos = subtotalConRecargos * ((state.adicionales.porcentajeImprevistos || 0) / 100);
    const costoTotalEst = subtotalConRecargos + costoImprevistos;

    const precioVenta = costoTotalEst * (1 + (state.margen || 0) / 100);
    const pesoEstimado = areaTotalM2 * CONSTANTS.PESO_KG_M2;
    const diasEstimados = Math.max(1, Math.ceil(totalModulos / 2));

    return {
        areaTotal: areaTotalM2,
        costoTableros,
        perimetroTotal: perimetroTotalMl,
        costoCantos,
        costoHerrajes,
        costoRH,
        costoManoObra,
        costoMateriales,
        costoTransporte,
        costoLED,
        costoAccesorios,
        costoUrgencia,
        costoAltura,
        costoImprevistos,
        costoTotalEst,
        precioVenta,
        pesoEstimado,
        diasEstimados
    };
};
