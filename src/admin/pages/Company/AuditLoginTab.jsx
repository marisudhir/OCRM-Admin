import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment } from '@mui/material';
import { useCompanyController } from './companyController';

const AuditLoginTab = ({company_id}) => {
  console.log("Company Id in audit log : ",company_id)
  const [searchTerm, setSearchTerm] = useState(''); 
  const [auditLogs, setAuditLogs] = useState([]); // Replace with actual data fetching
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);  
  const {fetchAuditLogs} = useCompanyController();

  // Pagination settings
  const logsPerPage = 100;

  // In a real application, you'd fetch data here
 useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAuditLogs(company_id);
        setAuditLogs(data);
        console.log("Fetched audit logs:", data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
        setError(err.message || 'Something went wrong');
      }
    };

    fetchData();
  }, [company_id]);

  const totalLogs = auditLogs?.data || [];
  const paginatedLogs = totalLogs.slice(
  (currentPage - 1) * logsPerPage,
  currentPage * logsPerPage
);


const totalPages = Math.ceil(totalLogs.length / logsPerPage);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // const filteredLogs = auditLogs.filter(log =>
  //   log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   log.iuser_id.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    
    <Box sx={{ p: 3 }}>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by User Name, IP Address, or Status..."
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />
  
      {auditLogs?.data?.length > 0 ? (
        <>
        <TableContainer component={Paper} className="shadow-md border border-gray-100 rounded-xl">
          <Table sx={{ minWidth: 650 }} aria-label="audit login table">
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</TableCell>
                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time (IST)</TableCell>
                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</TableCell>
                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="bg-white divide-y divide-gray-200">
              {paginatedLogs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.userName}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.ilast_loggedin).toLocaleString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                      timeZone: 'Asia/Kolkata' 
                    })}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">143.110.178.254</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                   <Chip
                    label={log.status}
                    color={log.status === 'Success' ? 'success' : 'error'}
                    size="small"
                  />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
                
        </TableContainer>


  <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
        </>
        
      ) : (
        <Paper className="p-6 text-center text-gray-500 rounded-xl shadow-md border border-gray-100">
          <Typography variant="body1">No audit login records found.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AuditLoginTab;