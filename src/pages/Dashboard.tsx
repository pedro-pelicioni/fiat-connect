import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, LogOut, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import merchantQR from "@/assets/merchant-qr.png";

const Dashboard = () => {
  const navigate = useNavigate();

  const totalBalance = 1245.50;
  const totalToday = 225.50;

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your payment gateway</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-3xl font-bold">
              ${totalBalance.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardDescription>Received Today</CardDescription>
            <CardTitle className="text-3xl font-bold">
              ${totalToday.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              3 transactions
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardDescription>Merchant QR Code</CardDescription>
            <CardTitle className="text-lg">Payment Address</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <div className="bg-white p-4 rounded-lg">
              <img src={merchantQR} alt="Merchant Payment QR Code" className="w-40 h-40" />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Customers scan to pay with crypto
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card border-border hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => navigate("/transactions")}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Transactions
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>View complete transaction history</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-card border-border hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => navigate("/split")}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Payment Split
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>Configure payment distribution</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-card border-border hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => navigate("/withdrawals")}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Withdrawals
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>Process validated transactions</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
