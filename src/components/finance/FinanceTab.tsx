import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface FinanceTabProps {
  transactions: Transaction[];
  transactionDialogOpen: boolean;
  setTransactionDialogOpen: (open: boolean) => void;
  newTransaction: {
    type: "income" | "expense";
    amount: string;
    category: string;
    description: string;
    date: string;
  };
  setNewTransaction: (transaction: any) => void;
  handleAddTransaction: () => void;
  deleteTransaction: (id: string) => void;
}

export const FinanceTab = ({
  transactions,
  transactionDialogOpen,
  setTransactionDialogOpen,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  deleteTransaction
}: FinanceTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Учет финансов</h2>
        <Dialog open={transactionDialogOpen} onOpenChange={setTransactionDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={16} />
              Добавить операцию
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новая операция</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Тип</Label>
                <Select value={newTransaction.type} onValueChange={(value: "income" | "expense") => setNewTransaction({ ...newTransaction, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Доход</SelectItem>
                    <SelectItem value="expense">Расход</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Сумма</Label>
                <Input type="number" value={newTransaction.amount} onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Категория</Label>
                <Input value={newTransaction.category} onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Дата</Label>
                <Input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setTransactionDialogOpen(false)}>Отмена</Button>
              <Button onClick={handleAddTransaction}>Добавить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                  <Icon name={transaction.type === "income" ? "TrendingUp" : "TrendingDown"} size={20} className={transaction.type === "income" ? "text-green-600" : "text-red-600"} />
                </div>
                <div>
                  <h4 className="font-semibold">{transaction.category}</h4>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className={`text-xl font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "income" ? "+" : "-"}{transaction.amount.toLocaleString()} ₽
                </p>
                <Button variant="ghost" size="sm" onClick={() => deleteTransaction(transaction.id)} className="text-red-600">
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};