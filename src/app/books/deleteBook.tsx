'use client'
import { useState } from "react"
import { useRouter } from "next/navigation";

type Book = {
    id:number;
    title:string;
    cover:string;
    sinopsis:string;
}

export default function DeleteBook(book: Book) {

const [modal, setModal] = useState(false);
const [isMutating, setIsMutating] = useState(false);
const router = useRouter();

async function handleDelete(bookId : number) {
    setIsMutating(true)
    await fetch(`http://localhost:3000/api/books/delete/${bookId}`,{
        method : 'DELETE',
        headers: {
            'Content-Type':'application/json'
        },
    });
    setIsMutating(false)

    router.refresh();
    setModal(false);
}
function handleChange(){
    setModal(!modal);
}
  return (
    <div>
        <button className="btn bg-red-500" onClick={handleChange}>delete</button>
        <input type="checkbox" 
       checked={modal} onChange={handleChange} name="" id="" className="modal-toggle" />
        <div className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">
                    Are sure to delete {book.title}?
                </h3>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={handleChange}>close</button>
                        {!isMutating ? (
                        <button type="button" onClick={() => handleDelete(book.id)} className="btn bg-cyan-500">delete</button>
                        ):(
                            <button type="button" className="btn bg-red-500">deleting ...</button>
                        )}
                    </div>
            </div>
        </div>
    </div>
  )
}
