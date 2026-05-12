"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSurgePricing, updateSurgePricing } from "../../../services/admin.service";

export const DynamicPricing = () => {
    const [multiplier, setMultiplier] = useState<number>(1.0);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        const fetchSurge = async () => {
            try {
                const data = await getSurgePricing();
                setMultiplier(data.multiplier);
            } catch (error) {
                toast.error("Failed to load surge pricing");
            } finally {
                setLoading(false);
            }
        };
        fetchSurge();
    }, []);

    const handleApplyChanges = async () => {
        try {
            setSaving(true);
            const data = await updateSurgePricing(multiplier);
            toast.success(data.message || "Surge pricing updated successfully");
            setMultiplier(data.multiplier);
        } catch (error) {
            toast.error("Failed to update surge pricing");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6">Loading pricing settings...</div>;
    }

    return (
        <div className="max-w-xl bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold mb-6">Price Controls</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm mb-1 font-medium">Base Fare (₹)</label>
                    <input className="w-full border p-2 rounded bg-gray-100 text-gray-500" type="number" defaultValue="50.00" disabled />
                    <p className="text-xs text-gray-500 mt-1">Base fare is currently fixed by the system.</p>
                </div>
                <div>
                    <label className="block text-sm mb-1 font-medium">Surge Multiplier</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={multiplier}
                        onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                    >
                        <option value={1.0}>1.0x (Normal)</option>
                        <option value={1.2}>1.2x (Slight Demand)</option>
                        <option value={1.5}>1.5x (High Demand)</option>
                        <option value={2.0}>2.0x (Peak Hours)</option>
                        <option value={2.5}>2.5x (Extreme Demand)</option>
                    </select>
                </div>
                <button
                    onClick={handleApplyChanges}
                    disabled={saving}
                    className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold disabled:opacity-50"
                >
                    {saving ? "Applying..." : "Apply Changes"}
                </button>
            </div>
        </div>
    );
};