import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TrainingRecordDetailsModal } from "../training-records/_components/TrainingRecordDetailsModal";
import { exportTrainingRecordsToExcel } from "@/lib/exportUtils";

interface TrainingRecord {
    id: number;
    training_date: string;
    training_hour: number;
    training_result: string;
    trainer_name: string;
    location: string;
    attachment: string;
    course: {
        course_name: string;
        course_code: string;
    };
}

interface EmployeeTrainingRecordsModalProps {
    employee: any;
    isOpen: boolean;
    onClose: () => void;
}

export const EmployeeTrainingRecordsModal: React.FC<EmployeeTrainingRecordsModalProps> = ({
    employee,
    isOpen,
    onClose,
}) => {
    const [records, setRecords] = useState<TrainingRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const translateResult = (result: string) => {
        switch (result) {
            case 'Passed': return { text: 'ผ่าน', variant: 'success' as const };
            case 'Failed': return { text: 'ไม่ผ่าน', variant: 'danger' as const };
            case 'Attended': return { text: 'เข้าร่วม', variant: 'info' as const };
            default: return { text: result || '-', variant: 'neutral' as const };
        }
    };

    useEffect(() => {
        setRecords([]);
        if (isOpen && employee && employee.id) {
            const fetchRecords = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`/api/training-records/employee/${employee.id}`);
                    const result = await res.json();
                    if (result.data) {
                        setRecords(result.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch training records", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRecords();
        }
    }, [isOpen, employee]);

    const handleExport = () => {
        if (records.length === 0) return;
        // Inject employee info for formatted output
        const recordsToExport = records.map(r => ({
            ...r,
            employee: employee
        }));
        exportTrainingRecordsToExcel(recordsToExport);
    };

    if (!employee) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`ประวัติการอบรม: ${employee.employee_name_th}`}
            maxWidth="2xl"
        >
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-sm">
                    <div>
                        <p className="text-gray-500">รหัสพนักงาน</p>
                        <p className="font-bold">{employee.employee_code}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">แผนก/ตำแหน่ง</p>
                        <p className="font-bold">{employee.department} / {employee.position}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                ) : records.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 italic bg-gray-25/50 border border-dashed border-gray-200 rounded-xl">
                        ไม่พบประวัติการอบรม
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {records.map((record, index) => {
                            const result = translateResult(record.training_result);
                            return (
                                <div
                                    key={record.id}
                                    className="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group/card"
                                    onClick={() => { setSelectedRecord(record); setIsDetailsOpen(true); }}
                                >
                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                        <div className="text-xs font-bold text-gray-300">
                                            #{records.length - index}
                                        </div>
                                        <div className="opacity-0 group-hover/card:opacity-100 transition-opacity">
                                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">คลิกเพื่อดูรายละเอียด</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-1">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <h4 className="font-bold uppercase tracking-wider text-[10px]">หลักสูตร</h4>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-tight">{record.course.course_name}</p>
                                                <p className="text-xs text-indigo-600 font-medium mt-1">{record.course.course_code}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-1">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <h4 className="font-bold uppercase tracking-wider text-[10px]">รายละเอียดการอบรม</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <InfoItem
                                                    label="วันที่อบรม"
                                                    value={new Date(record.training_date).toLocaleDateString('th-TH', {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    })}
                                                />
                                                <InfoItem label="ชั่วโมง" value={`${record.training_hour} ชม.`} />
                                                <InfoItem label="สถานที่" value={record.location || "-"} />
                                                <div>
                                                    <dt className="text-[10px] font-semibold text-gray-400 uppercase tracking-tighter">ผลการอบรม</dt>
                                                    <dd className="mt-1">
                                                        <Badge variant={result.variant} className="text-[10px] py-0 px-2 h-5">
                                                            {result.text}
                                                        </Badge>
                                                    </dd>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex justify-between items-center bg-white pt-4">
                    <Button
                        variant="secondary"
                        onClick={handleExport}
                        disabled={records.length === 0 || loading}
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                        Export Excel {employee.employee_name_th}
                    </Button>
                    <Button variant="secondary" onClick={onClose} className="px-8 shadow-sm">
                        ปิดหน้าต่าง
                    </Button>
                </div>

                <TrainingRecordDetailsModal
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                    record={selectedRecord ? { ...selectedRecord, employee } : null}
                />
            </div>
        </Modal>
    );
};

const InfoItem = ({ label, value, isDanger }: { label: string; value: string; isDanger?: boolean }) => (
    <div>
        <dt className="text-[10px] font-semibold text-gray-400 uppercase tracking-tighter">{label}</dt>
        <dd className={`mt-0.5 text-xs font-bold ${isDanger ? 'text-red-600' : 'text-gray-700'}`}>{value || "-"}</dd>
    </div>
);
