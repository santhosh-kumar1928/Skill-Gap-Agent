import React, { useState, useEffect } from 'react';
import { Cpu, Terminal, Compass, Zap } from 'lucide-react';
import ProfileEditor from './components/ProfileEditor.jsx';
import SkillGapReport from './components/SkillGapReport.jsx';
import ApiTester from './components/ApiTester.jsx';
import IntelligenceBrowser from './components/IntelligenceBrowser.jsx';
import { DEFAULT_TARGETS } from './data/knowledgeData.js';
import { analyzeSkillGapClient } from './data/skillGapEngineClient.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer'); // 'analyzer', 'api', 'browser'
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targets, setTargets] = useState(DEFAULT_TARGETS);

  useEffect(() => {
    // Fetch available targets from backend if running, otherwise keep DEFAULT_TARGETS
    fetch('/api/targets')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.companies && data.companies.length > 0) {
          setTargets(data);
        }
      })
      .catch(err => console.error("Failed to load targets metadata from server, using built-in intelligence data:", err));
  }, []);

  const handleAnalyze = async (payload) => {
    setLoading(true);
    try {
      const res = await fetch('/agent/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      } else {
        throw new Error('Server returned non-200 response');
      }
    } catch (err) {
      console.warn("Backend server offline or unreachable. Executing client-side Skill Gap Agent fallback...", err);
      const fallbackResult = analyzeSkillGapClient(payload);
      setReportData(fallbackResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* App Header */}
      <header className="app-header">
        <div className="header-container">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
            }}>
              <Zap size={24} color="#ffffff" />
            </div>

            <div>
              <div className="brand-badge">
                Multi-Agent Placement Intelligence System
              </div>
              <h1 className="agent-title">
                Skill Gap Agent <span className="status-dot" title="Agent Service Active"></span>
              </h1>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'analyzer' ? 'active' : ''}`}
              onClick={() => setActiveTab('analyzer')}
            >
              <Cpu size={16} /> Interactive Analyzer
            </button>
            <button 
              className={`nav-tab ${activeTab === 'browser' ? 'active' : ''}`}
              onClick={() => setActiveTab('browser')}
            >
              <Compass size={16} /> Intelligence Browser
            </button>
            <button 
              className={`nav-tab ${activeTab === 'api' ? 'active' : ''}`}
              onClick={() => setActiveTab('api')}
            >
              <Terminal size={16} /> API Endpoint Specs
            </button>
          </nav>

        </div>
      </header>

      {/* Main Content View */}
      <main className="main-container">
        
        {activeTab === 'analyzer' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
            <ProfileEditor 
              onAnalyze={handleAnalyze} 
              loading={loading} 
              targets={targets} 
            />
            <SkillGapReport 
              reportData={reportData} 
            />
          </div>
        )}

        {activeTab === 'browser' && (
          <IntelligenceBrowser targets={targets} />
        )}

        {activeTab === 'api' && (
          <ApiTester />
        )}

      </main>
    </div>
  );
}
