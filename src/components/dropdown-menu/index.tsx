import { Dropdown } from '@heroui/react';
import { Menu, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router';

function BurgersDropdownMenu({ onSetValue }: { onSetValue: (newValue: string) => void }) {
  const navigate = useNavigate();

  const handleNavigate = (path: string, key: string) => {
    navigate(path);
    onSetValue(key);
  };

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Menu"
        className="inline-flex items-center justify-center rounded-md p-1.5 text-foreground hover:bg-surface-secondary transition-colors"
      >
        <Menu size={18} />
      </Dropdown.Trigger>

      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Item
            id="settings"
            onAction={() => handleNavigate('/settings', 'settings')}
            data-testid="setting-menu"
          >
            Settings
          </Dropdown.Item>
          <Dropdown.Item id="faq" onAction={() => handleNavigate('/faq', 'faq')}>
            FAQ
          </Dropdown.Item>
          <Dropdown.Item id="account" onAction={() => handleNavigate('/account', 'account')}>
            Account
          </Dropdown.Item>
          <Dropdown.Item id="admin" onAction={() => handleNavigate('/admin', 'admin')}>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[var(--accent)]" />
              Admin
            </span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default BurgersDropdownMenu;
