import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { SOCIAL_LINKS, AVAILABLE_COMMANDS } from '../constants/social';

function Contact() {
  const t = useTranslations('contact');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [commandStatus, setCommandStatus] = useState({ command: '> initializing_connection', completed: false });
  const [showEmail, setShowEmail] = useState(false);
  const [inputCommand, setInputCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [focusInput, setFocusInput] = useState(false);
  const [hasTerminalFocus, setHasTerminalFocus] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const email = SOCIAL_LINKS.email;
  
  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Terminal command simulation effect
  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setCommandStatus({ command: '> establishing_connection', completed: false });
    }, 1000);
    
    const timeout2 = setTimeout(() => {
      setCommandStatus({ command: '> connection_established', completed: true });
    }, 1800);
    
    const timeout2b = setTimeout(() => {
      setCommandStatus({ command: '> authentication_success', completed: true });
    }, 2200);
    
    const timeout3 = setTimeout(() => {
      setShowEmail(true);
      setFocusInput(true);
    }, 2500);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout2b);
      clearTimeout(timeout3);
    };
  }, []);

  // Focus input when ready
  useEffect(() => {
    if (focusInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusInput]);

  // Handle click anywhere on the terminal to focus input
  const handleTerminalClick = () => {
    if (inputRef.current && showEmail) {
      inputRef.current.focus();
    }
  };

  // Scroll terminal to bottom
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  // Update scroll position when command history changes
  useEffect(() => {
    scrollToBottom();
  }, [commandHistory, scrollToBottom]);

  // Process user commands
  const processCommand = (cmd) => {
    const command = cmd.trim().toLowerCase();
    let response = '';
    
    if (command === 'copy') {
      navigator.clipboard.writeText(email);
      response = `> email_copied_to_clipboard\n> ${email}`;
    } 
    else if (command === 'help') {
      response = `> available_commands\n${AVAILABLE_COMMANDS.map(cmd => `  ${cmd}`).join('\n')}`;
    }
    else if (command === 'echo $email') {
      response = `> ${email}`;
    }
    else if (command === 'whoami') {
      response = '> guest@visitorsession';
    }
    else if (command === 'date') {
      response = `> ${new Date().toString()}`;
    }
    else if (command === 'clear') {
      setCommandHistory([]);
      return;
    }
    else if (SOCIAL_LINKS[command]) {
      window.open(SOCIAL_LINKS[command], '_blank');
      response = `> opening_${command}_profile`;
    }
    else if (command) {
      response = `> command_not_found: ${command}\n> type_help_for_available_commands`;
    }
    
    if (command) {
      setCommandHistory(prev => [...prev, { type: 'input', text: command }, { type: 'output', text: response }]);
    }
  };

  // Handle terminal focus events
  const handleTerminalFocus = () => {
    setHasTerminalFocus(true);
  };

  const handleTerminalBlur = () => {
    setHasTerminalFocus(false);
  };

  // Handle key press in input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processCommand(inputCommand);
      setInputCommand('');
    }
  };

  return (
    <section id="contact" className="py-16 px-4 relative">
      {/* Background effect */}
      <div className="absolute inset-0 opacity-5 crt-effect"></div>
      
      {/* Central terminal window */}
      <div className="max-w-lg mx-auto border-2 border-current overflow-hidden relative">
        {/* Terminal header */}
        <div className="bg-ink/10 dark:bg-paper/10 px-4 py-2 flex justify-between items-center border-b border-current">
          <div className="text-sm font-bold uppercase tracking-wider">{t('heading')}</div>
          <div className="flex gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-current opacity-20"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-current opacity-50"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-current opacity-80"></span>
          </div>
        </div>
        
        {/* Terminal content */}
        <div 
          ref={terminalRef}
          className={`bg-ink/5 dark:bg-paper/5 p-6 font-mono text-sm relative min-h-[300px] max-h-[400px] overflow-y-auto transition-colors duration-200 ${hasTerminalFocus ? 'ring-1 ring-ink/50 dark:ring-paper/50' : ''}`}
          onClick={handleTerminalClick}
        >
          <div className="mb-2 flex">
            <span className="text-green-600 dark:text-green-400">you</span>
            <span className="mx-1">:</span>
            <span className="text-blue-600 dark:text-blue-400">~</span>
            <span className="mx-1">$</span>
            <span>contact --init</span>
          </div>
          
          <div className="mb-4">
            <div>{commandStatus.command}{!commandStatus.completed && <span className={cursorVisible ? 'opacity-100' : 'opacity-0'}>_</span>}</div>
            {commandStatus.completed && (
              <div className="text-green-600 dark:text-green-400">{`> success`}</div>
            )}
          </div>
          
          {showEmail && (
            <div className="animate-slide-up mb-4">
              <div className="mb-2">{'> contact_information'}</div>
              <div className="flex gap-2 my-2">
                <span className="text-green-600 dark:text-green-400">EMAIL:</span> 
                <a 
                  href={`mailto:${email}`}
                  className="group relative overflow-hidden inline-block"
                  onMouseEnter={() => setCursorVisible(false)}
                  onMouseLeave={() => setCursorVisible(true)}
                >
                  <span>{email}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>
              
              <div className="mb-2 mt-4">{'> type_help_for_available_commands'}</div>
            </div>
          )}
          
          {/* Command history */}
          <div className="mb-6">
            {commandHistory.map((item, index) => (
              <div key={index} className="mb-1">
                {item.type === 'input' ? (
                  <div className="flex">
                    <span className="text-green-600 dark:text-green-400">terminal</span>
                    <span className="mx-1">:</span>
                    <span className="text-blue-600 dark:text-blue-400">~</span>
                    <span className="mx-1">$</span>
                    <span>{item.text}</span>
                  </div>
                ) : (
                  <div className="text-comment whitespace-pre-wrap">{item.text}</div>
                )}
              </div>
            ))}
          </div>
          
          {/* Command input */}
          {showEmail && (
            <div className="flex items-center relative">
              <span className="text-green-600 dark:text-green-400">terminal</span>
              <span className="mx-1">:</span>
              <span className="text-blue-600 dark:text-blue-400">~</span>
              <span className="mx-1">$</span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputCommand}
                  onChange={(e) => setInputCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={handleTerminalFocus}
                  onBlur={handleTerminalBlur}
                  className="bg-transparent outline-none w-full caret-transparent"
                  spellCheck="false"
                />
                <span 
                  className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} absolute ${hasTerminalFocus ? 'bg-ink dark:bg-paper' : ''}`}
                  style={{ 
                    display: 'inline-block', 
                    width: hasTerminalFocus ? '0.5rem' : 'auto',
                    left: `${inputCommand.length}ch`,
                    height: hasTerminalFocus ? '1.125rem' : 'auto',
                    top: '1px',
                    animation: hasTerminalFocus ? 'blink 1s step-end infinite' : 'none'
                  }}
                >
                  {!hasTerminalFocus && '_'}
                </span>
              </div>
            </div>
          )}
          
          {/* ASCII decoration and focus indicator */}
          <div className="absolute bottom-4 right-4 text-xs text-comment flex items-center gap-2">
            {hasTerminalFocus && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
            {'[session_active]'}
          </div>
        </div>
      </div>
      
      {/* Retro decorative elements */}
      <div className="flex justify-center mt-8 opacity-40">
        <div className="text-xs tracking-widest uppercase text-comment">{'/* End of transmission */'}</div>
      </div>
      
      <div className="scanlines absolute inset-0 opacity-10 pointer-events-none"></div>
    </section>
  );
}

export default Contact;
