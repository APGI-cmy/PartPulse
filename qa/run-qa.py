#!/usr/bin/env python3
"""
PartPulse QA System
Validates codebase against architecture requirements
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

# Define the project root
PROJECT_ROOT = Path(__file__).parent.parent


class Requirement:
    """Represents a single architecture requirement"""
    
    def __init__(self, category: str, name: str, description: str, file_path: str = None, component_check: callable = None):
        self.category = category
        self.name = name
        self.description = description
        self.file_path = file_path
        self.component_check = component_check
        self.status = "RED"
        self.found = False
        self.details = ""


class QASystem:
    """Main QA validation system"""
    
    def __init__(self):
        self.requirements: List[Requirement] = []
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "total_requirements": 0,
            "passed": 0,
            "failed": 0,
            "pass_rate": 0.0,
            "categories": {},
            "details": []
        }
        
    def add_requirement(self, category: str, name: str, description: str, file_path: str = None, component_check: callable = None):
        """Add a requirement to check"""
        req = Requirement(category, name, description, file_path, component_check)
        self.requirements.append(req)
        
    def check_file_exists(self, file_path: str) -> bool:
        """Check if a file exists"""
        full_path = PROJECT_ROOT / file_path
        return full_path.exists() and full_path.is_file()
    
    def check_directory_exists(self, dir_path: str) -> bool:
        """Check if a directory exists"""
        full_path = PROJECT_ROOT / dir_path
        return full_path.exists() and full_path.is_dir()
    
    def check_file_contains(self, file_path: str, pattern: str) -> bool:
        """Check if a file contains a specific pattern"""
        full_path = PROJECT_ROOT / file_path
        if not full_path.exists():
            return False
        try:
            content = full_path.read_text()
            return bool(re.search(pattern, content, re.MULTILINE | re.IGNORECASE))
        except Exception:
            return False
    
    def load_architecture_requirements(self):
        """Load requirements from architecture.md"""
        
        # Configuration Files
        config_files = [
            ("Configuration", "package.json", "Package configuration file", "package.json"),
            ("Configuration", "tsconfig.json", "TypeScript configuration", "tsconfig.json"),
            ("Configuration", "eslint.config.mjs", "ESLint configuration", "eslint.config.mjs"),
            ("Configuration", "next.config.ts", "Next.js configuration", "next.config.ts"),
            ("Configuration", "tailwind.config.ts", "Tailwind CSS configuration", "tailwind.config.ts"),
            ("Configuration", ".env.example", "Environment variables template", ".env.example"),
            ("Configuration", ".gitignore", "Git ignore patterns", ".gitignore"),
        ]
        
        for cat, name, desc, path in config_files:
            self.add_requirement(cat, name, desc, file_path=path)
        
        # Database Files
        db_files = [
            ("Database", "prisma/schema.prisma", "Database schema file", "prisma/schema.prisma"),
            ("Database", "prisma/seed.ts", "Database seed script", "prisma/seed.ts"),
            ("Database", "lib/prisma.ts", "Prisma client singleton", "lib/prisma.ts"),
        ]
        
        for cat, name, desc, path in db_files:
            self.add_requirement(cat, name, desc, file_path=path)
        
        # Authentication Files
        auth_files = [
            ("Authentication", "lib/auth.ts", "NextAuth configuration", "lib/auth.ts"),
            ("Authentication", "app/api/auth/[...nextauth]/route.ts", "Auth API endpoints", "app/api/auth/[...nextauth]/route.ts"),
            ("Authentication", "middleware.ts", "Route protection middleware", "middleware.ts"),
        ]
        
        for cat, name, desc, path in auth_files:
            self.add_requirement(cat, name, desc, file_path=path)
        
        # App Pages
        app_pages = [
            ("App Pages", "app/layout.tsx", "Root layout with sidebar", "app/layout.tsx"),
            ("App Pages", "app/page.tsx", "Dashboard/home page", "app/page.tsx"),
            ("App Pages", "app/internal-transfer/page.tsx", "Internal transfer list page", "app/internal-transfer/page.tsx"),
            ("App Pages", "app/warranty/page.tsx", "Warranty claims list page", "app/warranty/page.tsx"),
            ("App Pages", "app/users/invite/page.tsx", "User invitation page", "app/users/invite/page.tsx"),
            ("App Pages", "app/reports/page.tsx", "Reports dashboard page", "app/reports/page.tsx"),
            ("App Pages", "app/settings/page.tsx", "Settings page", "app/settings/page.tsx"),
        ]
        
        for cat, name, desc, path in app_pages:
            self.add_requirement(cat, name, desc, file_path=path)
        
        # UI Components
        ui_components = [
            ("UI Components", "components/ui/sidebar.tsx", "Navigation sidebar component", "components/ui/sidebar.tsx"),
            ("UI Components", "components/ui/button.tsx", "Button component", "components/ui/button.tsx"),
            ("UI Components", "components/ui/input.tsx", "Input component", "components/ui/input.tsx"),
            ("UI Components", "components/ui/select.tsx", "Select component", "components/ui/select.tsx"),
            ("UI Components", "components/ui/modal.tsx", "Modal component", "components/ui/modal.tsx"),
            ("UI Components", "components/ui/table.tsx", "Table component", "components/ui/table.tsx"),
            ("UI Components", "components/ui/badge.tsx", "Badge component", "components/ui/badge.tsx"),
            ("UI Components", "components/ui/card.tsx", "Card component", "components/ui/card.tsx"),
        ]
        
        for cat, name, desc, path in ui_components:
            self.add_requirement(cat, name, desc, file_path=path)
        
        # Form Components
        form_components = [
            ("Form Components", "components/forms/transfer-form.tsx", "Transfer form component", "components/forms/transfer-form.tsx"),
            ("Form Components", "components/forms/warranty-form.tsx", "Warranty form component", "components/forms/warranty-form.tsx"),
            ("Form Components", "components/forms/user-invite-form.tsx", "User invite form component", "components/forms/user-invite-form.tsx"),
        ]
        
        for cat, name, desc, path in form_components:
            self.add_requirement(cat, name, desc, file_path=path)
        
        # API Routes
        api_routes = [
            ("API Routes", "app/api/transfers/route.ts", "Transfer CRUD API", "app/api/transfers/route.ts"),
            ("API Routes", "app/api/internal-transfer/route.ts", "Internal Transfer API (Wave 2)", "app/api/internal-transfer/route.ts"),
            ("API Routes", "app/api/claims/route.ts", "Warranty claim CRUD API", "app/api/claims/route.ts"),
            ("API Routes", "app/api/users/route.ts", "User management API", "app/api/users/route.ts"),
            ("API Routes", "app/api/users/invite/route.ts", "User invitation API", "app/api/users/invite/route.ts"),
            ("API Routes", "app/api/reports/route.ts", "Report generation API", "app/api/reports/route.ts"),
            ("API Routes", "app/api/pdf/route.ts", "PDF generation API", "app/api/pdf/route.ts"),
            ("API Routes", "app/api/email/route.ts", "Email sending API", "app/api/email/route.ts"),
            ("API Routes", "app/api/audit/route.ts", "Audit log API", "app/api/audit/route.ts"),
        ]
        
        for cat, name, desc, path in api_routes:
            self.add_requirement(cat, name, desc, file_path=path)
        
        # Wave 2 - Internal Transfer Workflow
        wave2_components = [
            ("Wave 2 - Internal Transfer", "app/internal-transfer/InternalTransferForm.tsx", "Internal Transfer form component", "app/internal-transfer/InternalTransferForm.tsx"),
            ("Wave 2 - Internal Transfer", "app/internal-transfer/success/page.tsx", "Transfer success page", "app/internal-transfer/success/page.tsx"),
            ("Wave 2 - Internal Transfer", "app/internal-transfer/[id]/page.tsx", "Transfer report page", "app/internal-transfer/[id]/page.tsx"),
            ("Wave 2 - Internal Transfer", "lib/db/schema.ts", "Data model/schema", "lib/db/schema.ts"),
            ("Wave 2 - Internal Transfer", "lib/pdf/internalTransferPdf.ts", "PDF generation stub", "lib/pdf/internalTransferPdf.ts"),
            ("Wave 2 - Internal Transfer", "components/ui/input.tsx", "Input component", "components/ui/Input.tsx"),
            ("Wave 2 - Internal Transfer", "components/ui/select.tsx", "Select component", "components/ui/Select.tsx"),
        ]
        
        for cat, name, desc, path in wave2_components:
            self.add_requirement(cat, name, desc, file_path=path)
        
        # Utilities
        utilities = [
            ("Utilities", "lib/validators.ts", "Zod validation schemas", "lib/validators.ts"),
            ("Utilities", "lib/utils.ts", "Helper functions", "lib/utils.ts"),
            ("Utilities", "lib/email.ts", "Email utilities", "lib/email.ts"),
            ("Utilities", "lib/pdf.ts", "PDF generation utilities", "lib/pdf.ts"),
            ("Utilities", "lib/constants.ts", "App constants", "lib/constants.ts"),
        ]
        
        for cat, name, desc, path in utilities:
            self.add_requirement(cat, name, desc, file_path=path)
        
        # Types
        types = [
            ("Types", "types/index.ts", "TypeScript type definitions", "types/index.ts"),
            ("Types", "types/api.ts", "API type definitions", "types/api.ts"),
        ]
        
        for cat, name, desc, path in types:
            self.add_requirement(cat, name, desc, file_path=path)
        
        # Documentation
        docs = [
            ("Documentation", "README.md", "Project overview", "README.md"),
            ("Documentation", "rules.md", "App rules and specifications", "rules.md"),
            ("Documentation", "architecture/architecture.md", "Architecture specification", "architecture/architecture.md"),
        ]
        
        for cat, name, desc, path in docs:
            self.add_requirement(cat, name, desc, file_path=path)
        
        # Component Checks (content validation)
        self.add_requirement(
            "Component Content",
            "Sidebar Navigation",
            "Sidebar contains all required navigation items",
            component_check=self.check_sidebar_navigation
        )
        
        self.add_requirement(
            "Component Content",
            "Primary Color",
            "Tailwind config uses primary color #FF2B00",
            component_check=self.check_primary_color
        )
        
        self.add_requirement(
            "Database Schema",
            "User Model",
            "User model exists in Prisma schema",
            component_check=self.check_user_model
        )
        
        self.add_requirement(
            "Database Schema",
            "Transfer Model",
            "Transfer model exists in Prisma schema",
            component_check=self.check_transfer_model
        )
        
        self.add_requirement(
            "Architecture Documentation",
            "Internal Transfer Workflow",
            "Architecture document contains Internal Transfer workflow description",
            component_check=self.check_internal_transfer_workflow_docs
        )
        
        self.add_requirement(
            "Database Schema",
            "Warranty Claim Model",
            "WarrantyClaim model exists in Prisma schema",
            component_check=self.check_warranty_model
        )
        
        self.add_requirement(
            "Database Schema",
            "Audit Log Model",
            "AuditLog model exists in Prisma schema",
            component_check=self.check_audit_model
        )
    
    def check_sidebar_navigation(self) -> Tuple[bool, str]:
        """Check if sidebar has all required navigation items"""
        if not self.check_file_exists("components/ui/sidebar.tsx"):
            return False, "Sidebar component file not found"
        
        required_items = [
            "Internal Transfer",
            "Warranty",
            "Invite",
            "Reports",
            "Settings"
        ]
        
        content = (PROJECT_ROOT / "components/ui/sidebar.tsx").read_text()
        missing = [item for item in required_items if item.lower() not in content.lower()]
        
        if missing:
            return False, f"Missing navigation items: {', '.join(missing)}"
        return True, "All navigation items present"
    
    def check_primary_color(self) -> Tuple[bool, str]:
        """Check if primary color is set correctly"""
        config_files = ["tailwind.config.js", "tailwind.config.ts", "app/globals.css"]
        
        for config_file in config_files:
            if self.check_file_exists(config_file):
                content = (PROJECT_ROOT / config_file).read_text()
                if "#FF2B00" in content or "FF2B00" in content:
                    return True, f"Primary color #FF2B00 found in {config_file}"
        
        return False, "Primary color #FF2B00 not found in Tailwind config or globals.css"
    
    def check_user_model(self) -> Tuple[bool, str]:
        """Check if User model exists in Prisma schema"""
        if not self.check_file_exists("prisma/schema.prisma"):
            return False, "Prisma schema file not found"
        
        if self.check_file_contains("prisma/schema.prisma", r"model\s+User\s*{"):
            return True, "User model found"
        return False, "User model not found"
    
    def check_transfer_model(self) -> Tuple[bool, str]:
        """Check if Transfer model exists in Prisma schema"""
        if not self.check_file_exists("prisma/schema.prisma"):
            return False, "Prisma schema file not found"
        
        if self.check_file_contains("prisma/schema.prisma", r"model\s+Transfer\s*{"):
            return True, "Transfer model found"
        return False, "Transfer model not found"
    
    def check_warranty_model(self) -> Tuple[bool, str]:
        """Check if WarrantyClaim model exists in Prisma schema"""
        if not self.check_file_exists("prisma/schema.prisma"):
            return False, "Prisma schema file not found"
        
        if self.check_file_contains("prisma/schema.prisma", r"model\s+WarrantyClaim\s*{"):
            return True, "WarrantyClaim model found"
        return False, "WarrantyClaim model not found"
    
    def check_audit_model(self) -> Tuple[bool, str]:
        """Check if AuditLog model exists in Prisma schema"""
        if not self.check_file_exists("prisma/schema.prisma"):
            return False, "Prisma schema file not found"
        
        if self.check_file_contains("prisma/schema.prisma", r"model\s+AuditLog\s*{"):
            return True, "AuditLog model found"
        return False, "AuditLog model not found"
    
    def check_internal_transfer_workflow_docs(self) -> Tuple[bool, str]:
        """Check if architecture.md contains Internal Transfer workflow documentation"""
        if not self.check_file_exists("architecture/architecture.md"):
            return False, "Architecture document not found"
        
        if self.check_file_contains("architecture/architecture.md", r"Internal Transfer Workflow"):
            return True, "Internal Transfer workflow documentation found"
        return False, "Internal Transfer workflow not documented in architecture.md"
    
    def run_checks(self):
        """Run all requirement checks"""
        for req in self.requirements:
            if req.file_path:
                # File existence check
                req.found = self.check_file_exists(req.file_path)
                req.status = "GREEN" if req.found else "RED"
                req.details = f"File {'exists' if req.found else 'missing'}: {req.file_path}"
            
            if req.component_check:
                # Component-specific check
                req.found, req.details = req.component_check()
                req.status = "GREEN" if req.found else "RED"
        
        # Calculate statistics
        self.results["total_requirements"] = len(self.requirements)
        self.results["passed"] = sum(1 for req in self.requirements if req.status == "GREEN")
        self.results["failed"] = sum(1 for req in self.requirements if req.status == "RED")
        self.results["pass_rate"] = (self.results["passed"] / self.results["total_requirements"] * 100) if self.results["total_requirements"] > 0 else 0
        
        # Group by category
        for req in self.requirements:
            if req.category not in self.results["categories"]:
                self.results["categories"][req.category] = {
                    "total": 0,
                    "passed": 0,
                    "failed": 0,
                    "pass_rate": 0.0
                }
            
            cat = self.results["categories"][req.category]
            cat["total"] += 1
            if req.status == "GREEN":
                cat["passed"] += 1
            else:
                cat["failed"] += 1
        
        # Calculate category pass rates
        for cat in self.results["categories"].values():
            cat["pass_rate"] = (cat["passed"] / cat["total"] * 100) if cat["total"] > 0 else 0
        
        # Store details
        self.results["details"] = [
            {
                "category": req.category,
                "name": req.name,
                "description": req.description,
                "status": req.status,
                "details": req.details
            }
            for req in self.requirements
        ]
    
    def generate_markdown_report(self) -> str:
        """Generate markdown report"""
        report = []
        report.append("# PartPulse QA Report")
        report.append("")
        report.append(f"**Generated**: {self.results['timestamp']}")
        report.append("")
        
        # Summary
        report.append("## Summary")
        report.append("")
        report.append(f"- **Total Requirements**: {self.results['total_requirements']}")
        report.append(f"- **Passed**: {self.results['passed']} ✅")
        report.append(f"- **Failed**: {self.results['failed']} ❌")
        report.append(f"- **Pass Rate**: {self.results['pass_rate']:.1f}%")
        report.append("")
        
        # Category Summary
        report.append("## Results by Category")
        report.append("")
        report.append("| Category | Total | Passed | Failed | Pass Rate |")
        report.append("|----------|-------|--------|--------|-----------|")
        
        for cat_name, cat_data in sorted(self.results["categories"].items()):
            report.append(
                f"| {cat_name} | {cat_data['total']} | "
                f"{cat_data['passed']} ✅ | {cat_data['failed']} ❌ | "
                f"{cat_data['pass_rate']:.1f}% |"
            )
        
        report.append("")
        
        # Detailed Results
        report.append("## Detailed Results")
        report.append("")
        
        current_category = None
        for detail in self.results["details"]:
            if detail["category"] != current_category:
                current_category = detail["category"]
                report.append(f"### {current_category}")
                report.append("")
            
            status_icon = "✅" if detail["status"] == "GREEN" else "❌"
            report.append(f"**{status_icon} {detail['name']}**")
            report.append(f"- Description: {detail['description']}")
            report.append(f"- Status: {detail['status']}")
            report.append(f"- Details: {detail['details']}")
            report.append("")
        
        # Traceability Matrix
        report.append("## Traceability Matrix")
        report.append("")
        report.append("| Requirement | Category | Status | Details |")
        report.append("|-------------|----------|--------|---------|")
        
        for detail in self.results["details"]:
            status_icon = "✅" if detail["status"] == "GREEN" else "❌"
            report.append(
                f"| {detail['name']} | {detail['category']} | "
                f"{status_icon} {detail['status']} | {detail['details']} |"
            )
        
        report.append("")
        
        # Next Steps
        if self.results["failed"] > 0:
            report.append("## Next Steps")
            report.append("")
            report.append("The following items need to be addressed:")
            report.append("")
            
            for detail in self.results["details"]:
                if detail["status"] == "RED":
                    report.append(f"- [ ] {detail['name']}: {detail['details']}")
            
            report.append("")
        else:
            report.append("## ✅ All Requirements Met!")
            report.append("")
            report.append("The codebase is fully compliant with the architecture specification.")
            report.append("")
        
        return "\n".join(report)
    
    def save_reports(self):
        """Save QA reports to files"""
        qa_dir = PROJECT_ROOT / "qa"
        qa_dir.mkdir(exist_ok=True)
        
        # Save JSON results
        json_path = qa_dir / "QA_RESULTS.json"
        with open(json_path, "w") as f:
            json.dump(self.results, f, indent=2)
        
        print(f"✅ Saved JSON results to {json_path}")
        
        # Save Markdown report
        md_path = qa_dir / "QA_REPORT.md"
        with open(md_path, "w") as f:
            f.write(self.generate_markdown_report())
        
        print(f"✅ Saved Markdown report to {md_path}")
    
    def print_summary(self):
        """Print summary to console"""
        print("\n" + "=" * 70)
        print("PartPulse QA System - Results Summary")
        print("=" * 70)
        print(f"Total Requirements: {self.results['total_requirements']}")
        print(f"Passed: {self.results['passed']} ✅")
        print(f"Failed: {self.results['failed']} ❌")
        print(f"Pass Rate: {self.results['pass_rate']:.1f}%")
        print("=" * 70)
        
        if self.results["failed"] > 0:
            print("\n⚠️  FAILED - Architecture requirements not met")
            print(f"\n{self.results['failed']} requirement(s) need to be addressed.")
        else:
            print("\n✅ PASSED - All architecture requirements met!")
        
        print("\nReports saved:")
        print(f"  - qa/QA_RESULTS.json")
        print(f"  - qa/QA_REPORT.md")
        print()


def main():
    """Main entry point"""
    print("\n🔍 Starting PartPulse QA System...\n")
    
    qa = QASystem()
    
    # Load requirements from architecture
    print("📋 Loading architecture requirements...")
    qa.load_architecture_requirements()
    print(f"   Loaded {len(qa.requirements)} requirements\n")
    
    # Run checks
    print("🔎 Running compliance checks...")
    qa.run_checks()
    print("   Checks complete\n")
    
    # Save reports
    print("💾 Generating reports...")
    qa.save_reports()
    
    # Print summary
    qa.print_summary()


if __name__ == "__main__":
    main()
