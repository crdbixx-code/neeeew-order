export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-navy-deep to-[#0f172a] text-white p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                <p className="text-silver text-lg">Backend Control Center</p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="rounded-xl border border-silver/20 bg-navy-card p-6">
                        <h2 className="text-xl font-semibold mb-2">System Status</h2>
                        <p className="text-silver">🟢 Online & Operational</p>
                    </div>
                    <div className="rounded-xl border border-silver/20 bg-navy-card p-6">
                        <h2 className="text-xl font-semibold mb-2">API Endpoints</h2>
                        <p className="text-silver">Connected to Render Backend</p>
                    </div>
                    <div className="rounded-xl border border-silver/20 bg-navy-card p-6">
                        <h2 className="text-xl font-semibold mb-2">Database</h2>
                        <p className="text-silver">MongoDB Connected</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
