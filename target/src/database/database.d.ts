export type GoalDatabase = {
  id: number
  name: string
  target: number
}

export type TransactionDatabase = {
  id: number
  goal_id: number
  amount: number
  type: 'input' | 'output'
  description: string
  created_at: string
}
