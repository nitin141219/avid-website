import ExcelJS from 'exceljs';

interface ExcelExportOptions {
  filename?: string;
  sheetName?: string;
  columns?: string[];
}

/**
 * Export data to Excel file
 * @param data - Array of objects to export
 * @param options - Export options (filename, sheetName, columns)
 */
export const exportToExcel = async (
  data: any[],
  options: ExcelExportOptions = {}
) => {
  try {
    const {
      filename = 'export.xlsx',
      sheetName = 'Sheet1',
      columns = [],
    } = options;

    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // If columns are specified, only include those columns
    let exportData = data;
    if (columns.length > 0) {
      exportData = data.map((row) => {
        const filteredRow: any = {};
        columns.forEach((col) => {
          filteredRow[col] = row[col];
        });
        return filteredRow;
      });
    }

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    
    // Add worksheet
    const worksheet = workbook.addWorksheet(sheetName);

    // Get column headers from the first row
    const headers = Object.keys(exportData[0] || {});
    
    // Define columns with auto-width
    worksheet.columns = headers.map((header) => {
      const maxLength = Math.max(
        header.length,
        ...exportData.map((row) => String(row[header] || '').length)
      );
      return {
        header: header,
        key: header,
        width: Math.min(maxLength + 2, 50),
      };
    });

    // Add rows
    exportData.forEach((row) => {
      worksheet.addRow(row);
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };

    // Generate filename with current date and time
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5);
    const finalFilename = filename.replace(
      '.xlsx',
      `_${timestamp}.xlsx`
    );

    // Write the file
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Create a blob and download
    if (typeof window !== 'undefined') {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = finalFilename;
      link.click();
      window.URL.revokeObjectURL(url);
    }

    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

/**
 * Export users data to Excel
 * @param users - Array of user objects
 * @param filename - Name of the export file
 */
export const exportUsersToExcel = async (
  users: any[],
  filename: string = 'users.xlsx'
) => {
  const columns = [
    'first_name',
    'last_name',
    'email',
    'mobile_no',
    'company_name',
    'department',
    'country',
    'market_interest',
    'is_active',
    'created_at',
  ];

  const formattedData = users.map((user) => ({
    'First Name': user.first_name,
    'Last Name': user.last_name,
    'Email': user.email,
    'Mobile No': user.mobile_no,
    'Company Name': user.company_name,
    'Department': user.department,
    'Country': user.country,
    'Market Interest': Array.isArray(user.market_interest)
      ? user.market_interest.join(', ')
      : user.market_interest,
    'Status': user.is_active ? 'Active' : 'Inactive',
    'Created At': user.created_at,
  }));

  return await exportToExcel(formattedData, {
    filename,
    sheetName: 'Users',
  });
};

/**
 * Export contact us data to Excel
 * @param contactUs - Array of contact us objects
 * @param filename - Name of the export file
 */
export const exportContactUsToExcel = async (
  contactUs: any[],
  filename: string = 'contact_us.xlsx'
) => {
  const formattedData = contactUs.map((contact) => ({
    'First Name': contact.first_name,
    'Last Name': contact.last_name,
    'Email': contact.email,
    'Phone Number': contact.phone_number,
    'Company': contact.company,
    'Country': contact.country,
    'Inquiry Type': Array.isArray(contact.inquiry_type)
      ? contact.inquiry_type.join(', ')
      : contact.inquiry_type,
    'Preferred Contact Method': Array.isArray(
      contact.preferred_contact_method
    )
      ? contact.preferred_contact_method.join(', ')
      : contact.preferred_contact_method,
    'Message': contact.message,
    'Receive Updates': contact.receive_updates ? 'Yes' : 'No',
    'Privacy Policy Agreed': contact.agree_to_privacy_policy
      ? 'Yes'
      : 'No',
    'Created At': contact.created_at,
  }));

  return await exportToExcel(formattedData, {
    filename,
    sheetName: 'Contact Us',
  });
};
