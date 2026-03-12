import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register Thai Font
Font.register({
  family: 'BaiJamjuree',
  fonts: [
    { src: '/fonts/BaiJamjuree-Light.ttf', fontWeight: 300 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'BaiJamjuree',
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5',
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4338ca',
  },
  printDate: {
    fontSize: 8,
    color: '#9ca3af',
  },
  // Section 1: Employee info row
  employeeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 12,
    marginBottom: 15,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: 'bold',
  },
  employeeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  employeeCode: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Grid layout
  grid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  gridColumn: {
    flex: 1,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eef2ff',
    paddingBottom: 4,
    marginBottom: 8,
    color: '#4f46e5',
    fontSize: 9,
    fontWeight: 'bold',
  },
  infoItem: {
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 8,
    color: '#9ca3af',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  dangerValue: {
    color: '#dc2626',
  },
  // Description section
  descriptionBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e0e7ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  descriptionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4338ca',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 8.5,
    color: '#4b5563',
    marginBottom: 5,
  },
  // Notes area
  notesBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 15,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  notesValue: {
    fontSize: 9,
    color: '#4b5563',
  }
});

const translateResult = (result: string) => {
  switch (result) {
    case 'Passed': return { text: 'ผ่าน', color: '#047857', bgColor: '#ecfdf5' };
    case 'Failed': return { text: 'ไม่ผ่าน', color: '#b91c1c', bgColor: '#fef2f2' };
    case 'Attended': return { text: 'เข้าร่วม', color: '#1d4ed8', bgColor: '#eff6ff' };
    default: return { text: result || '-', color: '#374151', bgColor: '#f3f4f6' };
  }
};

export const TrainingPDFDocument = ({ record }: { record: any }) => {
  const tr = translateResult(record.training_result);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>รายละเอียดบันทึกการอบรม</Text>
          <Text style={styles.printDate}>
            วันที่พิมพ์: {new Date().toLocaleDateString('th-TH')}
          </Text>   
        </View>

        {/* Employee Section */}
        <View style={styles.employeeSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {record.employee?.employee_name_th?.charAt(0) || "U"}
              </Text>
            </View>
            <View>
              <Text style={styles.employeeName}>{record.employee?.employee_name_th}</Text>
              <Text style={styles.employeeCode}>
                รหัสพนักงาน: <Text style={{ color: '#4f46e5' }}>{record.employee?.employee_code}</Text>
              </Text>
            </View>
          </View>
          <View style={[styles.badge, { backgroundColor: tr.bgColor, color: tr.color }]}>
            <Text>{tr.text}</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.grid}>
          {/* Section 2: Training Details */}
          <View style={styles.gridColumn}>
            <Text style={styles.sectionTitle}>ข้อมูลการอบรม</Text>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>วันที่อบรม</Text>
              <Text style={styles.infoValue}>
                {record.training_date ? new Date(record.training_date).toLocaleDateString('th-TH', {
                  year: 'numeric', month: 'long', day: 'numeric'
                }) : "-"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>จำนวนชั่วโมง</Text>
              <Text style={styles.infoValue}>{record.training_hour || 0} ชั่วโมง</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>วิทยากร</Text>
              <Text style={styles.infoValue}>{record.trainer_name || "-"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>สถานที่</Text>
              <Text style={styles.infoValue}>{record.location || "-"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>วันที่หมดอายุ</Text>
              <Text style={[
                styles.infoValue, 
                record.expire_date && new Date(record.expire_date) < new Date() ? styles.dangerValue : {}
              ]}>
                {record.expire_date ? new Date(record.expire_date).toLocaleDateString('th-TH', {
                  year: 'numeric', month: 'long', day: 'numeric'
                }) : "ไม่มีวันหมดอายุ"}
              </Text>
            </View>
          </View>

          {/* Section 3: Course Details */}
          <View style={styles.gridColumn}>
            <Text style={styles.sectionTitle}>ข้อมูลหลักสูตร</Text>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>รหัสหลักสูตร</Text>
              <Text style={styles.infoValue}>{record.course?.course_code || "-"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>ชื่อหลักสูตร</Text>
              <Text style={styles.infoValue}>{record.course?.course_name || "-"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>หมวดหมู่</Text>
              <Text style={styles.infoValue}>{record.course?.course_category || "-"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>ประเภทการฝึกอบรม</Text>
              <Text style={styles.infoValue}>{record.course?.training_type || "-"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>หน่วยงานที่จัด</Text>
              <Text style={styles.infoValue}>{record.course?.organizing_agency || "-"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>วุฒิบัตร / ประกาศนียบัตร</Text>
              <View style={[
                styles.badge, 
                { 
                  backgroundColor: record.course?.certificate_required ? '#ecfdf5' : '#f3f4f6', 
                  color: record.course?.certificate_required ? '#047857' : '#6b7280',
                  alignSelf: 'flex-start',
                  marginTop: 2
                }
              ]}>
                <Text>{record.course?.certificate_required ? "ต้องมีวุฒิบัตร" : "ไม่ต้องมีวุฒิบัตร"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 4: Course Full Description */}
        {record.course?.descriptions && record.course.descriptions.length > 0 && (
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionTitle}>รายละเอียดเนื้อหาและวัตถุประสงค์</Text>
            {record.course.descriptions.map((desc: any, idx: number) => (
              <Text key={idx} style={styles.descriptionText}>
                {desc.description}
              </Text>
            ))}
          </View>
        )}

        {/* Section 5: Notes */}
        <View style={styles.notesBox}>
          <View style={styles.grid}>
             <View style={styles.gridColumn}>
                <Text style={styles.notesLabel}>หมายเหตุ</Text>
                <Text style={styles.notesValue}>{record.note || "ไม่มีหมายเหตุ"}</Text>
             </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};