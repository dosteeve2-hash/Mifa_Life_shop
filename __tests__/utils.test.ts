import { describe, it, expect } from "vitest";

describe("Formatage monetaire FCFA", () => {
  it("les chiffres sont preserves dans le formatage fr-FR", () => {
    const formatted = new Intl.NumberFormat("fr-FR").format(1500000);
    expect(formatted.replace(/[^0-9]/g, "")).toBe("1500000");
  });

  it("formate zero", () => {
    expect(new Intl.NumberFormat("fr-FR").format(0)).toBe("0");
  });

  it("formate 75000", () => {
    const formatted = new Intl.NumberFormat("fr-FR").format(75000);
    expect(formatted.replace(/[^0-9]/g, "")).toBe("75000");
  });
});

describe("Calcul remise e-commerce", () => {
  it("remise 10% sur 50000 FCFA", () => {
    expect(Math.round(50000 * 0.9)).toBe(45000);
  });

  it("arrondi correct sur 33333 * 0.9", () => {
    expect(Math.round(33333 * 0.9)).toBe(30000);
  });
});
