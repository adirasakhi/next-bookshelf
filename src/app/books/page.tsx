import Link from "next/link";
import AddBook from "./addBook";
import DeleteBook from "./deleteBook";
import UpdateBook from "./updateBook";

type Book = {
    id:number;
    title:string;
    cover:string;
    sinopsis:string;
}

async function getBooks() {
    const res = await fetch('http://localhost:3000/api/books', {cache : "no-cache"});
    return res.json();
}

export default async function BookList(){
    const books : Book[] = await getBooks();
    return (
        <div className='container'>
            <div className='w-full px-4'>
                <h1 className='text-3xl font-bold text-center my-5'>Books Page</h1>
                <nav className='text-center mb-3'>
                    <Link href="/" className='p-1 underline hover:text-cyan-400 transition duration-100'>Home</Link>
                    <Link href="/books" className='p-1 underline hover:text-cyan-400 transition duration-100'>Books</Link>
                </nav>
            <div className='max-w-5xl mx-auto text-center'>
                <div className="py-2">
                <AddBook />
                </div>
                <table className='min-w-full bg-white border border-gray-200'>
                    <thead>
                        <tr>
                            <th className='border border-black'>#</th>
                            <th className='border border-black'>Title</th>
                            <th className='border border-black'>Cover</th>
                            <th className='border border-black'>Sinopsis</th>
                            <th className='border border-black'>action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {books.map((book, index) => (
                        <tr key={book.id}>
                            <td className='border border-black text-center p-5'>{index + 1}</td>
                            <td className='border border-black text-center p-5'>{book.title}</td>
                            <td className='border border-black text-center p-5'><img src={book.cover} alt={book.title} width="100px"/></td>
                            <td className='border border-black text-center p-5'>{book.sinopsis}</td>
                            <td className='border border-black text-center p-5'>
                                <UpdateBook {...book}/>
                                <DeleteBook {...book}/>
                                </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    )
}

