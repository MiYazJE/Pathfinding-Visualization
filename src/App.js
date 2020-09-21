import React from 'react';
import Grid from './components/Grid';
import { FaGithubAlt } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {

    return (
        <div className="app">
            <div className="wrap-githubIcon">
                <a
                    href="https://github.com/MiYazJE/PathfindingViewer/"
                    target="_blank"
                    rel="noopener noreferrer"
                    alt="github repository of this proyect"
                    title="See the code!"
                >
                    <FaGithubAlt />
                </a>
            </div>
            <Grid />
            <ToastContainer
                style={{ fontSize: '15px' }}
                position="bottom-right"
            />
        </div>
    );
};

export default App;