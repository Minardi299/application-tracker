import { createColumnConfigHelper } from '@/components/data-table-filter/core/filters'
import { Book, BookOpenText }from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Link as Link2,CalendarDays, CircleCheck } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';


const Statuses = [
    { value: 'Wishlist', label: 'Wishlist', icon: CircleCheck },
    { value: 'Applied', label: "Applied", icon: CircleCheck },
    { value: 'Interviewing', label: 'Interviewing', icon: CircleCheck },
    { value: 'Accepted', label: 'Accepted', icon: CircleCheck },
    { value: 'Rejected', label: 'Rejected', icon: CircleCheck },
    { value: 'Offered', label: 'Offered', icon: CircleCheck },
    { value: 'Withdrawn', label: 'Withdrawn', icon: CircleCheck },
]

const statusStyles = {
  Accepted: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300",
  Rejected: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300",
  Applied: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300",
  Wishlist: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300",
  Interviewing: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300",
  Withdrawn:"bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300",
  Offered: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300"
};
function formatUrl  (url) {
  if (!url) return "#"; 
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};
export const ApplicationColumn = [

    {
    id: "companyName",
    size: 90,
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => (
      // The `truncate` class is a Tailwind shorthand for text overflow with ellipsis
      <div className="truncate" title={row.getValue("companyName")}>
        {row.getValue("companyName")}
      </div>
    ),
    },
    {
    id: "position",
    size: 90,
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => (
      <div className="truncate" title={row.getValue("position")}>
        {row.getValue("position")}
      </div>
    ),
    },
    {
    id: "status",
    accessorKey: "status",
    size: 30,
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const style = statusStyles[status] || statusStyles["Wishlist"];
      return (
        <Badge variant="outline" className={`capitalize ${style}`}>
          {status}
        </Badge>
      );
    },
  },

    {
    id: "jobPostingUrl",
    size: 150,
    accessorKey: "jobPostingUrl",   
    header: "Link",
    cell: ({ row }) => {
      const url = row.getValue("jobPostingUrl");
      if (!url) {
        return <span className="text-muted-foreground">No link</span>;
      }
      return (
        <a
          href={formatUrl(url)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center text-blue-500 hover:underline hover:text-blue-600"
          title={url} 
        >
          <Link2 className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Open Link</span>
        </a>
      );
    }
    },
    {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => <div className="text-center">Date Added</div>,
    size: 110,
    cell: ({ row }) => {
      const dateString = row.getValue('createdAt');
      
        //Handle null, undefined, or the "zero value" date from the backend
        if (!dateString ) {
          return <div className="text-center text-muted-foreground">-</div>;
        }
        
        const date = new Date(dateString);
        
        const fullDate = format(date, 'MMM d, yyyy');
        const relativeTime = formatDistanceToNow(date, { addSuffix: true });
        
        return (
          <div className="text-center text-muted-foreground" title={fullDate}>
            {relativeTime}
          </div>
        );
      }
    },
    {
      id:'notes',
      accessorKey:'notes',
      header:()=> <div className="w-0 h-0"></div>,
      cell: ()=> <div className="w-0 h-0"></div>,
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
    dtf.option()
        .id('status')
        .accessor(row => row.status)
        .displayName('Status')
        .icon(BookOpenText)
        .options(Statuses)
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
        .icon(Link2)
        .build(),
    dtf.date()
        .id('createdAt')
        .accessor(row => row.createAt)
        .displayName('Created')
        .icon(CalendarDays)
        .build(),
];
