"use client";

import { ResumeData } from "@/types/resume";
import { ClassicLayout } from "@/components/layouts/ClassicLayout";
import { ModernLayout } from "@/components/layouts/ModernLayout";
import { CompactLayout } from "@/components/layouts/CompactLayout";
import { ProfessionalLayout } from "@/components/layouts/ProfessionalLayout";
import { MinimalLayout } from "@/components/layouts/MinimalLayout";
import { ExecutiveLayout } from "@/components/layouts/ExecutiveLayout";

interface ResumePreviewProps {
  data: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const layout = data.layout || "modern";

  const layouts = {
    classic: ClassicLayout,
    modern: ModernLayout,
    compact: CompactLayout,
    professional: ProfessionalLayout,
    minimal: MinimalLayout,
    executive: ExecutiveLayout,
  };

  const Layout = layouts[layout];

  return (
    <div id="resume-preview">
      <Layout data={data} />
    </div>
  );
}
