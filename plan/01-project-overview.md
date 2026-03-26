# 01 — Project Overview

## Project Name

**Lab Inventory / Chemical Ordering / Peroxide Monitoring System**

## Project Purpose

This system is an **internal enterprise lab operations platform** designed to manage the full lifecycle of chemicals, reagents, verified standards, gases, and consumable materials within a multi-site, multi-lab organization. It replaces fragmented manual processes (spreadsheets, email chains, paper logs) with a unified, role-based digital system.

> **Note:** This is _not_ a general e-commerce or public-facing storefront. It is a purpose-built internal tool for laboratory personnel, lab managers, and compliance stakeholders.

## Problem Statement

The organization currently operates across **4 main locations** and **18+ labs**. Daily lab operations require:

- Ordering chemicals and materials from approved vendors.
- Receiving, labeling, and checking-in deliveries against approved orders.
- Tracking real-time inventory, including lot numbers, expiry dates, and storage locations.
- Monitoring peroxide-forming chemicals on a defined schedule for safety compliance.
- Extending the shelf life of qualified chemicals per documented procedures.
- Checking out chemicals for consumption, with traceable transaction history.
- Meeting regulatory and audit reporting requirements.

These activities are currently managed through disconnected tools, leading to:

| Problem | Impact |
|---|---|
| No unified ordering or approval process | Duplicate or unauthorized purchases |
| Manual inventory tracking | Inaccurate stock levels, expired chemicals undetected |
| No peroxide monitoring automation | Safety and compliance risk |
| No centralized transaction history | Audit and traceability gaps |
| No role-based access or visibility controls | Unauthorized access to sensitive operations |
| No dashboards for min-stock or expiry | Reactive rather than proactive lab management |

## Main System Goals

1. **Centralized Ordering & Approval** — Provide a cart-based ordering workflow with multi-level approval and vendor notification.
2. **Inventory & Lot Tracking** — Maintain accurate, real-time inventory with lot-level traceability across locations and labs.
3. **Safety Monitoring** — Automate peroxide-forming chemical monitoring and shelf-life extension workflows.
4. **Regulatory Compliance** — Support audit trails, transaction histories, and regulatory report generation.
5. **Role-Based Access** — Enforce granular permissions per role, location, and lab context.
6. **Dashboard-Driven Operations** — Surface actionable insights: low stock, approaching expiry, overdue peroxide tests, and pending approvals.
7. **QR-Based Workflows** — Enable fast check-in and checkout via QR code scanning.

## High-Level Feature Summary

| Feature Area | Description |
|---|---|
| **Dashboard** | Role-specific overview: pending approvals, low stock, expiring items, peroxide alerts |
| **Ordering** | Browse catalog, add to cart, submit order requests |
| **Cart** | Review, edit, and submit pending orders before approval |
| **Approval Workflow** | Multi-step approval by Lab Manager / Focal Point |
| **Vendor Email** | Auto-generated vendor notification upon approval |
| **Check-In** | Receive and record delivered items into inventory (manual or QR-based) |
| **Checkout** | Record consumption/withdrawal from inventory (manual or QR-based) |
| **Inventory Management** | View, search, filter inventory by location, lab, category, and status |
| **Lot Tracking** | Track individual lots: lot number, manufacture date, expiry, quantity |
| **Min-Stock Dashboard** | Alerts when inventory falls below defined minimum thresholds |
| **Expired Dashboard** | Lists items at or past expiry, with action options |
| **Peroxide Monitoring** | Scheduled testing for peroxide-forming chemicals with pass/fail logging |
| **Extend Shelf Life** | Documented extension of chemical shelf life after qualifying tests |
| **Transaction History** | Complete audit log of all inventory movements |
| **Regulatory Reporting** | Exportable records for compliance and audit purposes |
| **Role-Based Access** | Admin, Lab Manager/Focal Point, Lab User, Viewer/Auditor |
| **Location/Lab Hierarchy** | Multi-site, multi-lab organizational structure with scoped access |
| **Master Data Management** | Manage chemicals, vendors, categories, units, and lab definitions |
| **User/Admin Management** | User provisioning, role assignment, and access control |

## Internal Operational Nature

This system is designed exclusively for **internal organizational use**:

- All users are employees or authorized lab personnel.
- Authentication is enterprise-grade (e.g., SSO or organizational credentials).
- No public registration, no external customer access.
- Data sensitivity requires strict access controls and audit trails.
- The system supports operational, compliance, and safety workflows — not commercial transactions.
