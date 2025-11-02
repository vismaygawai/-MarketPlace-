import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft } from "lucide-react";

interface OwnedItemProps {
  item: {
    id: ethers.BigNumber;
    name: string;
    price: ethers.BigNumber;
    owner: string;
  };
  onTransfer: (id: ethers.BigNumber, address: string) => void;
  loading: boolean;
}

const OwnedItem = ({ item, onTransfer, loading }: OwnedItemProps) => {
  const [transferAddress, setTransferAddress] = useState("");

  const handleTransfer = () => {
    onTransfer(item.id, transferAddress);
    setTransferAddress("");
  };

  return (
    <Card className="hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 border-border overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
      <CardHeader>
        <CardTitle className="text-xl">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center py-2 px-3 bg-accent/10 rounded-lg">
          <span className="text-muted-foreground text-sm">Value</span>
          <span className="text-2xl font-bold text-accent">
            {ethers.utils.formatEther(item.price)} ETH
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`transfer-${item.id}`} className="text-sm">Transfer to Address</Label>
          <Input
            id={`transfer-${item.id}`}
            type="text"
            value={transferAddress}
            onChange={(e) => setTransferAddress(e.target.value)}
            placeholder="0x..."
            className="font-mono text-sm transition-all duration-200 focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleTransfer}
          disabled={loading || !transferAddress}
          className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-all duration-300"
        >
          <ArrowRightLeft className="mr-2" size={18} />
          Transfer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OwnedItem;
