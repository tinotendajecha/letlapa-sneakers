'use client';

import { useEffect, useState } from 'react';
import { User, Phone, MessageCircle, MapPin, Home, Truck, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import FancyProfileLoader from '@/components/fancy-loader'; // ⬅️ your loader component
// import FancyProfileLoader from '@/components/FancyProfileLoader';
import FancyProfileLoader from '@/components/FancyProfileLoader';
import { toast } from 'react-toastify';              // ⬅️ toasts

type SavedAddress = {
  id: string;
  label?: string;
  line1: string;
  line2?: string;
  suburb?: string;
  province: string;
  postalCode?: string;
  country?: string;
  isDefault: boolean;
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [email, setEmail] = useState('');

  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    cellNumber: '',
    whatsappNumber: '',
    sameAsCell: true,
  });

  const [address, setAddress] = useState({
    label: '',
    line1: '',
    line2: '',
    suburb: '',
    province: 'Gauteng',
    postalCode: '',
    country: 'South Africa',
    isDefault: false,
  });

  const [shippingPrefs, setShippingPrefs] = useState({
    instructions: '',
    deliveryWindow: 'Anytime',
  });

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddrs, setLoadingAddrs] = useState(true);

  // NEW: page-level loader for the very first load (profile + addrs + prefs)
  const [initialLoading, setInitialLoading] = useState(true);

  const provinces = [
    'Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape',
    'Free State','Limpopo','Mpumalanga','North West','Northern Cape',
  ];

  // Load profile + addresses + shipping prefs
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Profile
        const pRes = await fetch('/api/profile', { cache: 'no-store' });
        const pJson = await pRes.json();
        if (!pRes.ok) {
          toast.error(pJson?.error ?? 'Failed to load profile');
        } else if (alive) {
          setEmail(pJson.email || '');
          const fullName = pJson.name || '';
          const cellNumber = pJson.phone || '';
          const whatsappNumber = pJson.whatsapp || cellNumber || '';
          setContactInfo({
            fullName,
            cellNumber,
            whatsappNumber,
            sameAsCell: whatsappNumber === cellNumber,
          });
        }

        // Addresses
        const aRes = await fetch('/api/addresses', { cache: 'no-store' });
        const aJson = await aRes.json();
        if (!aRes.ok) {
          toast.error(aJson?.error ?? 'Failed to load addresses');
        } else if (alive) {
          setSavedAddresses(aJson.addresses);
        }

        // Shipping prefs
        const sRes = await fetch('/api/shipping-preferences', { cache: 'no-store' });
        const sJson = await sRes.json();
        if (!sRes.ok) {
          toast.error(sJson?.error ?? 'Failed to load shipping preferences');
        } else if (alive) {
          setShippingPrefs({
            instructions: sJson.instructions ?? '',
            deliveryWindow: sJson.deliveryWindow ?? 'Anytime',
          });
        }
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong while loading your profile');
      } finally {
        if (alive) {
          setLoadingAddrs(false);
          setInitialLoading(false);
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  // Save contact info (User.name + Profile phone/whatsapp)
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: contactInfo.fullName || '',
        phone: contactInfo.cellNumber || '',
        whatsapp: contactInfo.sameAsCell ? (contactInfo.cellNumber || '') : (contactInfo.whatsappNumber || ''),
      };
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error ?? 'Failed to save contact info');
        return;
      }
      // reflect return
      setEmail(json.email || email);
      setContactInfo(ci => ({
        ...ci,
        fullName: json.name || ci.fullName,
        cellNumber: json.phone || ci.cellNumber,
        whatsappNumber: json.whatsapp || ci.whatsappNumber,
        sameAsCell: (json.whatsapp || '') === (json.phone || ''),
      }));
      toast.success('Contact information saved');
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error saving contact info');
    }
  };

  // Add / Edit address
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      label: address.label?.trim() || undefined,
      line1: address.line1,
      line2: address.line2?.trim() || undefined,
      suburb: address.suburb?.trim() || undefined,
      province: address.province,
      postalCode: address.postalCode?.trim() || undefined,
      country: address.country || 'South Africa',
      isDefault: !!address.isDefault,
    };
    try {
      let res: Response;
      if (editingId) {
        res = await fetch(`/api/addresses/${editingId}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/addresses', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
      }
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error ?? 'Failed to save address');
        return;
      }
      const list = await fetch('/api/addresses', { cache: 'no-store' }).then(r => r.json());
      setSavedAddresses(list.addresses);
      setAddress({ label: '', line1: '', line2: '', suburb: '', province: 'Gauteng', postalCode: '', country: 'South Africa', isDefault: false });
      setEditingId(null);
      setIsEditing(false);
      toast.success(editingId ? 'Address updated' : 'Address added');
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error saving address');
    }
  };

  const editAddress = (addr: SavedAddress) => {
    setAddress({
      label: addr.label ?? '',
      line1: addr.line1,
      line2: addr.line2 ?? '',
      suburb: addr.suburb ?? '',
      province: addr.province,
      postalCode: addr.postalCode ?? '',
      country: addr.country ?? 'South Africa',
      isDefault: !!addr.isDefault,
    });
    setEditingId(addr.id);
    setIsEditing(true);
  };

  const removeAddress = async (id: string) => {
    if (!confirm('Remove this address?')) return;
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j?.error ?? 'Failed to delete address');
        return;
      }
      setSavedAddresses(prev => prev.filter(a => a.id !== id));
      toast.success('Address removed');
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error deleting address');
    }
  };

  // Save shipping preferences
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/shipping-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructions: shippingPrefs.instructions,
          deliveryWindow: shippingPrefs.deliveryWindow,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error ?? 'Failed to save shipping preferences');
        return;
      }
      setShippingPrefs({
        instructions: json.instructions ?? '',
        deliveryWindow: json.deliveryWindow ?? 'Anytime',
      });
      toast.success('Shipping preferences saved');
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error saving shipping preferences');
    }
  };

  // ===== Page-level loader =====
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background mb-10">
        <FancyProfileLoader message="Loading your profile…" /> 
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Your Profile</h1>
          <p className="mt-2 text-muted-foreground">Manage your details for a smoother checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-xl p-6 border border-border sticky top-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-dark-brown to-brand-warm-tan rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{(contactInfo.fullName || 'U').charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{contactInfo.fullName || 'Your Name'}</h3>
                  <p className="text-muted-foreground text-sm">Customer since 2024</p>
                </div>
              </div>

              {/* Email (Read-only from DB) */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input type="email" value={email} readOnly className="input-field bg-muted cursor-not-allowed" />
              </div>

              <div className="space-y-3">
                {savedAddresses.find(addr => addr.isDefault) && (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">Default Address Set</span>
                    </div>
                  </div>
                )}
                <Button className="w-full" onClick={() => console.log('Save changes')}>Save Changes</Button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Contact Information */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Contact Information
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text" id="contactName" className="input-field"
                    value={contactInfo.fullName}
                    onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="cellNumber" className="block text-sm font-medium mb-2">Cell Number</label>
                  <input
                    type="tel" id="cellNumber" className="input-field" placeholder="+27 82 123 4567"
                    value={contactInfo.cellNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setContactInfo(ci => ({
                        ...ci,
                        cellNumber: val,
                        whatsappNumber: ci.sameAsCell ? val : ci.whatsappNumber,
                      }));
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Used by couriers to contact you for deliveries</p>
                </div>

                <div>
                  <label htmlFor="whatsappNumber" className="block text-sm font-medium mb-2">WhatsApp Number</label>
                  <div className="space-y-2">
                    <input
                      type="tel" id="whatsappNumber" className="input-field" placeholder="+27 82 123 4567"
                      value={contactInfo.whatsappNumber}
                      onChange={(e) => setContactInfo({ ...contactInfo, whatsappNumber: e.target.value })}
                      disabled={contactInfo.sameAsCell}
                    />
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox" className="rounded border-border" checked={contactInfo.sameAsCell}
                        onChange={(e) => {
                          const sameAsCell = e.target.checked;
                          setContactInfo(ci => ({
                            ...ci,
                            sameAsCell,
                            whatsappNumber: sameAsCell ? ci.cellNumber : ci.whatsappNumber,
                          }));
                        }}
                      />
                      <span className="text-sm text-muted-foreground">Same as cell number</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full">Save Contact Info</Button>
              </form>
            </div>

            {/* Delivery Address */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Delivery Address
              </h3>

              {/* Add/Edit Address Form */}
              {isEditing && (
                <form onSubmit={handleAddressSubmit} className="space-y-4 mb-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium">{editingId ? 'Edit Address' : 'Add Address'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="label" className="block text-sm font-medium mb-2">Label (e.g. Home, Work)</label>
                      <input type="text" id="label" value={address.label}
                        onChange={(e) => setAddress({ ...address, label: e.target.value })} className="input-field" placeholder="Home" />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="line1" className="block text-sm font-medium mb-2">Address Line 1</label>
                      <input type="text" id="line1" value={address.line1}
                        onChange={(e) => setAddress({ ...address, line1: e.target.value })} className="input-field" placeholder="Street name and number" required />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="line2" className="block text-sm font-medium mb-2">Address Line 2 (Optional)</label>
                      <input type="text" id="line2" value={address.line2}
                        onChange={(e) => setAddress({ ...address, line2: e.target.value })} className="input-field" placeholder="Apartment, suite, etc." />
                    </div>
                    <div>
                      <label htmlFor="suburb" className="block text-sm font-medium mb-2">Suburb / City</label>
                      <input type="text" id="suburb" value={address.suburb}
                        onChange={(e) => setAddress({ ...address, suburb: e.target.value })} className="input-field" required />
                    </div>
                    <div>
                      <label htmlFor="province" className="block text-sm font-medium mb-2">Province</label>
                      <select id="province" value={address.province}
                        onChange={(e) => setAddress({ ...address, province: e.target.value })} className="input-field" required>
                        {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium mb-2">Postal Code</label>
                      <input type="text" id="postalCode" value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} className="input-field" required />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium mb-2">Country</label>
                      <input type="text" id="country" value={address.country} readOnly className="input-field bg-muted cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-border"
                          checked={address.isDefault} onChange={(e) => setAddress({ ...address, isDefault: e.target.checked })} />
                        <span className="text-sm text-muted-foreground">Set as default delivery address</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button type="submit" className="flex-1">Save Address</Button>
                    <Button type="button" variant="outline" className="flex-1"
                      onClick={() => {
                        setIsEditing(false); setEditingId(null);
                        setAddress({ label: '', line1: '', line2: '', suburb: '', province: 'Gauteng', postalCode: '', country: 'South Africa', isDefault: false });
                      }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Add New Address Button */}
              {!isEditing && (
                <Button onClick={() => { setIsEditing(true); setEditingId(null); }} variant="outline" className="w-full mb-6">
                  Add New Address
                </Button>
              )}

              {/* Saved Addresses List */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Saved Addresses</h4>
                {loadingAddrs ? (
                  <div className="flex items-center justify-center py-6">
                    <FancyProfileLoader message="Loading addresses…" />
                  </div>
                ) : savedAddresses.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No saved addresses yet.</div>
                ) : (
                  savedAddresses.map((addr) => (
                    <div key={addr.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{addr.label || 'Address'}</span>
                            {addr.isDefault && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.suburb}, {addr.province} {addr.postalCode}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => editAddress(addr)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => removeAddress(addr.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Shipping Preferences */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Shipping Preferences
              </h3>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium mb-2">Delivery Instructions</label>
                  <textarea
                    id="instructions" className="input-field min-h-[80px] resize-none"
                    placeholder="Any special instructions for delivery..."
                    value={shippingPrefs.instructions}
                    onChange={(e) => setShippingPrefs({ ...shippingPrefs, instructions: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="deliveryWindow" className="block text-sm font-medium mb-2">Preferred Delivery Window</label>
                  <select
                    id="deliveryWindow" className="input-field"
                    value={shippingPrefs.deliveryWindow}
                    onChange={(e) => setShippingPrefs({ ...shippingPrefs, deliveryWindow: e.target.value })}
                  >
                    <option value="Anytime">Anytime</option>
                    <option value="Weekdays 9–17h">Weekdays 9–17h</option>
                    <option value="Evenings 17–20h">Evenings 17–20h</option>
                    <option value="Weekends">Weekends</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">Save Preferences</Button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
