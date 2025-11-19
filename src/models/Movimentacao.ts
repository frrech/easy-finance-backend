// src/models/Movimentacao.ts
import {
  Sequelize,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";

import { Categoria } from "./Categoria.js";
import { Usuario } from "./Usuario.js";
import { ArquivoMensal } from "./ArquivoMensal.js";

export class Movimentacao extends Model<
  InferAttributes<Movimentacao>,
  InferCreationAttributes<Movimentacao>
> {
  declare id: CreationOptional<number>;
  declare descricao: string;
  declare valor: number;
  declare dataMovimentacao: Date;
  declare tipo: "entrada" | "saida";
  declare categoriaId: number;
  declare usuarioId: number;
  declare arquivoMensalId: number | null;

  // ✔ Association fields (important for TypeScript)
  declare categoria?: Categoria;
  declare usuario?: Usuario;
  declare arquivoMensal?: ArquivoMensal;

  static initModel(sequelize: Sequelize) {
    Movimentacao.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          field: "id_movimentacao",
        },
        descricao: DataTypes.STRING,
        valor: DataTypes.DECIMAL(10, 2),
        dataMovimentacao: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "data_movimentacao",
        },
        tipo: DataTypes.ENUM("entrada", "saida"),
        categoriaId: {
          type: DataTypes.INTEGER,
          field: "categoria_id",
        },
        usuarioId: {
          type: DataTypes.INTEGER,
          field: "usuario_id",
        },
        arquivoMensalId: {
          type: DataTypes.INTEGER,
          field: "arquivo_mensal_id",
        },
      },
      {
        sequelize,
        tableName: "movimentacoes",
        timestamps: true,
      }
    );
  }
}
