import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { TableRowData } from "../../api";

interface Props {
    data: TableRowData[];
    columns: string[];
}

const OutputTable: React.FC<Props> = ({ data, columns }: Props) => {
    //   const [data, setData] = useState<TableRowData[]>([]);
    //   const [columns, setColumns] = useState<string[]>([]);

    return (
        <TableContainer component={Paper}>
            <Table style={{ borderCollapse: "collapse" }}>
                <TableHead>
                    <TableRow>
                        {columns.map(column => (
                            <TableCell style={{ border: "1px solid black", padding: 8 }} key={column}>
                                {column}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            {columns.map(column => (
                                <TableCell style={{ border: "1px solid black", padding: 8 }} key={column}>
                                    {row[column]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OutputTable;
