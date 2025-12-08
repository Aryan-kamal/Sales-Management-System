function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center text-white font-semibold">
          V
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">Vault</div>
          <div className="text-xs text-gray-500">Aryan Kamal</div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 text-sm text-gray-600">
        <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50">Dashboard</button>
        <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50">Nexus</button>
        <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50">Intake</button>

        <details className="mt-2" open>
          <summary className="px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer font-medium text-gray-800">
            Services
          </summary>
          <div className="ml-3 mt-1 space-y-1">
            {['Pre-active', 'Active', 'Blocked', 'Closed'].map((item) => (
              <div key={item} className="px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-50 cursor-default">
                {item}
              </div>
            ))}
          </div>
        </details>

        <details className="mt-2" open>
          <summary className="px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer font-medium text-gray-800">
            Invoices
          </summary>
          <div className="ml-3 mt-1 space-y-1">
            {['Proforma Invoices', 'Final Invoices'].map((item) => (
              <div key={item} className="px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-50 cursor-default">
                {item}
              </div>
            ))}
          </div>
        </details>
      </nav>
    </aside>
  );
}

export default Sidebar;

