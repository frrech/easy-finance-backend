const Sequelize = require('sequelize');
const sequelize = new Sequelize('contoso', 'root', '3@$yF1n@nc3DB', {
    dialect:'mysql', 
    host:'localhost',
    port:3306
});

module.exports = sequelize;