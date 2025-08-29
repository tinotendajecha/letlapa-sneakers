'use client';

import { useState } from 'react';
import { User, Phone, MessageCircle, MapPin, Home, Truck, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    fullName: 'Thabo Mokoena',
    cellNumber: '+27 82 123 4567',
    whatsappNumber: '+27 82 123 4567',
    sameAsCell: true,
  });

  const [address, setAddress] = useState({
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

  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: '1',
      label: 'Home',
      line1: '123 Mandela Street',
      suburb: 'Sandton',
      province: 'Gauteng',
      postalCode: '2196',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Work',
      line1: '456 Business Park',
      suburb: 'Rosebank',
      province: 'Gauteng',
      postalCode: '2196',
      isDefault: false,
    },
  ]);

  const provinces = [
    'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
    'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact info saved:', contactInfo);
    alert('Contact information saved! (UI only)');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Address saved:', address);
    alert('Address saved! (UI only)');
    setIsEditing(false);
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Shipping preferences saved:', shippingPrefs);
    alert('Shipping preferences saved! (UI only)');
  };

  const editAddress = (addr: any) => {
    setAddress({
      line1: addr.line1,
      line2: '',
      suburb: addr.suburb,
      province: addr.province,
      postalCode: addr.postalCode,
      country: 'South Africa',
      isDefault: addr.isDefault,
    });
    setIsEditing(true);
  };

  const removeAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Your Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your details for a smoother checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-xl p-6 border border-border sticky top-8">
              {/* Avatar */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-dark-brown to-brand-warm-tan rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">U</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{contactInfo.fullName}</h3>
                  <p className="text-muted-foreground text-sm">Customer since 2024</p>
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value="thabo@example.com"
                  readOnly
                  className="input-field bg-muted cursor-not-allowed"
                />
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                {savedAddresses.find(addr => addr.isDefault) && (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">Default Address Set</span>
                    </div>
                  </div>
                )}
                <Button className="w-full" onClick={() => console.log('Save changes')}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-8 space-y-8">
            {/* Contact Information */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Contact Information
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    value={contactInfo.fullName}
                    onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="cellNumber" className="block text-sm font-medium mb-2">
                    Cell Number
                  </label>
                  <input
                    type="tel"
                    id="cellNumber"
                    value={contactInfo.cellNumber}
                    onChange={(e) => setContactInfo({ ...contactInfo, cellNumber: e.target.value })}
                    className="input-field"
                    placeholder="+27 82 123 4567"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Used by couriers to contact you for deliveries
                  </p>
                </div>

                <div>
                  <label htmlFor="whatsappNumber" className="block text-sm font-medium mb-2">
                    WhatsApp Number
                  </label>
                  <div className="space-y-2">
                    <input
                      type="tel"
                      id="whatsappNumber"
                      value={contactInfo.whatsappNumber}
                      onChange={(e) => setContactInfo({ ...contactInfo, whatsappNumber: e.target.value })}
                      disabled={contactInfo.sameAsCell}
                      className="input-field"
                      placeholder="+27 82 123 4567"
                    />
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-border"
                        checked={contactInfo.sameAsCell}
                        onChange={(e) => {
                          const sameAsCell = e.target.checked;
                          setContactInfo({ 
                            ...contactInfo, 
                            sameAsCell,
                            whatsappNumber: sameAsCell ? contactInfo.cellNumber : contactInfo.whatsappNumber
                          });
                        }}
                      />
                      <span className="text-sm text-muted-foreground">Same as cell number</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Save Contact Info
                </Button>
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
                  <h4 className="font-medium">Add / Edit Address</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="line1" className="block text-sm font-medium mb-2">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        id="line1"
                        value={address.line1}
                        onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                        className="input-field"
                        placeholder="Street name and number"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="line2" className="block text-sm font-medium mb-2">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        id="line2"
                        value={address.line2}
                        onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                        className="input-field"
                        placeholder="Apartment, suite, etc."
                      />
                    </div>

                    <div>
                      <label htmlFor="suburb" className="block text-sm font-medium mb-2">
                        Suburb / City
                      </label>
                      <input
                        type="text"
                        id="suburb"
                        value={address.suburb}
                        onChange={(e) => setAddress({ ...address, suburb: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="province" className="block text-sm font-medium mb-2">
                        Province
                      </label>
                      <select
                        id="province"
                        value={address.province}
                        onChange={(e) => setAddress({ ...address, province: e.target.value })}
                        className="input-field"
                        required
                      >
                        {provinces.map((province) => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        value={address.country}
                        readOnly
                        className="input-field bg-muted cursor-not-allowed"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-border"
                          checked={address.isDefault}
                          onChange={(e) => setAddress({ ...address, isDefault: e.target.checked })}
                        />
                        <span className="text-sm text-muted-foreground">Set as default delivery address</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit" className="flex-1">
                      Save Address
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Add New Address Button */}
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="outline" 
                  className="w-full mb-6"
                >
                  Add New Address
                </Button>
              )}

              {/* Saved Addresses List */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Saved Addresses</h4>
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {addr.line1}, {addr.suburb}, {addr.province} {addr.postalCode}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => editAddress(addr)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeAddress(addr.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <label htmlFor="instructions" className="block text-sm font-medium mb-2">
                    Delivery Instructions
                  </label>
                  <textarea
                    id="instructions"
                    value={shippingPrefs.instructions}
                    onChange={(e) => setShippingPrefs({ ...shippingPrefs, instructions: e.target.value })}
                    className="input-field min-h-[80px] resize-none"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>

                <div>
                  <label htmlFor="deliveryWindow" className="block text-sm font-medium mb-2">
                    Preferred Delivery Window
                  </label>
                  <select
                    id="deliveryWindow"
                    value={shippingPrefs.deliveryWindow}
                    onChange={(e) => setShippingPrefs({ ...shippingPrefs, deliveryWindow: e.target.value })}
                    className="input-field"
                  >
                    <option value="Anytime">Anytime</option>
                    <option value="Weekdays 9–17h">Weekdays 9–17h</option>
                    <option value="Evenings 17–20h">Evenings 17–20h</option>
                    <option value="Weekends">Weekends</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Save Preferences
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}