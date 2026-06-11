import { Route, Switch } from 'wouter';
import { LangProvider } from './context/LangContext';
import { AllocationProvider } from './components/AllocationModal';
import Header from './components/Header';
import LaunchBanner from './components/LaunchBanner';
import Hero from './components/Hero';
import Inventory from './components/Inventory';
import MissionManifest from './components/MissionManifest';
import SpaceXGallery from './components/SpaceXGallery';
import InvestmentParams from './components/InvestmentParams';
import ProfitCalculator from './components/ProfitCalculator';
import DemandBoard from './components/DemandBoard';
import Footer from './components/Footer';
import ToastNotifications from './components/ToastNotifications';
import VerifyPage from './components/VerifyPage';
import AdminPage from './components/AdminPage';

function HomePage() {
  return (
    <>
      <Header />
      <div className="pt-16">
        <LaunchBanner />
      </div>
      <main>
        <Hero />
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
      <AllocationProvider>
        <div className="min-h-screen text-slate-100" style={{ backgroundColor: '#000000' }}>
          <Switch>
            <Route path="/verify/:ref" component={VerifyPage} />
            <Route path="/verify" component={VerifyPage} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/" component={HomePage} />
          </Switch>
        </div>
      </AllocationProvider>
    </LangProvider>
  );
}
