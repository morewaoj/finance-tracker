import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api/config';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  CircularProgress,
  Alert
} from '@mui/material';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category_id: '', // Changed from category to category_id
    type: 'expense'
  });
  // eslint-disable-next-line no-unused-vars
  const [lastAddedTransaction, setLastAddedTransaction] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [wsConnection, setWsConnection] = useState(null);
  
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Calculate totals
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const balance = income - expense;

  const handleAuthError = useCallback(() => {
    // First logout the user
    logout();
    // Then redirect to login page
    navigate('/login');
  }, [logout, navigate]);

  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        handleAuthError();
        return;
      }

      const response = await axios.get(`${API_URL}/transactions`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setTransactions(response.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        handleAuthError();
      } else {
        setError('Failed to fetch transactions');
        setLoading(false);
      }
    }
  }, [handleAuthError]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      handleAuthError();
      return;
    }

    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category_id) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const transactionData = {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        category_id: parseInt(newTransaction.category_id, 10)
      };

      const response = await axios.post(
        `${API_URL}/transactions`,
        transactionData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setLastAddedTransaction({
          ...transactionData,
          id: response.data.id,
          date: new Date()
        });

        setNewTransaction({
          description: '',
          amount: '',
          category_id: '',
          type: 'expense'
        });
        
        setError(null);
        fetchTransactions();
      }
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        handleAuthError();
      } else if (error.response?.status === 400) {
        setError(error.response.data.error || 'Invalid transaction data. Please check all fields.');
      } else {
        setError('Failed to add transaction. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" color="success.main">Income</Typography>
            <Typography variant="h5">${income.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" color="error.main">Expenses</Typography>
            <Typography variant="h5">${expense.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary.main">Balance</Typography>
            <Typography variant="h5">${balance.toFixed(2)}</Typography>
          </Paper>
        </Grid>

        {/* New Transaction Form */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Add New Transaction</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Description"
                    name="description"
                    value={newTransaction.description}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!newTransaction.description}
                    helperText={!newTransaction.description ? "Description is required" : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!newTransaction.amount}
                    helperText={!newTransaction.amount ? "Amount is required" : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category ID"
                    name="category_id"
                    type="number"
                    value={newTransaction.category_id}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!newTransaction.category_id}
                    helperText={!newTransaction.category_id ? "Category ID is required" : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Type"
                    name="type"
                    value={newTransaction.type}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  >
                    <MenuItem value="expense">Expense</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Add Transaction
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Transactions Table */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell align="right" 
                      sx={{ 
                        color: transaction.type === 'income' ? 'success.main' : 'error.main'
                      }}
                    >
                      ${parseFloat(transaction.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
