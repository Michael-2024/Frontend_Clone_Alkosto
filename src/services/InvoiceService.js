// Service to generate PDF invoices using jsPDF
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatCOP = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

const InvoiceService = {
  generate(order, user) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const left = 40;
    const right = 555;
    const line = (y) => doc.line(left, y, right, y);

    // Header
    doc.setFontSize(18);
    doc.setTextColor('#004797');
    doc.text('ALKOSTO S.A. - Factura Electrónica', left, 50);

    doc.setFontSize(10);
    doc.setTextColor('#222');
    doc.text('NIT: 900.000.000-1', left, 70);
    doc.text('Cra. 00 # 00-00, Bogotá D.C.', left, 85);
    doc.text('Tel: (601) 407 3033', left, 100);

    // Invoice meta
    const createdAt = new Date(order.createdAt);
    const invoiceNo = `FAC-${createdAt.getFullYear()}${String(createdAt.getMonth()+1).padStart(2,'0')}${String(createdAt.getDate()).padStart(2,'0')}-${order.id.split('-').pop()}`;
    doc.setFontSize(12);
    doc.text(`Factura No: ${invoiceNo}`, right - 200, 50);
    doc.text(`Fecha: ${createdAt.toLocaleDateString('es-CO')}`, right - 200, 70);
    doc.text(`Pedido: ${order.id}`, right - 200, 85);
    doc.text(`Tracking: ${order.trackingNumber}`, right - 200, 100);

    line(110);

    // Customer
    doc.setFontSize(12);
    doc.text('Datos del comprador', left, 130);
    doc.setFontSize(10);
    const ship = order.shippingAddress || {};
    doc.text(`Nombre: ${ship.fullName || `${user.firstName} ${user.lastName}`}`, left, 150);
    doc.text(`Documento: ${ship.document || '-'}`, left, 165);
    doc.text(`Email: ${ship.email || user.email}`, left, 180);
    doc.text(`Teléfono: ${ship.phone || user.phone || '-'}`, left, 195);
    doc.text(`Dirección: ${ship.address || '-'}`, left, 210);
    doc.text(`Ciudad/Depto: ${ship.city || '-'} / ${ship.department || '-'}`, left, 225);

    // Table of items
    const body = order.items.map((it, idx) => [
      idx + 1,
      String(it.product?.id ?? ''),
      String(it.product?.name ?? ''),
      it.quantity,
      formatCOP(it.product?.price || 0),
      formatCOP((it.product?.price || 0) * it.quantity)
    ]);

    autoTable(doc, {
      startY: 250,
      head: [['#', 'Código', 'Descripción', 'Cant.', 'Precio', 'Subtotal']],
      body,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 71, 151] },
      columnStyles: {
        0: { halign: 'center', cellWidth: 30 },
        1: { halign: 'center', cellWidth: 80 },
        2: { cellWidth: 250 },
        3: { halign: 'center', cellWidth: 50 },
        4: { halign: 'right', cellWidth: 70 },
        5: { halign: 'right', cellWidth: 75 }
      }
    });

    const y = doc.lastAutoTable.finalY + 20;
    line(y);

    const subtotal = order.subtotal ?? order.items.reduce((s, it) => s + (it.product?.price || 0) * it.quantity, 0);
    const shipping = order.shipping ?? 0;
    const iva = order.iva ?? Math.round(subtotal * 0.19);
    const discount = order.discount ?? (order.coupon?.discount || 0);
    const total = order.total ?? (subtotal + shipping + iva - discount);

    doc.setFontSize(10);
    const amounts = [
      ['Subtotal:', formatCOP(subtotal)],
      ['Envío:', shipping === 0 ? 'GRATIS' : formatCOP(shipping)],
      ['IVA (19%):', formatCOP(iva)],
      ['Descuento:', discount ? `- ${formatCOP(discount)}` : formatCOP(0)],
      ['Total:', formatCOP(total)]
    ];

    let offsetY = y + 20;
    amounts.forEach(([label, value], idx) => {
      doc.text(label, right - 200, offsetY + idx * 16);
      doc.text(value, right - 80, offsetY + idx * 16, { align: 'right' });
    });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor('#666');
    doc.text('Gracias por tu compra. Esta es tu representación en PDF de la factura.', left, offsetY + 90);
    doc.text('Para efectos fiscales, la validación final se realiza en el proveedor autorizado por la DIAN.', left, offsetY + 105);

    const filename = `Factura_ALK_${order.trackingNumber}.pdf`;
    doc.save(filename);
  }
};

export default InvoiceService;
