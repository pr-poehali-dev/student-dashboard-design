import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface TransactionCategory {
  name: string;
  icon: string;
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
  categories: TransactionCategory[];
  onAddCategory: (category: TransactionCategory) => void;
}

const iconOptions = ['Wallet', 'BookOpen', 'Code', 'UtensilsCrossed', 'Car', 'PartyPopper', 'Heart', 'DollarSign', 'ShoppingCart', 'Home', 'Smartphone', 'Gift'];

export const FinanceTab = ({
  transactions,
  transactionDialogOpen,
  setTransactionDialogOpen,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  deleteTransaction,
  categories,
  onAddCategory
}: FinanceTabProps) => {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("DollarSign");

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory({ name: newCategoryName, icon: newCategoryIcon });
      setNewTransaction({ ...newTransaction, category: newCategoryName });
      setNewCategoryName("");
      setNewCategoryIcon("DollarSign");
      setShowNewCategory(false);
    }
  };

  const getCategoryIcon = (categoryName: string): string => {
    const category = categories.find(c => c.name === categoryName);
    return category?.icon || "DollarSign";
  };

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
          <DialogContent className="max-w-2xl">
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
                {!showNewCategory ? (
                  <div className="flex gap-2">
                    <Select value={newTransaction.category} onValueChange={(value) => {
                      if (value === "__new__") {
                        setShowNewCategory(true);
                      } else {
                        setNewTransaction({ ...newTransaction, category: value });
                      }
                    }}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            <div className="flex items-center gap-2">
                              <Icon name={cat.icon as any} size={16} />
                              {cat.name}
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="__new__">
                          <div className="flex items-center gap-2 text-primary">
                            <Icon name="Plus" size={16} />
                            Создать новую категорию
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label>Новая категория</Label>
                      <Button variant="ghost" size="sm" onClick={() => setShowNewCategory(false)}>
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                    <Input 
                      value={newCategoryName} 
                      onChange={(e) => setNewCategoryName(e.target.value)} 
                      placeholder="Название категории"
                    />
                    <div>
                      <Label className="text-xs">Иконка</Label>
                      <div className="grid grid-cols-6 gap-2 mt-2">
                        {iconOptions.map(icon => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => setNewCategoryIcon(icon)}
                            className={`p-2 rounded-lg border-2 transition-all hover:bg-gray-50 ${
                              newCategoryIcon === icon ? 'border-primary bg-primary/10' : 'border-gray-200'
                            }`}
                          >
                            <Icon name={icon as any} size={20} className="mx-auto" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleAddNewCategory} className="w-full" size="sm">
                      Добавить категорию
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea 
                  value={newTransaction.description} 
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })} 
                  placeholder="Дополнительная информация об операции..."
                  rows={3}
                />
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
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                    <Icon name={getCategoryIcon(transaction.category) as any} size={20} className={transaction.type === "income" ? "text-green-600" : "text-red-600"} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{transaction.category}</h4>
                    {transaction.description && (
                      <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};