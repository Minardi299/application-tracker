import { createColumnConfigHelper } from '@/components/data-table-filter/core/filters'
import { BookOpenText }from "lucide-react"

export const ApplicationColumn = [

    {
    id: "companyName",
    accessorKey: "companyName",
    header: "Company",
    },
    {
    id: "position",
    accessorKey: "position",
    header: "Position",
    },
    {
    id: "status",
    accessorKey: "status",
    header: "Status",
    },
    {
    id: "notes",
    accessorKey: "notes",
    header: "Notes",
    },
    {
        id: "jobPostingUrl",
        accessorKey: "jobPostingUrl",   
        header: "Link",
    },
];
const dtf = createColumnConfigHelper();
export const ApplicationColumnConfig = [
    dtf.text()
        .id('companyName')
        .accessor(row => row.companyName)
        .displayName('Company')
        .icon(BookOpenText)
        .build(),
    dtf.text()
        .id('position')
        .accessor(row => row.position)
        .displayName('Position')
        .icon(BookOpenText)
        .build(),
    dtf.text()
        .id('status')
        .accessor(row => row.status)
        .displayName('Status')
        .icon(BookOpenText)
        .build(),
    dtf.text()
        .id('notes')
        .accessor(row => row.notes)
        .displayName('Notes')
        .icon(BookOpenText)
        .build(),
    dtf.text()
        .id('jobPostingUrl')
        .accessor(row => row.jobPostingUrl)
        .displayName('Link')
        .icon(BookOpenText)
        .build(),
];