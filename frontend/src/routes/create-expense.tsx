import { createFileRoute,useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { api } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createFileRoute("/create-expense")({
  component: CreateExpense,
})

function CreateExpense() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: "",
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      console.log({
        ...value,
        amount: Number(value.amount),
      })
      const res = await api.expenses.$post({json:value})
      if(!res.ok){
        throw new Error('Server error')
      }
      navigate({to:"/expenses"})
      // reset after submit
      form.reset()
    },
  })

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Expense</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            {/* TITLE FIELD */}
            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Title is required" : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Groceries"
                  />

                  {field.state.meta.errors?.length ? (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            {/* AMOUNT FIELD */}
            <form.Field
  name="amount"
  validators={{
    onChange: ({ value }) =>
      value === undefined || value === null || value === 0
        ? "Amount is required"
        : isNaN(Number(value))
        ? "Must be a number"
        : undefined,
  }}
>
  {(field) => (
    <div className="space-y-2">
      <Label htmlFor={field.name}>Amount</Label>

      <Input
        id={field.name}
        type="number"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        placeholder="e.g. 5000"
      />

      {field.state.meta.errors?.length ? (
        <p className="text-sm text-red-500">
          {field.state.meta.errors[0]}
        </p>
      ) : null}
    </div>
  )}
</form.Field>

            {/* SUBMIT BUTTON */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "Adding..." : "Add Expense"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}