import React, { useState, useEffect, useRef } from 'react';

const LoadingScreen = ({ onLoadComplete }) => {
  const [messages, setMessages] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const hasStartedRef = useRef(false);
  const terminalRef = useRef(null);
  
  // Command pairs: each entry has a command, output, and execution time (in ms)
  const startupSequence = [
    { 
      cmd: 'boot system.kernel', 
      output: `[OK] Loading kernel module core.sys
[OK] Hardware detection completed
[OK] System initialization complete`,
      execTime: 450 
    },
    { 
      cmd: 'load kernel_modules', 
      output: `Loading module: io.system [OK]
Loading module: fs.driver [OK]
Loading module: network.core [OK]
Loading module: graphics.base [OK]
Loading module: input.devices [OK]
All kernel modules loaded successfully.`,
      execTime: 750 
    },
    { 
      cmd: 'fsck --integrity', 
      output: `Checking filesystem structure...
Verifying inode tables: 586428/586428 files
Checking sector allocation: 2847301/2984251 clusters
Verifying file extents...
Verifying directory structure...
Resolving hardlinks...
Pass 1 complete - filesystem integrity verified`,
      execTime: 850 
    },
    { 
      cmd: 'mount --all', 
      output: `/dev/sda1 mounted on /boot
/dev/sda2 mounted on /
/dev/sda3 mounted on /home
tmpfs mounted on /tmp
procfs mounted on /proc
All filesystems mounted. Space available: 234.5GB`,
      execTime: 320 
    },
    { 
      cmd: 'service network start', 
      output: `Starting network services...
Initializing interfaces...
eth0: Link is up at 1000Mbps
Obtaining IP address: 192.168.1.105
Network gateway: 192.168.1.1
DNS: 8.8.8.8, 8.8.4.4
Network connectivity established.`,
      execTime: 580 
    },
    { 
      cmd: 'load ui_components', 
      output: `Loading graphical subsystem...
Initializing windowing system...
Loading theme: modern-dark
Registering UI components:
  - navigation.component [LOADED]
  - content.framework [LOADED]
  - animation.engine [LOADED]
  - interaction.handlers [LOADED]
Application framwork initialized.`,
      execTime: 650 
    },
    { 
      cmd: 'init display', 
      output: `Detecting displays...
Found monitor: DELL U2720Q (3840x2160)
Setting optimal resolution
Refresh rate: 60Hz
Color depth: 32bit
Graphics acceleration enabled
Display configuration complete.`,
      execTime: 400 
    },
    { 
      cmd: 'echo "$(date) - System ready."', 
      output: `${new Date().toLocaleString()} - System ready.`,
      execTime: 100 
    }
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
        setMessages(prev => {
          const newMessages = [...prev, { type: 'command', text: cmdWithPrompt }];
          setTimeout(() => scrollToBottom(), 50);
          return newMessages;
        });
        
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
                setTimeout(() => scrollToBottom(), 50);
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
        setMessages(prev => {
          const newMessages = [...prev, { type: 'output', text: output }];
          setTimeout(() => scrollToBottom(), 50);
          return newMessages;
        });
        
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
    
    // Function to scroll the terminal to the bottom
    const scrollToBottom = () => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    };
    
    // Start the message display sequence
    displayMessages();
    
    return () => {
      clearTimeout(messageTimer);
      clearInterval(cursorInterval);
    };
  }, [onLoadComplete]);
  
  return (
    <div ref={terminalRef} className="fixed inset-0 bg-black flex flex-col items-start justify-start z-50 overflow-auto">
      <div className="p-6 pt-10 font-mono text-amber-50 w-full max-w-4xl">
        <pre className="whitespace-pre-wrap text-left">
          {messages.map((message, index) => (
            <div key={index} className={
              message.type === 'command' ? 'text-green-200 font-bold' : 
              message.type === 'executing' ? 'text-yellow-500 italic pl-4' : 
              'text-amber-50 pl-0'
            }>
              {message.type === 'output' ? (
                <pre className="whitespace-pre-wrap">{message.text}</pre>
              ) : (
                message.text
              )}
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
