import { supabase } from '../supabase'
import type { CategoryInsertPayload, CategoryUpdatePayload } from '../types'

export async function getCategories() {
  return supabase.from('categories').select('id, name').order('created_at', { ascending: true })
}

export async function createCategory(payload: CategoryInsertPayload) {
  return supabase.from('categories').insert(payload)
}

export async function updateCategory(id: string, payload: CategoryUpdatePayload) {
  return supabase.from('categories').update(payload).eq('id', id)
}

export async function removeCategory(id: string) {
  return supabase.from('categories').delete().eq('id', id)
}
