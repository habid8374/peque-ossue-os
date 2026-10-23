import { MarcoAdmin } from "@/components/admin/MarcoAdmin";

export default function LayoutPanel({ children }: { children: React.ReactNode }) {
  return <MarcoAdmin>{children}</MarcoAdmin>;
}
