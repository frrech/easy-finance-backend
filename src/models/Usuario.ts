import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize
} from "sequelize";

import bcrypt from "bcryptjs";
import { Categoria } from "./Categoria.js";
import { Movimentacao } from "./Movimentacao.js";
import { ArquivoMensal } from "./ArquivoMensal.js";

export class Usuario extends Model<
  InferAttributes<Usuario>,
  InferCreationAttributes<Usuario>
> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare email: string;
  declare senha: string;

  declare categorias?: Categoria[];
  declare movimentacoes?: Movimentacao[];
  declare arquivosMensais?: ArquivoMensal[];

  async correctPassword(typed: string): Promise<boolean> {
    return bcrypt.compare(typed, this.senha);
  }

  static initModel(sequelize: Sequelize) {
    Usuario.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: { isEmail: true },
        },
        senha: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "usuarios",
        timestamps: true,
        hooks: {
          async beforeCreate(user) {
            user.senha = await bcrypt.hash(user.senha.trim(), 10);
          },
          async beforeUpdate(user) {
            if (user.changed("senha")) {
              user.senha = await bcrypt.hash(user.senha.trim(), 10);
            }
          },
        },
      }
    );
  }
}
