import { useState } from 'react';
import type { CSSProperties, ChangeEvent, FormEvent } from 'react';
import apiClient from '../api/client';

export default function CheckoutPage(): React.JSX.Element {
  const [lotNumber, setLotNumber] = useState('');
  const [lot, setLot] = useState<any | null>(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    if (!lotNumber.trim()) return;

    setLookupLoading(true);
    setLookupError(null);
    setCheckoutError(null);
    setSuccessMsg(null);
    setLot(null);
    setCheckoutQuantity('');
    setNotes('');

    try {
      const resp = await apiClient.get(`/checkout/lookup/${encodeURIComponent(lotNumber.trim())}`);
      setLot(resp.data);
    } catch (err: any) {
      setLookupError(err.response?.data?.error || 'Lot not found or error looking up lot.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (!lot || !checkoutQuantity) return;

    const qty = parseFloat(checkoutQuantity);
    if (!qty || qty <= 0) {
      setCheckoutError('Quantity must be greater than zero.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);
    setSuccessMsg(null);

    // Get performing user ID from token
    const token = localStorage.getItem('chemwatch_token');
    let userId = '';
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.sub || payload.nameid || '';
        } catch(err) {}
    }

    try {
      const resp = await apiClient.post('/checkout/confirm', {
        inventoryLotId: lot.id,
        quantity: qty,
        performedByUserId: userId,
        notes: notes
      });
      
      setSuccessMsg(`✅ Successfully checked out ${qty} ${lot.unit}. Remaining: ${resp.data.inventoryLot.quantityRemaining}`);
      
      // Update lot data with new info returned
      setLot({
          ...lot,
          quantityRemaining: resp.data.inventoryLot.quantityRemaining,
          status: resp.data.inventoryLot.status
      });
      setCheckoutQuantity('');
      setNotes('');
    } catch (err: any) {
      setCheckoutError(err.response?.data?.error || 'Error confirming checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Checkout / Consume Inventory</h1>
      <p style={styles.subtitle}>Scan or enter a lot number to deduct stock.</p>

      {/* Lot Lookup Form */}
      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>Find Inventory Lot</h3>
        <form onSubmit={handleLookup} style={styles.lookupForm}>
          <input
            type="text"
            placeholder="Scan or Enter Lot Number"
            value={lotNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLotNumber(e.target.value)}
            style={{...styles.input, flex: 1}}
            required
            autoFocus
          />
          <button 
            type="submit" 
            disabled={lookupLoading || !lotNumber.trim()}
            style={styles.lookupBtn}
          >
            {lookupLoading ? '⏳...' : '🔍 Lookup'}
          </button>
        </form>
        {lookupError && <div style={styles.errorBox}>❌ {lookupError}</div>}
      </div>

      {/* Lot Details & Checkout Form */}
      {lot && (
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Lot Details</h3>
          <div style={styles.detailsGrid}>
            <div>
              <div style={styles.label}>Item</div>
              <div style={styles.value}>{lot.itemName}</div>
            </div>
            <div>
              <div style={styles.label}>Location</div>
              <div style={styles.value}>{lot.locationName} &mdash; {lot.labName}</div>
            </div>
            <div>
              <div style={styles.label}>Status</div>
              <div style={{...styles.value, color: lot.status === 'consumed' ? '#f87171' : '#34d399', textTransform: 'capitalize'}}>
                  {lot.status}
              </div>
            </div>
            <div>
              <div style={styles.label}>Remaining</div>
              <div style={{...styles.value, fontWeight: 'bold'}}>
                {lot.quantityRemaining} {lot.unit}
              </div>
            </div>
          </div>
          
          <div style={styles.divider} />

          <h3 style={styles.panelTitle}>Perform Checkout</h3>
          {lot.status === "consumed" ? (
             <div style={styles.infoBox}>ℹ️ This lot is fully consumed and cannot be checked out further.</div>
          ) : (
             <form onSubmit={handleCheckout} style={styles.checkoutForm}>
               <label style={styles.formField}>
                 <span style={styles.label}>Quantity to Consume ({lot.unit}) *</span>
                 <input
                   type="number"
                   step="0.001"
                   min="0.001"
                   max={lot.quantityRemaining}
                   value={checkoutQuantity}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckoutQuantity(e.target.value)}
                   style={styles.input}
                   required
                 />
               </label>
               <label style={styles.formField}>
                 <span style={styles.label}>Notes / Purpose (Optional)</span>
                 <input
                   type="text"
                   placeholder="e.g. Synthesis experiment 42"
                   value={notes}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
                   style={styles.input}
                 />
               </label>
               <button 
                 type="submit" 
                 disabled={checkoutLoading || !checkoutQuantity}
                 style={styles.checkoutBtn}
               >
                 {checkoutLoading ? '⏳ Processing...' : '📤 Confirm Checkout'}
               </button>
             </form>
          )}

          {checkoutError && <div style={{...styles.errorBox, marginTop: '1rem'}}>❌ {checkoutError}</div>}
          {successMsg && <div style={{...styles.successBox, marginTop: '1rem'}}>{successMsg}</div>}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  title: { color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' },
  panel: {
    background: '#1e293b', borderRadius: '12px', border: '1px solid #334155',
    padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
  },
  panelTitle: { color: '#f1f5f9', margin: '0 0 0.5rem 0', fontSize: '1.1rem' },
  lookupForm: { display: 'flex', gap: '1rem' },
  input: {
    background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '8px',
    padding: '0.6rem 0.75rem', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  lookupBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '0.6rem 1.5rem', fontSize: '0.95rem', fontWeight: 600,
    cursor: 'pointer', minWidth: '120px',
  },
  detailsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'
  },
  label: { color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' },
  value: { color: '#e2e8f0', fontSize: '1rem' },
  divider: { height: '1px', background: '#334155', margin: '0.5rem 0' },
  checkoutForm: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' },
  formField: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  checkoutBtn: {
    background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '0.7rem 1.2rem', fontSize: '0.95rem', fontWeight: 600,
    cursor: 'pointer', marginTop: '0.5rem'
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: '#f87171', fontWeight: 500,
  },
  successBox: {
    background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.25)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: '#34d399', fontWeight: 600,
  },
  infoBox: {
    background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: '#60a5fa', fontWeight: 500,
  }
};
