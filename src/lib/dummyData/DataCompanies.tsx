export interface CompaniesDataType {
    id: number;
    company: string;
    address: string;
    telephone: string;
    createdAt: string;
    updatedAt: string;
}


export const dataCompanies:CompaniesDataType[] = [
    {
        id: 1,
        company: "PT SPBE 1",
        address: "JL. SOEPRAPTO NOMOR 24",
        telephone: "089977263326",
        createdAt: '2024-10-02 11:11:11', 
        updatedAt: '2024-10-02 11:11:11',
    },
    {
        id: 2,
        company: "PT SPBE 2",
        address: "JL. ENDANG NOMOR 24",
        telephone: "089237263326",
        createdAt: '2024-10-02 11:11:11', 
        updatedAt: '2024-10-02 11:11:11',
    },
];