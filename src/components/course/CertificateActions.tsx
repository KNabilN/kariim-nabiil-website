import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Download, Loader2, User } from "lucide-react";
import CompletionCertificate, { type CertificateView } from "@/components/course/CompletionCertificate";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { downloadCertificatePdf } from "@/lib/certificatePdf";

interface CertificateActionsProps {
  certificate: CertificateView;
  showProfileLink?: boolean;
  footer?: ReactNode;
}

export default function CertificateActions({
  certificate,
  showProfileLink = false,
  footer,
}: CertificateActionsProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const onDownloadPdf = async () => {
    const node = certRef.current?.querySelector(".certificate-print-root") as HTMLElement | null;
    if (!node) {
      toast({ title: "Certificate not ready", variant: "destructive" });
      return;
    }

    setDownloading(true);
    try {
      const safeName = (certificate.studentName || "certificate").replace(/[^\w\-]+/g, "_");
      await downloadCertificatePdf(node, `${safeName}-certificate.pdf`);
      toast({ title: "PDF downloaded" });
    } catch (error) {
      toast({
        title: "PDF download failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div ref={certRef} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <CompletionCertificate certificate={certificate} className="max-w-none rounded-none border-0" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="default"
          className="h-11 min-w-[168px] rounded-md px-5"
          disabled={downloading}
          onClick={() => void onDownloadPdf()}
        >
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download PDF
        </Button>

        {showProfileLink && (
          <Button
            asChild
            type="button"
            size="default"
            variant="outline"
            className="h-11 min-w-[168px] rounded-md px-5"
          >
            <Link to="/course/profile">
              <User className="h-4 w-4" />
              View in profile
            </Link>
          </Button>
        )}

        {footer}
      </div>
    </div>
  );
}
