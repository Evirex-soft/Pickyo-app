"use client";

import React, { useEffect, useState, useRef } from "react";
import {
    Car, ShieldCheck, FileText, BadgeCheck,
    AlertCircle, Camera, Loader2, Save, X, Calendar as CalendarIcon, UploadCloud,
    Trash2
} from "lucide-react";
import { deleteDriverDocument, getDriverProfile, updateVehicle, uploadVehicleDocument } from "@/services/driver.service";
import { toast } from "sonner";


export default function VehicleDetails() {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [vehicle, setVehicle] = useState<any>(null);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        type: "insurance",
        expiryDate: "",
        file: null as File | null
    });


    // Fetch driver profile
    const fetchVehicleData = async () => {
        try {
            setLoading(true);
            const data = await getDriverProfile();
            const profile = data.driverProfile;

            setVehicle({
                ...profile,
                ...profile.vehicles?.[0],
                licenseNo: profile.vehicles?.[0]?.plateNumber
            })
        } catch (error) {
            toast.error("Failed to load vehicle profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicleData();
    }, []);

    // Handle Vehicle Info
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setUpdating(true);
            await updateVehicle({
                vehicleType: vehicle.vehicleType,
                model: vehicle.model,
                licenseNo: vehicle.licenseNo,
                color: vehicle.color
            });
            toast.success("Vehicle information updated successfully");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update vehicle information");
        } finally {
            setUpdating(false);
        }
    };

    // Handle Document Upload
    const handleDocumentUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadForm.file || !uploadForm.expiryDate) {
            toast.error("Please fill all fields and select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadForm.file);
        formData.append("type", uploadForm.type);
        formData.append("expiryDate", uploadForm.expiryDate);

        try {
            toast.loading("Processing document...", { id: "upload" });
            await uploadVehicleDocument(formData);
            toast.success("Document uploaded for verification", { id: "upload" });

            // Reset and Close
            setIsUploadModalOpen(false);
            setUploadForm({ type: "insurance", expiryDate: "", file: null });
            fetchVehicleData();
        } catch (error) {
            toast.error("Upload failed", { id: "upload" });
        }
    };

    const handleDeleteDocument = async (id: string) => {
        try {
            await deleteDriverDocument(id);
            toast.success("Document deleted successfully");
            fetchVehicleData();
        } catch (error) {
            toast.error("Failed to delete document");
        }
    }

    if (loading) return <VehicleSkeleton />;

    return (
        <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-10">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">Vehicle Profile</h1>
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <button onClick={handleUpdate} disabled={updating} className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-sm font-bold flex items-center gap-2">
                            {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold">Update Info</button>
                    )}
                </div>
            </div>

            {/* Visual Hero Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 group relative overflow-hidden bg-zinc-900 dark:bg-zinc-800 rounded-[3rem] p-12 text-white shadow-2xl shadow-zinc-200 dark:shadow-none">
                    <div className="relative z-10">
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-1">Vehicle Type</p>
                        {isEditing ? (
                            <input className="bg-transparent text-5xl font-black tracking-tighter mb-8 border-b border-zinc-700 outline-none w-full" value={vehicle?.vehicleType} onChange={(e) => setVehicle({ ...vehicle, vehicleType: e.target.value })} />
                        ) : (
                            <h2 className="text-5xl font-black tracking-tighter mb-8 capitalize">{vehicle?.vehicleType}</h2>
                        )}

                        <p className="text-zinc-500 text-[10px] font-black uppercase mb-2">Model</p>

                        {isEditing ? (
                            <input
                                className="bg-transparent text-2xl font-bold tracking-tight mb-6 border-b border-zinc-700 outline-none w-full text-white"
                                value={vehicle?.model || ""}
                                placeholder=""
                                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                            />
                        ) : (
                            <p className="text-2xl font-bold tracking-tight mb-6 capitalize">
                                {vehicle?.model || "Not Set"}
                            </p>
                        )}

                        <div className="grid grid-cols-2 gap-10">
                            <div>
                                <p className="text-zinc-500 text-[10px] font-black uppercase mb-2">License / Plate</p>
                                {isEditing ? (
                                    <input className="bg-transparent text-xl font-bold tracking-tight border-b border-zinc-700 outline-none w-full text-white" value={vehicle?.licenseNo || ""} placeholder="Enter License No" onChange={(e) => setVehicle({ ...vehicle, licenseNo: e.target.value })} />
                                ) : (
                                    <p className="text-xl font-bold tracking-tight">{vehicle?.licenseNo || "Not Set"}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-zinc-500 text-[10px] font-black uppercase mb-2">Primary Color</p>
                                {isEditing ? (
                                    <input className="bg-transparent text-xl font-bold tracking-tight border-b border-zinc-700 outline-none w-full text-white" value={vehicle?.color || ""} placeholder="White/Black" onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })} />
                                ) : (
                                    <p className="text-xl font-bold tracking-tight capitalize">{vehicle?.color || "Not Set"}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <Car className="absolute -right-16 -bottom-16 w-80 h-80 text-white/5 -rotate-12 pointer-events-none" />
                </div>

                <div className="lg:col-span-5 p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] self-stretch flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl"><ShieldCheck className="text-zinc-900 dark:text-white" /></div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Driver Account</p>
                            <p className="text-sm font-bold text-emerald-600">Level 1 Verified</p>
                        </div>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">Verification ensures you receive priority in ride allocations and build trust with customers.</p>
                </div>
            </div>

            {/* Documents List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Documentation</h3>
                    <button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        <Camera size={14} /> Upload New
                    </button>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border-t border-zinc-100 dark:border-zinc-800">
                    {vehicle?.documents?.length > 0 ? (
                        vehicle.documents.map((doc: any) => (
                            <div key={doc.id} className="py-6 flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                                        <FileText size={20} className="text-zinc-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900 dark:text-white capitalize">{doc.type}</p>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Expires: {new Date(doc.expiryDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${doc.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {doc.isVerified ? <BadgeCheck size={14} /> : <AlertCircle size={14} />}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{doc.isVerified ? 'Verified' : 'Pending'}</span>
                                    </div>
                                    <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 text-red-500 hover:text-red-700 transition-colors"><Trash2 size={20} /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] mt-4">
                            <p className="text-zinc-400 text-sm font-medium">No documents uploaded yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- UPLOAD MODAL --- */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsUploadModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsUploadModalOpen(false)} className="absolute right-8 top-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                            <X size={24} />
                        </button>

                        <h2 className="text-3xl font-black tracking-tighter mb-2">Upload Document</h2>
                        <p className="text-zinc-500 text-sm mb-8">Select document type and set expiry date</p>

                        <form onSubmit={handleDocumentUpload} className="space-y-6">
                            {/* Doc Type */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Document Type</label>
                                <select
                                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold text-sm outline-none appearance-none"
                                    value={uploadForm.type}
                                    onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                                >
                                    <option value="insurance">Insurance</option>
                                    <option value="rc">Registration (RC)</option>
                                    <option value="pollution">Vehicle Pollution</option>
                                    <option value="license">Driving License</option>
                                    <option value="aadhar">Aadhar Card</option>
                                </select>
                            </div>

                            {/* Expiry Date */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Expiry Date</label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    <input
                                        type="date"
                                        className="w-full p-4 pl-12 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold text-sm outline-none"
                                        value={uploadForm.expiryDate}
                                        onChange={(e) => setUploadForm({ ...uploadForm, expiryDate: e.target.value })}
                                    />
                                </div>
                            </div>



                            {/* File Upload Area */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Select File</label>
                                <div className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-4xl p-8 text-center hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                                    />
                                    <UploadCloud className="mx-auto mb-2 text-zinc-300" size={32} />
                                    <p className="text-sm font-bold text-zinc-900 dark:text-white">
                                        {uploadForm.file ? uploadForm.file.name : "Click or drag file here"}
                                    </p>
                                    <p className="text-[10px] text-zinc-400 font-medium mt-1">Supports PNG, JPG or PDF</p>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl hover:opacity-90 transition-all">
                                Upload for Verification
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}

function VehicleSkeleton() {
    return (
        <div className="w-full max-w-5xl mx-auto space-y-12 animate-pulse">
            <div className="h-20 w-full bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 h-80 bg-zinc-100 dark:bg-zinc-900 rounded-[3rem]" />
                <div className="lg:col-span-5 h-80 bg-zinc-100 dark:bg-zinc-900 rounded-[3rem]" />
            </div>
            <div className="space-y-4">
                <div className="h-16 w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
                <div className="h-16 w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
            </div>
        </div>
    );
}