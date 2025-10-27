import { CheckCircle } from "lucide-react";

export default function PlaceOrderPage() {
  return (
    
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <CheckCircle className="text-green-600 w-20 h-20 animate-bounce" />
      <h1 className="text-2xl font-semibold mt-4 text-green-700">
        Order Placed Successfully!
      </h1>
    </div>
  );
}
