import axios from "axios";
import Head from "next/head";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

export default function Note() {
  const [cookies, setCookies] = useCookies(["token", "message"]);
  const [note, setNote] = useState({});
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/note/" + id, {
        headers: {
          Authorization: cookies.token,
        },
      })
      .then((res) => {
        if (res.data.status == "success") {
          setNote(res.data.note);
        } else {
          router.push("/");
          return;
        }
      });
    console.log("running one times");
  }, [cookies, id, router]);

  return (
    <div>
      <Head>
        <title>{note ? note.title : <></>} | Notes</title>
        <meta name="description" content="Notes App" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
        />
      </Head>

      <main className="bg-gray-800 min-h-screen">
        <nav className="flex p-3 text-white items-center">
          <button
            onClick={() => {
              router.back();
            }}
            className="btn btn-circle btn-gray"
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <h2 className="ml-2 text-2xl">Notes</h2>
          <Link href={"/note/" + note.id + "/edit"}>
            <button className="ml-auto btn btn-circle btn-gray">
              <i className="bi bi-pencil-square"></i>
            </button>
          </Link>
          <button
            className="ml-2 btn btn-circle btn-gray"
            onClick={() => {
              axios
                .delete("http://localhost:8080/api/note/" + id, {
                  headers: {
                    Authorization: cookies.token,
                  },
                })
                .then((res) => {
                  if (res.data.status == "success") {
                    const message = res.data.message;
                    setCookies("message", message, { maxAge: 60 });
                    router.push("/");
                  } else {
                    console.log("error");
                    return;
                  }
                });
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        </nav>
        <div className="p-3 grid gap-3">
          <div>
            <div className="w-full font-bold mb-3 bg-transparent min-h-min text-white outline-none text-2xl">
              {note ? note.title : <></>}
            </div>
            <hr />
          </div>
          <div className="mb-3 text-white text-xl">
            {note ? note.desc : <></>}
          </div>
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
