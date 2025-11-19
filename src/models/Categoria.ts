import {
  Sequelize,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { Movimentacao } from "./Movimentacao.js";
import { Usuario } from "./Usuario.js";

export class Categoria extends Model<
  InferAttributes<Categoria>,
  InferCreationAttributes<Categoria>
> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare tipo: "entrada" | "saida";
  declare usuarioId: number;

  declare movimentacoes?: Movimentacao[];
  declare usuario?: Usuario;

  static initModel(sequelize: Sequelize) {
    Categoria.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nome: DataTypes.STRING,
        tipo: DataTypes.ENUM("entrada", "saida"),
        usuarioId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "usuario_id",
        },
      },
      {
        sequelize,
        tableName: "categorias",
        timestamps: true,
      }
    );
  }
}
