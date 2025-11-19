// src/models/index.ts
import { Sequelize } from "sequelize";

import { Usuario } from "./Usuario.js";
import { Categoria } from "./Categoria.js";
import { Movimentacao } from "./Movimentacao.js";
import { ArquivoMensal } from "./ArquivoMensal.js";

export function initModels(sequelize: Sequelize) {
  // Initialize tables
  Usuario.initModel(sequelize);
  Categoria.initModel(sequelize);
  Movimentacao.initModel(sequelize);
  ArquivoMensal.initModel(sequelize);

  // Associations
  Usuario.hasMany(Categoria, { foreignKey: "usuarioId" });
  Categoria.belongsTo(Usuario, { foreignKey: "usuarioId" });

  Usuario.hasMany(Movimentacao, { foreignKey: "usuarioId" });
  Movimentacao.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

  Movimentacao.belongsTo(Categoria, {
    foreignKey: "categoriaId",
    as: "categoria",
  });
  Categoria.hasMany(Movimentacao, {
    foreignKey: "categoriaId",
    as: "movimentacoes",
  });

  Usuario.hasMany(ArquivoMensal, { foreignKey: "usuarioId" });
  ArquivoMensal.belongsTo(Usuario, { foreignKey: "usuarioId" });

  ArquivoMensal.hasMany(Movimentacao, { foreignKey: "arquivoMensalId" });
  Movimentacao.belongsTo(ArquivoMensal, { foreignKey: "arquivoMensalId" });
}

export { Usuario, Categoria, Movimentacao, ArquivoMensal };
