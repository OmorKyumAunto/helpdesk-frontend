import * as XLSX from 'xlsx';

export function ExcelGenerator(
  data: any[],
  column_names: string[],
  sheetName: string,
  fileName: string,
  column_width?: XLSX.ColInfo[]
) {
  const WorkBook = XLSX.utils.book_new();
  const WorkSheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.sheet_add_aoa(WorkSheet, [column_names], {
    origin: 'A1',
  });
  let col: XLSX.ColInfo[] = column_width as XLSX.ColInfo[];
  WorkSheet['!cols'] = col;
  XLSX.utils.book_append_sheet(WorkBook, WorkSheet, sheetName);
  XLSX.write(WorkBook, { bookType: 'xlsx', type: 'buffer' });
  XLSX.write(WorkBook, { bookType: 'xlsx', type: 'binary' });
  XLSX.writeFile(WorkBook, fileName);
}
