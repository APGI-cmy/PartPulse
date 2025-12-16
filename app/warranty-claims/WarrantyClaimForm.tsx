"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input, { Textarea } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";

interface FormWarrantyItem {
  partNo: string;
  quantity: number;
  failedPartSerial: string;
  replacedPartSerial: string;
  dateOfFailure: string;
  dateOfRepair: string;
}

interface FormData {
  date: string;
  chillerModel: string;
  chillerSerial: string;
  ssidJobNumber: string;
  buildingName: string;
  siteName: string;
  technicianName: string;
  items: FormWarrantyItem[];
  comments: string;
  coveredByWarranty: boolean;
  technicianSignature: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function WarrantyClaimForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with current date and one empty item row
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    chillerModel: "",
    chillerSerial: "",
    ssidJobNumber: "",
    buildingName: "",
    siteName: "",
    technicianName: "",
    items: [{
      partNo: "",
      quantity: 1,
      failedPartSerial: "",
      replacedPartSerial: "",
      dateOfFailure: "",
      dateOfRepair: "",
    }],
    comments: "",
    coveredByWarranty: false,
    technicianSignature: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleItemChange = (index: number, field: keyof FormWarrantyItem, value: string | number) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
      return { ...prev, items: newItems };
    });
    
    // Clear error for this item field
    const errorKey = `items.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          partNo: "",
          quantity: 1,
          failedPartSerial: "",
          replacedPartSerial: "",
          dateOfFailure: "",
          dateOfRepair: "",
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.chillerModel.trim()) {
      newErrors.chillerModel = "Chiller model is required";
    }
    if (!formData.chillerSerial.trim()) {
      newErrors.chillerSerial = "Chiller serial is required";
    }
    if (!formData.ssidJobNumber.trim()) {
      newErrors.ssidJobNumber = "SSID/Job number is required";
    }
    if (!formData.siteName.trim()) {
      newErrors.siteName = "Site name is required";
    }
    if (!formData.technicianName.trim()) {
      newErrors.technicianName = "Technician name is required";
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.partNo.trim()) {
        newErrors[`items.${index}.partNo`] = "Part number is required";
      }
      if (item.quantity < 1) {
        newErrors[`items.${index}.quantity`] = "Quantity must be at least 1";
      }
      if (!item.failedPartSerial.trim()) {
        newErrors[`items.${index}.failedPartSerial`] = "Failed part serial is required";
      }
      if (!item.replacedPartSerial.trim()) {
        newErrors[`items.${index}.replacedPartSerial`] = "Replaced part serial is required";
      }
      if (!item.dateOfFailure) {
        newErrors[`items.${index}.dateOfFailure`] = "Date of failure is required";
      }
      if (!item.dateOfRepair) {
        newErrors[`items.${index}.dateOfRepair`] = "Date of repair is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/warranty-claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Redirect to claim detail page with the claim ID
        router.push(`/warranty-claims/${result.data.id}`);
      } else {
        // Show error
        setErrors({
          submit: result.error?.message || "Failed to submit warranty claim. Please try again.",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        submit: "An unexpected error occurred. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Trane Warranty Parts Claims Form</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            {/* General Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  error={errors.date}
                  required
                />
                <Input
                  label="Chiller Model"
                  name="chillerModel"
                  value={formData.chillerModel}
                  onChange={handleChange}
                  error={errors.chillerModel}
                  placeholder="Enter chiller model"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Chiller Serial Number"
                  name="chillerSerial"
                  value={formData.chillerSerial}
                  onChange={handleChange}
                  error={errors.chillerSerial}
                  placeholder="Enter chiller serial number"
                  required
                />
                <Input
                  label="Job Number / SSID #"
                  name="ssidJobNumber"
                  value={formData.ssidJobNumber}
                  onChange={handleChange}
                  error={errors.ssidJobNumber}
                  placeholder="Enter job/SSID number"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Building Name"
                  name="buildingName"
                  value={formData.buildingName}
                  onChange={handleChange}
                  error={errors.buildingName}
                  placeholder="Enter building name (optional)"
                />
                <Input
                  label="Site Name"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  error={errors.siteName}
                  placeholder="Enter site name"
                  required
                />
              </div>
              <div className="mt-4">
                <Input
                  label="Attended By (Technician Name)"
                  name="technicianName"
                  value={formData.technicianName}
                  onChange={handleChange}
                  error={errors.technicianName}
                  placeholder="Enter technician name"
                  required
                />
              </div>
            </div>

            {/* Parts Table */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Parts Details</h3>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addItem}
                  disabled={isSubmitting}
                >
                  + Add Row
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="absolute top-2 right-2 text-error hover:text-error/80"
                        disabled={isSubmitting}
                      >
                        ✕
                      </button>
                    )}
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Item {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Part No."
                        value={item.partNo}
                        onChange={(e) => handleItemChange(index, 'partNo', e.target.value)}
                        error={errors[`items.${index}.partNo`]}
                        placeholder="Part number"
                        required
                      />
                      <Input
                        label="Qty"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        error={errors[`items.${index}.quantity`]}
                        required
                      />
                      <Input
                        label="Failed Part Serial"
                        value={item.failedPartSerial}
                        onChange={(e) => handleItemChange(index, 'failedPartSerial', e.target.value)}
                        error={errors[`items.${index}.failedPartSerial`]}
                        placeholder="Serial number"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <Input
                        label="Replaced Part Serial"
                        value={item.replacedPartSerial}
                        onChange={(e) => handleItemChange(index, 'replacedPartSerial', e.target.value)}
                        error={errors[`items.${index}.replacedPartSerial`]}
                        placeholder="Serial number"
                        required
                      />
                      <Input
                        label="Date of Failure"
                        type="date"
                        value={item.dateOfFailure}
                        onChange={(e) => handleItemChange(index, 'dateOfFailure', e.target.value)}
                        error={errors[`items.${index}.dateOfFailure`]}
                        required
                      />
                      <Input
                        label="Date of Repair"
                        type="date"
                        value={item.dateOfRepair}
                        onChange={(e) => handleItemChange(index, 'dateOfRepair', e.target.value)}
                        error={errors[`items.${index}.dateOfRepair`]}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <Textarea
                label="Comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                error={errors.comments}
                placeholder="Additional comments (optional)"
                rows={4}
              />
            </div>

            {/* Warranty Coverage */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="coveredByWarranty"
                  checked={formData.coveredByWarranty}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-900">
                  Covered by Warranty
                </span>
              </label>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>* Need Serial Number to be able to make a claim (Mandatory).</li>
                <li>* Provide Photos of Failed Parts.</li>
                <li>* Provide Service Reports for Failed Parts.</li>
              </ul>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-error">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit Warranty Claim
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </form>
  );
}
