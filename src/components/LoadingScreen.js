import React, { useState, useEffect, useRef } from 'react';

const LoadingScreen = ({ onLoadComplete }) => {
  const [messages, setMessages] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const hasStartedRef = useRef(false);
  
  // Command pairs: each entry has a command and its corresponding output
  const startupSequence = [
    { cmd: 'boot system.kernel', output: 'Initializing system...' },
    { cmd: 'load kernel_modules', output: 'Loading kernel modules...' },
    { cmd: 'fsck --integrity', output: 'Checking file system integrity...' },
    { cmd: 'mount --all', output: 'Mounting drives...' },
    { cmd: 'service network start', output: 'Starting network services...' },
    { cmd: 'load ui_components', output: 'Loading user interface components...' },
    { cmd: 'init display', output: 'Initializing display drivers...' },
    { cmd: 'echo "System ready."', output: 'System ready.' }
  ];
  
  useEffect(() => {
    // Prevent the effect from running multiple times
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    
    let messageTimer;
    const startTime = Date.now();
    
    // Blink cursor effect
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    // Display messages one by one with controlled timing
    const displayMessages = async () => {
      for (let i = 0; i < startupSequence.length; i++) {
        const { cmd, output } = startupSequence[i];
        
        // First show command with prompt
        const cmdWithPrompt = `$ ${cmd}`;
        setMessages(prev => [...prev, { type: 'command', text: cmdWithPrompt }]);
        
        // Wait as if typing
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Then show output
        setMessages(prev => [...prev, { type: 'output', text: output }]);
        
        // Wait before next command
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Calculate elapsed time and wait remaining time to ensure minimum 3 seconds
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(3000 - elapsedTime, 0);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      if (onLoadComplete) onLoadComplete();
    };
    
    // Start the message display sequence
    displayMessages();
    
    return () => {
      clearTimeout(messageTimer);
      clearInterval(cursorInterval);
    };
  }, [onLoadComplete]);
  
  return (
    <div className="fixed inset-0 bg-black flex items-start justify-start z-50 overflow-auto">
      <div className="p-6 pt-10 font-mono text-amber-50 w-full max-w-4xl">
        <pre className="whitespace-pre-wrap text-left">
          {messages.map((message, index) => (
            <div key={index} className={message.type === 'command' ? 'text-green-200 font-bold' : 'text-amber-50 pl-0'}>
              {message.text}
            </div>
          ))}
          <div className="flex items-center">
            <span className="text-green-200 font-bold">$ </span>
            <span className={cursorVisible ? 'opacity-100' : 'opacity-0 ml-1'}>_</span>
          </div>
        </pre>
      </div>
    </div>
  );
};

export default LoadingScreen;
