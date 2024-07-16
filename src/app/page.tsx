import Link from "next/link";

export default function Home() {
	return (
		<div className='container'>
			<div className='w-full px-4'>
				<h1 className='text-3xl font-bold text-center my-5'>Next BookShelf App</h1>
				<nav className='text-center mb-3'>
					<Link href="/" className='p-1 underline hover:text-cyan-400 transition duration-100'>Home</Link>
					<Link href="/books" className='p-1 underline hover:text-cyan-400 transition duration-100'>Books</Link>
				</nav>
			<div className='max-w-5xl mx-auto text-center'>
				<h1 className="text-xl">HOME PAGE</h1>
			</div>
		</div>
	</div>	
	);
}
