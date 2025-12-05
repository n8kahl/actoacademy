import { getModules, getCertifications } from '@/lib/data';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function Dashboard() {
  const [modulesData, certificationsData] = await Promise.all([
    getModules(),
    getCertifications(),
  ]);

  return <DashboardClient modules={modulesData} certifications={certificationsData} />;
}
