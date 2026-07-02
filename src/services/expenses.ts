import { supabase } from '../supabase'
import type { ExpenseInsertPayload, ExpenseUpdatePayload } from '../types'

export async function getExpenses() {
  return supabase
    .from('expenses')
    .select('id, expense_date, category, amount, currency, description, recurring_expense_id')
    .order('expense_date', { ascending: true })
    .order('created_at', { ascending: true })
}

export async function createExpense(payload: ExpenseInsertPayload) {
  return supabase.from('expenses').insert(payload)
}

export async function createExpensesBulk(payload: ExpenseInsertPayload[]) {
  return supabase.from('expenses').insert(payload)
}

export async function editExpense(id: string, payload: ExpenseUpdatePayload) {
  return supabase.from('expenses').update(payload).eq('id', id)
}

export async function renameExpenseCategory(fromCategory: string, toCategory: string) {
  return supabase.from('expenses').update({ category: toCategory }).eq('category', fromCategory)
}

export async function removeExpense(id: string) {
  return supabase.from('expenses').delete().eq('id', id)
}

export async function removeExpensesByRecurringId(recurringExpenseId: string) {
  return supabase.from('expenses').delete().eq('recurring_expense_id', recurringExpenseId)
}
