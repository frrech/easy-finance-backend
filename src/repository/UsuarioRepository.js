import { Usuario } from "../models/model.js";

/**
 * Create a new user
 */
export async function createUsuario(usuario) {
  return await Usuario.create({
    nome: usuario.nome,
    email: usuario.email,
    senha: usuario.senha
  });
}

/**
 * Get user by ID
 */
export async function listUsuarioByID(id) {
  return await Usuario.findOne({
    where: { usuario_id: id }
  });
}

/**
 * 🔍 Get user by email (for login)
 */
export async function findUsuarioByEmail(email) {
  return await Usuario.findOne({
    where: { email }
  });
}

export async function findByEmail(email) {
  return await Usuario.findOne({ where: { email } });
}

export async function findById(usuarioID) {
  return await Usuario.findByPk(usuarioID);
}

/**
 * Update user data
 */
export async function updateUsuario(id, usuario) {
  const [updatedRows] = await Usuario.update(
    {
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha
    },
    {
      where: { usuario_id: id }
    }
  );

  if (updatedRows === 0) {
    return null; // no user found
  }

  return await Usuario.findOne({ where: { usuario_id: id } });
}

/**
 * Delete user
 */
export async function deleteUsuario(id) {
  const deletedRows = await Usuario.destroy({
    where: { usuario_id: id }
  });
  return deletedRows > 0;
}

/**
 * List all users (optional, for admin/debug)
 */
export async function listAllUsuarios() {
  return await Usuario.findAll();
}