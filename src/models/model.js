const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const database = require('../../db/db')

async function correctPassword(typedPassword){
    return bcrypt.compare(typedPassword, this.password)
}

const Usuario = database.define('Usuario', {
    id_usuario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    Sequelize,
    modelName: 'Usuario',
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
            user.password = await bcrypt.hash(user.password, salt);
          },
          beforeUpdate: async (user) => {
            if (user.changed('password')) { // Only hash if password field is changed
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          }
    }
})

const Categoria = database.define( 'Categoria', {
    id_categoria: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    tipo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

const Arquivo_mensal = database.define('Arquivo_mensal', {
    id_arquivo_mensal:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    creationDate:{
        type: Sequelize.DATE,
        allowNull:false,
    },
    saldo_final:{
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    caminho_arquivo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            //This regex aims to capture the filename and its extension, 
            //regardless of whether the path uses forward slashes 
            //or backslashes as separators.
            is: ["(?:.*[\\/])?([^\\/]+?\.[^\\/]+)", 'i'],
        }
    },
});

const Movimentacao = database.define('Movimentacao', {
    id_movimentacao: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    descricao:{
        type: Sequelize.STRING,
    },
    valor:{
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    data_movimentacao:{
        type: Sequelize.DATE,
        allowNull: false
    },
    transaction_type:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

Categoria.belongsToMany(Usuario, {through: 'Usuario_Categoria'});
Usuario.belongsToMany(Categoria, {through: 'Usuario_Categoria'});
Usuario.hasMany(Arquivo_mensal);
Arquivo_mensal.belongsTo(Team);
Usuario.hasMany(Movimentacao);
Movimentacao.belongsTo(Usuario);
Arquivo_mensal.hasMany(Movimentacao);
Movimentacao.belongsTo(Arquivo_mensal);
Categoria.hasMany(Movimentacao);
Movimentacao.belongsTo(Categoria);
model.exports = {
    Usuario,
    Categoria,
    Arquivo_mensal,
    Movimentacao
};