// index.js
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import styles from './index.css'; // Import CSS Module

function Index() {
  useEffect(() => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <div className={styles.container}>
          <App />
        </div>
      </React.StrictMode>
    );
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  return <div id="root" />; // Placeholder for ReactDOM.createRoot
}

export default Index;
