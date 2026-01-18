import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('bbwqwg6kpm5ub3layqpb', 'ue1qwy91hzmhqmzq', 'txneChmMAdFnXeK8Cgg0', {
  host: 'bbwqwg6kpm5ub3layqpb-mysql.services.clever-cloud.com',
  dialect: 'mysql',
  timezone: '-04:00'
})

export default sequelize

export async function Conexiondatabase () {
  try {
    await sequelize.authenticate()
  } catch (e) {
    console.error('unable to connect to the database:', e)
  }
}
