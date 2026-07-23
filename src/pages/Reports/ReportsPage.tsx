import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FileText, Download, Printer, FileSpreadsheet } from 'lucide-react';
import { reportService } from '@/services/reportService';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';

export default function ReportsPage() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: reportService.getAvailable,
  });

  const handleGenerate = async (type: string) => {
    try {
      await reportService.generate(type);
      toast.success(`${type} report generated successfully`);
    } catch {
      toast.error('Failed to generate report');
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-slate-500">Generate and download water management reports</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports?.map((report) => (
          <Card key={report.id} hover>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">{report.name}</CardTitle>
                <CardDescription className="mt-1">{report.description}</CardDescription>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => handleGenerate(report.type)}>Generate</Button>
              <Button size="sm" variant="outline" onClick={() => reportService.downloadPDF(report.type)}>
                <Download className="h-3 w-3" /> PDF
              </Button>
              <Button size="sm" variant="outline" onClick={() => reportService.downloadExcel(report.type)}>
                <FileSpreadsheet className="h-3 w-3" /> Excel
              </Button>
              <Button size="sm" variant="ghost" onClick={() => window.print()}>
                <Printer className="h-3 w-3" /> Print
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
