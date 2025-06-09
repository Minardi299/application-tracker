import {useState, useMemo}  from "react"
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "@/components/ui/datatable-pagination"
import { toast } from "sonner"
 import { createTSTFilters, createTSTColumns} from "@/components/data-table-filter/integrations/tanstack-table/index"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { ColumnsIcon, ChevronDownIcon } from  "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import  {  DataTableFilter  } from "@/components/data-table-filter/components/data-table-filter"
import { useDataTableFilters } from '@/components/data-table-filter'
import exportToCsv from "tanstack-table-export-to-csv";

export function DataTable({columnDef, filterColumnConfig, data, onEdit, canExportToCSV}) {
  const { columns, filters, actions, strategy } = useDataTableFilters({
    strategy: 'client',       
    data: data ?? [], 
    columnsConfig: filterColumnConfig,          
  });
  const tstColumns = useMemo( 
    () =>
      createTSTColumns({  
        columns: columnDef,
        configs: columns,
      }), 
    [columns], 
  ) 
  const tstFilters = useMemo(() => createTSTFilters(filters), [filters]) ;
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const table = useReactTable({
    data: data,
    columns : tstColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting: sorting,
      columnFilters: tstFilters ,
      columnVisibility: columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  const handleExportToCSV = () => {
    const headers = table
    .getHeaderGroups()
    .map((x) => x.headers)
    .flat();

  const rows = table.getFilteredRowModel().rows;

  const randomString = Math.random().toString(36).substring(8);
  exportToCsv(`filtered-data-${randomString}`, headers, rows);
  };
  return (
    <div>      
        <div className="flex items-center py-4 px-4 gap-4">
        
          <DataTableFilter
          filters={filters}
          columns={columns}
          actions={actions}
          strategy={strategy}
          /> 
          {canExportToCSV && <Button 
            onClick={handleExportToCSV}
            className="bg-green-600 hover:bg-green-800 "
          >
            Export to CSV
          </Button>}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button  className="ml-auto">
              <ColumnsIcon />
              <span className=" lg:inline">Customize Columns</span>
              <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">           
              {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={()=>toast.info("to implement")}>Add +</Button>
        </div>
        <div  className="max-w-full overflow-x-auto">
          
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow  key={headerGroup.id} className="bg-background hover:bg-transparent cursor-default">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="px-4 py-2 text-center">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow className={`border-accent-foreground/50  data-[state=selected]:bg-accent-foreground/20
                      ${onEdit ? 'cursor-pointer hover:bg-accent/100' : ''}`}
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                        if (onEdit) {
                          onEdit(row.original);
                        }
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}  className="px-4 py-2 text-center">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={tstColumns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          
        </div>
 
      
      <DataTablePagination table={table} />
    </div>
  )

}