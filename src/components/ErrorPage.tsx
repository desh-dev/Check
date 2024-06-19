import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div
      className="w-full h-full p-0 m-0 flex flex-col justify-center align-center board"
      style={{ height: "100vh", width: "100vw" }}
    >
      <section>
        <h1 className="text-3xl font-bold text-center mb-4 text-white">
          404 not found
        </h1>
      </section>
    </div>
  );
};

export default ErrorPage;
