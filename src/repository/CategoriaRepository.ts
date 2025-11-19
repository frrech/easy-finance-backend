// src/repository/CategoriaRepository.ts
import { Categoria } from "../models/Categoria.js";

/**
 * Create a categoria tied to a given usuarioId.
 * Returns a plain object with id, nome, tipo, usuarioId.
 */
export async function createCategoria({
  nome,
  tipo,
  usuarioId,
}: {
  nome: string;
  tipo: "entrada" | "saida";
  usuarioId: number;
}) {
  const c = await Categoria.create({ nome, tipo, usuarioId });

  return {
    id: c.id,
    nome: c.nome,
    tipo: c.tipo,
    usuarioId: c.usuarioId,
  };
}

/**
 * List all categorias for a specific usuario (ordered newest first).
 */
export async function listCategoriasByUsuario(usuarioId: number) {
  const cats = await Categoria.findAll({
    where: { usuarioId },
    order: [["createdAt", "DESC"]],
  });

  return cats.map((c) => ({
    id: c.id,
    nome: c.nome,
    tipo: c.tipo,
    usuarioId: c.usuarioId,
  }));
}

/**
 * Find a single categoria by id and usuarioId.
 * Returns null if not found.
 */
export async function findCategoriaById(id: number, usuarioId: number) {
  const c = await Categoria.findOne({
    where: {
      id,
      usuarioId,
    },
  });

  if (!c) return null;

  return {
    id: c.id,
    nome: c.nome,
    tipo: c.tipo,
    usuarioId: c.usuarioId,
  };
}

/**
 * Update a categoria owned by usuarioId.
 * Returns the updated row (or null if not found).
 */
export async function updateCategoria(
  id: number,
  usuarioId: number,
  data: { nome?: string; tipo?: "entrada" | "saida" }
) {
  const categoria = await Categoria.findOne({ where: { id, usuarioId } });
  if (!categoria) return null;

  if (data.nome !== undefined) categoria.nome = data.nome;
  if (data.tipo !== undefined) categoria.tipo = data.tipo;

  await categoria.save();

  return {
    id: categoria.id,
    nome: categoria.nome,
    tipo: categoria.tipo,
    usuarioId: categoria.usuarioId,
  };
}

/**
 * Delete a categoria owned by usuarioId.
 * Returns true if deleted, false if not found.
 */
export async function deleteCategoria(id: number, usuarioId: number) {
  const deleted = await Categoria.destroy({
    where: { id, usuarioId },
  });

  return deleted > 0;
}
