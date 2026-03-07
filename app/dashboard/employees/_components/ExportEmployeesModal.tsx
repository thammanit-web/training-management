"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { exportEmployeesToExcel } from "@/lib/exportUtils";

interface ExportEmployeesModalProps {
    isOpen: boolean;
    onClose: () => void;
    departments: string[];
}

export function ExportEmployeesModal({
    isOpen,
    onClose,
    departments,
}: ExportEmployeesModalProps) {
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        dept: "All",
        status: "All",
        gender: "All",
    });

    const handleExport = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                limit: 'all',
                startDate: filters.startDate,
                endDate: filters.endDate,
                dept: filters.dept,
                status: filters.status,
                gender: filters.gender
            });

            const res = await fetch(`/api/employees?${params.toString()}`);
            if (res.ok) {
                const { data } = await res.json();
                exportEmployeesToExcel(data);
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
        <Modal isOpen={isOpen} onClose={onClose} title="ตั้งค่าการ Export รายชื่อพนักงาน" maxWidth="lg">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="วันที่เริ่มงาน (จาก)"
                        type="date"
                        value={filters.startDate}
                        onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                    />
                    <Input
                        label="วันที่เริ่มงาน (ถึง)"
                        type="date"
                        value={filters.endDate}
                        onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                    />
                </div>

                <Select
                    label="แผนก"
                    value={filters.dept}
                    onChange={e => setFilters({ ...filters, dept: e.target.value })}
                    options={[
                        { label: "ทั้งหมด", value: "All" },
                        ...departments.map(d => ({ label: d, value: d }))
                    ]}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="สถานะ"
                        value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                        options={[
                            { label: "ทั้งหมด", value: "All" },
                            { label: "ปกติ (Active)", value: "Active" },
                            { label: "พักงาน (Inactive)", value: "Inactive" },
                            { label: "พ้นสภาพ (Resigned)", value: "Resigned" }
                        ]}
                    />
                    <Select
                        label="เพศ"
                        value={filters.gender}
                        onChange={e => setFilters({ ...filters, gender: e.target.value })}
                        options={[
                            { label: "ทั้งหมด", value: "All" },
                            { label: "ชาย", value: "male" },
                            { label: "หญิง", value: "female" },
                            { label: "ไม่ระบุ", value: "other" }
                        ]}
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
