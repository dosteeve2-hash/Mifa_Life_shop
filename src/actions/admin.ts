"use server";

export async function getDashboardDataAction() {
  return {
    totalPotentialRevenue: 0,
    totalStock: 0,
    mostPopularCategory: "N/A",
    numberOfProducts: 0,
  };
}
