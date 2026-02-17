import React from 'react';
import UserController from './controllers/UserController';
import './App.css';

import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <div className="App">
            <Toaster position="top-right" />
            <UserController />
        </div>
    );
}

export default App;
