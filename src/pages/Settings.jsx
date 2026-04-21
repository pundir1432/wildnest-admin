import { useState } from 'react';
import { Save } from 'lucide-react';

const initialSettings = {
  siteName: 'WildNest Adventures',
  location: 'Rishikesh, Uttarakhand, India',
  phone: '+91 98765 43210',
  email: 'info@wildnest.com',
  mapLink: 'https://maps.google.com',
  currency: 'INR',
  razorpayKey: 'rzp_test_xxxxxxxxxxxx',
  taxPercent: '18',
  cancellationPolicy: '24 hours before booking',
  notifyEmail: true,
  notifySMS: false,
  maxPersonsPerSlot: '8',
  advanceBookingDays: '30',
};

export default function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const set = (key, val) => setSettings(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Section = ({ title, children }) => (
    <div className="card settings-section">
      <h3 className="card-title">{title}</h3>
      <div className="settings-grid">{children}</div>
    </div>
  );

  const Field = ({ label, name, type = 'text' }) => (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} value={settings[name]} onChange={e => set(name, e.target.value)} />
    </div>
  );

  return (
    <div className="page">
      {saved && <div className="toast">✓ Settings saved successfully</div>}

      <Section title="General">
        <Field label="Site Name" name="siteName" />
        <Field label="Location" name="location" />
        <Field label="Phone" name="phone" />
        <Field label="Email" name="email" />
        <Field label="Google Maps Link" name="mapLink" />
      </Section>

      <Section title="Pricing & Booking Rules">
        <Field label="Currency" name="currency" />
        <Field label="Tax (%)" name="taxPercent" type="number" />
        <Field label="Max Persons Per Slot" name="maxPersonsPerSlot" type="number" />
        <Field label="Advance Booking (days)" name="advanceBookingDays" type="number" />
        <div className="form-group">
          <label>Cancellation Policy</label>
          <input value={settings.cancellationPolicy} onChange={e => set('cancellationPolicy', e.target.value)} />
        </div>
      </Section>

      <Section title="Payment Configuration">
        <div className="form-group">
          <label>Razorpay Key ID</label>
          <input type="password" value={settings.razorpayKey} onChange={e => set('razorpayKey', e.target.value)} />
        </div>
      </Section>

      <Section title="Notifications">
        <div className="form-group toggle-group">
          <label>Email Notifications</label>
          <label className="toggle">
            <input type="checkbox" checked={settings.notifyEmail} onChange={e => set('notifyEmail', e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
        <div className="form-group toggle-group">
          <label>SMS Notifications</label>
          <label className="toggle">
            <input type="checkbox" checked={settings.notifySMS} onChange={e => set('notifySMS', e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
      </Section>

      <div className="settings-footer">
        <button className="btn btn-primary btn-lg" onClick={handleSave}><Save size={18} /> Save Settings</button>
      </div>
    </div>
  );
}
