import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateDonationReceipt = (donation) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Primary color (#05699e)
  const primaryColor = [5, 105, 158];
  const accentColor = [34, 197, 94]; // Green for success
  const lightBg = [240, 249, 255];

  // Add professional header with gradient effect
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Add a lighter overlay for depth
  doc.setFillColor(255, 255, 255);
  doc.setGState(new doc.GState({ opacity: 0.1 }));
  doc.circle(pageWidth - 20, 10, 40, 'F');
  doc.circle(20, 35, 30, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));

  // Organization name and tagline
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Smart Donation System', pageWidth / 2, 22, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Making a Difference Together', pageWidth / 2, 32, { align: 'center' });

  // Receipt title with icon
  doc.setFillColor(...lightBg);
  doc.roundedRect(15, 52, pageWidth - 30, 22, 3, 3, 'F');

  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('DONATION RECEIPT', pageWidth / 2, 65, { align: 'center' });

  let yPos = 85;

  // Receipt number and date in a highlight box
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, yPos, pageWidth - 30, 15, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');

  const receiptNo = donation.transactionId || `REC-${Date.now()}`;
  const receiptDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  doc.text(`Receipt No: ${receiptNo}`, 20, yPos + 7);
  doc.text(`Date: ${receiptDate}`, pageWidth - 20, yPos + 7, { align: 'right' });
  doc.text(`Time: ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`, pageWidth - 20, yPos + 12, { align: 'right' });

  yPos += 25;

  // Donor Information Section
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, 4, 8, 'F');

  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('DONOR INFORMATION', 22, yPos + 6);

  yPos += 12;

  const donorData = [
    [
      { content: 'Donor Name:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
      { content: donation.userId?.name || donation.donorName || 'Guest User', styles: { textColor: [0, 0, 0] } }
    ],
    [
      { content: 'Email Address:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
      { content: donation.userId?.email || donation.donorEmail || 'N/A', styles: { textColor: [0, 0, 0] } }
    ],
    [
      { content: 'Phone Number:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
      { content: donation.donorPhone || 'N/A', styles: { textColor: [0, 0, 0] } }
    ],
    [
      { content: 'Donor Type:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
      { content: donation.userId ? 'Registered User' : 'Guest User', styles: { textColor: [0, 0, 0] } }
    ]
  ];

  autoTable(doc, {
    startY: yPos,
    body: donorData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: { top: 3, bottom: 3, left: 5, right: 5 }
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 'auto' }
    },
    margin: { left: 20, right: 20 }
  });

  yPos = doc.lastAutoTable.finalY + 12;

  // Donation Details Section
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, 4, 8, 'F');

  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('DONATION DETAILS', 22, yPos + 6);

  yPos += 12;

  const donationData = [
    [
      { content: 'Category:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
      { content: donation.category?.name || 'General Donation', styles: { textColor: [0, 0, 0] } }
    ],
    [
      { content: 'Item/Purpose:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
      { content: donation.item || donation.category?.name || 'Donation', styles: { textColor: [0, 0, 0] } }
    ],
    [
      { content: 'Quantity:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
      { content: (donation.quantity || 1).toString(), styles: { textColor: [0, 0, 0] } }
    ],
    [
      { content: 'Donation Date:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
      { content: new Date(donation.date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }), styles: { textColor: [0, 0, 0] } }
    ]
  ];

  autoTable(doc, {
    startY: yPos,
    body: donationData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: { top: 3, bottom: 3, left: 5, right: 5 }
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 'auto' }
    },
    margin: { left: 20, right: 20 }
  });

  yPos = doc.lastAutoTable.finalY + 12;

  // Amount Breakdown Section (if baseAmount and extraAmount exist)
  if (donation.baseAmount !== undefined || donation.extraAmount !== undefined) {
    doc.setFillColor(...primaryColor);
    doc.rect(15, yPos, 4, 8, 'F');

    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('AMOUNT BREAKDOWN', 22, yPos + 6);

    yPos += 12;

    const amountBreakdown = [];

    if (donation.baseAmount !== undefined) {
      amountBreakdown.push([
        { content: 'Base Amount:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
        { content: `₹${parseFloat(donation.baseAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, styles: { textColor: [5, 105, 158], fontStyle: 'bold' } }
      ]);
    }

    if (donation.extraAmount !== undefined) {
      amountBreakdown.push([
        { content: 'Extra Amount:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
        { content: `₹${parseFloat(donation.extraAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, styles: { textColor: [147, 51, 234], fontStyle: 'bold' } }
      ]);
    }

    if (amountBreakdown.length > 0) {
      autoTable(doc, {
        startY: yPos,
        body: amountBreakdown,
        theme: 'plain',
        styles: {
          fontSize: 10,
          cellPadding: { top: 3, bottom: 3, left: 5, right: 5 }
        },
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 'auto', halign: 'right' }
        },
        margin: { left: 20, right: 20 }
      });

      yPos = doc.lastAutoTable.finalY + 12;
    }
  }

  // Payment Summary - Prominent Display
  doc.setFillColor(...primaryColor);
  doc.roundedRect(15, yPos, pageWidth - 30, 32, 4, 4, 'F');

  // Inner white box for contrast
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(20, yPos + 5, pageWidth - 40, 22, 2, 2, 'F');

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL AMOUNT DONATED', 25, yPos + 13);

  doc.setFontSize(22);
  doc.setTextColor(...accentColor);
  doc.setFont(undefined, 'bold');
  const amount = donation.amount ? parseFloat(donation.amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : '0.00';
  doc.text(`₹ ${amount}`, pageWidth - 25, yPos + 22, { align: 'right' });

  yPos += 40;

  // Payment Information Section
  if (donation.paymentStatus) {
    doc.setFillColor(...primaryColor);
    doc.rect(15, yPos, 4, 8, 'F');

    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('PAYMENT INFORMATION', 22, yPos + 6);

    yPos += 12;

    const paymentData = [
      [
        { content: 'Payment Status:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
        {
          content: donation.paymentStatus || 'Pending',
          styles: {
            fontStyle: 'bold',
            textColor: donation.paymentStatus === 'Paid' ? [34, 197, 94] : [251, 191, 36]
          }
        }
      ],
      [
        { content: 'Transaction ID:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
        { content: donation.transactionId || 'N/A', styles: { textColor: [0, 0, 0], fontStyle: 'bold' } }
      ]
    ];

    if (donation.paymentStatus === 'Paid' && donation.paymentDetails) {
      if (donation.paymentDetails.mihpayid) {
        paymentData.push([
          { content: 'Payment ID:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
          { content: donation.paymentDetails.mihpayid, styles: { textColor: [0, 0, 0] } }
        ]);
      }
      if (donation.paymentDetails.mode) {
        paymentData.push([
          { content: 'Payment Mode:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
          { content: donation.paymentDetails.mode, styles: { textColor: [0, 0, 0] } }
        ]);
      }
      if (donation.paymentDetails.bank_ref_num) {
        paymentData.push([
          { content: 'Bank Reference:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
          { content: donation.paymentDetails.bank_ref_num, styles: { textColor: [0, 0, 0] } }
        ]);
      }
    }

    autoTable(doc, {
      startY: yPos,
      body: paymentData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: { top: 3, bottom: 3, left: 5, right: 5 }
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 'auto' }
      },
      margin: { left: 20, right: 20 }
    });

    yPos = doc.lastAutoTable.finalY + 10;
  }

  // Thank you message
  yPos = Math.max(yPos, pageHeight - 65);

  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, yPos, pageWidth - 30, 20, 2, 2, 'F');

  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.setFont(undefined, 'bold');
  doc.text('Thank you for your generous donation!', pageWidth / 2, yPos + 8, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Your contribution makes a meaningful difference in the lives of those we serve.', pageWidth / 2, yPos + 15, { align: 'center' });

  // Footer
  yPos = pageHeight - 35;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPos, pageWidth - 15, yPos);

  yPos += 8;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, yPos, { align: 'center' });

  yPos += 5;
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Smart Donation System', pageWidth / 2, yPos, { align: 'center' });

  yPos += 4;
  doc.setFont(undefined, 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('www.smartdonation.org | support@smartdonation.org | +91-XXXX-XXXXXX', pageWidth / 2, yPos, { align: 'center' });

  // Professional border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.roundedRect(5, 5, pageWidth - 10, pageHeight - 10, 3, 3, 'S');

  // Save the PDF
  const fileName = `Donation_Receipt_${donation.transactionId || Date.now()}.pdf`;
  doc.save(fileName);
};

export const generateUserDonationReport = (userGroup) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Primary color (#05699e)
  const primaryColor = [5, 105, 158];
  const accentColor = [34, 197, 94];
  const lightBg = [240, 249, 255];

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setFillColor(255, 255, 255);
  doc.setGState(new doc.GState({ opacity: 0.1 }));
  doc.circle(pageWidth - 20, 10, 40, 'F');
  doc.circle(20, 30, 30, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));

  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Smart Donation System', pageWidth / 2, 18, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('Making a Difference Together', pageWidth / 2, 28, { align: 'center' });

  // Report title
  doc.setFillColor(...lightBg);
  doc.roundedRect(15, 47, pageWidth - 30, 18, 3, 3, 'F');

  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('DONATION SUMMARY REPORT', pageWidth / 2, 59, { align: 'center' });

  let yPos = 73;

  // Donor Information Header
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, 4, 8, 'F');

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('DONOR INFORMATION', 22, yPos + 6);

  yPos += 12;

  const donorData = [
    [
      { content: 'Name:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
      { content: userGroup.userInfo.name, styles: { textColor: [0, 0, 0] } }
    ],
    [
      { content: 'Email:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
      { content: userGroup.userInfo.email, styles: { textColor: [0, 0, 0] } }
    ],
    [
      { content: 'Type:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
      { content: userGroup.userInfo.type, styles: { textColor: [0, 0, 0] } }
    ],
    [
      { content: 'Report Date:', styles: { fontStyle: 'bold', textColor: [80, 80, 80] } },
      { content: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }), styles: { textColor: [0, 0, 0] } }
    ]
  ];

  autoTable(doc, {
    startY: yPos,
    body: donorData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: { top: 3, bottom: 3, left: 5, right: 5 }
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 'auto' }
    },
    margin: { left: 20, right: 20 }
  });

  yPos = doc.lastAutoTable.finalY + 12;

  // Summary Statistics Header
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, 4, 8, 'F');

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('SUMMARY STATISTICS', 22, yPos + 6);

  yPos += 12;

  // Summary boxes
  const boxWidth = (pageWidth - 40) / 2;
  const boxHeight = 22;

  // Total Donations Box
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, yPos, boxWidth - 2, boxHeight, 2, 2, 'F');
  doc.setDrawColor(...primaryColor);
  doc.roundedRect(15, yPos, boxWidth - 2, boxHeight, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Total Donations', 20, yPos + 8);

  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.setFont(undefined, 'bold');
  doc.text(userGroup.totalDonations.toString(), 20, yPos + 18);

  // Total Amount Box
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15 + boxWidth + 2, yPos, boxWidth - 2, boxHeight, 2, 2, 'F');
  doc.setDrawColor(...accentColor);
  doc.roundedRect(15 + boxWidth + 2, yPos, boxWidth - 2, boxHeight, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Total Amount', 20 + boxWidth, yPos + 8);

  doc.setFontSize(16);
  doc.setTextColor(...accentColor);
  doc.setFont(undefined, 'bold');
  doc.text(`₹${userGroup.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 20 + boxWidth, yPos + 18);

  yPos += boxHeight + 8;

  // Paid Amount Box
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(15, yPos, boxWidth - 2, boxHeight, 2, 2, 'F');
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(15, yPos, boxWidth - 2, boxHeight, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Paid Amount', 20, yPos + 8);

  doc.setFontSize(14);
  doc.setTextColor(34, 197, 94);
  doc.setFont(undefined, 'bold');
  doc.text(`₹${userGroup.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 20, yPos + 18);

  // Pending Amount Box
  doc.setFillColor(254, 252, 232);
  doc.roundedRect(15 + boxWidth + 2, yPos, boxWidth - 2, boxHeight, 2, 2, 'F');
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(15 + boxWidth + 2, yPos, boxWidth - 2, boxHeight, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Pending Amount', 20 + boxWidth, yPos + 8);

  doc.setFontSize(14);
  doc.setTextColor(251, 191, 36);
  doc.setFont(undefined, 'bold');
  doc.text(`₹${userGroup.pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 20 + boxWidth, yPos + 18);

  yPos += boxHeight + 15;

  // Donation History Header
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, 4, 8, 'F');

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('DONATION HISTORY', 22, yPos + 6);

  yPos += 12;

  // Donations Table
  const tableData = userGroup.donations.map((d, idx) => [
    (idx + 1).toString(),
    new Date(d.date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    d.category?.name || 'N/A',
    d.item || d.category?.name || 'N/A',
    (d.quantity || 1).toString(),
    `₹${d.amount ? parseFloat(d.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}`,
    d.paymentStatus || 'Pending',
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Date', 'Category', 'Item', 'Qty', 'Amount', 'Status']],
    body: tableData,
    theme: 'striped',
    styles: {
      fontSize: 9,
      cellPadding: { top: 4, bottom: 4, left: 3, right: 3 }
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 28 },
      2: { cellWidth: 30 },
      3: { cellWidth: 35 },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
      6: { cellWidth: 25, halign: 'center' }
    },
    margin: { left: 15, right: 15 },
    didParseCell: function(data) {
      // Color code the status column
      if (data.column.index === 6 && data.section === 'body') {
        const status = data.cell.raw;
        if (status === 'Paid') {
          data.cell.styles.textColor = [34, 197, 94];
          data.cell.styles.fontStyle = 'bold';
        } else if (status === 'Failed') {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [251, 191, 36];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  // Footer
  yPos = pageHeight - 25;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPos, pageWidth - 15, yPos);

  yPos += 6;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Thank you for your continued support!', pageWidth / 2, yPos, { align: 'center' });

  yPos += 5;
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Smart Donation System', pageWidth / 2, yPos, { align: 'center' });

  yPos += 4;
  doc.setFont(undefined, 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('www.smartdonation.org | support@smartdonation.org', pageWidth / 2, yPos, { align: 'center' });

  // Professional border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.roundedRect(5, 5, pageWidth - 10, pageHeight - 10, 3, 3, 'S');

  const fileName = `Donation_Report_${userGroup.userInfo.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(fileName);
};

