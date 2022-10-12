import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

export default function Home() {
  const [cookies, setCookies, removeCookie] = useCookies(["token", "message"]);
  const [notes, setNotes] = useState([]);
  const router = useRouter();
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
  }, [cookies]);
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
          <Link href="/note">
            <button className="ml-auto px-4 py-3 rounded-full transition-all duration-100 ease-in-out bg-gray-700 hover:bg-gray-600 active:bg-gray-500">
              <i className="bi bi-plus-lg"></i>
            </button>
          </Link>
          <button className="ml-2 px-4 py-2 rounded-xl transition-all duration-100 ease-in-out bg-gray-700 hover:bg-gray-600 active:bg-gray-500">
            <i className="bi bi-search"></i>
          </button>
          {cookies.token ? (
            <button
              onClick={() => {
                removeCookie("token");
                router.push("/auth/login");
              }}
              className="ml-2 px-4 py-2 rounded-xl transition-all duration-100 ease-in-out bg-gray-700 hover:bg-gray-600 active:bg-gray-500"
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          ) : (
            <Link href="/auth/login">
              <button className="ml-2 px-4 py-2 rounded-xl transition-all duration-100 ease-in-out bg-gray-700 hover:bg-gray-600 active:bg-gray-500">
                <i className="bi bi-person-fill"></i>
              </button>
            </Link>
          )}
        </nav>
        {cookies.message ? (
          <div className="p-3">
            <div className="grid grid-cols-3">
              <div className="rounded xl:col-span-1 bg-blue-300 text-blue-800">
                <div className="px-3 py-2 flex items-center">
                  {cookies.message}{" "}
                  <span
                    className="ml-auto text-blue-800 hover:text-blue-500 cursor-pointer"
                    onClick={() => {}}
                  >
                    <i className="bi bi-x text-2xl"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="p-3 grid xl:grid-cols-3 grid-cols-2 gap-3">
          {!cookies.token ? (
            <div className="xl:col-span-3 col-span-2 text-center text-white">
              <Link href="/auth/login">
                <h3 className="cursor-pointer text-3xl">
                  Not Found <br />
                  Login first, Click this to Login
                </h3>
              </Link>
            </div>
          ) : (
            <></>
          )}
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
                className={`rounded-xl xl:col-span-1 ${spanded} bg-${color} text-gray-800`}
              >
                <div className="card-body px-3 py-4">
                  <Link href={"/note/" + note.id}>
                    <h3 className="font-medium text-xl mb-1 cursor-pointer">
                      {note.title}
                    </h3>
                  </Link>
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
