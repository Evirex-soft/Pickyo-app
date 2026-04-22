// "use client";

// import { useEffect, useState } from "react";
// import {
//     Wallet as WalletIcon,
//     Plus,
//     CreditCard,
//     ArrowUpRight,
//     ArrowDownLeft,
//     ChevronRight,
//     Loader2,
//     IndianRupee,
//     X,
// } from "lucide-react";
// import { getWalletData, createRazorpayOrder, verifyPayment } from "@/services/wallet.service";
// import { toast } from "sonner";

// // Extend the Window interface to include Razorpay
// declare global {
//     interface Window {
//         Razorpay: any;
//     }
// }

// interface Transaction {
//     id: string;
//     type: "credit" | "debit";
//     amount: number;
//     description: string;
//     createdAt: string;
//     status: "success" | "pending" | "failed";
// }

// export default function Wallet() {
//     const [transactions, setTransactions] = useState<Transaction[]>([]);
//     const [balance, setBalance] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [amount, setAmount] = useState<string>("");
//     const [isProcessing, setIsProcessing] = useState(false)

//     const fetchWallet = async (page = currentPage) => {
//         setLoading(true);
//         try {
//             const data = await getWalletData(page);
//             setTransactions(data.transactions);
//             setBalance(data.balance);
//             setTotalPages(data.totalPages);
//         } catch (error) {
//             console.error("Error fetching wallet:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchWallet();
//     }, [currentPage]);

//     const formatCurrency = (amount: number) => {
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//         }).format(amount);
//     };

//     // Load Razorpay script
//     const loadRazorpayScript = () => {
//         return new Promise((resolve) => {
//             const script = document.createElement("script");
//             script.src = "https://checkout.razorpay.com/v1/checkout.js";
//             script.onload = () => resolve(true);
//             script.onerror = () => resolve(false);
//             document.body.appendChild(script);
//         });
//     };

//     const handleAddMoney = async () => {
//         const numAmount = Number(amount);
//         if (!numAmount || numAmount < 10) {
//             toast.info("Please enter a valid amount (minimum ₹10)");
//             return;
//         }

//         setIsProcessing(true);

//         try {
//             const isLoaded = await loadRazorpayScript();
//             if (!isLoaded) {
//                 toast.error("Failed to load payment gateway.");
//                 setIsProcessing(false);
//                 return;
//             }

//             const order = await createRazorpayOrder(numAmount);

//             const options = {
//                 key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//                 amount: order.amount,
//                 currency: order.currency,
//                 name: "Pickyo App",
//                 description: "Wallet Top-up",
//                 order_id: order.id,
//                 handler: async function (response: any) {
//                     const result = await verifyPayment({
//                         razorpay_order_id: response.razorpay_order_id,
//                         razorpay_payment_id: response.razorpay_payment_id,
//                         razorpay_signature: response.razorpay_signature,
//                         amount: numAmount
//                     });

//                     if (result.success) {
//                         toast.success("Wallet updated successfully!");
//                         setIsModalOpen(false);
//                         setAmount("");
//                         fetchWallet(1);
//                     }
//                 },
//                 prefill: {
//                     name: "Customer Name",
//                     email: "customer@example.com",
//                 },
//                 theme: { color: "#18181b" },
//                 modal: {
//                     ondismiss: function () {
//                         setIsProcessing(false);
//                     }
//                 }
//             };
//             const rzp = new window.Razorpay(options);
//             rzp.open();

//         } catch (error) {
//             toast.error("Error processing payment.");
//             console.error("Payment error:", error);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto px-4 py-8">
//             <div className="mb-8">
//                 <h1 className="text-2xl font-bold text-zinc-900">Wallet</h1>
//                 <p className="text-zinc-500 text-sm">Manage your funds and payment methods</p>
//             </div>

//             {/* Top Section: Balance and Add Money */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//                 <div className="md:col-span-2 bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
//                     <div className="relative z-10">
//                         <p className="text-zinc-400 text-sm font-medium mb-1">Total Balance</p>
//                         <h2 className="text-4xl font-bold mb-8">{formatCurrency(balance)}</h2>
//                         <button
//                             onClick={handleAddMoney}
//                             disabled={isProcessing}
//                             className="flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-100 transition-colors disabled:opacity-50"
//                         >
//                             {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
//                             {isProcessing ? "Processing..." : "Add Money"}
//                         </button>
//                     </div>
//                     {/* Decorative Circle */}
//                     <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-zinc-800 rounded-full opacity-50" />
//                 </div>

//                 <div className="bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col justify-between">
//                     <div>
//                         <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-4">Default Method</p>
//                         <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
//                                 <CreditCard size={20} className="text-zinc-600" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-bold text-zinc-900">•••• 4242</p>
//                                 <p className="text-[10px] text-zinc-500 font-medium">Expires 12/26</p>
//                             </div>
//                         </div>
//                     </div>
//                     <button className="text-sm font-bold text-zinc-900 flex items-center justify-between w-full mt-4 hover:underline">
//                         Manage Methods
//                         <ChevronRight size={16} />
//                     </button>
//                 </div>
//             </div>

//             {/* Transaction History */}
//             <div className="mb-6 flex items-center justify-between">
//                 <h3 className="text-lg font-bold text-zinc-900">Recent Transactions</h3>
//             </div>

//             {loading ? (
//                 <div className="space-y-4">
//                     {[1, 2, 3, 4].map((i) => (
//                         <div key={i} className="h-20 bg-zinc-100 rounded-2xl animate-pulse" />
//                     ))}
//                 </div>
//             ) : transactions.length > 0 ? (
//                 <div className="space-y-3">
//                     {transactions.map((tx) => (
//                         <div key={tx.id} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-200 transition-all">
//                             <div className="flex items-center gap-4">
//                                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-zinc-50 text-zinc-600'
//                                     }`}>
//                                     {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-bold text-zinc-900">{tx.description}</p>
//                                     <p className="text-xs text-zinc-500">
//                                         {new Date(tx.createdAt).toLocaleDateString()} • {tx.status}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-zinc-900'}`}>
//                                 {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
//                             </div>
//                         </div>
//                     ))}

//                     {/* Pagination */}
//                     <div className="flex items-center justify-between pt-6">
//                         <button
//                             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                             disabled={currentPage === 1}
//                             className="px-4 py-2 text-sm font-bold text-zinc-600 disabled:opacity-30"
//                         >
//                             Previous
//                         </button>
//                         <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
//                             Page {currentPage} of {totalPages}
//                         </span>
//                         <button
//                             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                             disabled={currentPage === totalPages}
//                             className="px-4 py-2 text-sm font-bold text-zinc-600 disabled:opacity-30"
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="text-center py-16 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
//                     <div className="bg-zinc-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <WalletIcon className="text-zinc-500" size={20} />
//                     </div>
//                     <p className="text-zinc-500 font-medium">No transactions found</p>
//                 </div>
//             )}

//             {isModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//                     <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
//                         <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
//                             <h3 className="text-xl font-bold text-zinc-900">Add Money</h3>
//                             <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900">
//                                 <X size={24} />
//                             </button>
//                         </div>

//                         <div className="p-8">
//                             <p className="text-zinc-500 text-sm mb-4">Enter amount to add to your wallet</p>

//                             <div className="relative mb-6">
//                                 <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
//                                 <input
//                                     type="number"
//                                     value={amount}
//                                     onChange={(e) => setAmount(e.target.value)}
//                                     placeholder="0.00"
//                                     className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl text-2xl font-bold focus:border-zinc-900 focus:outline-none transition-all"
//                                     autoFocus
//                                 />
//                             </div>

//                             <div className="grid grid-cols-3 gap-3 mb-8">
//                                 {[100, 500, 1000].map((val) => (
//                                     <button
//                                         key={val}
//                                         onClick={() => setAmount(val.toString())}
//                                         className="py-2 bg-zinc-100 hover:bg-zinc-900 hover:text-white rounded-xl text-sm font-bold transition-all"
//                                     >
//                                         +₹{val}
//                                     </button>
//                                 ))}
//                             </div>

//                             <button
//                                 onClick={handleAddMoney}
//                                 disabled={isProcessing || !amount}
//                                 className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {isProcessing ? (
//                                     <>
//                                         <Loader2 className="animate-spin" size={20} />
//                                         Processing...
//                                     </>
//                                 ) : (
//                                     `Proceed to Pay ${amount ? '₹' + amount : ''}`
//                                 )}
//                             </button>

//                             <p className="text-center text-[10px] text-zinc-400 mt-4 uppercase tracking-widest font-bold">
//                                 Secured by Razorpay
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             )}


//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import {
    Wallet as WalletIcon,
    Plus,
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    ChevronRight,
    Loader2,
    X,           // Added
    IndianRupee, // Added
} from "lucide-react";
import { getWalletData, createRazorpayOrder, verifyPayment } from "@/services/wallet.service";
import { toast } from "sonner";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Transaction {
    id: string;
    type: "credit" | "debit";
    amount: number;
    description: string;
    createdAt: string;
    status: "success" | "pending" | "failed";
}

export default function Wallet() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Fetch data logic
    const fetchWallet = async (page = currentPage) => {
        setLoading(true);
        try {
            const data = await getWalletData(page);
            setTransactions(data.transactions);
            setBalance(data.balance);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching wallet:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, [currentPage]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleAddMoney = async () => {
        const numAmount = Number(amount);
        if (!numAmount || numAmount < 10) {
            toast.info("Please enter a valid amount (minimum ₹10)");
            return;
        }

        setIsProcessing(true);

        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Failed to load payment gateway.");
                setIsProcessing(false);
                return;
            }

            const order = await createRazorpayOrder(numAmount);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Pickyo App",
                description: "Wallet Top-up",
                order_id: order.id,

                handler: async function (response: any) {
                    setIsModalOpen(false);

                    const result = await verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        amount: numAmount
                    });

                    if (result.success) {
                        toast.success("Wallet updated successfully!");
                        setIsModalOpen(false);
                        setAmount("");
                        fetchWallet(1);
                    }
                },
                prefill: {
                    name: "Customer Name",
                    email: "customer@example.com",
                },
                theme: { color: "#18181b" },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            toast.error("Error processing payment.");
            console.error("Payment error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900">Wallet</h1>
                <p className="text-zinc-500 text-sm">Manage your funds and payment methods</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="md:col-span-2 bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <p className="text-zinc-400 text-sm font-medium mb-1">Total Balance</p>
                        <h2 className="text-4xl font-bold mb-8">{formatCurrency(balance)}</h2>
                        <button
                            onClick={() => setIsModalOpen(true)} // FIXED: Open modal instead of calling handleAddMoney
                            className="flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-100 transition-colors"
                        >
                            <Plus size={18} />
                            Add Money
                        </button>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-zinc-800 rounded-full opacity-50" />
                </div>

                {/* ... Default Method Section ... */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-4">Default Method</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                                <CreditCard size={20} className="text-zinc-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-900">•••• 4242</p>
                                <p className="text-[10px] text-zinc-500 font-medium">Expires 12/26</p>
                            </div>
                        </div>
                    </div>
                    <button className="text-sm font-bold text-zinc-900 flex items-center justify-between w-full mt-4 hover:underline">
                        Manage Methods
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Transaction History Section remains the same */}
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-900">Recent Transactions</h3>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 bg-zinc-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : transactions.length > 0 ? (
                <div className="space-y-3">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-200 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-zinc-50 text-zinc-600'
                                    }`}>
                                    {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-900">{tx.description}</p>
                                    <p className="text-xs text-zinc-500">
                                        {new Date(tx.createdAt).toLocaleDateString()} • {tx.status}
                                    </p>
                                </div>
                            </div>
                            <div className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-zinc-900'}`}>
                                {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                            </div>
                        </div>
                    ))}
                    {/* Pagination  */}
                    <div className="flex items-center justify-between pt-6">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-bold text-zinc-600 disabled:opacity-30"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-bold text-zinc-600 disabled:opacity-30"
                        >
                            Next
                        </button>
                    </div>

                </div>
            ) : (
                <div className="text-center py-16 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                    <div className="bg-zinc-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <WalletIcon className="text-zinc-500" size={20} />
                    </div>
                    <p className="text-zinc-500 font-medium">No transactions found</p>
                </div>
            )}

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-500 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-zinc-900">Add Money</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8">
                            <p className="text-zinc-500 text-sm mb-4">Enter amount to add to your wallet</p>

                            <div className="relative mb-6">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl text-2xl font-bold focus:border-zinc-900 focus:outline-none transition-all"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {[100, 500, 1000].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(val.toString())}
                                        className="py-2 bg-zinc-100 hover:bg-zinc-900 hover:text-white rounded-xl text-sm font-bold transition-all"
                                    >
                                        +₹{val}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleAddMoney} // Triggers the Razorpay flow
                                disabled={isProcessing || !amount}
                                className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing...
                                    </>
                                ) : (
                                    `Proceed to Pay ${amount ? '₹' + amount : ''}`
                                )}
                            </button>

                            <p className="text-center text-[10px] text-zinc-400 mt-4 uppercase tracking-widest font-bold">
                                Secured by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}