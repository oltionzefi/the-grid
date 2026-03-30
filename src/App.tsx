import { Route, Routes } from 'react-router';
import { useOverlayState } from '@heroui/react';

import './App.css';
import { useBootstrap } from './lib/useBootstrap';
import BurgersNavigationMenu from './components/navigation';
import CartDrawer from './components/cart-drawer';
import Location from './modules/location';
import BurgerModule from './modules/burger';
import BuildPage from './modules/build';
import Recipe from './modules/recipe';
import Account from './modules/account';
import Settings from './modules/settings';
import FAQ from './modules/faq';
import AdminPage from './modules/admin';
import TermsPage from './modules/terms';

function App() {
  useBootstrap();
  const currentYear = new Date().getFullYear();
  const cartState = useOverlayState();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <BurgersNavigationMenu onCartOpen={cartState.open} />

      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <Routes>
          <Route index path="/" element={<BurgerModule />} />
          <Route path="/build" element={<BuildPage />} />
          <Route path="/location" element={<Location />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Account />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </main>

      <footer className="w-full border-t border-border py-3">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-1 text-sm text-muted">
          <span>©</span>
          <span>{currentYear}</span>
          <a
            href="https://oltionzefi.com"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline ml-1"
          >
            Oltion Zefi.
          </a>
          <span className="ml-1">All rights reserved.</span>
        </div>
      </footer>

      <CartDrawer state={cartState} />
    </div>
  );
}

export default App;
