import LanguageSelector from './components/LanguageSelector';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <div
      className="container"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <SignUpPage />
      <LanguageSelector />
    </div>
  );
}

export default App;
