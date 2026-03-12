import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateHealthReport = (userData, prescriptions, symptoms) => {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleDateString();

  // --- 1. Header & Title ---
  doc.setFontSize(22);
  doc.setTextColor(20, 184, 166); // Teal-600 color
  doc.text('Medrack Health Report', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${timestamp}`, 14, 28);
  doc.text(`Patient: ${userData.name}`, 14, 33);

  // --- 2. Medication Summary Table ---
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('Current Medications', 14, 45);

  const medRows = prescriptions.map(p => [p.name, p.dose, p.frequency, p.status]);
  
  autoTable(doc, {
    startY: 50,
    head: [['Medication', 'Dosage', 'Frequency', 'Status']],
    body: medRows,
    headStyles: { fillColor: [20, 184, 166] }, // Teal
    theme: 'striped'
  });

  // --- 3. Symptom Log Table ---
  const finalY = doc.lastAutoTable.finalY || 50;
  doc.text('Recent Adverse Reactions', 14, finalY + 15);

  const symptomRows = symptoms.map(s => [s.date, s.name, s.severity, s.details]);

  autoTable(doc, {
    startY: finalY + 20,
    head: [['Date', 'Symptom', 'Severity', 'Details']],
    body: symptomRows,
    headStyles: { fillColor: [244, 63, 94] }, // Rose-500
    theme: 'grid'
  });

  // --- 4. Footer ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text('This report is for informational purposes only. Consult your doctor for medical advice.', 14, 285);
  }

  // --- 5. Save the File ---
  doc.save(`Medrack_Report_${timestamp.replace(/\//g, '-')}.pdf`);
};