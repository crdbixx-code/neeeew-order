export default function AdminControl() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-navy-deep to-[#0f172a] text-white p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">Admin Control</h1>
                <p className="text-silver text-lg">Storefront Management & Configuration</p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-silver/20 bg-navy-card p-6">
                        <h3 className="text-lg font-semibold mb-4">📦 Storefront</h3>
                        <ul className="space-y-2 text-silver">
                            <li className="hover:text-white cursor-pointer transition">→ Featured Products</li>
                            <li className="hover:text-white cursor-pointer transition">→ Categories</li>
                            <li className="hover:text-white cursor-pointer transition">→ Homepage Banner</li>
                            <li className="hover:text-white cursor-pointer transition">→ Promotions</li>
                        </ul>
                    </div>

                    <div className="rounded-xl border border-silver/20 bg-navy-card p-6">
                        <h3 className="text-lg font-semibold mb-4">👥 Users</h3>
                        <ul className="space-y-2 text-silver">
                            <li className="hover:text-white cursor-pointer transition">→ Manage Accounts</li>
                            <li className="hover:text-white cursor-pointer transition">→ Permissions</li>
                            <li className="hover:text-white cursor-pointer transition">→ Activity Logs</li>
                            <li className="hover:text-white cursor-pointer transition">→ Support Tickets</li>
                        </ul>
                    </div>

                    <div className="rounded-xl border border-silver/20 bg-navy-card p-6">
                        <h3 className="text-lg font-semibold mb-4">💳 Payments</h3>
                        <ul className="space-y-2 text-silver">
                            <li className="hover:text-white cursor-pointer transition">→ Transaction History</li>
                            <li className="hover:text-white cursor-pointer transition">→ Refunds</li>
                            <li className="hover:text-white cursor-pointer transition">→ Payment Methods</li>
                            <li className="hover:text-white cursor-pointer transition">→ Settlements</li>
                        </ul>
                    </div>

                    <div className="rounded-xl border border-silver/20 bg-navy-card p-6">
                        <h3 className="text-lg font-semibold mb-4">📊 Analytics</h3>
                        <ul className="space-y-2 text-silver">
                            <li className="hover:text-white cursor-pointer transition">→ Sales Reports</li>
                            <li className="hover:text-white cursor-pointer transition">→ Traffic Stats</li>
                            <li className="hover:text-white cursor-pointer transition">→ Conversion Rates</li>
                            <li className="hover:text-white cursor-pointer transition">→ Export Data</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
