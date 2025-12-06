"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input, { Textarea } from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
  technician: string;
  department: string;
  transferType: string;
  serial: string;
  model: string;
  part: string;
  description: string;
  reason: string;
  newUnit: string;
  comments: string;
  images: string[];
  signature: string;
}

interface FormErrors {
  [key: string]: string;
}

const TRANSFER_TYPES = [
  { value: "", label: "Select transfer type" },
  { value: "return", label: "Return to Stock" },
  { value: "repair", label: "Send to Repair" },
  { value: "scrap", label: "Scrap/Dispose" },
  { value: "warranty", label: "Warranty Return" },
  { value: "transfer", label: "Transfer to Another Location" },
];

const DEPARTMENTS = [
  { value: "", label: "Select department" },
  { value: "maintenance", label: "Maintenance" },
  { value: "production", label: "Production" },
  { value: "warehouse", label: "Warehouse" },
  { value: "quality", label: "Quality Control" },
  { value: "engineering", label: "Engineering" },
];

export default function InternalTransferForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    technician: "",
    department: "",
    transferType: "",
    serial: "",
    model: "",
    part: "",
    description: "",
    reason: "",
    newUnit: "",
    comments: "",
    images: [],
    signature: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.technician.trim()) {
      newErrors.technician = "Technician name is required";
    }
    if (!formData.department) {
      newErrors.department = "Department is required";
    }
    if (!formData.transferType) {
      newErrors.transferType = "Transfer type is required";
    }
    if (!formData.serial.trim()) {
      newErrors.serial = "Serial number is required";
    }
    if (!formData.model.trim()) {
      newErrors.model = "Model number is required";
    }
    if (!formData.part.trim()) {
      newErrors.part = "Part number is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for removal is required";
    }

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
      const response = await fetch("/api/internal-transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Redirect to success page with the transfer ID
        router.push(`/internal-transfer/success?id=${result.data.id}`);
      } else {
        // Show error
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

  const showNewUnitField =
    formData.transferType === "repair" ||
    formData.transferType === "warranty" ||
    formData.transferType === "transfer";

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Transfer Information</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {/* Technician Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Technician Name"
                name="technician"
                value={formData.technician}
                onChange={handleChange}
                error={errors.technician}
                placeholder="Enter technician name"
                required
              />
              <Select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={DEPARTMENTS}
                error={errors.department}
                required
              />
            </div>

            {/* Transfer Details */}
            <Select
              label="Transfer Type"
              name="transferType"
              value={formData.transferType}
              onChange={handleChange}
              options={TRANSFER_TYPES}
              error={errors.transferType}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Serial Number"
                name="serial"
                value={formData.serial}
                onChange={handleChange}
                error={errors.serial}
                placeholder="Enter serial number"
                required
              />
              <Input
                label="Model Number"
                name="model"
                value={formData.model}
                onChange={handleChange}
                error={errors.model}
                placeholder="Enter model number"
                required
              />
              <Input
                label="Part Number"
                name="part"
                value={formData.part}
                onChange={handleChange}
                error={errors.part}
                placeholder="Enter part number"
                required
              />
            </div>

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              placeholder="Describe the part and its condition"
              rows={3}
              required
            />

            <Textarea
              label="Reason for Removal"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              error={errors.reason}
              placeholder="Why is this part being removed/transferred?"
              rows={3}
              required
            />

            {/* Conditional field based on transfer type */}
            {showNewUnitField && (
              <Input
                label="New Unit / Job Number"
                name="newUnit"
                value={formData.newUnit}
                onChange={handleChange}
                error={errors.newUnit}
                placeholder="Enter new unit or job number"
                helperText="Required for repairs, warranties, and transfers"
              />
            )}

            <Textarea
              label="Additional Comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              error={errors.comments}
              placeholder="Any additional information or notes (optional)"
              rows={2}
            />

            {/* Placeholder for future features */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Coming Soon:</span> Image upload, signature capture, and date/time selection features will be added in future updates.
              </p>
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
                Submit Transfer
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </form>
  );
}
