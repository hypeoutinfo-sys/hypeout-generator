import React, { useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import SignatureCanvas from "react-signature-canvas";
import emailjs from "emailjs-com";

export default function App() {
  const signatureRef = useRef(null);

  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const [contractNumber, setContractNumber] = useState("001/05/2026");
  const [paymentMethod, setPaymentMethod] = useState("Przelew");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const random = Math.floor(Math.random() * 100) + 1;

    setContractNumber(
      `${String(random).padStart(3, "0")}/${month}/${year}`
    );
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("UMOWA KUPNA–SPRZEDAŻY", 20, 20);

    doc.setFontSize(11);
    doc.text(`Numer umowy: ${contractNumber}`, 20, 35);
    doc.text(`Data: ${today}`, 20, 42);

    doc.text("Kupujący:", 20, 55);
    doc.text("HypeOut Jakub Laskowski", 20, 62);
    doc.text("ul. Sympatyczna 39", 20, 69);
    doc.text("15-666 Białystok", 20, 76);
    doc.text("NIP: 5423514217", 20, 83);

    doc.text("Kwota:", 20, 110);
    doc.text(price || "________________", 50, 110);

    doc.text("Forma płatności:", 20, 120);
    doc.text(paymentMethod, 70, 120);

    doc.text("Podpis sprzedającego:", 20, 220);

    if (
      signatureRef.current &&
      !signatureRef.current.isEmpty()
    ) {
      const image = signatureRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");

      doc.addImage(image, "PNG", 20, 225, 60, 20);
    }

    doc.text("Kupujący:", 140, 220);

    doc.setFont("courier", "italic");
    doc.setFontSize(20);
    doc.text("Jakub Laskowski", 130, 232);

    doc.save(`umowa-${contractNumber}.pdf`);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>HypeOut Generator</h1>
        <p>Profesjonalny generator umów kupna–sprzedaży</p>
      </div>

      <div className="content">
        <div className="grid">
          <div className="card">
            <h2>Kupujący</h2>

            <p><strong>HypeOut Jakub Laskowski</strong></p>
            <p>ul. Sympatyczna 39</p>
            <p>15-666 Białystok</p>
            <p>NIP: 5423514217</p>
          </div>

          <div className="card">
            <h2>Informacje o umowie</h2>

            <input
              value={contractNumber}
              readOnly
              className="input"
            />

            <input
              type="date"
              defaultValue={today}
              className="input"
            />
          </div>
        </div>

        <br />

        <div className="card">
          <h2>Dane sprzedającego</h2>

          <div className="grid">
            <input className="input" placeholder="Imię i nazwisko" />
            <input className="input" placeholder="Telefon" />
            <input className="input" placeholder="Ulica i numer" />
            <input className="input" placeholder="Miasto" />
            <input className="input" placeholder="Kod pocztowy" />
          </div>
        </div>

        <br />

        <div className="grid">
          <div className="card">
            <h2>Przedmiot sprzedaży</h2>

            <input className="input" placeholder="Nazwa produktu" />
            <input className="input" placeholder="Rozmiar" />
            <input className="input" placeholder="Ilość" />

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input"
              placeholder="Cena brutto"
            />
          </div>

          <div className="card">
            <h2>Płatność</h2>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input"
            >
              <option value="Przelew">Przelew</option>
              <option value="BLIK">BLIK</option>
            </select>

            <input
              value={price}
              readOnly
              className="input"
              placeholder="Kwota"
            />

            <input
              className="input"
              placeholder={
                paymentMethod === "BLIK"
                  ? "Numer telefonu do BLIK"
                  : "Numer rachunku sprzedającego"
              }
            />
          </div>
        </div>

        <br />

        <div className="card">
          <h2>Podpis sprzedającego</h2>

          <div className="signature">
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              canvasProps={{
                width: 1000,
                height: 200,
              }}
            />
          </div>
        </div>

        <div className="buttons">
          <button
            onClick={generatePDF}
            className="button button-black"
          >
            Generuj PDF
          </button>

          <button
            onClick={() => window.print()}
            className="button button-white"
          >
            Drukuj Umowę
          </button>
        </div>
      </div>
    </div>
  );
}
