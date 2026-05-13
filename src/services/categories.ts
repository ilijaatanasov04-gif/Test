import { supabase } from '../supabase'

export async function getCategories() {
  return supabase.from('categories').select('id, name').order('created_at', { ascending: true })
}

export async function createCategory(payload) {
  return supabase.from('categories').insert(payload)
}

export async function updateCategory(id, payload) {
  return supabase.from('categories').update(payload).eq('id', id)
}

export async function removeCategory(id) {
  return supabase.from('categories').delete().eq('id', id)
}
