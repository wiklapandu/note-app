import axios from "axios";
import Head from "next/head";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import NotFound from "../../../components/notfound";

export default function Note() {
  const API = process.env.API_URL;
  const [cookies, setCookies] = useCookies(["token"]);
  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();
  const [color, setColor] = useState();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    axios
      .get(API + "/note/" + id, {
        headers: {
          Authorization: cookies.token,
        },
      })
      .then((res) => {
        if (res.data.status == "success") {
          const note = res.data.note;
          setTitle(note.title);
          setDesc(note.desc);
          setColor(note.color);
        } else {
          router.push("/");
          return;
        }
      });
  }, [cookies, id]);

  if (!cookies.token) {
    return <NotFound />;
  }

  return (
    <div>
      <Head>
        <title>Edit Note | Notes</title>
        <meta name="description" content="Notes App" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
        />
      </Head>

      <main className={`bg-${color} min-h-screen`}>
        <nav className="flex p-3 text-white items-center">
          <button
            onClick={() => {
              router.back();
            }}
            className="px-4 py-3 rounded-full transition-all duration-100 ease-in-out bg-gray-700 hover:bg-gray-600 active:bg-gray-500"
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <h2 className="ml-2 text-2xl">Notes</h2>
          <button
            onClick={() => {
              axios
                .put(
                  API + "/note/" + id,
                  {
                    title,
                    color,
                    desc,
                  },
                  {
                    headers: {
                      Authorization: cookies.token,
                    },
                  }
                )
                .then((res) => {
                  if (res.data.status == "success") {
                    setTitle("");
                    setDesc("");
                    router.push("/");
                  }
                });
            }}
            className="ml-auto px-4 py-3 rounded-full transition-all duration-100 ease-in-out bg-gray-700 hover:bg-gray-600 active:bg-gray-500"
          >
            <i className="bi bi-check2-circle"></i>
          </button>
        </nav>
        <div className="p-3 grid gap-3">
          <div>
            <input
              type="text"
              name="title"
              id="title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full font-bold mb-3 bg-transparent min-h-min text-white outline-none text-2xl"
              placeholder="Type Title"
              value={title}
            />
            <hr />
          </div>
          <div className="flex">
            <div
              className={
                "bullet default" + (color === "default" ? " active" : "")
              }
              onClick={()=>{
                setColor("default")
              }}
            ></div>
            <div className={"bullet red ml-1" + (color === "red" ? " active" : "")} 
              onClick={()=>{
                setColor("red")
              }}></div>
            <div className={"bullet green ml-1" + (color === "green" ? " active" : "")} 
              onClick={()=>{
                setColor("green")
              }}></div>
            <div className={"bullet blue ml-1" + (color === "blue" ? " active" : "")} 
              onClick={()=>{
                setColor("blue")
              }}></div>
          </div>
          <div>
            <textarea
              name="desc"
              id="desc"
              className="w-full mb-3 bg-transparent min-h-min text-white outline-none text-lg"
              placeholder="Type Description"
              cols="30"
              rows="15"
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            ></textarea>
          </div>
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
