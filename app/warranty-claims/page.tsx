import Header from "@/components/layout/Header";
import WarrantyClaimForm from "./WarrantyClaimForm";

export default function WarrantyClaimsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Warranty Claims" 
        description="Submit warranty claims for defective Trane parts"
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <WarrantyClaimForm />
        </div>
      </div>
    </div>
  );
}
