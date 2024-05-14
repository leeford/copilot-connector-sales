import './App.css';
import { Text } from '@fluentui/react-components';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Order } from "./Order";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Text size={800}>Sales Orders</Text>
        <div>
          <Text size={300}>This is a sample app, use Copilot or Microsoft Search to find and search for orders.</Text>
        </div>
        <Routes>
          <Route path="/orders/:id" element={<Order />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
