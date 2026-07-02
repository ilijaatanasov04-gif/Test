import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { CustomCategorySummary } from '../../types'
import { ConfirmDialog } from './Modal'
import { Icon } from './Icons'
import { getCategoryColor } from './helpers'
import { useToast } from './Toast'

type CategoriesSectionProps = {
  defaultCategories: string[]
  customCategorySummaries: CustomCategorySummary[]
  fetchingCategories: boolean
  categoriesFeatureEnabled: boolean
  onAddCategory: (name: string) => Promise<boolean>
  onRenameCategory: (id: string, currentName: string, nextName: string) => Promise<boolean>
  onDeleteCategory: (id: string, name: string) => Promise<boolean>
}

export function CategoriesSection({
  defaultCategories,
  customCategorySummaries,
  fetchingCategories,
  categoriesFeatureEnabled,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
}: CategoriesSectionProps) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<CustomCategorySummary | null>(null)
  const toast = useToast()

  const editingItem = useMemo(
    () => customCategorySummaries.find((item) => item.id === editingId) || null,
    [customCategorySummaries, editingId]
  )

  async function submitNewCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newCategoryName.trim()) return

    setBusyId('new')
    const ok = await onAddCategory(newCategoryName)
    setBusyId(null)

    if (ok) {
      setNewCategoryName('')
      toast.push('success', 'Category added.')
    } else {
      toast.push('error', 'Could not add that category (name may already exist).')
    }
  }

  function startEdit(item: CustomCategorySummary) {
    setEditingId(item.id)
    setEditName(item.name)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
  }

  async function saveEdit() {
    if (!editingItem) return

    setBusyId(editingItem.id)
    const ok = await onRenameCategory(editingItem.id, editingItem.name, editName)
    setBusyId(null)

    if (ok) {
      cancelEdit()
      toast.push('success', 'Category renamed.')
    } else {
      toast.push('error', 'Rename failed. Name may already be in use.')
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return

    setBusyId(pendingDelete.id)
    const ok = await onDeleteCategory(pendingDelete.id, pendingDelete.name)
    setBusyId(null)

    if (ok) {
      if (editingId === pendingDelete.id) cancelEdit()
      setPendingDelete(null)
      toast.push('success', 'Category deleted.')
    } else {
      toast.push('error', 'Could not delete category.')
    }
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Manage Categories</h2>
        {fetchingCategories ? <span className="head-meta">Loading…</span> : null}
      </div>

      <p className="small-note">Default categories stay available. Add custom ones for your own expense groups.</p>

      <div className="category-block">
        <label>Default Categories</label>
        <div className="category-chip-row">
          {defaultCategories.map((item) => (
            <span key={item} className="category-chip">
              <span className="cat-dot cat-dot-lg" style={{ background: getCategoryColor(item) }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <form className="category-form" onSubmit={submitNewCategory}>
        <div>
          <label>New custom category</label>
          <input
            type="text"
            maxLength={40}
            placeholder="e.g. Health, Travel..."
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            disabled={!categoriesFeatureEnabled || busyId === 'new'}
          />
        </div>
        <button type="submit" disabled={!categoriesFeatureEnabled || busyId === 'new' || !newCategoryName.trim()}>
          {Icon.plus} Add
        </button>
      </form>

      {!categoriesFeatureEnabled ? (
        <div className="empty-state">
          <div className="empty-icon">{Icon.folders}</div>
          <h3>Custom categories disabled</h3>
          <p>Run the latest Supabase schema to enable custom categories.</p>
        </div>
      ) : customCategorySummaries.length ? (
        <div className="table-wrap category-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Usage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customCategorySummaries.map((item) => {
                const isEditing = item.id === editingId
                const isBusy = item.id === busyId
                const usageLabel = `${item.expenseCount} expense${item.expenseCount === 1 ? '' : 's'} · ${item.recurringCount} recurring`

                return (
                  <tr key={item.id}>
                    <td data-label="Name">
                      {isEditing ? (
                        <input className="table-input" type="text" maxLength={40} value={editName} onChange={(event) => setEditName(event.target.value)} />
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <span className="cat-dot cat-dot-lg" style={{ background: getCategoryColor(item.name) }} />
                          <strong style={{ fontWeight: 600 }}>{item.name}</strong>
                        </span>
                      )}
                    </td>
                    <td data-label="Usage"><span style={{ color: 'var(--muted)' }}>{usageLabel}</span></td>
                    <td className="actions-cell">
                      <div className="row-actions">
                        {isEditing ? (
                          <>
                            <button type="button" disabled={isBusy || !editName.trim()} onClick={saveEdit}>
                              Save
                            </button>
                            <button type="button" className="ghost-btn" disabled={isBusy} onClick={cancelEdit}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button type="button" className="icon-action" disabled={Boolean(editingId) || isBusy} onClick={() => startEdit(item)} aria-label="Rename" title="Rename">
                              {Icon.edit}
                            </button>
                            <button
                              type="button"
                              className="icon-action danger"
                              disabled={Boolean(editingId) || isBusy || item.totalCount > 0}
                              onClick={() => setPendingDelete(item)}
                              aria-label="Delete"
                              title={item.totalCount > 0 ? 'Cannot delete a category that is in use' : 'Delete'}
                            >
                              {Icon.trash}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">{Icon.folders}</div>
          <h3>No custom categories yet</h3>
          <p>Create your own labels to group expenses the way you think about them.</p>
        </div>
      )}

      {categoriesFeatureEnabled ? (
        <p className="small-note">A custom category can be deleted only when it is not used by any expense or recurring rule.</p>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this category?"
        message="This removes the custom category from your category list."
        confirmLabel="Delete category"
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  )
}
