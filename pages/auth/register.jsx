import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Register() {
  const API = process.env.API_URL;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [cookies, setCookies] = useCookies(["token"]);
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Registerasi | Notes</title>
        <meta name="description" content="Notes App" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
        />
      </Head>

      <main className="bg-gray-800 h-screen">
        <nav className="flex p-3 text-white items-center">
          <Link href="/">
            <h2 className="text-2xl cursor-pointer">Notes</h2>
          </Link>
        </nav>
        <div className="p-3 grid xl:grid-cols-3 w-full">
          <div className="xl:block hidden"></div>
          <div>
            <h5 className="text-4xl text-center text-white mb-3">Registrasi</h5>
            {errors && errors.main ? (
              <div className="mb-3">
                <div className="rounded bg-red-400 text-red-800 p-3">
                  {errors.main.msg}
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="mb-3">
              <label htmlFor="name" className="block text-white mb-1">
                Name
              </label>
              <input
                type="text"
                className={
                  "form-control " + (errors && errors.name ? "is-invalid" : "")
                }
                placeholder="Type name"
                value={name}
                onChange={(e) => {
                  setErrors({});
                  setName(e.target.value);
                }}
              />
              {errors && errors.name ? (
                <span className="invalid-feedback">{errors.name.msg}</span>
              ) : (
                <></>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="block text-white mb-1">
                Email
              </label>
              <input
                type="text"
                className={
                  "form-control " + (errors && errors.email ? "is-invalid" : "")
                }
                placeholder="Type email"
                value={email}
                onChange={(e) => {
                  setErrors({});
                  setEmail(e.target.value);
                }}
              />
              {errors && errors.email ? (
                <span className="invalid-feedback">{errors.email.msg}</span>
              ) : (
                <></>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="block text-white mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setErrors({});
                  setPassword(e.target.value);
                }}
                placeholder="Type Password"
                className={
                  "form-control " +
                  (errors && errors.password ? "is-invalid" : "")
                }
              />
              {errors && errors.password ? (
                <span className="invalid-feedback">{errors.password.msg}</span>
              ) : (
                <></>
              )}
            </div>
            <div className="mb-3 grid">
              <button
                type="submit"
                onClick={() => {
                  axios
                    .post(API + "/auth/register", {
                      name,
                      email,
                      password,
                    })
                    .then(function (res) {
                      if (res.data.status == "fail") {
                        setErrors(res.data.errors);
                      } else if (res.data.status == "success") {
                        setCookies("token", res.data.token, {
                          path: "/",
                        });
                        setEmail("");
                        setName("");
                        setPassword("");
                        router.push("/");
                      }
                    });
                }}
                className="btn btn-green"
              >
                Daftar
              </button>
            </div>
            <div className="flex">
              <span className="text-white text-center mx-auto">
                Sudah punya akun?
                <Link href="/auth/login">
                  <a className="ml-2 text-green-400 hover:text-green-300">
                    Login
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
