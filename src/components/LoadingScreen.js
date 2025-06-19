import React, { useState, useEffect, useRef } from 'react';

// CSS for hiding scrollbars
const scrollbarHideStyles = `
  /* Hide scrollbar for Chrome, Safari and Opera */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  /* Classic Windows progress bar stripes */
  .progress-stripes {
    height: 100%;
    width: 200%;
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
    background-size: 20px 20px;
    animation: progress-animation 1s linear infinite;
  }
  
  @keyframes progress-animation {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-20px);
    }
  }
`;

const LoadingScreen = ({ onLoadComplete, simpleMode = false }) => {
  const [messages, setMessages] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [progressPercent, setProgressPercent] = useState(5); // Start with 5% visible
  const [debugMode, setDebugMode] = useState(false); // Debug mode disabled
  const hasStartedRef = useRef(false);
  const terminalRef = useRef(null);
  
  // Command pairs: each entry has a command, output, and execution time (in ms)
  // Final message after all terminal output is complete
  const finalStartupMessage = "Starting system...";

  const startupSequence = [
    { 
      cmd: 'boot system.kernel', 
      output: `[OK] Loading kernel module core.sys
[OK] Hardware detection completed
[OK] System initialization complete`, 
      execTime: 250 
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
      cmd: 'fsck /dev/sda2', 
      output: `Checking filesystem...
Verifying inode tables: 586428/586428 files
Checking sector allocation: 2847301/2984251 clusters
Verifying file extents...
Verifying directory structure...
Resolving hardlinks...
Pass 1 complete - filesystem integrity verified`,
      execTime: 350 
    },
    { 
      cmd: 'mount --all', 
      output: `/dev/sda1 mounted on /boot
/dev/sda2 mounted on /
/dev/sda3 mounted on /home
tmpfs mounted on /tmp
procfs mounted on /proc
All filesystems mounted. Space available.`,
      execTime: 180 
    },
    { 
      cmd: 'service network start', 
      output: `Starting network services...
Initializing interfaces...
Obtaining IP address: 192.168.1.105
Network gateway: 192.168.1.1
DNS: 8.8.8.8, 8.8.4.4
Network connectivity established.`,
      execTime: 250 
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
Setting optimal resolution
Color depth: 32bit
Graphics acceleration enabled
Display configuration complete.`,
      execTime: 200 
    },
    { 
      cmd: 'echo "$(date) - System ready."', 
      output: `${new Date().toLocaleString()} - System ready.`,
      execTime: 100 
    },
    {
      cmd: 'startx',
      output: 'Initializing graphical user interface...',
      execTime: 150
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
    
    // Function to skip directly to the welcome screen in simple mode
    const skipToWelcomeScreen = () => {
      setTimeout(() => setTransitioning(true), 100);
      setTimeout(() => setProgressPercent(30), 100);
      setTimeout(() => setProgressPercent(50), 200);
      setTimeout(() => setProgressPercent(75), 400);
      setTimeout(() => setProgressPercent(100), 600);
      
      // Only complete transition AFTER progress bar is 100%
      setTimeout(() => {
        if (onLoadComplete) onLoadComplete();
      }, 1000);
    };
    
    // Skip terminal animation if in simple mode
    if (simpleMode) {
      skipToWelcomeScreen();
      return;
    }
    
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
        const typingDelay = 50 + Math.floor(Math.random() * 50);
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
        
        // Show output line by line for a more realistic effect
        const outputLines = output.split('\n');
        
        for (let line of outputLines) {
          // Add a small random delay between each line to simulate realistic printing
          const lineDelay = 20 + Math.floor(Math.random() * 40);
          await new Promise(resolve => setTimeout(resolve, lineDelay));
          
          // Add the line to the message array
          setMessages(prev => {
            const newMessages = [...prev, { type: 'output', text: line }];
            setTimeout(() => scrollToBottom(), 50);
            return newMessages;
          });
        }
        
        // Wait before next command (varied delay between commands)
        const commandDelay = 100 + Math.floor(Math.random() * 100);
        await new Promise(resolve => setTimeout(resolve, commandDelay));
      }
      
      // Calculate elapsed time and wait remaining time to ensure minimum 3 seconds
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(2500 - elapsedTime, 0);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      // Show final startup message
      setMessages(prev => {
        const newMessages = [...prev, { type: 'system', text: finalStartupMessage }];
        setTimeout(() => scrollToBottom(), 50);
        return newMessages;
      });
      
      // Begin progress bar animation
      setTransitioning(true);
      
      // DEBUG MODE: If in debug mode, freeze at progress 50% and don't complete
      if (debugMode) {
        console.log('DEBUG MODE: Progress bar frozen at 50%');
        return; // Stop here in debug mode to examine the UI
      }
      
      // Set progress immediately to ensure visibility
      setProgressPercent(25);
      
      // Normal progress animation with guaranteed completion
      setTimeout(() => setProgressPercent(50), 200);
      setTimeout(() => setProgressPercent(75), 400);
      setTimeout(() => setProgressPercent(100), 600);
      
      // Only complete transition AFTER progress bar is 100%
      setTimeout(() => {
        if (onLoadComplete) onLoadComplete();
      }, 1000);
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
    <div className="fixed inset-0 z-50">
      {/* Add inline styles for hiding scrollbars */}
      <style>{scrollbarHideStyles}</style>
      {/* Windows 95-style transition overlay */}
      <div className={`fixed inset-0 bg-paper dark:bg-ink z-10 transition-opacity duration-1500 ${transitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-full h-full flex items-center justify-center transition-transform duration-1000 ${transitioning ? 'scale-100' : 'scale-75'}`}>
          <div className="text-center transform transition-all duration-1000">
            <div className="flex flex-col items-center justify-center">
                            {/* Windows 95 style progress bar */}
              <div className="w-64 h-5 mb-4 relative border border-ink dark:border-paper bg-paper dark:bg-ink shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)] overflow-hidden">
                {/* Progress bar with consistent padding and no overflow */}
                <div 
                  className="absolute inset-0 transition-all duration-300 ease-linear bg-ink dark:bg-paper m-[2px]" 
                  style={{ width: `calc(${progressPercent}% - 4px)` }}
                >
                  {/* Solid color progress bar */}
                </div>
              </div>
              <div className="
                py-2 px-8 inline-block
                border border-ink dark:border-paper
                shadow-[2px_2px_0_rgba(4,0,5,0.5)]
                dark:shadow-[2px_2px_0_rgba(255,249,239,0.5)]
                bg-gradient-to-b from-paper/90 to-paper dark:from-ink/90 dark:to-ink
              ">
                <p className="font-mono text-ink dark:text-paper text-sm">Welcome to adrianlegaspi.dev</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Terminal screen - only shown when not in simple mode */}
      {!simpleMode && (
        <div 
          ref={terminalRef}
          className={`fixed inset-0 bg-black flex flex-col items-start justify-start overflow-auto z-0 transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'} scrollbar-hide`}
        >
          <div className="p-6 pt-10 font-mono text-amber-50 w-full max-w-4xl">
            <pre className="whitespace-pre-wrap text-left">
            {messages.map((message, index) => (
              <div key={index} className={
                message.type === 'command' ? 'text-green-200 font-bold' : 
                message.type === 'executing' ? 'text-yellow-500 italic pl-4' : 
                message.type === 'system' ? 'text-blue-300 font-bold' :
                'text-amber-50 pl-0'
              }>
                {message.type === 'output' ? (
                  <pre className="whitespace-pre-wrap">{message.text}</pre>
                ) : (
                  message.text
                )}
              </div>
            ))}
            {!transitioning && (
              <div className="flex items-center">
                <span className="text-green-200 font-bold">$ </span>
                <span className={cursorVisible ? 'opacity-100' : 'opacity-0 ml-1'}>_</span>
              </div>
            )}
            </pre>
          </div>
      </div>
      )}
    </div>
  );
};

export default LoadingScreen;
