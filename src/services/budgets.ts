import { supabase } from '../supabase'
import type { BudgetInsertPayload, BudgetUpdatePayload } from '../types'

export async function getBudgets() {
  return supabase
    .from('budgets')
    .select('id, category, amount, currency')
    .order('created_at', { ascending: true })
}

export async function createBudget(payload: BudgetInsertPayload) {
  return supabase.from('budgets').insert(payload)
}

export async function updateBudget(id: string, payload: BudgetUpdatePayload) {
  return supabase.from('budgets').update(payload).eq('id', id)
}

export async function removeBudget(id: string) {
  return supabase.from('budgets').delete().eq('id', id)
}

export async function renameBudgetCategory(fromCategory: string, toCategory: string) {
  return supabase.from('budgets').update({ category: toCategory }).eq('category', fromCategory)
}
