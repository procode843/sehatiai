import MainFooter from "@/components/MainFooter"
import Link from "next/link"

export default function Sugg(){
    return(
        <>
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white p-8">
            <div className="max-w-4xl w-full rounded-lg shadow-lg bg-teal-900/50 p-8 leading-relaxed">
  
                <h1 className="text-4xl font-bold mb-6 text-green-400 border-b border-green-500 pb-2 text-center">
                    تقرير شامل
                </h1>
            </div>
        </main>

        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <div className="bg-white/30 backdrop-blur-md p-8 rounded-lg text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">صفحة تحت التطوير</h1>
                    <p className="text-white/80">نحن نعمل على تحسين هذه الصفحة قريبًا!</p>
                    <br />
                        <a href="/">
                            <span className="text-blue p-3 rounded hover:scale-105 transition-all cursor-pointer inline-block">
                                الرئيسيه
                             </span>
                        </a>
                </div>
            </div>
        <MainFooter/>
        </>
    )
}