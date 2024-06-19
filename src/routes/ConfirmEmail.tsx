import { MailCheck } from "lucide-react";

const ConfirmEmail = () => {
  return (
    <div
      className="w-full h-full flex flex-col justify-center align-center board"
      style={{ height: "100vh", width: "100vw" }}
    >
      <div className="w-full flex justify-center mb-4">
        <MailCheck size={100} color="#5c846e" />
      </div>
      <section>
        <h1 className="text-3xl font-bold text-center mb-4 text-white">
          Check Your Email
        </h1>
        <p className="p-3 text-center text-white">
          A magic link has been sent to your email. Click the link to finish
          signing in.
        </p>
      </section>
    </div>
  );
};
export default ConfirmEmail;
