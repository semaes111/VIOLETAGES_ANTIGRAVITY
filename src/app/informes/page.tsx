'use client'

import { ReportGenerator } from '@/components/reports/ReportGenerator'

export default function ReportsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Informes</h2>
            </div>
            <div className="flex justify-center mt-8">
                <ReportGenerator />
            </div>
        </div>
    )
}
