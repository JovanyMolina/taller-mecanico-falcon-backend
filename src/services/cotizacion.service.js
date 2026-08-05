const pool = require('../config/conexionbd');
const cotizacionModel = require('../models/cotizacion.model');
const cotizacionItemModel = require('../models/cotizacionItem.model');
const motocicletaService = require('./motocicleta.service');
const ApiError = require('../utils/ApiError');


function calcularTotales(items) {
  const itemsConSubtotal = items.map((item) => {
    const cantidad = item.cantidad || 1;
    const subtotal = Number((cantidad * item.precio_unitario).toFixed(2));
    return { ...item, cantidad, subtotal };
  });

  const subtotal = Number(itemsConSubtotal.reduce((acc, i) => acc + i.subtotal, 0).toFixed(2));

  const total = subtotal;

  return { itemsConSubtotal, subtotal, total };
}

function validarItems(items) {
  if (!items || items.length === 0) {
    throw new ApiError(400, 'La cotización debe tener al menos un ítem');
  }
}

async function crear({ moto_id, items, observaciones, anticipo }, creado_por) {
  await motocicletaService.obtenerPorId(moto_id); 
  validarItems(items);

  const { itemsConSubtotal, subtotal, total } = calcularTotales(items);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const cotizacionId = await cotizacionModel.crear({ moto_id, creado_por, observaciones, anticipo }, conn);

    for (const item of itemsConSubtotal) {
      await cotizacionItemModel.crear({ cotizacion_id: cotizacionId, ...item }, conn);
    }

    await cotizacionModel.actualizarTotales(cotizacionId, subtotal, total, conn);

    await conn.commit();
    return cotizacionModel.buscarPorId(cotizacionId);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function listar(filtros) {
  return cotizacionModel.listar(filtros);
}

async function obtenerPorId(id) {
  const cotizacion = await cotizacionModel.buscarPorId(id);
  if (!cotizacion) {
    throw new ApiError(404, 'Cotización no encontrada');
  }
  return cotizacion;
}

async function actualizar(id, { items, observaciones, anticipo }) {
  const cotizacion = await obtenerPorId(id);

  if (cotizacion.estado !== 'pendiente') {
    throw new ApiError(400, 'Solo se pueden editar cotizaciones en estado pendiente');
  }
  validarItems(items);

  const { itemsConSubtotal, subtotal, total } = calcularTotales(items);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await cotizacionItemModel.eliminarPorCotizacion(id, conn);
    for (const item of itemsConSubtotal) {
      await cotizacionItemModel.crear({ cotizacion_id: id, ...item }, conn);
    }

    await cotizacionModel.actualizarTotales(id, subtotal, total, conn);
    await cotizacionModel.actualizarDetalles(id, { observaciones, anticipo }, conn);

    await conn.commit();
    return cotizacionModel.buscarPorId(id);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function cambiarEstado(id, nuevoEstado) {
  const cotizacion = await obtenerPorId(id);

  if (cotizacion.estado !== 'pendiente') {
    throw new ApiError(400, `No se puede cambiar el estado de una cotización ya "${cotizacion.estado}"`);
  }

  return cotizacionModel.cambiarEstado(id, nuevoEstado);
}

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado };