-- ═══════════════════════════════════════════════════════════════════════════
-- MaterialList SQL INSERT Statements
-- Generated from Database_Info_Draft_20032026.xlsx → MaterialList sheet
-- Date: 2026-03-23
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- SECTION 1: New Vendors (not in existing seed data)
-- Existing: Sigma-Aldrich, Fisher Scientific, Merck
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO "Vendors" ("Id", "Name", "Code", "IsActive", "CreatedAt")
VALUES ('e0000000-0000-0000-0000-000000000004', 'Chemex', 'CHEMEX', TRUE, '2026-01-01T00:00:00Z');

INSERT INTO "Vendors" ("Id", "Name", "Code", "IsActive", "CreatedAt")
VALUES ('e0000000-0000-0000-0000-000000000005', '3M', '3M', TRUE, '2026-01-01T00:00:00Z');

INSERT INTO "Vendors" ("Id", "Name", "Code", "IsActive", "CreatedAt")
VALUES ('e0000000-0000-0000-0000-000000000006', 'Alfa Aesar', 'ALFAAESAR', TRUE, '2026-01-01T00:00:00Z');

INSERT INTO "Vendors" ("Id", "Name", "Code", "IsActive", "CreatedAt")
VALUES ('e0000000-0000-0000-0000-000000000007', 'Ametek Brookfield', 'AMETEKBROO', TRUE, '2026-01-01T00:00:00Z');

INSERT INTO "Vendors" ("Id", "Name", "Code", "IsActive", "CreatedAt")
VALUES ('e0000000-0000-0000-0000-000000000008', 'Labscan', 'LABSCAN', TRUE, '2026-01-01T00:00:00Z');

INSERT INTO "Vendors" ("Id", "Name", "Code", "IsActive", "CreatedAt")
VALUES ('e0000000-0000-0000-0000-000000000009', 'Loba', 'LOBA', TRUE, '2026-01-01T00:00:00Z');

INSERT INTO "Vendors" ("Id", "Name", "Code", "IsActive", "CreatedAt")
VALUES ('e0000000-0000-0000-0000-000000000010', 'Labsupply', 'LABSUPPLY', TRUE, '2026-01-01T00:00:00Z');

INSERT INTO "Vendors" ("Id", "Name", "Code", "IsActive", "CreatedAt")
VALUES ('e0000000-0000-0000-0000-000000000011', 'S&T', 'ST', TRUE, '2026-01-01T00:00:00Z');

INSERT INTO "Vendors" ("Id", "Name", "Code", "IsActive", "CreatedAt")
VALUES ('e0000000-0000-0000-0000-000000000012', 'TBS', 'TBS', TRUE, '2026-01-01T00:00:00Z');

INSERT INTO "Vendors" ("Id", "Name", "Code", "IsActive", "CreatedAt")
VALUES ('e0000000-0000-0000-0000-000000000013', 'BIG', 'BIG', TRUE, '2026-01-01T00:00:00Z');

INSERT INTO "Vendors" ("Id", "Name", "Code", "IsActive", "CreatedAt")
VALUES ('e0000000-0000-0000-0000-000000000014', 'Hach', 'HACH', TRUE, '2026-01-01T00:00:00Z');


-- ═══════════════════════════════════════════════════════════════════════════
-- SECTION 2: Items (124 rows from MaterialList)
-- ═══════════════════════════════════════════════════════════════════════════

-- [CHEM-001] ACETONE FOR ANALYSIS EMSURE ACS,ISO, PH EUR "Merck" 2.5 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000001', 'ACETONE FOR ANALYSIS EMSURE ACS,ISO, PH EUR "Merck" 2.5 L', 'Acetone 2.5L', '100014.25', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'ACETONE FOR ANALYSIS EMSURE ACS,ISO, PH EUR "Merck" 2.5 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-002] ACETONE FOR LIQUID CHROMATOGRAPHY LICHROSOLV "Merck" 1 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000002', 'ACETONE FOR LIQUID CHROMATOGRAPHY LICHROSOLV "Merck" 1 L', 'Acetone LC 1L', '100020.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '1', 'L', NULL, NULL, 14, 'ACETONE FOR LIQUID CHROMATOGRAPHY LICHROSOLV "Merck" 1 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-003] ACETONITRILE GRADIENT GRADE FOR LIQUID CHROMATOGRA "Merck" 2.5 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000003', 'ACETONITRILE GRADIENT GRADE FOR LIQUID CHROMATOGRA "Merck" 2.5 L', 'Acetronitrile LC 2.5L', '100030.25', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'ACETONITRILE GRADIENT GRADE FOR LIQUID CHROMATOGRA "Merck" 2.5 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-004] 2-PROPANOL GRADIENT GRADE FOR LIQUID CHROMATOGRAPH "Merck" 2.5 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000004', '2-PROPANOL GRADIENT GRADE FOR LIQUID CHROMATOGRAPH "Merck" 2.5 L', '2-Propanol LC', '101040.25', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '2.5', 'L', NULL, NULL, 14, '2-PROPANOL GRADIENT GRADE FOR LIQUID CHROMATOGRAPH "Merck" 2.5 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'B', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-005] BARIUM CHLORIDE DIHYDR. GR ACS, ISO "Merck"   1 KG
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000005', 'BARIUM CHLORIDE DIHYDR. GR ACS, ISO "Merck"   1 KG', 'Barium chloride', '101719.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Reagent', '1', 'g', NULL, NULL, 14, 'BARIUM CHLORIDE DIHYDR. GR ACS, ISO "Merck"   1 KG', 'Chemical storage cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-006] Conductivity water ( nominal 0 mS/cm) "Merck" 5x100ML  *** เลิกผลิต เส
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000006', 'Conductivity water ( nominal 0 mS/cm) "Merck" 5x100ML  *** เลิกผลิต เสนอ 104604.0105', 'Conductivity water ( nominal 0 mS/cm) 5x100ML *** เลิกผลิต เสนอ 104604.0105', '101810.0105', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Standard Solution', '1', 'PK', NULL, NULL, 14, 'Conductivity water ( nominal 0 mS/cm) "Merck" 5x100ML  *** เลิกผลิต เสนอ 104604.0105', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-007] Potassium chloride solution ( nominal 0.015 mS/cm) "Merck" 5x100 ML
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000007', 'Potassium chloride solution ( nominal 0.015 mS/cm) "Merck" 5x100 ML', 'Potassium chloride solution ( nominal 0.015 mS/cm)', '101811.0105', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Chemical', '1', 'PK', NULL, NULL, 14, 'Potassium chloride solution ( nominal 0.015 mS/cm) "Merck" 5x100 ML', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-008] Silica gel with indicator (orange gel) "Merck" 1 KG
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000008', 'Silica gel with indicator (orange gel) "Merck" 1 KG', 'Silica gel with indicator (orange gel)', '101969.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Reagent', '1', 'g', NULL, NULL, 14, 'Silica gel with indicator (orange gel) "Merck" 1 KG', 'Dry storage, sealed container', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-009] N-HEXANE FOR ANALYSIS EMSURE ACS,ISO, PH EUR "Merck" 2.5 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000009', 'N-HEXANE FOR ANALYSIS EMSURE ACS,ISO, PH EUR "Merck" 2.5 L', 'N-HEXANE', '104367.25', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'N-HEXANE FOR ANALYSIS EMSURE ACS,ISO, PH EUR "Merck" 2.5 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-010] N-HEPTANE GR "Merck" 1 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000010', 'N-HEPTANE GR "Merck" 1 L', 'N-HEPTANE GR', '104379.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '1', 'L', NULL, NULL, 14, 'N-HEPTANE GR "Merck" 1 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-011] IMIDAZOLE GR "Merck" 1 KG
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000011', 'IMIDAZOLE GR "Merck" 1 KG', 'IMIDAZOLE GR', '104716.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Reagent', '1', 'g', NULL, NULL, 14, 'IMIDAZOLE GR "Merck" 1 KG', 'Chemical storage cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-012] Methanol gradient grade for liquid chromatography LiChrosolv "Merck" 2
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000012', 'Methanol gradient grade for liquid chromatography LiChrosolv "Merck" 2.5 L', 'Methanol', '106007.25', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'Methanol gradient grade for liquid chromatography LiChrosolv "Merck" 2.5 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-013] METHANOL FOR ANALYSIS EMSURE ACS,ISO, PH EUR "Merck" 2.5 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000013', 'METHANOL FOR ANALYSIS EMSURE ACS,ISO, PH EUR "Merck" 2.5 L', 'Methanol', '106009.25', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'METHANOL FOR ANALYSIS EMSURE ACS,ISO, PH EUR "Merck" 2.5 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-014] METHANOL DRIED SECCOSOLV(MAX 0.003% H2O) "Merck" 1 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000014', 'METHANOL DRIED SECCOSOLV(MAX 0.003% H2O) "Merck" 1 L', 'Methanol dried', '106012.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '1', 'L', NULL, NULL, 14, 'METHANOL DRIED SECCOSOLV(MAX 0.003% H2O) "Merck" 1 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-015] Methanol hypergrade for LC-MS LiChrosolv. chemical formula CH3OH, mola
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000015', 'Methanol hypergrade for LC-MS LiChrosolv. chemical formula CH3OH, molar mass 32.04 g/mol. "Merck" 2.5L', 'Methanol LC-MS', '106035.25', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'Methanol hypergrade for LC-MS LiChrosolv. chemical formula CH3OH, molar mass 32.04 g/mol. "Merck" 2.5L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-016] DICHLOROMETHANE FOR ANALYSIS EMSURE ACS,ISO.REAG "Merck" 2.5 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000016', 'DICHLOROMETHANE FOR ANALYSIS EMSURE ACS,ISO.REAG "Merck" 2.5 L', 'DICHLOROMETHANEACS,ISO.REAG', '106050.25', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'DICHLOROMETHANE FOR ANALYSIS EMSURE ACS,ISO.REAG "Merck" 2.5 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-017] HYDROGEN PEROXIDE 30% H2O2 (PERHYDROL) GR ISO "Merck" 250 ML
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000017', 'HYDROGEN PEROXIDE 30% H2O2 (PERHYDROL) GR ISO "Merck" 250 ML', 'HYDROGEN PEROXIDE 30% H2O2 (PERHYDROL) GR ISO', '107209.025', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Oxidizer', '250', 'mL', NULL, NULL, 14, 'HYDROGEN PEROXIDE 30% H2O2 (PERHYDROL) GR ISO "Merck" 250 ML', 'Oxidizer cabinet, cool and dark area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-018] TETRAHYDROFURAN FOR LIQUID CHROMATOGRAPHY LICHROSO "Merck" 2.5 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000018', 'TETRAHYDROFURAN FOR LIQUID CHROMATOGRAPHY LICHROSO "Merck" 2.5 L', 'TETRAHYDROFURAN', '108101.25', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'TETRAHYDROFURAN FOR LIQUID CHROMATOGRAPHY LICHROSO "Merck" 2.5 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'B', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-019] TOLUENE FOR ANALYSIS EMSURE ACS,ISO, PH EUR "Merck" 2.5 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000019', 'TOLUENE FOR ANALYSIS EMSURE ACS,ISO, PH EUR "Merck" 2.5 L', 'TOLUENE', '108325.25', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'TOLUENE FOR ANALYSIS EMSURE ACS,ISO, PH EUR "Merck" 2.5 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-020] PERCHLORIC ACID 0,1 MOL/L IN ANHYDROUS ACETIC ACID "Merck" 1 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000020', 'PERCHLORIC ACID 0,1 MOL/L IN ANHYDROUS ACETIC ACID "Merck" 1 L', 'PERCHLORIC ACID 0,1 MOL/L IN ANHYDROUS ACETIC ACID', '109065.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Acid', '1', 'L', NULL, NULL, 14, 'PERCHLORIC ACID 0,1 MOL/L IN ANHYDROUS ACETIC ACID "Merck" 1 L', 'Corrosives cabinet, well-ventilated area', TRUE, TRUE, TRUE, TRUE, TRUE, 'A', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-021] SULFURIC ACID 0,5 MOL/L 1 N SOLUTION "Merck" 1 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000021', 'SULFURIC ACID 0,5 MOL/L 1 N SOLUTION "Merck" 1 L', 'SULFURIC ACID 0,5 MOL/L 1 N SOLUTION', '109072.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Acid', '1', 'L', NULL, NULL, 14, 'SULFURIC ACID 0,5 MOL/L 1 N SOLUTION "Merck" 1 L', 'Corrosives cabinet, well-ventilated area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-022] Sulfuric acid 0.25 mol/l(0.5 N) TitriPUR "Merck" 1 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000022', 'Sulfuric acid 0.25 mol/l(0.5 N) TitriPUR "Merck" 1 L', 'Sulfuric acid 0.25 mol/l(0.5 N) TitriPUR', '109073.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Acid', '1', 'L', NULL, NULL, 14, 'Sulfuric acid 0.25 mol/l(0.5 N) TitriPUR "Merck" 1 L', 'Corrosives cabinet, well-ventilated area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-023] Buffer solution (potassium hydrogen phthalate), traceable to SRM from 
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000023', 'Buffer solution (potassium hydrogen phthalate), traceable to SRM from NIST and PTB pH 4.01 (25 C) Certipur "Merck" 1 L', 'Buffer pH 4.01', '109406.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Buffer Solution', '1', 'L', NULL, NULL, 14, 'Buffer solution (potassium hydrogen phthalate), traceable to SRM from NIST and PTB pH 4.01 (25 C) Certipur "Merck" 1 L', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-024] Buffer solution (potassium dihydrogen phosphate/disodium hydrogen phos
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000024', 'Buffer solution (potassium dihydrogen phosphate/disodium hydrogen phosphate) traceable to SRM from NIST and PTB pH 7.00 (25 C) Certipur"Merck" 1L', 'Buffer pH 7.00', '109407.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Buffer Solution', '1', 'L', NULL, NULL, 14, 'Buffer solution (potassium dihydrogen phosphate/disodium hydrogen phosphate) traceable to SRM from NIST and PTB pH 7.00 (25 C) Certipur"Merck" 1L', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-025] Buffer solution (boric acid/potassium chloride/sodium hydroxide)tracea
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000025', 'Buffer solution (boric acid/potassium chloride/sodium hydroxide)traceable to SRM from NIST and PTB pH 10.00 (25 C) Certipur"Merck" 1L', 'Buffer pH 10.00', '109409.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Acid', '1', 'L', NULL, NULL, 14, 'Buffer solution (boric acid/potassium chloride/sodium hydroxide)traceable to SRM from NIST and PTB pH 10.00 (25 C) Certipur"Merck" 1L', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-026] Buffer solution (citric acid/sodium hydroxide/hydrogen chloride), trac
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000026', 'Buffer solution (citric acid/sodium hydroxide/hydrogen chloride), traceable to SRM from NIST and PTB pH 2.00 (20 Degree C) Certipur "Merck"   1 L', 'Buffer pH 2.00', '109433.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Acid', '1', 'L', NULL, NULL, 14, 'Buffer solution (citric acid/sodium hydroxide/hydrogen chloride), traceable to SRM from NIST and PTB pH 2.00 (20 Degree C) Certipur "Merck"   1 L', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-027] Buffer solution (citric acid/sodium hydroxide/hydrogen chloride), trac
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000027', 'Buffer solution (citric acid/sodium hydroxide/hydrogen chloride), traceable to SRM from NIST and PTB pH 4.00 (20 Degree C)  Certipur "Merck"  1 L', 'Buffer pH 4.00', '109435.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Acid', '1', 'L', NULL, NULL, 14, 'Buffer solution (citric acid/sodium hydroxide/hydrogen chloride), traceable to SRM from NIST and PTB pH 4.00 (20 Degree C)  Certipur "Merck"  1 L', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-028] Buffer solution citric acid/sodium hydroxide) traceable to SRM from NI
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000028', 'Buffer solution citric acid/sodium hydroxide) traceable to SRM from NIST and PTB pH 5.00 (20 C) Certipur "Merck" 1 L', 'Buffer pH 5.00', '109436.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Acid', '1', 'L', NULL, NULL, 14, 'Buffer solution citric acid/sodium hydroxide) traceable to SRM from NIST and PTB pH 5.00 (20 C) Certipur "Merck" 1 L', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-029] Buffer solution citric acid/sodium hydroxide), traceable to SRM from N
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000029', 'Buffer solution citric acid/sodium hydroxide), traceable to SRM from NIST and PTB pH 6.00 (20?C) Certipur "Merck" 1 L', 'Buffer pH 6.00', '109437.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Acid', '1', 'L', NULL, NULL, 14, 'Buffer solution citric acid/sodium hydroxide), traceable to SRM from NIST and PTB pH 6.00 (20?C) Certipur "Merck" 1 L', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-030] Buffer solution (boric acid/potassium chloride/sodium hydroxide), trac
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000030', 'Buffer solution (boric acid/potassium chloride/sodium hydroxide), traceable to SRM from NIST and PTB pH 10.00 (20 degree C) Certipur"Merck"   1 L', 'Buffer pH 10.00', '109438.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Acid', '1', 'L', NULL, NULL, 14, 'Buffer solution (boric acid/potassium chloride/sodium hydroxide), traceable to SRM from NIST and PTB pH 10.00 (20 degree C) Certipur"Merck"   1 L', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-031] Buffer solution (di-sodium hydrogen phosphate/potassium dihydrogen pho
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000031', 'Buffer solution (di-sodium hydrogen phosphate/potassium dihydrogen phosphate), traceable to SRM from NIST and PTB pH 7.00 (20 Degree C) Certipur "Merck" 1 L', 'Buffer pH 7.00', '109439.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Buffer Solution', '1', 'L', NULL, NULL, 14, 'Buffer solution (di-sodium hydrogen phosphate/potassium dihydrogen phosphate), traceable to SRM from NIST and PTB pH 7.00 (20 Degree C) Certipur "Merck" 1 L', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-032] Buffer solution (boric acid/sodium hydroxide/hydrogen chloride), trace
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000032', 'Buffer solution (boric acid/sodium hydroxide/hydrogen chloride), traceable to SRM from NIST and PTB pH 8.00 (20?C) Certipur "Merck" 1 L', 'Buffer pH 8.00', '109460.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Acid', '1', 'L', NULL, NULL, 15, 'Buffer solution (boric acid/sodium hydroxide/hydrogen chloride), traceable to SRM from NIST and PTB pH 8.00 (20?C) Certipur "Merck" 1 L', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-033] Buffer solution (boric acid/potassium chloride/sodium hydroxide), trac
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000033', 'Buffer solution (boric acid/potassium chloride/sodium hydroxide), traceable to SRM from NIST and PTB pH 9.00 (20 Degree C) Certipur "Merck" 1 L', 'Buffer pH 9.00', '109461.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Acid', '1', 'L', NULL, NULL, 14, 'Buffer solution (boric acid/potassium chloride/sodium hydroxide), traceable to SRM from NIST and PTB pH 9.00 (20 Degree C) Certipur "Merck" 1 L', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-034] pH-Indicator Strips Universal 0-14 pH "Merck" 100 ST
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000034', 'pH-Indicator Strips Universal 0-14 pH "Merck" 100 ST', 'pH-Indicator Strips Universal 0-14 pH', '109535.0001', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Indicator', '100', 'ST', NULL, NULL, 14, 'pH-Indicator Strips Universal 0-14 pH "Merck" 100 ST', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-035] 2-PROPANOL FOR ANALYSISEMSURE ACS,ISO, "Merck" 2.5 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000035', '2-PROPANOL FOR ANALYSISEMSURE ACS,ISO, "Merck" 2.5 L', '2-PROPANOLACS,ISO,', '109634.25', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '2.5', 'L', NULL, NULL, 14, '2-PROPANOL FOR ANALYSISEMSURE ACS,ISO, "Merck" 2.5 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'B', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-036] Acetonitrile isocratic grade for liquid chromatography LiChrosolv "Mer
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000036', 'Acetonitrile isocratic grade for liquid chromatography LiChrosolv "Merck" 2.5 L', 'Acetonitrile isocratic grade', '114291.25', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'Acetonitrile isocratic grade for liquid chromatography LiChrosolv "Merck" 2.5 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-037] METHYL METHACRYLATE (STABILISED WITH HYDROQUINONE "Merck" 100 ML
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000037', 'METHYL METHACRYLATE (STABILISED WITH HYDROQUINONE "Merck" 100 ML', 'METHYL METHACRYLATE (STABILISED WITH HYDROQUINONE', '800590.01', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Reagent', '100', 'L', NULL, NULL, 14, 'METHYL METHACRYLATE (STABILISED WITH HYDROQUINONE "Merck" 100 ML', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'C1', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-038] PHTHALIC ANHYDRIDE FOR SYNTHESIS "Merck" 1 KG
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000038', 'PHTHALIC ANHYDRIDE FOR SYNTHESIS "Merck" 1 KG', 'PHTHALIC ANHYDRIDE', '800592.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Reagent', '1', 'g', NULL, NULL, 14, 'PHTHALIC ANHYDRIDE FOR SYNTHESIS "Merck" 1 KG', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, TRUE, 'C2', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-039] CUMENE FOR SYNTHESIS "Merck" 100 ML
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000039', 'CUMENE FOR SYNTHESIS "Merck" 100 ML', 'CUMENE', '802681.01', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '100', 'L', NULL, NULL, 14, 'CUMENE FOR SYNTHESIS "Merck" 100 ML', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'B', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-040] STYRENE STABILISED FOR SYNTHESIS "Merck" 100 ML
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000040', 'STYRENE STABILISED FOR SYNTHESIS "Merck" 100 ML', 'STYRENE STABILISED', '807679.01', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '100', 'L', NULL, NULL, 14, 'STYRENE STABILISED FOR SYNTHESIS "Merck" 100 ML', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-041] DIPROPYLENE GLYCOL MONOMETHYL ETHER FOR SYNTHESIS "Merck"   1 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000041', 'DIPROPYLENE GLYCOL MONOMETHYL ETHER FOR SYNTHESIS "Merck"   1 L', 'DIPROPYLENE GLYCOL MONOMETHYL ETHER', '818533.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Reagent', '1', 'L', NULL, NULL, 14, 'DIPROPYLENE GLYCOL MONOMETHYL ETHER FOR SYNTHESIS "Merck"   1 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'D1', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-042] Propionaldehyde for synthesis "Merck"  1L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000042', 'Propionaldehyde for synthesis "Merck"  1L', 'Propionaldehyde', '822133.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Solvent', '1', 'L', NULL, NULL, 14, 'Propionaldehyde for synthesis "Merck"  1L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'B', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-043] Hydrogen peroxide 30% (stabilized) for synthesis "Merck" 1 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000043', 'Hydrogen peroxide 30% (stabilized) for synthesis "Merck" 1 L', 'Hydrogen peroxide 30% (stabilized)', '822287.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Oxidizer', '1', 'L', NULL, NULL, 14, 'Hydrogen peroxide 30% (stabilized) for synthesis "Merck" 1 L', 'Oxidizer cabinet, cool and dark area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-044] 1,2-PROPANEDIOL FOR SYNTHESIS "Merck"   1 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000044', '1,2-PROPANEDIOL FOR SYNTHESIS "Merck"   1 L', '1,2-PROPANEDIOL', '822324.1', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Reagent', '1', 'L', NULL, NULL, 30, '1,2-PROPANEDIOL FOR SYNTHESIS "Merck"   1 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'D1', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-045] WATER STANDARD 0.01%-APURA "Merck"  10x8ML  AMP
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000045', 'WATER STANDARD 0.01%-APURA "Merck"  10x8ML  AMP', 'WATER STANDARD 0.01%-APURA 10x8ML AMP', '188050.0010.', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Standard Solution', '1', 'PK', NULL, NULL, 14, 'WATER STANDARD 0.01%-APURA "Merck"  10x8ML  AMP', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-046] Water standard 0.1%"Merck" 10x8ml amp
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000046', 'Water standard 0.1%"Merck" 10x8ml amp', 'Water standard 0.1% 10x8ml amp', '188051.0010.', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'Standard Solution', '1', 'PK', NULL, NULL, 14, 'Water standard 0.1%"Merck" 10x8ml amp', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-047] 6478- 3M PETRIFILM RAC 25/PCHM2PCH "3M"
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000047', '6478- 3M PETRIFILM RAC 25/PCHM2PCH "3M"', '6478- 3M PETRIFILM RAC 25/PCHM2PCH', '3M-100691041', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'Microbiological Test Kit', '25', 'PC', NULL, NULL, 14, '6478- 3M PETRIFILM RAC 25/PCHM2PCH "3M"', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-048] Quick Swab 6432, 50 per box "3M"
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000048', 'Quick Swab 6432, 50 per box "3M"', 'Quick Swab 6432, 50 per box', '3M-6432', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'Microbiological Test Kit', '50', 'Box', NULL, NULL, 14, 'Quick Swab 6432, 50 per box "3M"', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-049] 1,2,3-Trimethylbenzene technical grade, 90% "Aldrich" 50ML
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000049', '1,2,3-Trimethylbenzene technical grade, 90% "Aldrich" 50ML', '1,2,3-Trimethylbenzene technical grade, 90%', 'ALD-T73202-50ML', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Chemical', '50', 'mL', NULL, NULL, 14, '1,2,3-Trimethylbenzene technical grade, 90% "Aldrich" 50ML', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-050] Sodium bromide, 97% "Alfa-Aesar" 500 G
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000050', 'Sodium bromide, 97% "Alfa-Aesar" 500 G', 'Sodium bromide, 97%', 'ALF-14037-500G', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000006', 'Reagent', '500', 'g', NULL, NULL, 14, 'Sodium bromide, 97% "Alfa-Aesar" 500 G', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-051] Tripropylene glycol "Alfa-Aesar" 250 ML
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000051', 'Tripropylene glycol "Alfa-Aesar" 250 ML', 'Tripropylene glycol', 'ALF-31798-250ML', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000006', 'Reagent', '250', 'mL', NULL, NULL, 14, 'Tripropylene glycol "Alfa-Aesar" 250 ML', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'D1', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-052] 2-Ethyl-4-methyl-1,3-dioxolane,cis+trans, 99% "Alfa Aesar"  5 G
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000052', '2-Ethyl-4-methyl-1,3-dioxolane,cis+trans, 99% "Alfa Aesar"  5 G', '2-Ethyl-4-methyl-1,3-dioxolane,cis+trans, 99%', 'ALF-H32187-5G', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000006', 'Reagent', '5', 'g', NULL, NULL, 14, '2-Ethyl-4-methyl-1,3-dioxolane,cis+trans, 99% "Alfa Aesar"  5 G', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-053] Viscosity Standard at 25 degree c, 100 cps "Ametek Brookfield, U.S.A" 
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000053', 'Viscosity Standard at 25 degree c, 100 cps "Ametek Brookfield, U.S.A" 500ML', 'Viscosity Standard at 25 degree c, 100 cps', 'AME-VS100', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000007', 'Standard Solution', '500', 'mL', NULL, NULL, 14, 'Viscosity Standard at 25 degree c, 100 cps "Ametek Brookfield, U.S.A" 500ML', 'Room temperature, stable environment', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-054] Viscosity Standard at 25 degree c, 1000 cps "Ametek Brookfield, U.S.A"
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000054', 'Viscosity Standard at 25 degree c, 1000 cps "Ametek Brookfield, U.S.A" 500ML', 'Viscosity Standard at 25 degree c, 1000 cps', 'AME-VS1000', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000007', 'Standard Solution', '500', 'mL', NULL, NULL, 14, 'Viscosity Standard at 25 degree c, 1000 cps "Ametek Brookfield, U.S.A" 500ML', 'Room temperature, stable environment', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-055] Viscosity Standard at 25 degree c, 12500 cps "Ametek Brookfield, U.S.A
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000055', 'Viscosity Standard at 25 degree c, 12500 cps "Ametek Brookfield, U.S.A" 500ML500ML', 'Viscosity Standard at 25 degree c, 12500 cps 500ML500ML', 'AME-VS12500', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000007', 'Standard Solution', '500', 'mL', NULL, NULL, 14, 'Viscosity Standard at 25 degree c, 12500 cps "Ametek Brookfield, U.S.A" 500ML500ML', 'Room temperature, stable environment', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-056] Viscosity Standard at 25 degree c, 500 cps "Ametek Brookfield"
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000056', 'Viscosity Standard at 25 degree c, 500 cps "Ametek Brookfield"', 'Viscosity Standard at 25 degree c, 500 cps', 'AME-VS500', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000007', 'Standard Solution', '500', 'mL', NULL, NULL, 14, 'Viscosity Standard at 25 degree c, 500 cps "Ametek Brookfield"', 'Room temperature, stable environment', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-057] Methanol, anhydrous (50 ppm) "Labscan" 1 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000057', 'Methanol, anhydrous (50 ppm) "Labscan" 1 L', 'Methanol, anhydrous (50 ppm)', 'LAB-AH1118-G1L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '1', 'L', NULL, NULL, 14, 'Methanol, anhydrous (50 ppm) "Labscan" 1 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-058] Acetone AR (Plastic) "Labscan" 4 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000058', 'Acetone AR (Plastic) "Labscan" 4 L', 'Acetone AR (Plastic)', 'LAB-AR1003-P4L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '4', 'L', NULL, NULL, 14, 'Acetone AR (Plastic) "Labscan" 4 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-059] Chloroform (stabilized with 1% Ethanol), AR "Labscan"  2.5L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000059', 'Chloroform (stabilized with 1% Ethanol), AR "Labscan"  2.5L', 'Chloroform (stabilized with 1% Ethanol), AR', 'LAB-AR1027E-G2.5L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'Chloroform (stabilized with 1% Ethanol), AR "Labscan"  2.5L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'B', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-060] Dimethylformamide, AR "Labscan" 2.5L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000060', 'Dimethylformamide, AR "Labscan" 2.5L', 'Dimethylformamide, AR', 'LAB-AR1051-G2.5L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'Dimethylformamide, AR "Labscan" 2.5L', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-061] Methanol, AR "Labscan" 2.5L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000061', 'Methanol, AR "Labscan" 2.5L', 'Methanol AR', 'LAB-AR1115-G2.5L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'Methanol, AR "Labscan" 2.5L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-062] Methanol, AR "Labscan" 2.5L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000062', 'Methanol, AR "Labscan" 2.5L', 'Methanol AR', 'LAB-AR1115-P2.5L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'Methanol, AR "Labscan" 2.5L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-063] N-PENTANE 99% AR GRADE "Labscan"  2.5 L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000063', 'N-PENTANE 99% AR GRADE "Labscan"  2.5 L', 'N-PENTANE 99% AR GRADE', 'LAB-AR1146-G2.5L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'N-PENTANE 99% AR GRADE "Labscan"  2.5 L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-064] 2-Propanol, AR "Labscan" 2.5L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000064', '2-Propanol, AR "Labscan" 2.5L', '2-Propanol, AR', 'LAB-AR1162-P2.5L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '2.5', 'L', NULL, NULL, 14, '2-Propanol, AR "Labscan" 2.5L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'B', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-065] Isooctane, AR "Labscan" 2.5L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000065', 'Isooctane, AR "Labscan" 2.5L', 'Isooctane, AR', 'LAB-AR1206-G2.5L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'Isooctane, AR "Labscan" 2.5L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-066] Toluene, AR "Labscan" 2.5L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000066', 'Toluene, AR "Labscan" 2.5L', 'Toluene, AR', 'LAB-AR1207-G2.5L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'Toluene, AR "Labscan" 2.5L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-067] Methanol, CG (Plastic) "LABSOLV" 4L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000067', 'Methanol, CG (Plastic) "LABSOLV" 4L', 'Methanol CG', 'LAB-CG05S0014204-4L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '4', 'L', NULL, NULL, 14, 'Methanol, CG (Plastic) "LABSOLV" 4L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-068] Acetone, HPLC "Labscan" 2.5L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000068', 'Acetone, HPLC "Labscan" 2.5L', 'Acetone HPLC', 'LAB-LC1003-G2.5L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'Acetone, HPLC "Labscan" 2.5L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-069] Methanol, HPLC "Labscan"  2.5L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000069', 'Methanol, HPLC "Labscan"  2.5L', 'Methanol HPLC', 'LAB-LC1115-G2.5L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'Methanol, HPLC "Labscan"  2.5L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-070] Tetrahydrofuran, HPLC "Labscan" 2.5L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000070', 'Tetrahydrofuran, HPLC "Labscan" 2.5L', 'THF HPLC', 'LAB-LC1200-G2.5L', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'Solvent', '2.5', 'L', NULL, NULL, 14, 'Tetrahydrofuran, HPLC "Labscan" 2.5L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'B', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-071] 2,4 DINITROPHENYL HYDRAZINE 99%, AR "Loba"   100 G
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000071', '2,4 DINITROPHENYL HYDRAZINE 99%, AR "Loba"   100 G', '2,4 DINITROPHENYL HYDRAZINE 99%, AR', 'LOB-03471-100G', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000009', 'Chemical', '100', 'g', NULL, NULL, 14, '2,4 DINITROPHENYL HYDRAZINE 99%, AR "Loba"   100 G', 'Chemical storage cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'A', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-072] Methanol "Labsupply" 4L
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000072', 'Methanol "Labsupply" 4L', 'Methanol ??', 'MAC-6501-40', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000010', 'Solvent', '4', 'L', NULL, NULL, 14, 'Methanol "Labsupply" 4L', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, TRUE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-001] Glass bottle 60 ML with septum and aluminum cap
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000073', 'Glass bottle 60 ML with septum and aluminum cap', 'Glass bottle 60 ML with septum and aluminum cap', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000011', 'Glassware', '1', 'EA', NULL, NULL, 14, 'Glass bottle 60 ML with septum and aluminum cap', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-002] Glass bottle 60 ML with septum and aluminium cap
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000074', 'Glass bottle 60 ML with septum and aluminium cap', 'Glass bottle 60 ML with septum and aluminium cap', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000011', 'Glassware', '1', 'EA', NULL, NULL, 14, 'Glass bottle 60 ML with septum and aluminium cap', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-003] Glass bottle 500 ML with septum and aluminium cap
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000075', 'Glass bottle 500 ML with septum and aluminium cap', 'Glass bottle 500 ML with septum and aluminium cap', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000011', 'Glassware', '1', 'EA', NULL, NULL, 14, 'Glass bottle 500 ML with septum and aluminium cap', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-004] Vial 2 mL clear color 9 mm neck ใส คอเกลียว 100 PCS/PACK , KIMA
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000076', 'Vial 2 mL clear color 9 mm neck ใส คอเกลียว 100 PCS/PACK , KIMA', 'Vial 2 mL clear color 9 mm neck ใส คอเกลียว 100 PCS/PACK , KIMA', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000011', 'Glassware', '1', 'EA', NULL, NULL, 14, 'Vial 2 mL clear color 9 mm neck ใส คอเกลียว 100 PCS/PACK , KIMA', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-005] 9mm write PTFE/red Silicone septa blue scew polypropylene cap 6 mm cen
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000077', '9mm write PTFE/red Silicone septa blue scew polypropylene cap 6 mm center hole 100 Pcs/Pack', '9mm write PTFE/red Silicone septa blue scew polypropylene cap 6 mm center hol...', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000011', 'Consumable', '1', 'EA', NULL, NULL, 14, '9mm write PTFE/red Silicone septa blue scew polypropylene cap 6 mm center hole 100 Pcs/Pack', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-006] Glass bottle 500 ML with septum and aluminium cap
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000078', 'Glass bottle 500 ML with septum and aluminium cap', 'Glass bottle 500 ML with septum and aluminium cap', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000011', 'Glassware', '1', 'EA', NULL, NULL, 14, 'Glass bottle 500 ML with septum and aluminium cap', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-007] Syringe NIPRO Luer lock 3 ml  (100pcs/Box)
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000079', 'Syringe NIPRO Luer lock 3 ml  (100pcs/Box)', 'Syringe NIPRO Luer lock 3 ml (100pcs/Box)', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Lab Supply', '1', 'Box', NULL, NULL, 14, 'Syringe NIPRO Luer lock 3 ml  (100pcs/Box)', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-008] Syringe NIPRO Luer lock 3 ml  (100pcs/Box)
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000080', 'Syringe NIPRO Luer lock 3 ml  (100pcs/Box)', 'Syringe NIPRO Luer lock 3 ml (100pcs/Box)', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Lab Supply', '1', 'Box', NULL, NULL, 14, 'Syringe NIPRO Luer lock 3 ml  (100pcs/Box)', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-009] NEEDLE NO.18G, LENGTH 1.5",(100PCS/BOX),
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000081', 'NEEDLE NO.18G, LENGTH 1.5",(100PCS/BOX),', 'NEEDLE NO.18G, LENGTH 1.5",(100PCS/BOX),', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Lab Supply', '1', 'Box', NULL, NULL, 14, 'NEEDLE NO.18G, LENGTH 1.5",(100PCS/BOX),', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-010] NEEDLE NO.18G, LENGTH 1.5",(100PCS/BOX),
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000082', 'NEEDLE NO.18G, LENGTH 1.5",(100PCS/BOX),', 'NEEDLE NO.18G, LENGTH 1.5",(100PCS/BOX),', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Lab Supply', '1', 'Box', NULL, NULL, 14, 'NEEDLE NO.18G, LENGTH 1.5",(100PCS/BOX),', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-011] Micro-Insert 250 ul.,31x5 mm. (100/PK) " Vertical
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000083', 'Micro-Insert 250 ul.,31x5 mm. (100/PK) " Vertical', 'Micro-Insert 250 ul.,31x5 mm. (100/PK) " Vertical', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Glassware', '1', 'PK', NULL, NULL, 14, 'Micro-Insert 250 ul.,31x5 mm. (100/PK) " Vertical', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-012] Micro-Insert 250 ul.,31x5 mm. (100/PK) " Vertical
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000084', 'Micro-Insert 250 ul.,31x5 mm. (100/PK) " Vertical', 'Micro-Insert 250 ul.,31x5 mm. (100/PK) " Vertical', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Glassware', '1', 'PK', NULL, NULL, 14, 'Micro-Insert 250 ul.,31x5 mm. (100/PK) " Vertical', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-013] Glass beaker size 100 ml
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000085', 'Glass beaker size 100 ml', 'Glass beaker size', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Glassware', '1', 'EA', NULL, NULL, 14, 'Glass beaker size 100 ml', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-014] Glass beaker size 100 ml
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000086', 'Glass beaker size 100 ml', 'Glass beaker size', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Glassware', '1', 'EA', NULL, NULL, 14, 'Glass beaker size 100 ml', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-015] Kimwipes EX-L Box - 280 Wipes (กระดาษเช็ดเลนส์)
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000087', 'Kimwipes EX-L Box - 280 Wipes (กระดาษเช็ดเลนส์)', 'Kimwipes EX-L Box - 280 Wipes (กระดาษเช็ดเลนส์)', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Consumable', '1', 'Box', NULL, NULL, 14, 'Kimwipes EX-L Box - 280 Wipes (กระดาษเช็ดเลนส์)', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-016] Kimwipes EX-L Box - 280 Wipes (กระดาษเช็ดเลนส์)
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000088', 'Kimwipes EX-L Box - 280 Wipes (กระดาษเช็ดเลนส์)', 'Kimwipes EX-L Box - 280 Wipes (กระดาษเช็ดเลนส์)', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Consumable', '1', 'Box', NULL, NULL, 14, 'Kimwipes EX-L Box - 280 Wipes (กระดาษเช็ดเลนส์)', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-017] Kimwipes EX-L Box - 280 Wipes (กระดาษเช็ดเลนส์)
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000089', 'Kimwipes EX-L Box - 280 Wipes (กระดาษเช็ดเลนส์)', 'Kimwipes EX-L Box - 280 Wipes (กระดาษเช็ดเลนส์)', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Consumable', '1', 'Box', NULL, NULL, 14, 'Kimwipes EX-L Box - 280 Wipes (กระดาษเช็ดเลนส์)', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-018] Nalgene wash bottles for Methanol 500 ml
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000090', 'Nalgene wash bottles for Methanol 500 ml', 'Nalgene wash bottles for Methanol', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Lab Supply', '1', 'EA', NULL, NULL, 14, 'Nalgene wash bottles for Methanol 500 ml', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [MAT-019] Nalgene wash bottles for Methanol 500 ml
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000091', 'Nalgene wash bottles for Methanol 500 ml', 'Nalgene wash bottles for Methanol', NULL, NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000012', 'Lab Supply', '1', 'EA', NULL, NULL, 14, 'Nalgene wash bottles for Methanol 500 ml', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [GAS-001] Nitrogen UHP 99.999% Code:1100060
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000092', 'Nitrogen UHP 99.999% Code:1100060', 'Nitrogen UHP 99.999% Code:1100060', NULL, NULL, 'd0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000013', 'Compressed Gas', '1', 'EA', NULL, NULL, 14, 'Nitrogen UHP 99.999% Code:1100060', 'Gas cylinder storage, well-ventilated area', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [GAS-002] Argon UHP  99.999% Code: 1100033
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000093', 'Argon UHP  99.999% Code: 1100033', 'Argon UHP 99.999% Code: 1100033', NULL, NULL, 'd0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000013', 'Compressed Gas', '1', 'EA', NULL, NULL, 14, 'Argon UHP  99.999% Code: 1100033', 'Gas cylinder storage, well-ventilated area', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [GAS-003] Hydrogen UHP 99.999% Code:1100107
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000094', 'Hydrogen UHP 99.999% Code:1100107', 'Hydrogen UHP 99.999% Code:1100107', NULL, NULL, 'd0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000013', 'Compressed Gas', '1', 'EA', NULL, NULL, 14, 'Hydrogen UHP 99.999% Code:1100107', 'Gas cylinder storage, well-ventilated area', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [GAS-004] Helium Premier 99.999% Code: 1100201
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000095', 'Helium Premier 99.999% Code: 1100201', 'Helium Premier 99.999% Code: 1100201', NULL, NULL, 'd0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000013', 'Compressed Gas', '1', 'EA', NULL, NULL, 14, 'Helium Premier 99.999% Code: 1100201', 'Gas cylinder storage, well-ventilated area', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [GAS-005] Air Zero Code: 1100083
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000096', 'Air Zero Code: 1100083', 'Air Zero Code: 1100083', NULL, NULL, 'd0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000013', 'Compressed Gas', '1', 'EA', NULL, NULL, 14, 'Air Zero Code: 1100083', 'Gas cylinder storage, well-ventilated area', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [GAS-006] O2 PREMIER Code: 1100194
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000097', 'O2 PREMIER Code: 1100194', 'O2 PREMIER Code: 1100194', NULL, NULL, 'd0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000013', 'Compressed Gas', '1', 'EA', NULL, NULL, 14, 'O2 PREMIER Code: 1100194', 'Gas cylinder storage, well-ventilated area', TRUE, TRUE, TRUE, FALSE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-073] Prolylene Glycol Retained sample
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000098', 'Prolylene Glycol Retained sample', 'Prolylene Glycol Retained sample', NULL, NULL, 'd0000000-0000-0000-0000-000000000001', NULL, 'Reagent', '1', 'EA', NULL, NULL, 14, 'Prolylene Glycol Retained sample', 'Flammable cabinet, cool and dry area', TRUE, TRUE, TRUE, TRUE, TRUE, 'D2', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-001] STD EB Ver.
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000099', 'STD EB Ver.', 'STD EB Ver.', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD EB Ver.', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-002] STD BT Ver.
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000100', 'STD BT Ver.', 'STD BT Ver.', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD BT Ver.', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-003] STD ALK TAR Ver.
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000101', 'STD ALK TAR Ver.', 'STD ALK TAR Ver.', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD ALK TAR Ver.', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-004] STD FIN TAR Ver.
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000102', 'STD FIN TAR Ver.', 'STD FIN TAR Ver.', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD FIN TAR Ver.', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-005] STD CR Ver.
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000103', 'STD CR Ver.', 'STD CR Ver.', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD CR Ver.', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-006] STD DVB Ver.
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000104', 'STD DVB Ver.', 'STD DVB Ver.', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD DVB Ver.', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-007] STD ALK Ver.
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000105', 'STD ALK Ver.', 'STD ALK Ver.', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD ALK Ver.', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-008] STD Sulfer Ver.
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000106', 'STD Sulfer Ver.', 'STD Sulfer Ver.', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD Sulfer Ver.', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-009] STD SM Ver.
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000107', 'STD SM Ver.', 'STD SM Ver.', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD SM Ver.', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-010] Antioxidant STD Stock Solution 2000 ppm
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000108', 'Antioxidant STD Stock Solution 2000 ppm', 'Antioxidant STD Stock Solution 2000 ppm', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'Antioxidant STD Stock Solution 2000 ppm', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-011] STD Residual Stock
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000109', 'STD Residual Stock', 'STD Residual Stock', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD Residual Stock', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-012] STD Residual Organic
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000110', 'STD Residual Organic', 'STD Residual Organic', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD Residual Organic', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-013] STD for Recycle PS 01
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000111', 'STD for Recycle PS 01', 'STD for Recycle PS 01', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD for Recycle PS 01', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-014] STD for Recycle PS 02
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000112', 'STD for Recycle PS 02', 'STD for Recycle PS 02', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'STD for Recycle PS 02', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-015] Standard Water_GC
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000113', 'Standard Water_GC', 'Standard Water_GC', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'Standard Water_GC', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-016] Standard Glycol blend
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000114', 'Standard Glycol blend', 'Standard Glycol blend', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'Standard Glycol blend', 'Room temperature, standard laboratory storage', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-017] Acetaldehyde ( for prepare Standard verify)
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000115', 'Acetaldehyde ( for prepare Standard verify)', 'Acetaldehyde ( for prepare Standard verify)', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'Acetaldehyde ( for prepare Standard verify)', 'Flammable cabinet, cool and dry area', FALSE, TRUE, TRUE, TRUE, TRUE, 'B', FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [STD-018] Methanol ( for prepare Standard verify FIN_PO)
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000116', 'Methanol ( for prepare Standard verify FIN_PO)', 'Methanol ( for prepare Standard verify FIN_PO)', NULL, NULL, 'd0000000-0000-0000-0000-000000000004', NULL, 'Reference Standard', '1', 'EA', NULL, NULL, 14, 'Methanol ( for prepare Standard verify FIN_PO)', 'Flammable cabinet, cool and dry area', FALSE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-074] AMMONIA TNT+, ULR, 0.015-2.0 MG/L PK/25
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000117', 'AMMONIA TNT+, ULR, 0.015-2.0 MG/L PK/25', 'AMMONIA TNT+, ULR, 0.015-2.0 MG/L PK/25', NULL, NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000014', 'Reagent', '1', 'PK', NULL, NULL, 14, 'AMMONIA TNT+, ULR, 0.015-2.0 MG/L PK/25', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-075] NITRATE,TNT+ LR, 0.2-13.5MG/L PK/25
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000118', 'NITRATE,TNT+ LR, 0.2-13.5MG/L PK/25', 'NITRATE,TNT+ LR, 0.2-13.5MG/L PK/25', NULL, NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000014', 'Reagent', '1', 'PK', NULL, NULL, 14, 'NITRATE,TNT+ LR, 0.2-13.5MG/L PK/25', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-076] aa PHOSPHORUS TNT+ LR PK/25 (0.05-1.5MG/L PO4-P)
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000119', 'aa PHOSPHORUS TNT+ LR PK/25 (0.05-1.5MG/L PO4-P)', 'aa PHOSPHORUS TNT+ LR PK/25 (0.05-1.5MG/L PO4-P)', NULL, NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000014', 'Reagent', '1', 'PK', NULL, NULL, 14, 'aa PHOSPHORUS TNT+ LR PK/25 (0.05-1.5MG/L PO4-P)', 'Room temperature, away from direct sunlight', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-077] Molybdate 3 Reagent, 100 mL (100 tests) MDB
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000120', 'Molybdate 3 Reagent, 100 mL (100 tests) MDB', 'Molybdate 3 Reagent, 100 mL (100 tests) MDB', NULL, NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000014', 'Reagent', '100', 'EA', NULL, NULL, 14, 'Molybdate 3 Reagent, 100 mL (100 tests) MDB', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-078] Citric Acid F Reagent Solution, 100 mL MDB
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000121', 'Citric Acid F Reagent Solution, 100 mL MDB', 'Citric Acid F Reagent Solution, 100 mL MDB', NULL, NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000014', 'Acid', '100', 'EA', NULL, NULL, 14, 'Citric Acid F Reagent Solution, 100 mL MDB', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-079] Amino acid f rgt soln, 100ml
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000122', 'Amino acid f rgt soln, 100ml', 'Amino acid f rgt soln,', NULL, NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000014', 'Acid', '100', 'EA', NULL, NULL, 14, 'Amino acid f rgt soln, 100ml', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-080] Chlorine 25-30mg/L 2mL pk/20 Ampules Standard Solutions as Cl2
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000123', 'Chlorine 25-30mg/L 2mL pk/20 Ampules Standard Solutions as Cl2', 'Chlorine 25-30mg/L 2mL pk/20 Ampules Standard Solutions as Cl2', NULL, NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000014', 'Standard Solution', '1', 'PK', NULL, NULL, 14, 'Chlorine 25-30mg/L 2mL pk/20 Ampules Standard Solutions as Cl2', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');

-- [CHEM-081] Silica std soln, 1mg/l 500ml
INSERT INTO "Items" ("Id", "ItemName", "ItemShortName", "PartNo", "CasNo", "CategoryId", "DefaultVendorId", "Type", "Size", "Unit", "ReferencePrice", "Currency", "LeadTimeDays", "Description", "StorageConditions", "IsOrderable", "RequiresCheckin", "AllowsCheckout", "TracksExpiry", "RequiresPeroxideMonitoring", "PeroxideClass", "IsRegulatoryRelated", "IsActive", "CreatedAt")
VALUES ('f1000000-0000-0000-0000-000000000124', 'Silica std soln, 1mg/l 500ml', 'Silica std soln, 1mg/l', NULL, NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000014', 'Standard Solution', '500', 'EA', NULL, NULL, 14, 'Silica std soln, 1mg/l 500ml', 'Room temperature, standard laboratory storage', TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, TRUE, '2026-01-01T00:00:00Z');


-- ═══════════════════════════════════════════════════════════════════════════
-- SECTION 3: ItemLabSettings (min stock per lab)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000003', 'f1000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000006', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000004', 'f1000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-00000000000e', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000005', 'f1000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-00000000000f', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000006', 'f1000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000010', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- ATC Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000007', 'f1000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000008', 'f1000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000010', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- ATC Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000009', 'f1000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000010', 'f1000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000011', 'f1000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000006', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000012', 'f1000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000013', 'f1000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000014', 'f1000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000015', 'f1000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000010', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- ATC Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000016', 'f1000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000017', 'f1000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-00000000000e', 4.0, 8.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000018', 'f1000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000019', 'f1000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000006', 3.0, 6.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000020', 'f1000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-00000000000e', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000021', 'f1000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-00000000000f', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000022', 'f1000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000010', 3.0, 6.0, TRUE, '2026-01-01T00:00:00Z');  -- ATC Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000023', 'f1000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000006', 5.0, 10.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000024', 'f1000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000010', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- ATC Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000025', 'f1000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000006', 4.0, 8.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000026', 'f1000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-00000000000f', 4.0, 8.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000027', 'f1000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000010', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- ATC Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000028', 'f1000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-00000000000e', 5.0, 10.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000029', 'f1000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000006', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000030', 'f1000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000006', 4.0, 8.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000031', 'f1000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000010', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- ATC Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000032', 'f1000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000033', 'f1000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000034', 'f1000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-00000000000e', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000035', 'f1000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000036', 'f1000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000037', 'f1000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000038', 'f1000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000006', 3.0, 6.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000039', 'f1000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000006', 3.0, 6.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000040', 'f1000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000041', 'f1000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000006', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000042', 'f1000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000010', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- ATC Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000043', 'f1000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000044', 'f1000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000045', 'f1000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000046', 'f1000000-0000-0000-0000-000000000030', 'c0000000-0000-0000-0000-000000000006', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000047', 'f1000000-0000-0000-0000-000000000030', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000048', 'f1000000-0000-0000-0000-000000000031', 'c0000000-0000-0000-0000-00000000000e', 3.0, 6.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000049', 'f1000000-0000-0000-0000-000000000031', 'c0000000-0000-0000-0000-00000000000f', 3.0, 6.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000050', 'f1000000-0000-0000-0000-000000000031', 'c0000000-0000-0000-0000-000000000010', 3.0, 6.0, TRUE, '2026-01-01T00:00:00Z');  -- ATC Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000051', 'f1000000-0000-0000-0000-000000000032', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000052', 'f1000000-0000-0000-0000-000000000032', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000053', 'f1000000-0000-0000-0000-000000000033', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000054', 'f1000000-0000-0000-0000-000000000033', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000055', 'f1000000-0000-0000-0000-000000000034', 'c0000000-0000-0000-0000-000000000006', 3.0, 6.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000056', 'f1000000-0000-0000-0000-000000000034', 'c0000000-0000-0000-0000-00000000000f', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000057', 'f1000000-0000-0000-0000-000000000035', 'c0000000-0000-0000-0000-000000000006', 5.0, 10.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000058', 'f1000000-0000-0000-0000-000000000036', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000059', 'f1000000-0000-0000-0000-000000000036', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000060', 'f1000000-0000-0000-0000-000000000036', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000061', 'f1000000-0000-0000-0000-000000000036', 'c0000000-0000-0000-0000-000000000010', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- ATC Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000062', 'f1000000-0000-0000-0000-000000000037', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000063', 'f1000000-0000-0000-0000-000000000038', 'c0000000-0000-0000-0000-000000000006', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000064', 'f1000000-0000-0000-0000-000000000038', 'c0000000-0000-0000-0000-00000000000e', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000065', 'f1000000-0000-0000-0000-000000000039', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000066', 'f1000000-0000-0000-0000-000000000040', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000067', 'f1000000-0000-0000-0000-000000000041', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000068', 'f1000000-0000-0000-0000-000000000042', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000069', 'f1000000-0000-0000-0000-000000000043', 'c0000000-0000-0000-0000-00000000000e', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000070', 'f1000000-0000-0000-0000-000000000044', 'c0000000-0000-0000-0000-000000000006', 3.0, 6.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000071', 'f1000000-0000-0000-0000-000000000045', 'c0000000-0000-0000-0000-000000000006', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000072', 'f1000000-0000-0000-0000-000000000045', 'c0000000-0000-0000-0000-00000000000e', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000073', 'f1000000-0000-0000-0000-000000000046', 'c0000000-0000-0000-0000-000000000006', 4.0, 8.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000074', 'f1000000-0000-0000-0000-000000000047', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000075', 'f1000000-0000-0000-0000-000000000048', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000076', 'f1000000-0000-0000-0000-000000000049', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000077', 'f1000000-0000-0000-0000-000000000050', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000078', 'f1000000-0000-0000-0000-000000000051', 'c0000000-0000-0000-0000-000000000006', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000079', 'f1000000-0000-0000-0000-000000000052', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000080', 'f1000000-0000-0000-0000-000000000053', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000081', 'f1000000-0000-0000-0000-000000000054', 'c0000000-0000-0000-0000-00000000000f', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000082', 'f1000000-0000-0000-0000-000000000055', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000083', 'f1000000-0000-0000-0000-000000000056', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000084', 'f1000000-0000-0000-0000-000000000057', 'c0000000-0000-0000-0000-000000000006', 5.0, 10.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000085', 'f1000000-0000-0000-0000-000000000057', 'c0000000-0000-0000-0000-00000000000e', 5.0, 10.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000086', 'f1000000-0000-0000-0000-000000000058', 'c0000000-0000-0000-0000-000000000006', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000087', 'f1000000-0000-0000-0000-000000000058', 'c0000000-0000-0000-0000-00000000000e', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000088', 'f1000000-0000-0000-0000-000000000059', 'c0000000-0000-0000-0000-000000000006', 4.0, 8.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000089', 'f1000000-0000-0000-0000-000000000060', 'c0000000-0000-0000-0000-00000000000e', 5.0, 10.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000090', 'f1000000-0000-0000-0000-000000000061', 'c0000000-0000-0000-0000-000000000006', 5.0, 10.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000091', 'f1000000-0000-0000-0000-000000000061', 'c0000000-0000-0000-0000-00000000000e', 5.0, 10.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000092', 'f1000000-0000-0000-0000-000000000062', 'c0000000-0000-0000-0000-000000000006', 10.0, 20.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000093', 'f1000000-0000-0000-0000-000000000063', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000094', 'f1000000-0000-0000-0000-000000000064', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000095', 'f1000000-0000-0000-0000-000000000064', 'c0000000-0000-0000-0000-00000000000e', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000096', 'f1000000-0000-0000-0000-000000000065', 'c0000000-0000-0000-0000-000000000006', 3.0, 6.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000097', 'f1000000-0000-0000-0000-000000000065', 'c0000000-0000-0000-0000-00000000000e', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000098', 'f1000000-0000-0000-0000-000000000066', 'c0000000-0000-0000-0000-000000000006', 5.0, 10.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000099', 'f1000000-0000-0000-0000-000000000066', 'c0000000-0000-0000-0000-00000000000e', 4.0, 8.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000100', 'f1000000-0000-0000-0000-000000000067', 'c0000000-0000-0000-0000-000000000006', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000101', 'f1000000-0000-0000-0000-000000000067', 'c0000000-0000-0000-0000-00000000000e', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000102', 'f1000000-0000-0000-0000-000000000067', 'c0000000-0000-0000-0000-00000000000f', 2.0, 4.0, TRUE, '2026-01-01T00:00:00Z');  -- CT Lab
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000103', 'f1000000-0000-0000-0000-000000000068', 'c0000000-0000-0000-0000-00000000000e', 4.0, 8.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000104', 'f1000000-0000-0000-0000-000000000069', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000105', 'f1000000-0000-0000-0000-000000000070', 'c0000000-0000-0000-0000-00000000000e', 4.0, 8.0, TRUE, '2026-01-01T00:00:00Z');  -- MTP Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000106', 'f1000000-0000-0000-0000-000000000071', 'c0000000-0000-0000-0000-000000000006', 1.0, 2.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared
INSERT INTO "ItemLabSettings" ("Id", "ItemId", "LabId", "MinStock", "ReorderQuantity", "IsStocked", "CreatedAt")
VALUES ('11000000-0000-0000-0000-000000000107', 'f1000000-0000-0000-0000-000000000072', 'c0000000-0000-0000-0000-000000000006', 3.0, 6.0, TRUE, '2026-01-01T00:00:00Z');  -- AIE Shared