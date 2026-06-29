import React, { createContext, useContext, useState, useEffect } from 'react';

const PlatformContext = createContext(null);

export function PlatformProvider({ children }) {
  const [activeProject, setActiveProject] = useState(() => {
    const saved = localStorage.getItem('activeProject');
    return saved ? JSON.parse(saved) : null;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('documents');
    return saved ? JSON.parse(saved) : [];
  });

  const [pos, setPos] = useState(() => {
    const saved = localStorage.getItem('pos');
    return saved ? JSON.parse(saved) : [];
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : [];
  });

  const [cos, setCos] = useState(() => {
    const saved = localStorage.getItem('cos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('activeProject', JSON.stringify(activeProject));
  }, [activeProject]);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('pos', JSON.stringify(pos));
  }, [pos]);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('cos', JSON.stringify(cos));
  }, [cos]);

  const createProject = (projectData) => {
    setActiveProject({ id: Date.now().toString(), ...projectData });
  };

  const addDocument = (doc) => {
    setDocuments(prev => [...prev, { id: Date.now().toString(), date: new Date().toISOString(), ...doc }]);
  };

  const addPO = (po) => {
    setPos(prev => [...prev, { id: Date.now().toString(), date: new Date().toISOString(), ...po }]);
  };

  const addInvoice = (invoice) => {
    setInvoices(prev => [...prev, { id: Date.now().toString(), date: new Date().toISOString(), ...invoice }]);
  };

  const addCO = (co) => {
    setCos(prev => [...prev, { id: Date.now().toString(), date: new Date().toISOString(), ...co }]);
  };

  return (
    <PlatformContext.Provider value={{
      activeProject, createProject,
      documents, addDocument,
      pos, addPO,
      invoices, addInvoice,
      cos, addCO
    }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  return useContext(PlatformContext);
}
