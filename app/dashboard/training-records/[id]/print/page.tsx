import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Badge } from "@/components/ui/Badge";

export default async function PrintTrainingRecordPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const record = await prisma.trainingRecord.findUnique({
        where: { id: parseInt(id) },
        include: {
            employee: true,
            course: {
                include: {
                    descriptions: true
                }
            },
        },
    });

    if (!record) notFound();

    const translateResult = (result: string) => {
        switch (result) {
            case 'Passed': return { text: 'ผ่าน', variant: 'success' as const };
            case 'Failed': return { text: 'ไม่ผ่าน', variant: 'danger' as const };
            case 'Attended': return { text: 'เข้าร่วม', variant: 'info' as const };
            default: return { text: result || '-', variant: 'neutral' as const };
        }
    };

    const result = translateResult(record.training_result || "");

    return (
        <div className="bg-white min-h-screen text-slate-900 p-8" id="print-content">
            <style dangerouslySetInnerHTML={{
                __html: `
                @font-face {
                    font-family: 'BaiJamjureeCustom';
                    src: url('/fonts/BaiJamjuree-Light.ttf') format('truetype');
                    font-weight: 300;
                    font-style: normal;
                }
                @page { 
                    size: A4; 
                    margin: 10mm;
                }
                body { 
                    margin: 0; 
                    padding: 0;
                    overflow: visible !important;
                    background: white !important;
                    font-family: 'BaiJamjureeCustom', sans-serif !important;
                }
                * { 
                    -webkit-print-color-adjust: exact !important; 
                    print-color-adjust: exact !important; 
                }
                #print-content { 
                    font-family: 'BaiJamjureeCustom', sans-serif !important; 
                    width: 100%;
                }
                .avoid-break {
                    page-break-inside: avoid !important;
                }
            ` }} />

            {/* Header / Title */}
            <div className="mb-10 text-center border-b-2 border-indigo-600 pb-6">
                <h1 className="text-3xl font-bold text-indigo-700 mb-1">รายละเอียดการอบรม</h1>
                <p className="text-sm text-gray-400 font-medium">NDC Training Management System</p>
            </div>

            <div className="space-y-10">
                {/* Section 1: Employee and Status */}
                <div className="flex items-start justify-between border-b border-gray-100 pb-8 avoid-break">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl shadow-inner border border-indigo-200">
                            {record.employee?.employee_name_th?.charAt(0) || "U"}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{record.employee?.employee_name_th}</h3>
                            <div className="flex items-center gap-3">
                                <p className="text-base text-gray-600 font-medium tracking-tight">
                                    รหัสพนักงาน: <span className="text-indigo-600 font-bold">{record.employee?.employee_code}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Training Result</span>
                        <Badge variant={result.variant} className="text-lg py-1.5 px-6 border-2 font-bold">
                            {result.text}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                    {/* Section 2: Training Details */}
                    <div className="space-y-6 avoid-break">
                        <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-100 pb-3">
                            <h4 className="font-bold uppercase tracking-widest text-xs">ข้อมูลการอบรม</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                            <PrintInfoItem label="วันที่อบรม" value={record.training_date ? new Date(record.training_date).toLocaleDateString('th-TH', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            }) : "-"} />
                            <PrintInfoItem label="จำนวนชั่วโมง" value={record.training_hour ? `${record.training_hour} ชั่วโมง` : "0 ชั่วโมง"} />
                            <PrintInfoItem label="วิทยากร" value={record.trainer_name} />
                            <PrintInfoItem label="สถานที่" value={record.location} />
                            <PrintInfoItem
                                label="วันที่หมดอายุ"
                                value={record.expire_date ? new Date(record.expire_date).toLocaleDateString('th-TH', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                }) : "ไม่มีวันหมดอายุ"}
                                isDanger={!!(record.expire_date && new Date(record.expire_date) < new Date())}
                            />
                        </div>
                    </div>

                    {/* Section 3: Course Details */}
                    <div className="space-y-6 avoid-break">
                        <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-100 pb-3">
                            <h4 className="font-bold uppercase tracking-widest text-xs">ข้อมูลหลักสูตร</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                            <PrintInfoItem label="รหัสหลักสูตร" value={record.course?.course_code} />
                            <PrintInfoItem label="ชื่อหลักสูตร" value={record.course?.course_name} />
                            <PrintInfoItem label="หมวดหมู่" value={record.course?.course_category} />
                            <PrintInfoItem label="ประเภทการฝึกอบรม" value={record.course?.training_type} />
                            <PrintInfoItem label="หน่วยงานที่จัด" value={record.course?.organizing_agency} />
                        </div>
                    </div>
                </div>

                {/* Section 4: Course Full Description */}
                {record.course?.descriptions && record.course.descriptions.length > 0 && (
                    <div className="space-y-4 bg-indigo-50/20 rounded-2xl p-8 border border-indigo-100/50 avoid-break">
                        <div className="flex items-center gap-3 text-indigo-700 border-b border-indigo-100/50 pb-3">
                            <h4 className="font-bold text-sm uppercase tracking-tight">รายละเอียดเนื้อหาและวัตถุประสงค์</h4>
                        </div>
                        <div className="space-y-4 px-2">
                            {record.course.descriptions.map((desc: any) => (
                                <div key={desc.id} className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {desc.description}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 5: Notes */}
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 avoid-break">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">หมายเหตุ (Notes)</h4>
                    <p className="text-base text-gray-600 leading-relaxed italic">
                        {record.note || "ไม่มีหมายเหตุ"}
                    </p>
                </div>

                {/* Footer Signature */}
                <div className="pt-20 mt-12 grid grid-cols-2 gap-20 avoid-break">
                    <div className="text-center">
                        <div className="border-b border-gray-300 w-full mb-2"></div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ลายเซ็นพนักงาน / Employee Signature</p>
                    </div>
                    <div className="text-center">
                        <div className="border-b border-gray-300 w-full mb-2"></div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ลายเซ็นอนุมัติ / Authorized Signature</p>
                    </div>
                </div>
            </div>

            {/* Generation Info */}
            <div className="mt-16 text-[10px] text-gray-300 flex justify-between items-center border-t border-gray-50 pt-4">
                <p>System Generated Document ID: {record.id}</p>
                <p>Generated on: {new Date().toLocaleString('th-TH')}</p>
            </div>
        </div>
    );
}

function PrintInfoItem({ label, value, isDanger }: { label: string; value: string | null | undefined; isDanger?: boolean | null }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</span>
            <span className={`text-base font-bold tracking-tight ${isDanger ? 'text-red-600' : 'text-slate-800'}`}>
                {value || "-"}
            </span>
        </div>
    );
}
