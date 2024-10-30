import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { TransactionTable } from '@/components/admin/transactions/transaction-table';
import { TransactionDetails } from '@/components/admin/transactions/transaction-details';
import { useAuthStore } from '@/store/auth';
import { hasSuperAdminAccess } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import toast from 'react-hot-toast';

export function AdminTransactions() {
  const navigate = useNavigate();
  const { userData } = useAuthStore();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    if (!hasSuperAdminAccess(userData?.role)) {
      toast.error('Access denied. Master admin privileges required.');
      navigate('/dashboard');
    }
  }, [userData, navigate]);

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
    logAuditEvent({
      action: 'view_transaction',
      targetId: transaction.id,
      userId: userData?.uid,
      details: `Viewed transaction ${transaction.id}`
    });
  };

  const handleEditTransaction = async (transactionId: string, updates: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logAuditEvent({
        action: 'edit_transaction',
        targetId: transactionId,
        userId: userData?.uid,
        details: `Modified transaction ${transactionId}`
      });
      
      toast.success('Transaction updated successfully');
      setShowDetails(false);
    } catch (error) {
      toast.error('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logAuditEvent({
        action: 'delete_transaction',
        targetId: transactionId,
        userId: userData?.uid,
        details: `Deleted transaction ${transactionId}`
      });
      
      toast.success('Transaction deleted successfully');
      setShowDetails(false);
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  if (!hasSuperAdminAccess(userData?.role)) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0">
        <PageHeader
          title="Transaction Management"
          subtitle="View and manage all system transactions"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Admin', href: '/admin' },
            { label: 'Transactions' }
          ]}
        />
      </div>

      <div className="flex-1 min-h-0 mt-6">
        <TransactionTable onViewTransaction={handleViewTransaction} />
      </div>

      {showDetails && selectedTransaction && (
        <TransactionDetails
          transaction={selectedTransaction}
          onClose={() => setShowDetails(false)}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      )}
    </div>
  );
}