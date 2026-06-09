export default function Inventory() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-navy-deep to-[#0f172a] text-white p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">Inventory</h1>
                <p className="text-silver text-lg">Manage Products & Stock</p>

                <div className="mt-8">
                    <div className="rounded-xl border border-silver/20 bg-navy-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Products</h2>
                            <button className="bg-crimson hover:bg-crimson/80 px-4 py-2 rounded-lg font-semibold transition-colors">
                                + Add Product
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-silver/20">
                                    <tr>
                                        <th className="px-4 py-2 text-silver">Product Name</th>
                                        <th className="px-4 py-2 text-silver">SKU</th>
                                        <th className="px-4 py-2 text-silver">Stock</th>
                                        <th className="px-4 py-2 text-silver">Price</th>
                                        <th className="px-4 py-2 text-silver">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-silver/10">
                                        <td className="px-4 py-3">PlayBeat Pro Plan</td>
                                        <td className="px-4 py-3">PB-PRO-001</td>
                                        <td className="px-4 py-3">∞</td>
                                        <td className="px-4 py-3">PKR 999</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">Active</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
