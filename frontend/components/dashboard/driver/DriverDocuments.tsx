"use client";

import React, { useEffect, useState, useRef } from "react";
import {
    FileText,
    BadgeCheck,
    AlertCircle,
    Eye,
    RefreshCcw,
    Plus,
    X,
    Calendar,
    UploadCloud,
    Loader2,
    CheckCircle2,
    Clock
} from "lucide-react";
import { getDriverProfile, uploadVehicleDocument } from "@/services/driver.service";
import { toast } from "sonner";

export default function DriverDocuments() {
    const [loading, setLoading] = useState(true);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Form state for new/updated document
    const [form, setForm] = useState({
        type: "license",
        expiryDate: "",
        file: null as File | null
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getDriverProfile();
            setDocuments(data.driverProfile.documents || []);
        } catch (error) {
            toast.error("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.file || !form.expiryDate) return toast.error("All fields are required");

        const formData = new FormData();
        formData.append("file", form.file);
        formData.append("type", form.type);
        formData.append("expiryDate", form.expiryDate);

        try {
            setIsUploading(true);
            toast.loading("Uploading to secure vault...", { id: "doc-up" });
            await uploadVehicleDocument(formData);
            toast.success("Document submitted for review", { id: "doc-up" });
            setIsModalOpen(false);
            setForm({ type: "license", expiryDate: "", file: null });
            fetchData();
        } catch (error) {
            toast.error("Upload failed", { id: "doc-up" });
        } finally {
            setIsUploading(false);
        }
    };

    const openUpdateModal = (type: string) => {
        setForm(prev => ({ ...prev, type }));
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-zinc-300" size={40} /></div>;

    return (
        <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-10">
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">Compliance Vault</h1>
                    <p className="text-zinc-500 text-sm mt-1">Manage and update your verification documents</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-sm font-bold shadow-xl hover:opacity-90 transition-all"
                >
                    <Plus size={18} /> Add New Document
                </button>
            </div>

            {/* Verification Progress Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
                    <CheckCircle2 className="text-emerald-500 mb-4" size={28} />
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Verified</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-white">
                        {documents.filter(d => d.isVerified).length} <span className="text-sm text-zinc-400 font-medium">Files</span>
                    </p>
                </div>
                <div className="p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
                    <Clock className="text-orange-500 mb-4" size={28} />
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pending Review</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-white">
                        {documents.filter(d => !d.isVerified).length} <span className="text-sm text-zinc-400 font-medium">Files</span>
                    </p>
                </div>
            </div>

            {/* Documents List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                        {/* IMAGE SECTION */}
                        <div className="relative">
                            {doc.url && (
                                <img
                                    src={doc.url}
                                    alt={doc.type}
                                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            )}

                            {/* STATUS BADGE */}
                            <div className="absolute top-4 left-4">
                                <span
                                    className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${doc.isVerified
                                        ? "bg-emerald-500 text-white"
                                        : "bg-orange-500 text-white"
                                        }`}
                                >
                                    {doc.isVerified ? "Verified" : "Pending"}
                                </span>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-5">
                            <h3 className="font-black text-lg text-zinc-900 dark:text-white uppercase tracking-tight">
                                {doc.type} Certificate
                            </h3>

                            <p className="text-xs text-zinc-400 mt-1">
                                Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                            </p>

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-3 mt-5">
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    className="flex-1 text-center px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 transition"
                                >
                                    View
                                </a>

                                <button
                                    onClick={() => openUpdateModal(doc.type)}
                                    className="flex-1 px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-80 transition"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 text-zinc-400 hover:text-zinc-900"><X /></button>

                        <h2 className="text-3xl font-black tracking-tighter mb-8">Update Document</h2>

                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Document Category</label>
                                <select
                                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold text-sm outline-none capitalize"
                                    value={form.type}
                                    onChange={e => setForm({ ...form, type: e.target.value })}
                                >
                                    <option value="license">Driving License</option>
                                    <option value="insurance">Insurance</option>
                                    <option value="rc">Registration (RC)</option>
                                    <option value="permit">Vehicle Permit</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Expiry Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    <input
                                        type="date"
                                        className="w-full p-4 pl-12 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold text-sm outline-none"
                                        value={form.expiryDate}
                                        onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Document File</label>
                                <div className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-4xl p-10 text-center hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={e => setForm({ ...form, file: e.target.files?.[0] || null })}
                                    />
                                    <UploadCloud className="mx-auto mb-2 text-zinc-300" size={40} />
                                    <p className="text-sm font-bold text-zinc-900 dark:text-white">
                                        {form.file ? form.file.name : "Select Document Image/PDF"}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isUploading}
                                className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                            >
                                {isUploading && <Loader2 className="animate-spin" size={18} />}
                                Upload & Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}