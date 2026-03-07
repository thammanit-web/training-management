"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { exportCoursesToExcel } from "@/lib/exportUtils";

interface ExportCoursesModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[];
}

export function ExportCoursesModal({
    isOpen,
    onClose,
    categories,
}: ExportCoursesModalProps) {
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        cat: "All",
        trainingType: "All",
        agency: "",
    });

    const handleExport = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                limit: 'all',
                cat: filters.cat,
                trainingType: filters.trainingType,
                agency: filters.agency
            });

            const res = await fetch(`/api/courses?${params.toString()}`);
            if (res.ok) {
                const { data } = await res.json();
                exportCoursesToExcel(data);
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
        <Modal isOpen={isOpen} onClose={onClose} title="ตั้งค่าการ Export ข้อมูลหลักสูตร" maxWidth="lg">
            <div className="space-y-4">
                <Select
                    label="หมวดหมู่"
                    value={filters.cat}
                    onChange={e => setFilters({ ...filters, cat: e.target.value })}
                    options={[
                        { label: "ทั้งหมด", value: "All" },
                        ...categories.map(c => ({ label: c, value: c }))
                    ]}
                />

                <Select
                    label="ประเภทการอบรม"
                    value={filters.trainingType}
                    onChange={e => setFilters({ ...filters, trainingType: e.target.value })}
                    options={[
                        { label: "ทั้งหมด", value: "All" },
                        { label: "OJT", value: "OJT" },
                        { label: "IN HOUSE", value: "IN HOUSE" },
                        { label: "OUT SITE", value: "OUT SITE" }
                    ]}
                />

                <Input
                    label="หน่วยงานที่จัด (ค้นหาจากบางคำ)"
                    value={filters.agency}
                    onChange={e => setFilters({ ...filters, agency: e.target.value })}
                    placeholder="เช่น กรมแรงงาน, มหาวิทยาลัย..."
                />

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
