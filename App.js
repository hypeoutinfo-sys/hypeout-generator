import React, { useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import SignatureCanvas from "react-signature-canvas";
import emailjs from "@emailjs/browser";

export default function GeneratorUmowyHypeout() {
  const signatureRef = useRef(null);

  // --- STANY DLA DANYCH ---
  const [contractNumber, setContractNumber] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Przelew");
  
  const [sellerData, setSellerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    accountNumber: ""
  });

  const [productData, setProductData] = useState({
    name: "",
    size: "",
    quantity: "1"
  });

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    setContractNumber(`${String(randomNumber).padStart(3, "0")}/${month}/${year}`);
  }, []);

  // --- FUNKCJA WYSYŁAJĄCA EMAIL ---
  const sendEmailSummary = async (currentNumber) => {
    // DANE Z PANELU EMAILJS
    const SERVICE_ID = "service_xhr8bua";
    const PUBLIC_KEY = "nU78h4zf7IbbNOs5g"; 
    const TEMPLATE_ID = "template_l3111wb"; 

    const templateParams = {
      to_email: sellerData.email,
      owner_email: "laskowskijakub1@gmail.com",
      seller_name: sellerData.name,
      contract_number: currentNumber,
      date: today,
      product_name: productData.name,
      product_size: productData.size,
      price: price,
      payment_method: paymentMethod,
      payment_details: sellerData.accountNumber,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      alert("Sukces! Umowa pobrana, a potwierdzenie wysłane na e-mail.");
    } catch (error) {
      console.error("Błąd EmailJS:", error);
      alert("PDF pobrany, ale mail nie doszedł. Sprawdź, czy w panelu EmailJS szablon jest zapisany i czy Gmail jest poprawnie połączony.");
    }
  };

  // --- GENEROWANIE PDF ---
  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("UMOWA KUPNA–SPRZEDAŻY", 20, 20);

      doc.setFontSize(11);
      doc.text(`Numer umowy: ${contractNumber}`, 20, 35);
      doc.text(`Data: ${today}`, 20, 42);

      doc.text("Kupujący:", 20, 55);
      doc.text("HypeOut Jakub Laskowski", 20, 62);
      doc.text("ul. Sympatyczna 39, 15-666 Białystok", 20, 69);
      doc.text("NIP: 5423514217", 20, 76);

      doc.text("Sprzedający:", 20, 90);
      doc.text(sellerData.name || "________________", 20, 97);
      doc.text(`${sellerData.address || "________________"}`, 20, 104);
      doc.text(`${sellerData.zip || "____"} ${sellerData.city || "________________"}`, 20, 111);

      doc.text("Przedmiot sprzedaży:", 20, 125);
      doc.text(`Produkt: ${productData.name || "________________"}`, 20, 132);
      doc.text(`Rozmiar: ${productData.size || "____"} | Ilość: ${productData.quantity}`, 20, 139);
      
      doc.text("Płatność:", 20, 155);
      doc.text(`Kwota: ${price || "0"} PLN`, 20, 162);
      doc.text(`Metoda: ${paymentMethod}`, 20, 169);
      doc.text(`Dane do wpłaty: ${sellerData.accountNumber || "________________"}`, 20, 176);

      doc.text("Podpis sprzedającego:", 20, 220);
      if (signatureRef.current && !signatureRef.current.isEmpty()) {
        const image = signatureRef.current.getTrimmedCanvas().toDataURL("image/png");
        doc.addImage(image, "PNG", 20, 225, 60, 20);
      } else {
        doc.text("_______________________", 20, 230);
      }

      doc.text("Kupujący:", 120, 220);
      doc.setFont("courier", "italic");
      doc.setFontSize(18);
      doc.text("Jakub Laskowski", 110, 232);

      doc.save(`umowa-${contractNumber}.pdf`);

      if (sellerData.email) {
        sendEmailSummary(contractNumber);
      } else {
        alert("Wpisz e-mail sprzedającego, aby wysłać potwierdzenie!");
      }

    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center font-sans">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-black">HypeOut Generator</h1>
        <p className="text-center text-gray-500 mb-8 italic">Automatyczna umowa i potwierdzenie e-mail</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8 text-sm">
          <div className="bg-gray-50 border rounded-2xl p-5 border-gray-200">
            <h2 className="font-bold text-lg mb-4 text-black underline">Kupujący</h2>
            <p><strong>Jakub Laskowski (HypeOut)</strong></p>
            <p>ul. Sympatyczna 39, 15-666 Białystok</p>
            <p>NIP: 5423514217</p>
          </div>
          <div className="bg-black text-white rounded-2xl p-5 flex flex-col justify-center items-center">
            <p className="text-gray-400 text-xs uppercase tracking-widest">Numer Umowy</p>
            <p className="font-mono text-2xl font-bold">{contractNumber}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="font-semibold text-lg mb-5 text-black border-b pb-2">Dane sprzedającego</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input className="border rounded-xl p-3 focus:ring-2 focus:ring-black outline-none" placeholder="Imię i nazwisko" value={sellerData.name} onChange={e => setSellerData({...sellerData, name: e.target.value})} />
            <input className="border rounded-xl p-3 focus:ring-2 focus:ring-black outline-none" placeholder="E-mail" value={sellerData.email} onChange={e => setSellerData({...sellerData, email: e.target.value})} />
            <input className="border rounded-xl p-3 focus:ring-2 focus:ring-black outline-none" placeholder="Telefon" value={sellerData.phone} onChange={e => setSellerData({...sellerData, phone: e.target.value})} />
            <input className="border rounded-xl p-3 focus:ring-2 focus:ring-black outline-none" placeholder="Ulica i numer" value={sellerData.address} onChange={e => setSellerData({...sellerData, address: e.target.value})} />
            <input className="border rounded-xl p-3 focus:ring-2 focus:ring-black outline-none" placeholder="Miasto" value={sellerData.city} onChange={e => setSellerData({...sellerData, city: e.target.value})} />
            <input className="border rounded-xl p-3 focus:ring-2 focus:ring-black outline-none" placeholder="Kod pocztowy" value={sellerData.zip} onChange={e => setSellerData({...sellerData, zip: e.target.value})} />
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="font-semibold text-lg mb-5 text-black border-b pb-2">Przedmiot i Płatność</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input className="border rounded-xl p-3 focus:ring-2 focus:ring-black outline-none" placeholder="Produkt" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} />
            <input className="border rounded-xl p-3 focus:ring-2 focus:ring-black outline-none" placeholder="Rozmiar" value={productData.size} onChange={e => setProductData({...productData, size: e.target.value})} />
            <input className="border rounded-xl p-3 focus:ring-2 focus:ring-black outline-none" placeholder="Cena PLN" value={price} onChange={e => setPrice(e.target.value)} />
            <select className="border rounded-xl p-3 focus:ring-2 focus:ring-black outline-none" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="Przelew">Przelew</option>
              <option value="BLIK">BLIK</option>
            </select>
            <input className="border rounded-xl p-3 md:col-span-2 focus:ring-2 focus:ring-black outline-none bg-gray-50" 
                   placeholder={paymentMethod === "BLIK" ? "Numer telefonu BLIK" : "Numer konta bankowego"} 
                   value={sellerData.accountNumber} onChange={e => setSellerData({...sellerData, accountNumber: e.target.value})} />
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-5 mb-8 shadow-inner">
          <p className="font-semibold mb-3 text-white">Podpis sprzedającego</p>
          <div className="bg-white rounded-xl overflow-hidden">
            <SignatureCanvas ref={signatureRef} penColor="black" canvasProps={{ className: "w-full h-48" }} />
          </div>
          <button type="button" onClick={() => signatureRef.current.clear()} className="mt-3 text-xs text-gray-400 hover:text-white transition-colors">WYCZYŚĆ PODPIS</button>
        </div>

        <button
          type="button"
          onClick={generatePDF}
          className="bg-black text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-gray-800 transition-all w-full shadow-lg active:scale-95"
        >
          GENERUJ I WYŚLIJ UMOWĘ
        </button>
      </div>
    </div>
  );
}
