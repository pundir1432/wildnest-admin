import { TreePine } from 'lucide-react';

export default function GlobalLoader() {
  return (
    <div className="global-loader">
      <div className="loader-content">
        <div className="loader-logo">
          <TreePine size={36} />
        </div>
        <div className="loader-spinner" />
        <p className="loader-text">Loading...</p>
      </div>
    </div>
  );
}
