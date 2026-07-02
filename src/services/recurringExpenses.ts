import { supabase } from '../supabase'
import type { RecurringInsertPayload, RecurringUpdatePayload } from '../types'

export async function getRecurringExpenses() {
  return supabase
    .from('recurring_expenses')
    .select('id, name, category, amount, currency, frequency, next_due_date')
    .order('created_at', { ascending: true })
}

export async function createRecurringExpense(payload: RecurringInsertPayload) {
  return supabase.from('recurring_expenses').insert(payload)
}

export async function updateRecurringExpense(id: string, payload: RecurringUpdatePayload) {
  return supabase.from('recurring_expenses').update(payload).eq('id', id)
}

export async function renameRecurringExpenseCategory(fromCategory: string, toCategory: string) {
  return supabase.from('recurring_expenses').update({ category: toCategory }).eq('category', fromCategory)
}

export async function removeRecurringExpense(id: string) {
  return supabase.from('recurring_expenses').delete().eq('id', id)
}

export async function applyDueRecurringExpensesRpc() {
  return supabase.rpc('apply_due_recurring_expenses')
}
