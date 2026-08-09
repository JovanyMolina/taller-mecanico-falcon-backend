const pool = require('../config/conexionbd');
const clienteModel = require('../models/cliente.model');
const motocicletaModel = require('../models/motocicleta.model');
const citaModel = require('../models/cita.model');
const configuracionService = require('../services/configuracion.service');
const ApiError = require('../utils/ApiError');

const TELEFONO_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function validarDiaLaboral(fecha) {
  const esDomingo = new Date(fecha).getUTCDay() === 0;
  if (!esDomingo) return;

  const config = await configuracionService.obtener();
  if (!config.trabaja_domingos) {
    throw new ApiError(400, 'El taller no labora los domingos');
  }
}

async function recibir({ cliente, moto, entrega }, creado_por) {
  if (!entrega?.fecha) {
    throw new ApiError(400, 'Falta la fecha estimada de entrega');
  }
  await validarDiaLaboral(entrega.fecha);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // --- Cliente ---
    let clienteFinal;
    if (cliente.id) {
      clienteFinal = await clienteModel.buscarPorId(cliente.id, conn);
      if (!clienteFinal) {
        throw new ApiError(404, 'Cliente no encontrado');
      }
    } else {
      if (!cliente.nombre || !cliente.telefono) {
        throw new ApiError(400, 'Faltan datos del cliente nuevo');
      }
      if (!TELEFONO_REGEX.test(cliente.telefono.trim())) {
        throw new ApiError(400, 'El teléfono debe tener exactamente 10 dígitos');
      }
      if (cliente.email && !EMAIL_REGEX.test(cliente.email.trim())) {
        throw new ApiError(400, 'El email no es válido');
      }
      const existente = await clienteModel.buscarPorTelefono(cliente.telefono, conn);
      if (existente) {
        throw new ApiError(409, `Ese teléfono ya pertenece a ${existente.nombre}`);
      }
      clienteFinal = await clienteModel.crear(cliente, conn);
    }

    // --- Moto ---
    let motoFinal;
    if (moto.id) {
      const motoExistente = await motocicletaModel.buscarPorId(moto.id, conn);
      if (!motoExistente) {
        throw new ApiError(404, 'Motocicleta no encontrada');
      }

      await motocicletaModel.actualizar(
        moto.id,
        {
          cliente_id: clienteFinal.id,
          marca: motoExistente.marca,
          modelo: motoExistente.modelo,
          anio: motoExistente.anio,
          placa: motoExistente.placa,
          color: motoExistente.color,
          kilometraje: moto.kilometraje || motoExistente.kilometraje,
          falla_reportada: moto.falla_reportada,
          recibido_por: creado_por,
        },
        conn
      );

      motoFinal =
        motoExistente.estado === 'entregada'
          ? await motocicletaModel.cambiarEstadoServicio(moto.id, 'recibida', conn)
          : await motocicletaModel.buscarPorId(moto.id, conn);
    } else {
      if (!moto.marca || !moto.modelo) {
        throw new ApiError(400, 'Faltan datos de la moto nueva');
      }
      if (moto.placa) {
        const existente = await motocicletaModel.buscarPorPlaca(moto.placa, conn);
        if (existente) {
          throw new ApiError(409, 'Ya existe una motocicleta registrada con esa placa');
        }
      }
      motoFinal = await motocicletaModel.crear(
        { ...moto, cliente_id: clienteFinal.id, recibido_por: creado_por },
        conn
      );
    }

    // --- Cita de entrega estimada ---
    const citaFinal = await citaModel.crear(
      {
        cliente_id: clienteFinal.id,
        moto_id: motoFinal.id,
        fecha: entrega.fecha,
        hora: entrega.hora,
        motivo: `Entrega estimada — ${motoFinal.marca} ${motoFinal.modelo}`,
        creado_por,
      },
      conn
    );

    await conn.commit();
    return { cliente: clienteFinal, moto: motoFinal, cita: citaFinal };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

module.exports = { recibir };
