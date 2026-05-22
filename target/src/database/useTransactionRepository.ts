import { useSQLiteContext } from 'expo-sqlite'
import { TransactionDatabase } from './database'

export function useTransactionRepository() {
  const database = useSQLiteContext()

  async function create(data: Omit<TransactionDatabase, 'id' | 'created_at'>) {
    const statement = await database.prepareAsync(
      'INSERT INTO transactions (goal_id, amount, type, description) VALUES ($goal_id, $amount, $type, $description)'
    )

    try {
      const result = await statement.executeAsync({
        $goal_id: data.goal_id,
        $amount: data.amount,
        $type: data.type,
        $description: data.description,
      })

      const insertedRowId = result.lastInsertRowId.toLocaleString()

      return { insertedRowId }
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function findByGoal(goalId: number) {
    try {
      const query = 'SELECT * FROM transactions WHERE goal_id = ?'
      const response = await database.getAllAsync<TransactionDatabase>(query, [
        goalId,
      ])

      return response
    } catch (error) {
      throw error
    }
  }

  return {
    create,
    findByGoal,
  }
}
