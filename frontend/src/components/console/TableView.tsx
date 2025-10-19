/**
 * TableView Component
 * 
 * Displays data tables with sorting, filtering, and export capabilities
 */

'use client'

import { useState, useMemo } from 'react'
import { ArrowUpDown, Search, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TableViewProps {
  data: any
}

export function TableView({ data }: TableViewProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // Extract headers and rows
  const headers = data.headers || Object.keys(data.rows?.[0] || {})
  const rows = data.rows || []

  // Filter rows by search
  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows

    return rows.filter((row: any) => {
      const rowString = Array.isArray(row) 
        ? row.join(' ').toLowerCase()
        : Object.values(row).join(' ').toLowerCase()
      
      return rowString.includes(searchQuery.toLowerCase())
    })
  }, [rows, searchQuery])

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sortColumn) return filteredRows

    return [...filteredRows].sort((a, b) => {
      const aVal = Array.isArray(a) ? a[headers.indexOf(sortColumn)] : a[sortColumn]
      const bVal = Array.isArray(b) ? b[headers.indexOf(sortColumn)] : b[sortColumn]

      // Handle numeric values
      const aNum = parseFloat(String(aVal).replace(/[$,%]/g, ''))
      const bNum = parseFloat(String(bVal).replace(/[$,%]/g, ''))

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum
      }

      // Handle string values
      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      
      if (sortDirection === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0
      }
    })
  }, [filteredRows, sortColumn, sortDirection, headers])

  // Paginate
  const paginatedRows = sortedRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleExportCSV = () => {
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...sortedRows.map((row: any) => {
        const values = Array.isArray(row)
          ? row
          : headers.map(h => row[h])
        return values.map(v => `"${v}"`).join(',')
      }),
    ].join('\n')

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search table..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Export button */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {headers.map((header: string, idx: number) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort(header)}
                >
                  <div className="flex items-center gap-2">
                    <span>{header}</span>
                    <ArrowUpDown className={cn(
                      'w-3 h-3 text-slate-400',
                      sortColumn === header && 'text-primary-600'
                    )} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-4 py-8 text-center text-slate-500">
                  No data found
                </td>
              </tr>
            ) : (
              paginatedRows.map((row: any, rowIdx: number) => (
                <tr key={rowIdx} className="hover:bg-slate-50 transition-colors">
                  {headers.map((header: string, cellIdx: number) => {
                    const value = Array.isArray(row) ? row[cellIdx] : row[header]
                    return (
                      <td key={cellIdx} className="px-4 py-3 text-slate-700">
                        {formatCellValue(value)}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
            {Math.min(currentPage * rowsPerPage, sortedRows.length)} of{' '}
            {sortedRows.length} results
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1
                
                // Show pages around current page
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      'w-8 h-8 text-sm rounded',
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'border border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Format cell values
function formatCellValue(value: any): React.ReactNode {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? '✓' : '✗'
  if (typeof value === 'number') return value.toLocaleString()
  
  // Handle percentages
  if (String(value).includes('%')) {
    return <span className="text-green-600 font-medium">{value}</span>
  }
  
  // Handle currency
  if (String(value).startsWith('$')) {
    return <span className="font-medium">{value}</span>
  }
  
  // Handle status badges
  if (['Active', 'Completed', 'Success'].includes(String(value))) {
    return (
      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
        {value}
      </span>
    )
  }
  
  if (['Pending', 'In Progress'].includes(String(value))) {
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
        {value}
      </span>
    )
  }

  return String(value)
}

