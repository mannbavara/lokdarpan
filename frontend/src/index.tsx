import './assets/css/App.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element. Ensure index.html contains a div with id="root"');
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
