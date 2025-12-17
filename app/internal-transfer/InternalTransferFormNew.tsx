"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";

interface TransferItem {
  qty: string;
  partNo: string;
  description: string;
}

interface FormData {
  date: string;
  technicianName: string;
  idType: 'SSID' | 'PSID' | '';
  idNumber: string;
  items: TransferItem[];
}

export default function InternalTransferFormNew() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with current date and one empty item
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    technicianName: "", // TODO: Auto-fill from auth when available
    idType: '',
    idNumber: '',
    items: [{
      qty: '',
      partNo: '',
      description: '',
    }],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value 
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleIdTypeChange = (type: 'SSID' | 'PSID') => {
    setFormData((prev) => ({
      ...prev,
      idType: type,
      idNumber: '', // Clear the number when switching types
    }));
    
    // Clear error
    if (errors.idType) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.idType;
        return newErrors;
      });
    }
  };

  const handleItemChange = (index: number, field: keyof TransferItem, value: string) => {
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
          qty: '',
          partNo: '',
          description: '',
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
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.technicianName.trim()) {
      newErrors.technicianName = "Technician name is required";
    }
    if (!formData.idType) {
      newErrors.idType = "Please select SSID or PSID";
    }
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = `${formData.idType || 'ID'} number is required`;
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.qty.trim()) {
        newErrors[`items.${index}.qty`] = "Quantity is required";
      }
      if (!item.partNo.trim()) {
        newErrors[`items.${index}.partNo`] = "Part number is required";
      }
      if (!item.description.trim()) {
        newErrors[`items.${index}.description`] = "Description is required";
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
      // TODO: Implement API call
      const response = await fetch("/api/internal-transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formData.date,
          technicianName: formData.technicianName,
          [formData.idType === 'SSID' ? 'ssid' : 'psid']: formData.idNumber,
          items: formData.items.map(item => ({
            qty: parseInt(item.qty),
            partNo: item.partNo,
            description: item.description,
          })),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Redirect to success page or show success message
        alert("Transfer submitted successfully!");
        // Reset form
        setFormData({
          date: new Date().toISOString().split('T')[0],
          technicianName: formData.technicianName, // Keep technician name
          idType: '',
          idNumber: '',
          items: [{
            qty: '',
            partNo: '',
            description: '',
          }],
        });
      } else {
        setErrors({
          submit: result.error?.message || "Failed to submit transfer. Please try again.",
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
          <CardTitle>Internal Transfer Form</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            {/* Date and Technician Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={
                  <>
                    Date <span className="text-red-600">*</span>
                  </>
                }
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
                required
              />
              <Input
                label={
                  <>
                    Technician Name <span className="text-red-600">*</span>
                  </>
                }
                name="technicianName"
                value={formData.technicianName}
                onChange={handleChange}
                error={errors.technicianName}
                placeholder="Auto-filled from profile"
                required
              />
            </div>

            {/* SSID / PSID Radio Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Select ID Type <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="idType"
                    checked={formData.idType === 'SSID'}
                    onChange={() => handleIdTypeChange('SSID')}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className={`text-sm ${formData.idType === 'PSID' ? 'text-gray-400' : 'text-gray-900'}`}>
                    SSID
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="idType"
                    checked={formData.idType === 'PSID'}
                    onChange={() => handleIdTypeChange('PSID')}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className={`text-sm ${formData.idType === 'SSID' ? 'text-gray-400' : 'text-gray-900'}`}>
                    PSID
                  </span>
                </label>
              </div>
              {errors.idType && (
                <p className="text-sm text-red-600">{errors.idType}</p>
              )}

              {/* ID Number Input - Only show when type selected */}
              {formData.idType && (
                <Input
                  label={
                    <>
                      {formData.idType} Number <span className="text-red-600">*</span>
                    </>
                  }
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  error={errors.idNumber}
                  placeholder={`Enter ${formData.idType} number`}
                  required
                />
              )}
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Parts</h3>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4 relative">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label={
                        <>
                          Quantity <span className="text-red-600">*</span>
                        </>
                      }
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      error={errors[`items.${index}.qty`]}
                      placeholder="Enter quantity"
                      required
                    />
                    <Input
                      label={
                        <>
                          Part Number <span className="text-red-600">*</span>
                        </>
                      }
                      value={item.partNo}
                      onChange={(e) => handleItemChange(index, 'partNo', e.target.value)}
                      error={errors[`items.${index}.partNo`]}
                      placeholder="Enter part number"
                      required
                    />
                    <Input
                      label={
                        <>
                          Description <span className="text-red-600">*</span>
                        </>
                      }
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      error={errors[`items.${index}.description`]}
                      placeholder="Part description"
                      required
                    />
                  </div>
                </div>
              ))}

              {/* Add Item Button */}
              <button
                type="button"
                onClick={addItem}
                className="w-full md:w-auto px-6 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span>
                <span>Add Another Part</span>
              </button>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
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
                {isSubmitting ? "Submitting..." : "Submit Transfer"}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </form>
  );
}
