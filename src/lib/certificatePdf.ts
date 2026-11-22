/** Capture a certificate DOM node and download a landscape A4 PDF. */
export async function downloadCertificatePdf(element: HTMLElement, fileName: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  // Radix Dialog applies CSS transforms; cloning off-screen avoids distorted capture.
  const cloneHost = document.createElement("div");
  cloneHost.style.cssText =
    "position:fixed;left:-10000px;top:0;width:900px;z-index:-1;pointer-events:none;opacity:1;";
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = "900px";
  clone.style.maxWidth = "900px";
  clone.style.aspectRatio = "1.414 / 1";
  clone.style.borderRadius = "0";
  cloneHost.appendChild(clone);
  document.body.appendChild(cloneHost);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      width: 900,
      windowWidth: 900,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 18;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;
    const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
    const renderWidth = canvas.width * ratio;
    const renderHeight = canvas.height * ratio;
    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);
    pdf.save(fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
  } finally {
    cloneHost.remove();
  }
}
