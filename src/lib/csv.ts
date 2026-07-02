import type { Currency, ExpenseUpdatePayload, VisibleExpense } from '../types'
import { normalizeCurrency } from './expenseUtils'

const HEADER_ALIASES: Record<string, keyof ExpenseUpdatePayload> = {
  date: 'expense_date',
  expense_date: 'expense_date',
  'expense date': 'expense_date',
  category: 'category',
  amount: 'amount',
  total: 'amount',
  currency: 'currency',
  description: 'description',
  note: 'description',
  notes: 'description',
}

const CSV_HEADERS = ['date', 'category', 'amount', 'currency', 'description']

export type CsvImportError = {
  row: number
  reason: string
}

export type CsvImportResult = {
  rows: ExpenseUpdatePayload[]
  errors: CsvImportError[]
}

export type CsvImportOptions = {
  validCategories: string[]
  validCurrencies: readonly Currency[]
}

export function downloadExpensesCsv(expenses: VisibleExpense[]): void {
  const rows = [CSV_HEADERS.join(',')]

  for (const expense of expenses) {
    rows.push(
      [
        expense.expense_date,
        expense.category,
        expense.originalAmount.toFixed(2),
        expense.currency,
        expense.description || '',
      ]
        .map(escapeField)
        .join(',')
    )
  }

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `spendly-expenses-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function parseExpensesCsv(text: string, options: CsvImportOptions): CsvImportResult {
  const lines = splitCsvLines(text.trim())
  const errors: CsvImportError[] = []
  const rows: ExpenseUpdatePayload[] = []

  if (!lines.length) {
    return { rows, errors: [{ row: 0, reason: 'file is empty' }] }
  }

  const headers = parseCsvLine(lines[0]).map((cell) => cell.trim().toLowerCase())
  const columnMap: Partial<Record<keyof ExpenseUpdatePayload, number>> = {}
  headers.forEach((header, index) => {
    const field = HEADER_ALIASES[header]
    if (field) columnMap[field] = index
  })

  if (columnMap.expense_date === undefined || columnMap.category === undefined || columnMap.amount === undefined) {
    return {
      rows,
      errors: [{ row: 1, reason: 'is missing required columns (date, category, amount).' }],
    }
  }

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line.trim()) continue

    const cells = parseCsvLine(line)
    const rowNumber = i + 1

    const dateRaw = getCell(cells, columnMap.expense_date)
    const categoryRaw = getCell(cells, columnMap.category)
    const amountRaw = getCell(cells, columnMap.amount)
    const currencyRaw = getCell(cells, columnMap.currency)
    const descriptionRaw = getCell(cells, columnMap.description)

    if (!dateRaw || !/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) {
      errors.push({ row: rowNumber, reason: 'has an invalid date (expected YYYY-MM-DD).' })
      continue
    }

    const trimmedCategory = categoryRaw.trim()
    if (!trimmedCategory) {
      errors.push({ row: rowNumber, reason: 'is missing a category.' })
      continue
    }

    if (options.validCategories.length && !options.validCategories.includes(trimmedCategory)) {
      errors.push({ row: rowNumber, reason: `has unknown category "${trimmedCategory}".` })
      continue
    }

    const amount = Number(amountRaw.replace(/,/g, '.'))
    if (!Number.isFinite(amount) || amount <= 0) {
      errors.push({ row: rowNumber, reason: 'has an invalid amount.' })
      continue
    }

    const currency = normalizeCurrency(currencyRaw || options.validCurrencies[0])

    rows.push({
      expense_date: dateRaw,
      category: trimmedCategory,
      amount,
      currency,
      description: (descriptionRaw || '').slice(0, 200),
    })
  }

  return { rows, errors }
}

function getCell(cells: string[], index: number | undefined): string {
  if (index === undefined) return ''
  return (cells[index] ?? '').trim()
}

function escapeField(value: string | number): string {
  const stringValue = String(value ?? '')
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function splitCsvLines(text: string): string[] {
  const lines: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]
    if (ch === '"') {
      const next = text[i + 1]
      if (inQuotes && next === '"') {
        current += '""'
        i += 1
        continue
      }
      inQuotes = !inQuotes
      current += ch
      continue
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (current) lines.push(current)
      current = ''
      if (ch === '\r' && text[i + 1] === '\n') i += 1
      continue
    }

    current += ch
  }

  if (current) lines.push(current)
  return lines
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
        continue
      }
      inQuotes = !inQuotes
      continue
    }

    if (ch === ',' && !inQuotes) {
      cells.push(current)
      current = ''
      continue
    }

    current += ch
  }

  cells.push(current)
  return cells
}
