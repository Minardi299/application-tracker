import {useState, useMemo}  from "react"
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "@/components/ui/datatable-pagination"
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
import { Settings2, ChevronDownIcon } from  "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import  {  DataTableFilter  } from "@/components/data-table-filter/components/data-table-filter"
import { useDataTableFilters } from '@/components/data-table-filter'
import exportToCsv from "tanstack-table-export-to-csv";
import { useGlobalSheet } from "@/context/sheet-provider";
import { ApplicationForm } from "@/components/forms/application-form"
export function DataTable({columnDef, filterColumnConfig, data, canExportToCSV}) {
  const { openSheet } = useGlobalSheet();
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
              <Settings2 />
              <p className=" lg:inline">View</p>
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
          onClick={() => openSheet({
            render: () => <ApplicationForm mode="create" />,
            title: "New Application",
            description: "Track a new job application.",
          })}>Add +</Button>
        </div>
        <div  className="max-w-full overflow-x-auto">
                <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow  key={headerGroup.id} className=" bg-background hover:bg-transparent cursor-default">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="px-4 py-2 text-center bg-accent">
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
                    <TableRow className=" rounded-md border-muted data-[state=selected]:bg-accent-foreground/20 cursor-pointer hover:bg-muted"
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                        openSheet({
                                render: () => <ApplicationForm mode="edit" data={row.original} />,
                                title: `${row.original.position} at ${row.original.companyName}`,
                                description: `Editing ${row.original.id}.`,
                              })
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}  className="px-4 py-4 text-center">
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
        </div>
 
      
      <DataTablePagination table={table} />
    </div>
  )

}