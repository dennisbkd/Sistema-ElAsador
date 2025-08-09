import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('dbAsador', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
})

export default sequelize

export async function Conexiondatabase () {
  try {
    await sequelize.authenticate()
  } catch (e) {
    console.error('unable to connect to the database:', e)
  }
}
