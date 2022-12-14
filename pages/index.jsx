import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

export default function Home() {
  const API = process.env.API_URL;
  const [cookies, setCookies, removeCookie] = useCookies(["token", "message"]);
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState({});
  const router = useRouter();
  useEffect(() => {
    if(cookies.token){
      axios
        .get(API + "/user", {
          headers: {
            'Authorization': 'Bearer ' + cookies.token,
          },
        })
        .then((res) => {
          console.log(res)
          if (res.data.status == "success") {
            setUser(res.data.user);
          }
        }).catch(err => {
          // const errors = JSON.parse(JSON.stringify(err));
          console.log(err.response.data)
        });

        axios
          .get(API + "/note", {
            headers: {
              Authorization: cookies.token,
            },
          })
          .then((res) => {
            if (res.data.status == "success") {
              setNotes(res.data.notes);
            }
          }).catch(err => {
            // const errors = JSON.parse(JSON.stringify(err));
            console.log(err.response.data)
          });
    }

  }, [cookies, API]);
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
          {cookies.token ? (
            <Link href="/note">
              <button className="ml-auto px-4 py-3 rounded-full transition-all duration-100 ease-in-out bg-gray-700 hover:bg-gray-600 active:bg-gray-500">
                <i className="bi bi-plus-lg"></i>
              </button>
            </Link>
          ) : (
            <></>
          )}
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
              <button className="ml-auto px-4 py-2 rounded-xl transition-all duration-100 ease-in-out bg-gray-700 hover:bg-gray-600 active:bg-gray-500">
                <i className="bi bi-person-fill"></i>
              </button>
            </Link>
          )}
        </nav>
        {user.name ? (
          <div className="p-3">
            <div className="text-white">
              <h3 className="text-3xl">
                Selamat Datang {user.name.split(" ")[0]}
              </h3>
            </div>
          </div>
        ) : (
          <></>
        )}

        {cookies.message ? (
          <div className="p-3">
            <div className="grid grid-cols-3">
              <div className="rounded xl:col-span-1 bg-blue-300 text-blue-800">
                <div className="px-3 py-2 flex items-center">
                  {cookies.message}{" "}
                  <span
                    className="ml-auto text-blue-800 hover:text-blue-500 cursor-pointer"
                    onClick={() => {
                      removeCookie("message")
                    }}
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
            const date = moment(parseInt(note.updated_at));

            return (
              <div
                key={key}
                className={`rounded-xl xl:col-span-1 ${spanded} bg-${note.color} text-gray-800`}
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
