import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "./lib/api";
import use

function App() {
  const totalSpent = use(api.expenses['total-spent'].$get)

  const [totalSpent, setTotalSpent] = useState(0);


  // useEffect(()=> {
  //   async function fetchTotal() {
  //    const res = await api.expenses["total-spent"].$get()
  //    const data = await res.json()
  //    console.log(data)
  //    setTotalSpent(data)
  //   }
  //   fetchTotal()
  // },[])

  return (
    
      <Card className="w-120">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{totalSpent.toString()}</p>
        </CardContent>
      </Card>
    
  );
}

export default App;
