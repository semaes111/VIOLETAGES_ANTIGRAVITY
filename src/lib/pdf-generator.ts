import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ReportData {
    title: string
    dateRange: { from: Date; to: Date }
    headers: string[]
    rows: any[][]
    summary?: { label: string; value: string }[]
}

export const generatePDF = (data: ReportData) => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.setTextColor(30, 58, 95) // Corporate Blue
    doc.text('VioletaGest - Clínica Estética', 14, 22)

    doc.setFontSize(12)
    doc.setTextColor(100)
    doc.text(data.title, 14, 32)

    doc.setFontSize(10)
    doc.text(
        `Período: ${format(data.dateRange.from, 'dd/MM/yyyy', { locale: es })} - ${format(data.dateRange.to, 'dd/MM/yyyy', { locale: es })}`,
        14,
        38
    )

    // Summary
    if (data.summary) {
        let y = 50
        data.summary.forEach((item) => {
            doc.setFontSize(10)
            doc.setTextColor(0)
            doc.text(`${item.label}:`, 14, y)
            doc.setFont('helvetica', 'bold')
            doc.text(item.value, 60, y)
            doc.setFont('helvetica', 'normal')
            y += 6
        })
    }

    // Table
    autoTable(doc, {
        head: [data.headers],
        body: data.rows,
        startY: data.summary ? 50 + (data.summary.length * 6) + 10 : 50,
        theme: 'grid',
        headStyles: { fillColor: [30, 58, 95] },
        styles: { fontSize: 8 },
    })

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text(
            `Página ${i} de ${pageCount} - Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        )
    }

    doc.save(`reporte_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`)
}
