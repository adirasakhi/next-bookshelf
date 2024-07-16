'use client'
import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Book = {
  id: number;
  title: string;
  cover: string;
  sinopsis: string;
};

export default function UpdateBook(book: Book) {
  const [title, setTitle] = useState(book.title);
  const [cover, setCover] = useState<File | null>(null);
  const [sinopsis, setSinopsis] = useState(book.sinopsis);
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const router = useRouter();

  async function handleUpdate(e: SyntheticEvent) {
    e.preventDefault();
    setIsMutating(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('sinopsis', sinopsis);
    if (cover) {
      formData.append('cover', cover);
    }

    await fetch(`/api/books/update/${book.id}`, {
      method: 'PATCH',
      body: formData,
    });

    setIsMutating(false);
    router.refresh();
    setModal(false);
  }

  function handleChange() {
    setModal(!modal);
  }

  return (
    <div>
      <button className="btn" onClick={handleChange}>Edit</button>
      <input type="checkbox" 
        checked={modal} onChange={handleChange} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit {book.title}</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-control">
              <label className="label font-bold">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input w-full input-border"
                placeholder="Title of the book"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Cover</label>
              <input
                type="file"
                onChange={(e) => setCover(e.target.files?.[0] || null)}
                className="input w-full input-border"
                accept="image/*"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Sinopsis</label>
              <input
                type="text"
                value={sinopsis}
                onChange={(e) => setSinopsis(e.target.value)}
                className="input w-full input-border"
                placeholder="Sinopsis"
              />
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleChange}>Close</button>
              {!isMutating ? (
                <button type="submit" className="btn bg-cyan-500">Update</button>
              ) : (
                <button type="button" className="btn bg-red-500">Updating ...</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
