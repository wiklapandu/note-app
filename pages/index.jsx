import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import moment from "moment";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

export default function Home() {
  const [cookies, setCookies] = useCookies(["token"]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/note", {
        headers: {
          Authorization: cookies.token,
        },
      })
      .then((res) => {
        if (res.data.status == "success") {
          setNotes(res.data.notes);
        }
      });
  }, [cookies, notes]);
  return (
    <div>
      <Head>
        <title>Notes</title>
        <meta name="description" content="Notes App" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
        />
      </Head>

      <main className="bg-gray-800 h-screen">
        <nav className="flex p-3 text-white items-center">
          <h2 className="text-2xl">Notes</h2>
          <button className="ml-auto px-4 py-3 rounded-full transition-all duration-100 ease-in-out bg-gray-700 hover:bg-gray-600 active:bg-gray-500">
            <i className="bi bi-plus-lg"></i>
          </button>
          <button className="ml-2 px-4 py-2 rounded-xl transition-all duration-100 ease-in-out bg-gray-700 hover:bg-gray-600 active:bg-gray-500">
            <i className="bi bi-search"></i>
          </button>
          <button className="ml-2 px-4 py-2 rounded-xl transition-all duration-100 ease-in-out bg-gray-700 hover:bg-gray-600 active:bg-gray-500">
            <i className="bi bi-person-fill"></i>
          </button>
        </nav>
        <div className="p-3 grid xl:grid-cols-3 grid-cols-2 gap-3">
          {notes.map((note, key) => {
            let spanded = (key + 1) % 3 == 0 ? "col-span-2" : "";
            let color = "red";
            if ((key + 1) % 3 == 0) {
              color = "blue";
            } else if ((key + 1) % 2 == 0) {
              color = "green";
            }
            const date = moment(parseInt(note.updated_at));

            return (
              <div
                key={key}
                className={`rounded-xl xl:col-span-1 ${spanded} bg-${color}-300 text-gray-800`}
              >
                <div className="card-body px-3 py-4">
                  <h3 className="font-medium text-xl mb-1">{note.title}</h3>
                  <div className="flex">
                    <span className="text-gray-600 text-lg font-medium">
                      {date.format("MMM D, YYYY")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
