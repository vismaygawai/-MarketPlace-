import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Wallet } from "lucide-react";

interface MarketplaceItemProps {
  item: {
    id: ethers.BigNumber;
    name: string;
    price: ethers.BigNumber;
    owner: string;
    isSold: boolean;
  };
  currentAccount: string;
  onPurchase: (id: ethers.BigNumber, price: string) => void;
  loading: boolean;
}

const MarketplaceItem = ({ item, currentAccount, onPurchase, loading }: MarketplaceItemProps) => {
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isOwner = item.owner.toLowerCase() === currentAccount.toLowerCase();

  return (
    <Card className="group hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 border-border overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
      <CardHeader>
        <CardTitle className="text-xl">{item.name}</CardTitle>
        <div className="flex items-center justify-between mt-2">
          <Badge variant={item.isSold ? "secondary" : "default"} className={item.isSold ? "" : "bg-gradient-to-r from-primary to-accent"}>
            {item.isSold ? "Sold" : "Available"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center py-2 px-3 bg-secondary/50 rounded-lg">
          <span className="text-muted-foreground text-sm">Price</span>
          <span className="text-2xl font-bold text-primary">
            {ethers.utils.formatEther(item.price)} ETH
          </span>
        </div>
        <div className="flex justify-between items-center py-2 px-3 bg-muted/30 rounded-lg">
          <span className="text-muted-foreground text-sm flex items-center gap-1">
            <Wallet size={14} />
            Owner
          </span>
          <span className="font-mono text-sm font-medium">{shortenAddress(item.owner)}</span>
        </div>
      </CardContent>
      <CardFooter>
        {!item.isSold && !isOwner && (
          <Button
            onClick={() => onPurchase(item.id, ethers.utils.formatEther(item.price))}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[hsl(160_70%_45%)] to-[hsl(150_75%_50%)] hover:opacity-90 transition-all duration-300"
          >
            <ShoppingCart className="mr-2" size={18} />
            Purchase
          </Button>
        )}
        {isOwner && (
          <div className="w-full py-3 bg-muted text-muted-foreground text-center font-medium rounded-lg">
            You own this item
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MarketplaceItem;
