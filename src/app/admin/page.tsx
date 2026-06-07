import { StitchPage } from "@/components/StitchPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration | Mifa Life",
};

export default function AdminPage() {
  return <StitchPage page="adminDashboard" title="Mifa Life — Admin" />;
}
