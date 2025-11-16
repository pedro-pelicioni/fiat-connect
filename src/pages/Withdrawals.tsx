import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft } from "lucide-react";

interface WithdrawalTransaction {
  id: string;
  amount: number;
  currency: string;
  network: string;
  date: string;
  hash: string;
}

const mockWithdrawals: WithdrawalTransaction[] = [
  {
    id: "w1",
    amount: 150.00,
    currency: "USDC",
    network: "BSC",
    date: "2025-01-15 14:32",
    hash: "0x742d...3a1f"
  },
  {
    id: "w2",
    amount: 220.00,
    currency: "USDC",
    network: "Ethereum",
    date: "2025-01-14 10:23",
    hash: "0x5e7d...9b4f"
  },
  {
    id: "w3",
    amount: 89.99,
    currency: "USDT",
    network: "BSC",
    date: "2025-01-13 18:56",
    hash: "0x3c2b...6a5d"
  }
];

const Withdrawals = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Withdrawals</h1>
        <p className="text-muted-foreground">Manage and process validated transactions</p>
      </div>

      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle>Available for Withdrawal</CardTitle>
          <CardDescription>Validated transactions ready to withdraw to your bank account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockWithdrawals.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-success/10 text-success">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">Validated Payment</p>
                      <Badge className="bg-success text-success-foreground">Ready</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tx.network} • {tx.date}
                    </p>
                    <code className="text-xs text-muted-foreground">{tx.hash}</code>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-lg font-bold text-success">
                      ${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">{tx.currency}</p>
                  </div>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Withdraw
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Withdrawals;
