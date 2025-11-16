import { Usuario } from "../models/model.js";

// ---------------------------
// Types
// ---------------------------
export interface UsuarioDTO {
  nome: string;
  email: string;
  senha: string;
}

// ---------------------------
// Create User
// ---------------------------
export async function createUsuario(usuario: UsuarioDTO) {
  return Usuario.create({
    nome: usuario.nome,
    email: usuario.email,
    senha: usuario.senha,
  });
}

// ---------------------------
// Get by ID
// ---------------------------
export async function listUsuarioByID(id: number) {
  return Usuario.findOne({
    where: { usuarioID: id },
  });
}

export async function findById(id: number) {
  return Usuario.findByPk(id);
}

// ---------------------------
// Get by Email
// ---------------------------
export async function findUsuarioByEmail(email: string) {
  return Usuario.findOne({ where: { email } });
}

export async function findByEmail(email: string) {
  return Usuario.findOne({ where: { email } });
}

// ---------------------------
// Update User
// ---------------------------
export async function updateUsuario(id: number, usuario: Partial<UsuarioDTO>) {
  const [updatedRows] = await Usuario.update(
    {
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
    },
    {
      where: { usuarioID: id },
    }
  );

  if (updatedRows === 0) return null;

  return Usuario.findOne({ where: { usuarioID: id } });
}

// ---------------------------
// Delete User
// ---------------------------
export async function deleteUsuario(id: number) {
  const deletedRows = await Usuario.destroy({
    where: { usuarioID: id },
  });

  return deletedRows > 0;
}

// ---------------------------
// List All (optional)
// ---------------------------
export function listAllUsuarios() {
  return Usuario.findAll();
}
