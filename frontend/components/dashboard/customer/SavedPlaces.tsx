"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useRef } from "react";
import { MapPin, Home, Briefcase, Plus, X, Trash2, Map as MapIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getSavedPlaces, addSavedPlace, deleteSavedPlace } from "@/services/user.service";
import { Autocomplete } from "@react-google-maps/api";


const MapPicker = dynamic(() => import("../../MapPicker"), {
    ssr: false,
    loading: () => <div className="h-62.5 bg-zinc-100 flex items-center justify-center"><Loader2 className="animate-spin" /></div>
});

interface Place {
    id: string;
    label: string;
    address: string;
    type: "home" | "work" | "other";
    lat: number;
    lng: number;
}

const mapContainerStyle = { width: "100%", height: "250px" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 };

export default function SavedPlaces() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [markerPos, setMarkerPos] = useState(defaultCenter);
    const [formData, setFormData] = useState({
        label: "",
        address: "",
        type: "home" as "home" | "work" | "other"
    });

    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // REVERSE GEOCODING LOGIC
    const getAddressFromCoords = useCallback((lat: number, lng: number) => {
        if (typeof window === "undefined" || !window.google || !window.google.maps) {
            console.warn("Google Maps not yet loaded");
            return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.[0]) {
                setFormData(prev => ({ ...prev, address: results[0].formatted_address }));
            }
        });
    }, []);

    const handleLocationChange = (lat: number, lng: number) => {
        setMarkerPos({ lat, lng });
        getAddressFromCoords(lat, lng);
    };

    const fetchPlaces = async () => {
        setLoading(true);
        try {
            const data = await getSavedPlaces();
            setPlaces(data);
        } catch (error) {
            toast.error("Failed to load addresses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlaces(); }, []);

    const handleDelete = (id: string) => {
        toast("Delete this place?", {
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await deleteSavedPlace(id);
                        setPlaces((prev) => prev.filter(p => p.id !== id));
                        toast.success("Place removed");
                    } catch (error) {
                        toast.error("Failed to delete");
                    }
                },
            },
        });
    };

    const handleAddPlace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.label || !formData.address) return toast.info("Fill all fields");

        setIsSubmitting(true);
        try {
            const result = await addSavedPlace({ ...formData, ...markerPos });
            if (result.success) {
                toast.success("Place saved");
                setIsModalOpen(false);
                setFormData({ label: "", address: "", type: "home" });
                fetchPlaces();
            }
        } catch (error) {
            toast.error("Error saving place");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onPlaceChanged = () => {
        if (!window.google) return;
        const place = autoCompleteRef.current?.getPlace();

        if (!place || !place.geometry) return;

        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();

        if (!lat || !lng) return;

        setMarkerPos({ lat, lng });

        setFormData(prev => ({
            ...prev,
            address: place.formatted_address || ""
        }));
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Saved Places</h1>
                    <p className="text-zinc-500 text-sm">Manage your frequent locations</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors"
                >
                    <Plus size={18} /> Add New
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => <div key={i} className="h-32 bg-zinc-100 rounded-3xl animate-pulse" />)}
                </div>
            ) : places.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {places.map((place) => (
                        <div key={place.id} className="group p-6 bg-white border border-zinc-100 rounded-3xl flex items-start justify-between hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                    {place.type === 'home' ? <Home size={18} /> : place.type === 'work' ? <Briefcase size={18} /> : <MapPin size={18} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-900">{place.label}</h3>
                                    <p className="text-sm text-zinc-500 line-clamp-2">{place.address}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(place.id)} className="text-zinc-300 hover:text-red-500 transition-colors p-1">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                    <MapIcon className="text-zinc-300 mx-auto mb-4" size={40} />
                    <p className="text-zinc-500 font-medium">No saved places yet</p>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="relative">
                            <MapPicker
                                center={markerPos}
                                onLocationSelect={handleLocationChange}
                                mapContainerStyle={mapContainerStyle}
                            />
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg z-10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddPlace} className="p-8">
                            <div className="space-y-4">
                                <div className="flex gap-2 p-1 bg-zinc-100 rounded-2xl">
                                    {(['home', 'work', 'other'] as const).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: t })}
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${formData.type === t ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    placeholder="Label (e.g. Home)"
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-zinc-300 transition-colors"
                                    value={formData.label}
                                    onChange={e => setFormData({ ...formData, label: e.target.value })}
                                    required
                                />
                                {typeof window !== "undefined" && window.google && (
                                    <Autocomplete
                                        onLoad={(ref) => (autoCompleteRef.current = ref)}
                                        onPlaceChanged={onPlaceChanged}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search location..."
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-zinc-300"
                                        />
                                    </Autocomplete>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.address}
                                className="w-full mt-6 bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Place"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}