import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CardList from './pages/CardList';
import NewCard from './pages/NewCard';
import EditCard from './pages/EditCard';
import ImportCards from './pages/ImportCards';
import PracticeSetup from './pages/PracticeSetup';
import PracticeGame from './pages/PracticeGame';

function App() {
  return (
    <BrowserRouter basename="/MachMitDeutsch">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage" element={<CardList />} />
          <Route path="manage/new" element={<NewCard />} />
          <Route path="manage/edit/:id" element={<EditCard />} />
          <Route path="manage/import" element={<ImportCards />} />
          <Route path="practice/setup" element={<PracticeSetup />} />
          <Route path="practice/game" element={<PracticeGame />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
