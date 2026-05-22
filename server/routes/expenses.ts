import { Hono } from "hono";
import z from "zod";
import { zValidator } from "@hono/zod-validator";


const fakeExpenses: Expense[] = [
    {
        id: 1,
        title: "Groceries",
        amount: 12500,
    },
    {
        id: 2,
        title: "Internet Subscription",
        amount: 18000,
    },
    {
        id: 3,
        title: "Electricity Bill",
        amount: 9500,
    },
    {
        id: 4,
        title: "Transport",
        amount: 7000,
    },
    {
        id: 5,
        title: "Netflix Subscription",
        amount: 5500,
    },
    {
        id: 6,
        title: "Mobile Data",
        amount: 4000,
    },
    {
        id: 7,
        title: "Lunch",
        amount: 3200,
    },
    {
        id: 8,
        title: "Fuel",
        amount: 25000,
    },
];

const expenseSchema = z.object({
    id:z.number().int().positive().min(1),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(),
})


type Expense = z.infer<typeof expenseSchema>

const createExpenseSchema = expenseSchema.omit({id:true})

export const expensesRoute = new Hono()

    // GET ALL EXPENSES
    .get("/", async (c) => {
        return c.json({
            expenses: fakeExpenses,
        });
    })
    .get('/total-spent', async(c)=> {
       const total = fakeExpenses.reduce((acc,expense)=> acc + expense.amount, 0)
       return c.json(total)
    })

    // CREATE EXPENSE
    .post(
        "/",
        zValidator("json", createExpenseSchema),
        async (c) => {
            const expense = await c.req.valid("json");

            const newExpense: Expense = {
                id: fakeExpenses.length + 1,
                ...expense,
            };

            fakeExpenses.push(newExpense);
            c.status(201)
            return c.json(
                newExpense,
            );
        }
    )

    // GET SINGLE EXPENSE
    .get("/:id{[0-9]+}", async (c) => {
        const id = Number.parseInt(c.req.param("id"));

        const expense = fakeExpenses.find(
            (expense) => expense.id === id
        );

        if (!expense) {
            return c.notFound();
        }

        return c.json({
            expense,
        });
    })

    // DELETE EXPENSE
    .delete("/:id{[0-9]+}", async (c) => {
        const id = Number.parseInt(c.req.param("id"));

        const index = fakeExpenses.findIndex(
            (expense) => expense.id === id
        );

        if (index === -1) {
            return c.notFound();
        }

        const deletedExpense = fakeExpenses.splice(index, 1)[0];

        return c.json({
            message: "Expense deleted successfully",
            expense: deletedExpense,
        });
    })

    // UPDATE EXPENSE
    .put(
        "/:id{[0-9]+}",
        zValidator("json", createExpenseSchema),
        async (c) => {
            const id = Number.parseInt(c.req.param("id"));

            const index = fakeExpenses.findIndex(
                (expense) => expense.id === id
            );

            if (index === -1) {
                return c.notFound();
            }

            const body = await c.req.valid("json");

            fakeExpenses[index] = {
                id,
                ...body,
            };

            return c.json({
                message: "Expense updated successfully",
                expense: fakeExpenses[index],
            });
        }
    );