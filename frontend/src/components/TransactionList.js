import React from 'react';

const TransactionList = ({ transactions }) => {
  // Format amount as currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0, // This will show $20 instead of $20.00
      maximumFractionDigits: 2  // This will allow up to 2 decimal places
    }).format(amount);
  };

  return (
    <div>
      {transactions.map(transaction => (
        <div key={transaction.id}>
          <span>{transaction.description}</span>
          <span>{formatAmount(transaction.amount)}</span>
          <span>{transaction.category}</span>
          <span>{transaction.type}</span>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;