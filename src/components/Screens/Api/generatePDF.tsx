import { NextApiRequest, NextApiResponse } from "next";
import { renderToStream } from "@react-pdf/renderer";
import RekapPenyaluranBe from "@/components/FeatureComponents/CetakDistribusi/RekapPenyaluranBe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  try {
    const { data, isAgentFiltered } = req.body;

    // Generate the PDF stream
    const pdfStream = await renderToStream(
      <RekapPenyaluranBe data={data} isAgentFiltered={isAgentFiltered} />
    );

    // Set response headers for a PDF file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Rekap_Penyaluran_Elpiji.pdf"
    );

    // Pipe the PDF stream directly to the response
    pdfStream.pipe(res);

    // Handle stream end and errors
    pdfStream.on("end", () => {
      res.end();
    });
    pdfStream.on("error", (error) => {
      console.error("PDF stream error:", error);
      if (!res.headersSent) {
        res.status(500).end("Error generating PDF");
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (!res.headersSent) {
      res.status(500).end("Error generating PDF");
    }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb", // Increase if your data payload is large
    },
  },
};
