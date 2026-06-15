import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { LangProvider } from './context/LangContext';
import { AllocationProvider } from './components/AllocationModal';
import { InventoryProvider } from './context/InventoryContext';
import Header from './components/Header';
import LaunchBanner from './components/LaunchBanner';
import Hero from './components/Hero';
import Inventory from './components/Inventory';
import MissionManifest from './components/MissionManifest';
import SpaceXGallery from './components/SpaceXGallery';
import InvestmentParams from './components/InvestmentParams';
import ProfitCalculator from './components/ProfitCalculator';
import DemandBoard from './components/DemandBoard';
import StockChart from './components/StockChart';
import Footer from './components/Footer';
import ToastNotifications from './components/ToastNotifications';
import VerifyPage from './components/VerifyPage';
import AdminPage from './components/AdminPage';

const ADMIN_HOST = 'admin.ipo-spcx.com';
const PUBLIC_HOST = 'omni.ipo-spcx.com';

function SubdomainGuard() {
  const [path, navigate] = useLocation();
  useEffect(() => {
    const host = window.location.hostname;
    if (host === ADMIN_HOST && !path.startsWith('/admin')) {
      navigate('/admin', { replace: true });
    } else if (host === PUBLIC_HOST && path.startsWith('/admin')) {
      navigate('/', { replace: true });
    }
  }, [path, navigate]);
  return null;
}

function HomePage() {
  return (
    <>
      <Header />
      <div className="pt-16">
        <LaunchBanner />
      </div>
      <main>
        <Hero />
        <StockChart />
        <Inventory />
        <MissionManifest />
        <SpaceXGallery />
        <InvestmentParams />
        <ProfitCalculator />
        <DemandBoard />
      </main>
      <Footer />
      <ToastNotifications />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <InventoryProvider>
        <AllocationProvider>
          <div className="min-h-screen text-slate-100" style={{ backgroundColor: '#000000' }}>
            <SubdomainGuard />
            <Switch>
              <Route path="/verify/:ref" component={VerifyPage} />
              <Route path="/verify" component={VerifyPage} />
              <Route path="/admin" component={AdminPage} />
              <Route path="/" component={HomePage} />
            </Switch>
          </div>
        </AllocationProvider>
      </InventoryProvider>
    </LangProvider>
  );
}
