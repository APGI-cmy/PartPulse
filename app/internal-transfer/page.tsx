import Header from "@/components/layout/Header";
import InternalTransferFormNew from "./InternalTransferFormNew";

export default function InternalTransferPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Internal Transfer" 
        description="Submit internal part transfer notifications"
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <InternalTransferFormNew />
        </div>
      </div>
    </div>
  );
}
