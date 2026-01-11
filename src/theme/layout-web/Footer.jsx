/**
 * Application Footer Component
 * Fixed footer with branding and version information
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white dark:bg-dark-surface border-t border-light-border dark:border-dark-border z-30 lg:left-64">
      <div className="h-full px-6 flex items-center justify-between text-sm">
        {/* Left: Copyright */}
        <div className="text-gray-600 dark:text-gray-400">
          © {currentYear} {import.meta.env.VITE_DEV_ORG_NAME}
        </div>

        {/* Right: Version Info */}
        <div className="text-gray-500 dark:text-gray-500 hidden sm:block">
          {import.meta.env.VITE_DEV_APP_NAME} {import.meta.env.VITE_DEV_APP_VERSION}
        </div>
      </div>
    </footer>
  );
}