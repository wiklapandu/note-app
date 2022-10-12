import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState();
  const [password, setPassword] = useState("");
  const [cookies, setCookies] = useCookies(["token"]);
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Login | Notes</title>
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
        </nav>
        <div className="p-3 grid xl:grid-cols-3 w-full">
          <div className="xl:block hidden"></div>
          <div>
            <h5 className="text-4xl text-center text-white mb-3">Login</h5>
            {error ? (
              <div className="mb-3">
                <div className="rounded bg-red-400 text-red-800 p-3">
                  {error}
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="mb-3">
              <label htmlFor="email" className="block text-white mb-1">
                Email
              </label>
              <input
                type="text"
                className="p-2 px-3 rounded w-full"
                placeholder="Type email"
                value={email}
                onChange={(e) => {
                  setError("");
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="block text-white mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setError("");
                  setPassword(e.target.value);
                }}
                placeholder="Type Password"
                className="p-2 px-3 rounded w-full"
              />
            </div>
            <div className="mb-3 grid">
              <button
                type="submit"
                onClick={() => {
                  axios
                    .post("http://localhost:8080/api/auth/login", {
                      email,
                      password,
                    })
                    .then(function (res) {
                      if (res.data.status == "fail") {
                        setError(res.data.error);
                      } else if (res.data.status == "success") {
                        setCookies("token", res.data.token, {
                          path: "/",
                        });
                        setEmail("");
                        setPassword("");
                        router.push("/");
                      }
                    });
                }}
                className="btn btn-green"
              >
                Login
              </button>
            </div>
            <div className="flex">
              <span className="text-white text-center mx-auto">
                Belum punya akun?
                <Link href="/auth/register">
                  <a className="ml-2 text-green-400 hover:text-green-300">
                    Registrasi
                  </a>
                </Link>
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
