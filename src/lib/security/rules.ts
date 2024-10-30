export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function hasRole(role) {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    function isValidTransaction() {
      return request.resource.data.amount > 0 
        && request.resource.data.timestamp is timestamp
        && request.resource.data.hash is string
        && request.resource.data.hash.size() == 64;
    }
    
    // Rate limiting
    function isWithinRateLimit() {
      let recentTransactions = get(/databases/$(database)/documents/users/$(request.auth.uid)).data.recentTransactions;
      let windowStart = request.time.toMillis() - duration.value(5, 'm');
      let recentCount = recentTransactions.filter(tx => tx.timestamp > windowStart).size();
      return recentCount < 10;
    }

    // Wallet rules
    match /wallets/{walletId} {
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow update: if isAuthenticated() 
        && isOwner(resource.data.userId)
        && isValidTransaction()
        && isWithinRateLimit()
        && (
          // Only allow balance changes through transactions
          request.resource.data.diff(resource.data).affectedKeys()
            .hasOnly(['balance', 'transactions', 'lastModified', 'transactionHash'])
        );
      allow delete: if false; // Prevent wallet deletion
    }

    // Transaction rules
    match /transactions/{transactionId} {
      allow read: if isAuthenticated() 
        && (isOwner(resource.data.userId) || hasRole('admin'));
      allow create: if isAuthenticated() 
        && isOwner(request.resource.data.userId)
        && isValidTransaction()
        && isWithinRateLimit();
      allow update, delete: if false; // Transactions are immutable
    }

    // Audit logs
    match /audit_logs/{logId} {
      allow read: if isAuthenticated() && hasRole('admin');
      allow write: if false; // Only backend can write audit logs
    }
  }
}
`;