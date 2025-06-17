import React, { useState, useEffect, useRef } from 'react';

const LoadingScreen = ({ onLoadComplete }) => {
  const [messages, setMessages] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const hasStartedRef = useRef(false);
  
  // Command pairs: each entry has a command, output, and execution time (in ms)
  const startupSequence = [
    { cmd: 'boot system.kernel', output: 'Initializing system...', execTime: 350 },
    { cmd: 'load kernel_modules', output: 'Loading kernel modules...', execTime: 650 },
    { cmd: 'fsck --integrity', output: 'Checking file system integrity...', execTime: 750 },
    { cmd: 'mount --all', output: 'Mounting drives...', execTime: 200 },
    { cmd: 'service network start', output: 'Starting network services...', execTime: 450 },
    { cmd: 'load ui_components', output: 'Loading user interface components...', execTime: 550 },
    { cmd: 'init display', output: 'Initializing display drivers...', execTime: 300 },
    { cmd: 'echo "System ready."', output: 'System ready.', execTime: 100 }
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
    
    // Display messages one by one with randomized typing speed and execution time
    const displayMessages = async () => {
      for (let i = 0; i < startupSequence.length; i++) {
        const { cmd, output, execTime } = startupSequence[i];
        
        // Type command with varied typing speed
        const cmdWithPrompt = `$ ${cmd}`;
        setMessages(prev => [...prev, { type: 'command', text: cmdWithPrompt }]);
        
        // Simulate "Enter" key press with slightly varied timing
        const typingDelay = 150 + Math.floor(Math.random() * 100);
        await new Promise(resolve => setTimeout(resolve, typingDelay));
        
        // Execute command with its specified time
        // For longer executions, show a loading indicator
        if (execTime > 300) {
          let dots = '';
          const dotsInterval = setInterval(() => {
            dots = dots.length < 3 ? dots + '.' : '';
            setMessages(prev => {
              const newMessages = [...prev];
              const lastIndex = newMessages.length - 1;
              if (lastIndex >= 0 && newMessages[lastIndex].type === 'executing') {
                newMessages[lastIndex] = { type: 'executing', text: `Executing${dots}` };
              } else {
                newMessages.push({ type: 'executing', text: `Executing${dots}` });
              }
              return newMessages;
            });
          }, 200);
          
          await new Promise(resolve => setTimeout(resolve, execTime));
          clearInterval(dotsInterval);
          
          // Remove the loading indicator
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages[newMessages.length - 1].type === 'executing') {
              return newMessages.slice(0, -1);
            }
            return newMessages;
          });
        } else {
          await new Promise(resolve => setTimeout(resolve, execTime));
        }
        
        // Show output
        setMessages(prev => [...prev, { type: 'output', text: output }]);
        
        // Wait before next command (varied delay between commands)
        const commandDelay = 200 + Math.floor(Math.random() * 200);
        await new Promise(resolve => setTimeout(resolve, commandDelay));
      }
      
      // Calculate elapsed time and wait remaining time to ensure minimum 5 seconds
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(5000 - elapsedTime, 0);
      
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
            <div key={index} className={
              message.type === 'command' ? 'text-green-200 font-bold' : 
              message.type === 'executing' ? 'text-yellow-500 italic pl-4' : 
              'text-amber-50 pl-0'
            }>
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
