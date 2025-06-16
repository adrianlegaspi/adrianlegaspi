import React from 'react';

function Footer() {
  return (
    <footer className="text-center py-4 border-t border-ink/10 dark:border-paper/10">
      © {new Date().getFullYear()} Adrián Legaspi
    </footer>
  );
}

export default Footer;
