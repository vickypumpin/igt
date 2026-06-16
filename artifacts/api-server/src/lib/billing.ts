import { eq } from "drizzle-orm";
import { db, usersTable, agenciesTable } from "@workspace/db";

export interface BillingConfig {
  billingMode: string | null;
  commissionRate: number;
  agencyId: number | null;
  source: "agency" | "user";
}

/**
 * Resolves effective billing configuration for a brand user.
 * When the brand has an agencyId, inherits billing from the parent
 * agency record (agenciesTable). Otherwise uses the brand's own
 * billing settings from usersTable.
 *
 * This is the single source of truth used by:
 *  - /admin/accounts/:id/billing GET (display)
 *  - /admin/payouts/:id/approve commission hook
 */
export async function resolveBilling(brandId: number): Promise<BillingConfig | null> {
  const [brand] = await db
    .select({
      agencyId: usersTable.agencyId,
      billingMode: usersTable.billingMode,
      commissionRate: usersTable.commissionRate,
    })
    .from(usersTable)
    .where(eq(usersTable.id, brandId));

  if (!brand) return null;

  if (brand.agencyId) {
    const [agency] = await db
      .select({
        id: agenciesTable.id,
        billingMode: agenciesTable.billingMode,
        commissionRate: agenciesTable.commissionRate,
      })
      .from(agenciesTable)
      .where(eq(agenciesTable.id, brand.agencyId));

    if (agency) {
      return {
        billingMode: agency.billingMode,
        commissionRate: parseFloat(String(agency.commissionRate ?? "0")),
        agencyId: agency.id,
        source: "agency",
      };
    }
  }

  return {
    billingMode: brand.billingMode,
    commissionRate: parseFloat(String(brand.commissionRate ?? "0")),
    agencyId: null,
    source: "user",
  };
}
