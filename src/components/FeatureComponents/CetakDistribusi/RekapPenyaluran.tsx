import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format, parse } from 'date-fns';
import { calculateDiff, formatNumberQty, getTodayTotalQty, toNormalCase } from '@/utils/page';

interface RekapPenyaluranProps {
    data: any;
    data2: any;
    data3: any;
    isAgentFiltered: boolean;
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
        paddingVertical: 50,
        fontSize: 10,
        lineHeight: 1.5,
        fontFamily: 'Times-Roman',
    },
    header: {
        marginBottom: 20,
        textAlign: 'left',
    },
    title: {
        fontSize: 14,
        fontFamily: "Times-Bold",
        fontWeight: 'extrabold',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 10,
    },
    table: {
        marginTop: 10,
        width: '100%',
        // borderWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCellHeader: {
        fontSize: 12,
        padding: 5,
        fontWeight: 'bold',
        // borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
        fontFamily: "Times-Bold",
    },
    tableCell: {
        padding: 5,
        // borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
    },
});

const groupDataByDate = (data: any) => {
    if (!Array.isArray(data)) return {};

    const grouped = data.reduce((acc, record) => {
        const date = format(new Date(record.giDate), "dd-MM-yyyy");
        if (!acc[date]) acc[date] = [];
        acc[date].push(record);
        return acc;
    }, {} as { [key: string]: any[] });

    // Sort keys by date
    const sortedGrouped = Object.keys(grouped)
        .sort((a, b) => {
            const dateA = parse(a, "dd-MM-yyyy", new Date());
            const dateB = parse(b, "dd-MM-yyyy", new Date());
            return dateA.getTime() - dateB.getTime();
        })
        .reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
        }, {} as { [key: string]: any[] });

    return sortedGrouped;
};


// return Array.from(map.values()).sort((a, b) => {
//     const dateA = new Date(a.date.split("-").reverse().join("-")); 
//     const dateB = new Date(b.date.split("-").reverse().join("-"));
//     return dateA.getTime() - dateB.getTime();
//   });

const groupFakultatif = (data: any) =>{
    const totalQty = (Array.isArray(data) ? data : []).reduce((sum, item) => sum + (item.qty || 0), 0);
    return totalQty;
}

const RekapPenyaluran: React.FC<RekapPenyaluranProps> = ({ data = [], data2 = [], data3 = [], isAgentFiltered}) => {
    const groupedData = groupDataByDate(data);
    const groupedData2 = groupDataByDate(data2);
    const groupedData3 = groupDataByDate(data3);
    let TOTAL = 0;
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>PT. Puri Kencana Merdeka Utama</Text>
                    <Text style={styles.subHeader}>STASIUN PENGISIAN DAN PENGANGKUTAN BULK ELPIJI (SPPBE)</Text>
                    <Text style={styles.subHeader}>Kawasan Industri Candi Blok XI No. 8, JL Candi Raya Timur, Ngaliyan, Semarang</Text>
                    <Text style={styles.subHeader}>Telp/Fax: 024-76633360 / 024-76633361</Text>
                </View>

                <Text style={[styles.title, { textAlign: 'center', fontFamily: "Times-Bold" }]}>
                    Penyaluran Elpiji 3 Kg
                </Text>

                {/* Render a table for each day */}
                {data && data.length > 0 ? (
                    Object.keys(groupedData).map(giDate => {
                        const parsedDate = parse(giDate, "dd-MM-yyyy", new Date());
                        const formattedDate = format(parsedDate, "EEEE, dd MMMM yyyy");

                        let dailyTotalAllocation = 0;
                        let dailyTotalDistribution = 0;
                        let dailyTotalPending = 0;
                        let dailyTotalFakultatif = 0;
                        let totalLO = 0;

                        groupedData[giDate].forEach((item: any) => {
                            dailyTotalDistribution += item.allocatedQty || 0;
                        });
                        const allocatedMonth = groupedData2[giDate];
                        const allocatedDaily = groupedData3[giDate];
                        dailyTotalAllocation = groupFakultatif(allocatedDaily)
                        TOTAL = TOTAL + dailyTotalDistribution

                        if (allocatedMonth) {
                            const allocatedMonthQty = allocatedMonth.reduce((sum: number, monthItem: any) => sum + (monthItem.allocatedQty || 0), 0);
                            // const allocatedDailyQty = allocatedDaily.reduce((sum: number, monthItem: any) => sum + (monthItem.qty || 0), 0);
                            // allocatedDaily.reduce((sum: number, dailyItem: { qty: number; }) => sum + (dailyItem.qty || 0), 0);
                            dailyTotalPending = calculateDiff(dailyTotalAllocation, dailyTotalDistribution);
                            dailyTotalFakultatif = calculateDiff(dailyTotalAllocation, allocatedMonthQty);
                            totalLO = calculateDiff(allocatedMonthQty, dailyTotalAllocation)
                            // if (allocatedMonthQty > dailyTotalDistribution) {
                            //     dailyTotalPending = difference;  
                            // } else if (allocatedMonthQty < dailyTotalDistribution) {
                            //     dailyTotalFakultatif = -difference; 
                            // }
                        }
                        return (
                            <View key={giDate} style={{ marginVertical: 20 }}>
                                <Text style={{ marginTop: 5 }}>Penyaluran Tanggal: <Text style={{ fontFamily: "Times-Bold" }}>{formattedDate}</Text></Text>
                                <View style={styles.table}>
                                    {/* Table Header */}
                                    <View style={styles.tableRow} wrap={false}>
                                        <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>No Transaksi</Text>
                                        <Text style={[styles.tableCellHeader, { flex: 3 }]}>Nama Agen</Text>
                                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Sopir</Text>
                                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Nopol</Text>
                                        <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>No DO</Text>
                                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Status</Text>
                                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Jumlah</Text>
                                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Kg</Text>
                                    </View>

                                    {/* Table Rows */}
                                    {groupedData[giDate].map((item: any, index: number) => (
                                        <View style={styles.tableRow} wrap={false} key={index}>
                                            <Text style={[styles.tableCell, { flex: 1.5 }]} wrap={false}>{item.bpeNumber}</Text>
                                            <Text style={[styles.tableCell, { flex: 3, fontSize: 9 }]} wrap={false}>{item.agentName}</Text>
                                            <Text style={[styles.tableCell, { flex: 1, fontSize: 9 }]} wrap={false}>{toNormalCase(item.driverName)}</Text>
                                            <Text style={[styles.tableCell, { flex: 1, fontSize: 9 }]} wrap={false}>{item.licensePlate}</Text>
                                            <Text style={[styles.tableCell, { flex: 1.5 }]} wrap={false}>{item.deliveryNumber}</Text>
                                            <Text style={[styles.tableCell, { flex: 1 }]} wrap={false}>Refill</Text>
                                            <Text style={[styles.tableCell, { flex: 1 }]} wrap={false}>{formatNumberQty(item.allocatedQty)}</Text>
                                            <Text style={[styles.tableCell, { flex: 1 }]} wrap={false}>{formatNumberQty(item.volume)}</Text>
                                        </View>
                                    ))}

                                    {/* Summary Rows */}
                                    <View wrap={false}>
                                        <View style={[styles.tableRow, styles.summaryRow]} wrap={false}>
                                            <Text style={[styles.tableCell, { flex: 11, fontWeight: 'bold', textAlign: "left", fontFamily: "Times-Bold" }]} wrap={false}>Sub Total</Text>
                                            <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]} wrap={false}>{formatNumberQty(dailyTotalDistribution)}</Text>
                                            <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]} wrap={false}>{formatNumberQty(dailyTotalDistribution * 3)}</Text>
                                        </View>
                                        {!isAgentFiltered && 
                                            <>
                                                <View style={[styles.tableRow, styles.summaryRow]} wrap={false}>
                                                    <Text style={[styles.tableCell, { flex: 11, fontWeight: 'bold', textAlign: "left", fontFamily: "Times-Bold" }]} wrap={false}>Total Pending</Text>
                                                    <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]} wrap={false}>{formatNumberQty(dailyTotalPending)}</Text>
                                                    <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]} wrap={false}>{formatNumberQty(dailyTotalPending * 3)}</Text>
                                                </View>

                                                <View style={[styles.tableRow, styles.summaryRow]} wrap={false}>
                                                    <Text style={[styles.tableCell, { flex: 11, fontWeight: 'bold', textAlign: "left", fontFamily: "Times-Bold" }]} wrap={false}>Total Fakultatif</Text>
                                                    <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]} wrap={false}>{formatNumberQty(dailyTotalFakultatif)}</Text>
                                                    <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]} wrap={false}>{formatNumberQty(dailyTotalFakultatif * 3)}</Text>
                                                </View>

                                                <View style={[styles.tableRow, styles.summaryRow]} wrap={false}>
                                                    <Text style={[styles.tableCell, { flex: 11, fontWeight: 'bold', textAlign: "left", fontFamily: "Times-Bold" }]} wrap={false}>Total LO Tidak Ditebus</Text>
                                                    <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]} wrap={false}>{formatNumberQty(totalLO)}</Text>
                                                    <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]} wrap={false}>{formatNumberQty(totalLO * 3)}</Text>
                                                </View>
                                            </>
                                        }
                                    </View>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>Data tidak ditemukan</Text>
                )}
                    <View style={[styles.table, {marginTop:20}]}>
                        <View style={styles.tableRow} wrap={false}>
                            <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>Alokasi</Text>
                            <Text style={[styles.tableCellHeader, { flex: 1 }]}>Jumlah</Text>
                            <Text style={[styles.tableCellHeader, { flex: 1 }]}>Kg</Text>
                        </View>
                        <View style={[styles.tableRow, styles.summaryRow]} wrap={false}>
                            <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>TOTAL</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]} wrap={false}>{formatNumberQty(TOTAL)}</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]} wrap={false}>{formatNumberQty(TOTAL * 3)}</Text>
                        </View>
                    </View>
            </Page>
        </Document>
    );
};

export default RekapPenyaluran;