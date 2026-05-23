import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { createFileRoute } from "@tanstack/react-router"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const Route = createFileRoute("/expenses")({
  component: Expenses,
})

async function getExpenses() {
  const res = await api.expenses.$get()

  if (!res.ok) {
    throw new Error("Server error")
  }

  return res.json()
}

function Expenses() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getExpenses,
  })

  if (error) {
    return <div>An error has occurred: {error.message}</div>
  }

  return (
    <div>
      <TableDemo data={data} isPending={isPending} />
    </div>
  )
}

export function TableDemo({
  data,
  isPending,
}: {
  data?: { expenses: any[] }
  isPending: boolean
}) {
  return (
    <Table>
      <TableCaption>A list of your recent expenses.</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-25">Id</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isPending ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : data?.expenses?.length ? (
          data.expenses.map((expense: any) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.id}</TableCell>
              <TableCell>{expense.title}</TableCell>
              <TableCell>{expense.amount}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              No expenses found
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}