import * as CategoriaService from "../services/CategoriaService.js";

export async function createCategoria(req, res) {
  try {
    const newCategoria = await CategoriaService.createCategoria(req.body);
    return res.status(201).json(newCategoria);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Erro interno do servidor" });
  }
}

export async function listCategorias(req, res) {
  try {
    const categorias = await CategoriaService.listCategorias();
    return res.status(200).json(categorias);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Erro interno do servidor" });
  }
}

export async function listCategoriaById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const categoria = await CategoriaService.getCategoriaById(id);
    if (!categoria)
      return res.status(404).json({ message: "Categoria não encontrada" });
    return res.status(200).json(categoria);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Erro interno do servidor" });
  }
}

export async function updateCategoria(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const categoriaData = req.body;
    const updatedCategoria = await CategoriaService.updateCategoria(id, categoriaData);
    return res.status(200).json(updatedCategoria);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Erro interno do servidor" });
  }
}

export async function deleteCategoria(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    await CategoriaService.deleteCategoria(id);
    return res.status(204).send();
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Erro interno do servidor" });
  }
}

export async function listCategoriasByUsuario(req, res) {
  try {
    const usuario_id = parseInt(req.params.usuario_id, 10);
    const categorias = await CategoriaService.listCategoriasByUsuario(usuario_id);
    if (!categorias || categorias.length === 0) {
      return res.status(404).json({ message: "Nenhuma categoria encontrada para este usuário" });
    }
    return res.status(200).json(categorias);
  } catch (err) {
    console.error("Erro ao buscar categorias por usuário:", err);
    return res.status(500).json({ message: "Erro interno ao buscar categorias" });
  }
}
