import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateHealthReport = (userData, statistics, prescriptions, mode = 'full') => {
  const doc = new jsPDF();
  const isShareMode = mode === 'share';
  
  // Colors
  const primaryColor = '#0d9488';
  const successColor = '#16a34a';
  const warningColor = '#d97706';
  const dangerColor = '#e11d48';
  
  // Helper to format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Helper to get redacted value for share mode
  const getValue = (value, isSensitive = false) => {
    if (isShareMode && isSensitive) {
      return '[Redacted for sharing]';
    }
    return value || 'Not specified';
  };

  // Helper to clean text
  const cleanText = (text) => {
    if (!text) return '';
    return String(text)
      .replace(/&[^;]+;/g, '')
      .replace(/[^\x20-\x7E]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/([A-Za-z])\s+([a-z])/g, '$1$2')
      .trim();
  }
  
  // ===== HEADER =====
  doc.setFillColor(13, 148, 136);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('MediTrack Health Report', 105, 25, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${formatDate(new Date())}`, 105, 35, { align: 'center' });
  
  if (isShareMode) {
    doc.setTextColor(255, 200, 200);
    doc.setFontSize(8);
    doc.text('(Share-Friendly Version - Contact details redacted)', 105, 42, { align: 'center' });
  }
  
  // ===== PATIENT INFORMATION =====
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Information', 15, 55);
  
  const patientData = [
    ['Full Name:', getValue(userData.full_name, false)],
    ['Date of Birth:', isShareMode ? getValue(userData.age + ' years', false) : formatDate(userData.date_of_birth)],
    ['Age:', getValue(userData.age, false)],
    ['Gender:', getValue(userData.gender, false)],
    ['Blood Group:', getValue(userData.blood_group, false)],
    ['Email:', getValue(userData.email, true)],
    ['Phone:', getValue(userData.phone_number, true)],
  ];
  
  // Use autoTable function (not doc.autoTable)
  autoTable(doc, {
    startY: 62,
    body: patientData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 35 }, 1: { cellWidth: 100 } },
    margin: { left: 15 },
  });
  
  // Get the Y position after the table
  let currentY = doc.lastAutoTable.finalY;
  
  // ===== EMERGENCY CONTACT =====
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Emergency Contact', 15, currentY + 8);
  
  const emergencyData = [
    ['Contact Name:', getValue(userData.emergency_contact_name, true)],
    ['Contact Phone:', getValue(userData.emergency_contact_phone, true)],
  ];
  
  autoTable(doc, {
    startY: currentY + 13,
    body: emergencyData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 35 }, 1: { cellWidth: 100 } },
    margin: { left: 15 },
  });
  
  currentY = doc.lastAutoTable.finalY;
  
  // ===== MEDICAL INFORMATION =====
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Medical Information', 15, currentY + 8);

  const allergiesValue = cleanText(userData.allergies) || 'None reported';
  const conditionsValue = cleanText(userData.chronic_conditions) || 'None reported';

  const medicalData = [
    ['Allergies:', allergiesValue],
    ['Chronic Conditions:', conditionsValue],
    ['Report Period:', `Last ${statistics?.period_days || 30} days`],
  ];

  autoTable(doc, {
    startY: currentY + 13,
    body: medicalData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 35 }, 1: { cellWidth: 100 } },
    margin: { left: 15 },
  });

  if (allergiesValue !== 'None reported' && allergiesValue !== '') {
    doc.setDrawColor(225, 29, 72);
    doc.setLineWidth(0.5);
    doc.rect(13, currentY + 6, 182, 25);
  }

  currentY = doc.lastAutoTable.finalY;
  
  // ===== SUMMARY STATISTICS =====
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Health Summary Statistics', 15, currentY + 12);
  
  const summaryData = [
    ['Overall Adherence', `${statistics?.intakes?.adherence_rate || 0}%`],
    ['Total Medications', `${statistics?.medications?.total || 0} (${statistics?.medications?.active || 0} active)`],
    ['Doses Taken', `${statistics?.intakes?.taken || 0} of ${statistics?.intakes?.total || 0}`],
    ['Doses Missed', `${statistics?.intakes?.missed || 0}`],
    ['Side Effects Logged', `${statistics?.comments?.side_effects || 0}`],
    ['Refills Needed', `${statistics?.refills?.low_refills || 0} low, ${statistics?.refills?.no_refills || 0} out`],
  ];
  
  autoTable(doc, {
    startY: currentY + 18,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255], fontSize: 11, fontStyle: 'bold' },
    bodyStyles: { fontSize: 10, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 15 },
  });
  
  currentY = doc.lastAutoTable.finalY;
  
  // ===== MEDICATION ADHERENCE DETAILS =====
  const adherenceData = prescriptions.map(med => [
    med.name,
    med.dosage || 'N/A',
    `${med.adherence_rate || 0}%`,
    `${med.taken_doses || 0}/${med.total_doses || 0}`,
    med.status || 'Active'
  ]);
  
  if (adherenceData.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Medication Adherence Details', 15, currentY + 12);
    
    autoTable(doc, {
      startY: currentY + 18,
      head: [['Medication', 'Dosage', 'Adherence', 'Doses', 'Status']],
      body: adherenceData,
      theme: 'striped',
      headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
      bodyStyles: { fontSize: 9, textColor: [51, 65, 85] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 15 },
      columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 30 }, 2: { cellWidth: 30 }, 3: { cellWidth: 30 }, 4: { cellWidth: 30 } },
    });
    
    currentY = doc.lastAutoTable.finalY;
  }
  
  // ===== MEDICATION STATUS BREAKDOWN =====
  const medsData = statistics?.medications || {};
  const statusData = [
    ['Active', medsData.active || 0],
    ['Paused', medsData.paused || 0],
    ['Completed', medsData.completed || 0],
    ['Discontinued', medsData.discontinued || 0],
  ];
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Medication Status Breakdown', 15, currentY + 12);
  
  autoTable(doc, {
    startY: currentY + 18,
    head: [['Status', 'Count']],
    body: statusData,
    theme: 'striped',
    headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 15 },
  });
  
  currentY = doc.lastAutoTable.finalY;
  
  // ===== COMMENTS SUMMARY =====
  const commentsData = statistics?.comments || {};
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Comments & Notes Summary', 15, currentY + 12);
  
  const commentsSummary = [
    ['Side Effects', commentsData.side_effects || 0],
    ['Effectiveness Notes', commentsData.effectiveness_notes || 0],
    ['General Notes', commentsData.general_notes || 0],
    ['Total Comments', commentsData.total || 0],
  ];
  
  autoTable(doc, {
    startY: currentY + 18,
    head: [['Type', 'Count']],
    body: commentsSummary,
    theme: 'striped',
    headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 15 },
  });
  
  currentY = doc.lastAutoTable.finalY;
  
  // ===== PERSONALIZED RECOMMENDATIONS =====
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Personalized Recommendations', 15, currentY + 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  let recommendations = [];
  const adherenceRate = statistics?.intakes?.adherence_rate || 0;
  
  if (adherenceRate >= 80) {
    recommendations.push('• Excellent adherence! Continue maintaining your current medication schedule.');
  } else if (adherenceRate >= 50) {
    recommendations.push('• Consider setting additional reminders or using a pill organizer to improve adherence.');
  } else if (adherenceRate > 0) {
    recommendations.push('• Schedule a consultation with your healthcare provider to discuss adherence challenges.');
  }
  
  if ((statistics?.refills?.low_refills || 0) > 0) {
    recommendations.push('• Plan to refill medications with low remaining refills within the next week.');
  }
  if ((statistics?.refills?.no_refills || 0) > 0) {
    recommendations.push('• Contact your healthcare provider for new prescriptions for medications with no refills left.');
  }
  
  if ((statistics?.comments?.side_effects || 0) > 0) {
    recommendations.push('• Keep tracking side effects and discuss any persistent issues with your doctor.');
  }
  
  if (userData.allergies && userData.allergies !== 'None reported') {
    recommendations.push(`• IMPORTANT: Always inform healthcare providers about your allergies: ${userData.allergies}`);
  }
  
  if (userData.blood_group && userData.blood_group !== 'Not specified') {
    recommendations.push(`• Blood type ${userData.blood_group} - keep this information accessible for emergencies.`);
  }
  
  if (userData.chronic_conditions && userData.chronic_conditions !== 'None reported') {
    recommendations.push(`• Regular monitoring recommended for: ${userData.chronic_conditions}`);
  }
  
  recommendations.push('• Share this report with your healthcare provider at your next appointment.');
  
  let yOffset = currentY + 25;
  recommendations.forEach(rec => {
    if (yOffset > 270) {
      doc.addPage();
      yOffset = 20;
    }
    doc.text(rec, 15, yOffset);
    yOffset += 8;
  });
  
  // ===== FOOTER =====
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | MediTrack Health Report | ${userData.full_name || 'Patient'} | ${formatDate(new Date())}`,
      105,
      290,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const fileName = isShareMode 
    ? `MediTrack_Report_${userData.full_name?.replace(/\s+/g, '_')}_Share_${formatDate(new Date()).replace(/\s+/g, '_')}.pdf`
    : `MediTrack_Report_${userData.full_name?.replace(/\s+/g, '_')}_${formatDate(new Date()).replace(/\s+/g, '_')}.pdf`;
  
  doc.save(fileName);
};

// Share functionality
export const shareHealthReport = async (userData, statistics, prescriptions, method = 'email') => {
  // For email sharing
  if (method === 'email') {
    const subject = encodeURIComponent(`MediTrack Health Report - ${userData.full_name || 'Patient'}`);
    
    let body = `Hello,\n\nPlease find attached my health report from MediTrack.\n\n`;
    body += `Patient: ${userData.full_name || 'N/A'}\n`;
    body += `Blood Group: ${userData.blood_group || 'N/A'}\n`;
    body += `Allergies: ${userData.allergies || 'None reported'}\n\n`;
    body += `Summary:\n`;
    body += `- Overall Adherence: ${statistics?.intakes?.adherence_rate || 0}%\n`;
    body += `- Total Medications: ${statistics?.medications?.total || 0}\n`;
    body += `- Doses Taken: ${statistics?.intakes?.taken || 0}/${statistics?.intakes?.total || 0}\n`;
    body += `- Side Effects Reported: ${statistics?.comments?.side_effects || 0}\n\n`;
    body += `Best regards,\n${userData.full_name || 'Patient'}`;
    
    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
    return true;
  }
  
  // For WhatsApp sharing
  if (method === 'whatsapp') {
    let text = `*MediTrack Health Report*\n\n`;
    text += `*Patient:* ${userData.full_name || 'N/A'}\n`;
    text += `*Blood Group:* ${userData.blood_group || 'N/A'}\n`;
    
    if (userData.allergies && userData.allergies !== 'None reported') {
      text += `*⚠️ Allergies:* ${userData.allergies}\n`;
    }
    
    text += `\n*Summary:*\n`;
    text += `• Adherence: ${statistics?.intakes?.adherence_rate || 0}%\n`;
    text += `• Medications: ${statistics?.medications?.total || 0} (${statistics?.medications?.active || 0} active)\n`;
    text += `• Doses: ${statistics?.intakes?.taken || 0}/${statistics?.intakes?.total || 0} taken\n`;
    text += `• Side Effects: ${statistics?.comments?.side_effects || 0} reported\n`;
    text += `\nGenerated: ${new Date().toLocaleDateString()}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    return true;
  }
  
  // For native share (mobile)
  if (method === 'native' && navigator.share) {
    try {
      let shareText = `MediTrack Report - ${userData.full_name}\n`;
      shareText += `Adherence: ${statistics?.intakes?.adherence_rate || 0}% | `;
      shareText += `Meds: ${statistics?.medications?.total || 0}`;
      
      if (userData.allergies && userData.allergies !== 'None reported') {
        shareText += `\n⚠️ Allergies: ${userData.allergies}`;
      }
      
      await navigator.share({
        title: 'MediTrack Health Report',
        text: shareText,
        url: window.location.origin,
      });
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  }
  
  return false;
};