import { useSQLiteContext } from 'expo-sqlite'
import { GoalDatabase } from './database'

export function useGoalRepository() {
  const database = useSQLiteContext()

  async function create(data: Omit<GoalDatabase, 'id'>) {
    const statement = await database.prepareAsync(
      'INSERT INTO goals (name, target) VALUES ($name, $target)'
    )

    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $target: data.target,
      })

      const insertedRowId = result.lastInsertRowId.toLocaleString()

      return { insertedRowId }
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function all() {
    try {
      const query = 'SELECT * FROM goals'
      const response = await database.getAllAsync<GoalDatabase>(query)

      return response
    } catch (error) {
      throw error
    }
  }

  async function getSummary() {
    try {
      const query = `
        SELECT 
          g.id, 
          g.name, 
          g.target, 
          COALESCE(SUM(CASE WHEN t.type = 'input' THEN t.amount ELSE -t.amount END), 0) AS current
        FROM goals g
        LEFT JOIN transactions t ON t.goal_id = g.id
        GROUP BY g.id
      `
      const response = await database.getAllAsync<GoalDatabase & { current: number }>(query)

      return response
    } catch (error) {
      throw error
    }
  }

  async function show(id: number) {
    try {
      const query = 'SELECT * FROM goals WHERE id = ?'
      const response = await database.getFirstAsync<GoalDatabase>(query, [id])

      return response
    } catch (error) {
      throw error
    }
  }

  async function update(data: GoalDatabase) {
    const statement = await database.prepareAsync(
      'UPDATE goals SET name = $name, target = $target WHERE id = $id'
    )

    try {
      await statement.executeAsync({
        $id: data.id,
        $name: data.name,
        $target: data.target,
      })
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function deleteGoal(id: number) {
    try {
      await database.runAsync('DELETE FROM transactions WHERE goal_id = ?', [id])
      await database.runAsync('DELETE FROM goals WHERE id = ?', [id])
    } catch (error) {
      throw error
    }
  }

  return {
    create,
    all,
    show,
    getSummary,
    update,
    deleteGoal,
  }
}
