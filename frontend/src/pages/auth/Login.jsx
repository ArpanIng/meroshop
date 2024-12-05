import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import { AuthContext } from "../../contexts/AuthContext";
import AuthLayout from "../../layouts/AuthLayout";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in to your account">
      <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
        <div>
          <Label htmlFor="email" value="Email" className="block mb-2" />
          <TextInput
            type="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password" value="Password" className="block mb-2" />
          <TextInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="remember"
                aria-describedby="remember"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                required=""
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="remember"
                className="text-gray-500 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Forgot password?
          </a>
        </div>
        <Button color="blue" type="submit" className="w-full">
          Sign in
        </Button>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Don’t have an account yet?{" "}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
    // <section className="bg-gray-50 dark:bg-gray-900">
    //   <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    //     <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
    //       <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
    //         <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
    //           Sign in to your account
    //         </h1>
    //         <form className="space-y-4 md:space-y-6" action="#">
    //           <div>
    //             <Label htmlFor="email" value="Email" className="block mb-2" />
    //             <TextInput
    //               type="email"
    //               id="email"
    //               placeholder="name@example.com"
    //               required
    //             />
    //           </div>
    //           <div>
    //             <Label
    //               htmlFor="password"
    //               value="Password"
    //               className="block mb-2"
    //             />
    //             <TextInput type="password" id="password" required />
    //           </div>
    //           <div className="flex items-center justify-between">
    //             <div className="flex items-start">
    //               <div className="flex items-center h-5">
    //                 <input
    //                   id="remember"
    //                   aria-describedby="remember"
    //                   type="checkbox"
    //                   className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
    //                   required=""
    //                 />
    //               </div>
    //               <div className="ml-3 text-sm">
    //                 <label
    //                   for="remember"
    //                   className="text-gray-500 dark:text-gray-300"
    //                 >
    //                   Remember me
    //                 </label>
    //               </div>
    //             </div>
    //             <a
    //               href="#"
    //               className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
    //             >
    //               Forgot password?
    //             </a>
    //           </div>
    //           <Button color="blue" type="submit" className="w-full">
    //             Sign in
    //           </Button>
    //           <p className="text-sm font-light text-gray-500 dark:text-gray-400">
    //             Don’t have an account yet?{" "}
    //             <Link
    //               to="/register"
    //               className="font-medium text-primary-600 hover:underline dark:text-primary-500"
    //             >
    //               Sign up
    //             </Link>
    //           </p>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
}

export default Login;
