import React, { useState } from 'react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  Grid 
} from '@mui/material';

const TransactionForm = ({ onSubmit, isSubmitting }) => {
  const [transaction, setTransaction] = useState({
    description: '',
    amount: '', // Will store as number after input
    category: '',
    type: 'expense'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for amount to ensure it's stored as a number
    if (name === 'amount') {
      // Allow empty string or convert to number
      const numericValue = value === '' ? '' : Number(value);
      setTransaction(prev => ({
        ...prev,
        amount: numericValue
      }));
    } else {
      setTransaction(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate amount is a valid number
    if (isNaN(transaction.amount) || transaction.amount <= 0) {
      // Handle error
      return;
    }

    try {
      // Send the transaction with numeric amount
      await onSubmit({
        ...transaction,
        amount: Number(transaction.amount) // Ensure it's a number
      });

      // Reset form
      setTransaction({
        description: '',
        amount: '',
        category: '',
        type: 'expense'
      });
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            fullWidth
            required
            value={transaction.description}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            required
            inputProps={{ 
              step: "any", // Allows any decimal number
              min: "0"
            }}
            value={transaction.amount}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="category"
            label="Category"
            fullWidth
            required
            value={transaction.category}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Select
            name="type"
            fullWidth
            value={transaction.type}
            onChange={handleChange}
          >
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="income">Income</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={12}>
          <Button 
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
          >
            Add Transaction
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default TransactionForm;
