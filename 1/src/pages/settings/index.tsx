export default function Settings() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-navy-deep to-[#0f172a] text-white p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">Settings</h1>
                <p className="text-silver text-lg">Configuration & Preferences</p>

                <div className="mt-8 space-y-6">
                    <div className="rounded-xl border border-silver/20 bg-navy-card p-6">
                        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-silver text-sm mb-2">Store Name</label>
                                <input
                                    type="text"
                                    value="PlayBeat Digital"
                                    className="w-full rounded-lg border border-silver/20 bg-navy-surface px-4 py-2 text-white"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-silver text-sm mb-2">Currency</label>
                                <select className="w-full rounded-lg border border-silver/20 bg-navy-surface px-4 py-2 text-white">
                                    <option>PKR</option>
                                    <option>USD</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-silver/20 bg-navy-card p-6">
                        <h2 className="text-xl font-semibold mb-4">API Keys</h2>
                        <p className="text-silver text-sm">Manage your payment gateway integrations</p>
                        <ul className="mt-4 space-y-2 text-silver">
                            <li>✓ Stripe</li>
                            <li>✓ JazzCash</li>
                            <li>✓ Bank Alfalah</li>
                            <li>✓ Meezan Bank</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
