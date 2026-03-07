"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { exportTrainingRecordsToExcel } from "@/lib/exportUtils";

interface ExportTrainingRecordsModalProps {
    isOpen: boolean;
    onClose: () => void;
    employees: any[];
    courses: any[];
}

export function ExportTrainingRecordsModal({
    isOpen,
    onClose,
    employees,
    courses,
}: ExportTrainingRecordsModalProps) {
    const [loading, setLoading] = useState(false);
    const [empSearch, setEmpSearch] = useState("");
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        employee_id: "All",
        course_id: "All",
        result: "All",
        trainer: "",
        location: "",
    });

    const handleExport = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                limit: 'all',
                startDate: filters.startDate,
                endDate: filters.endDate,
                employee_id: filters.employee_id === 'All' ? '' : filters.employee_id,
                course_id: filters.course_id === 'All' ? '' : filters.course_id,
                result: filters.result,
                trainer: filters.trainer,
                location: filters.location
            });

            const res = await fetch(`/api/training-records?${params.toString()}`);
            if (res.ok) {
                const { data } = await res.json();
                exportTrainingRecordsToExcel(data);
                onClose();
            } else {
                alert("ไม่สามารถดึงข้อมูลสำหรับ Export ได้");
            }
        } catch (error) {
            console.error("Export error", error);
            alert("เกิดข้อผิดพลาดในการ Export");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="ตั้งค่าการ Export Excel" maxWidth="lg">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="วันที่เริ่มต้น"
                        type="date"
                        value={filters.startDate}
                        onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                    />
                    <Input
                        label="วันที่สิ้นสุด"
                        type="date"
                        value={filters.endDate}
                        onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Input
                        placeholder="ค้นพนักงาน..."
                        value={empSearch}
                        onChange={e => setEmpSearch(e.target.value)}
                        className="h-8 text-sm"
                    />
                    <Select
                        label="เลือกพนักงาน (เฉพาะเจาะจง)"
                        value={filters.employee_id}
                        onChange={e => setFilters({ ...filters, employee_id: e.target.value })}
                        options={[
                            { label: "ทั้งหมด", value: "All" },
                            ...employees
                                .filter(e => e.employee_name_th.includes(empSearch) || e.employee_code.includes(empSearch))
                                .map(e => ({ label: `${e.employee_code} - ${e.employee_name_th}`, value: e.id.toString() }))
                        ]}
                    />
                </div>

                <Select
                    label="เลือกหลักสูตร"
                    value={filters.course_id}
                    onChange={e => setFilters({ ...filters, course_id: e.target.value })}
                    options={[
                        { label: "ทั้งหมด", value: "All" },
                        ...courses.map(c => ({ label: c.course_name, value: c.id.toString() }))
                    ]}
                />

                <Select
                    label="ผลการอบรม"
                    value={filters.result}
                    onChange={e => setFilters({ ...filters, result: e.target.value })}
                    options={[
                        { label: "ทุกสถานะ", value: "All" },
                        { label: "ผ่าน (Passed)", value: "Passed" },
                        { label: "ไม่ผ่าน (Failed)", value: "Failed" },
                        { label: "เข้าร่วม (Attended)", value: "Attended" }
                    ]}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="ชื่อวิทยากร"
                        value={filters.trainer}
                        onChange={e => setFilters({ ...filters, trainer: e.target.value })}
                        placeholder="ค้นหาชื่อวิทยากร..."
                    />
                    <Input
                        label="สถานที่"
                        value={filters.location}
                        onChange={e => setFilters({ ...filters, location: e.target.value })}
                        placeholder="ค้นหาสถานที่..."
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="secondary" onClick={onClose}>ยกเลิก</Button>
                    <Button onClick={handleExport} disabled={loading}>
                        {loading ? "กำลังเตรียมข้อมูล..." : "ดาวน์โหลด Excel"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
