import Link from "next/link";
import { useRouter } from "next/router";
export default function Layout({ children }){
    const router = useRouter();
    
    return (
        <div className="bg-white m-5">
            {/* TABS */}
            
            <nav className="mb-5">
                <div className=" flex flex-col sm:flex-row sm:space-x-4">
                    <Link href="/form2307-page" className={`nav-link ${ router.pathname === "/tempForm2307"? "nav-link-active": ""}`}>Form 2307</Link>

                    <Link href="/service-invoice" className={`nav-link ${ router.pathname === "/service-invoice"? "nav-link-active": ""}`}>Service Invoice</Link>

                    <Link href="/expense-receipt" className={`nav-link ${ router.pathname === "/expense-receipt" ? "nav-link-active": ""}`}>Expense Receipt</Link>
                </div>
            </nav>

            {/*PAGE CONTENT*/}
            <main className="main-style">
                {children}
            </main>
        </div>
    )
}

