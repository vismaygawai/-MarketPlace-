import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface ListItemFormProps {
  onListItem: (name: string, price: string) => Promise<void>;
  loading: boolean;
}

const ListItemForm = ({ onListItem, loading }: ListItemFormProps) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onListItem(itemName, itemPrice);
    setItemName("");
    setItemPrice("");
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="text-primary" size={24} />
          List New Item
        </CardTitle>
        <CardDescription>Create a new listing on the marketplace</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="itemPrice">Price (ETH)</Label>
            <Input
              id="itemPrice"
              type="number"
              step="0.001"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              placeholder="0.00"
              required
              min="0.001"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {loading ? "Processing..." : "List Item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ListItemForm;
