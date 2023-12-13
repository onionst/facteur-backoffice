import Logo from "@/bases/logo";
import Button from "@/bases/Button/Button";
import { useState } from "react";
import { sendRestorePasswordEmail } from "@/services/auth.service";
import { notification } from "antd";
import { useRouter } from "next/router";
import { Input } from "@/bases/input";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function RestorePassword(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleSignInWithCredentials = async (e: any) => {
    try {
      e?.preventDefault();
      setLoading(true);
      await sendRestorePasswordEmail(email);
      notification.success({ message: "Please check your email" });
      setEmail("");
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      if (typeof err?.response?.data?.message === "object") {
        notification.error({
          message: "Error",
          description: err?.response?.data?.message[0],
        });
      } else {
        notification.error({
          message: "Error",
          description: "Please try again later",
        });
      }
      setLoading(false);
    }
  };

  return (
    <div className="ds-sign-in">
      <div className="ds-sign-in__left-container">
        <section className="ds-sign-in__left">
          <div className="ds-sign-in__left-t">
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Logo />
            </div>
            <h1>Restore account</h1>
            <p>We will send you reset instructions </p>
          </div>

          <form
            style={{ marginTop: 32 }}
            onSubmit={handleSignInWithCredentials}
          >
            <Input
              placeholder="username@organization.com"
              type="email"
              label="Email"
              value={email}
              onChange={(email) => setEmail((prev) => email.target.value)}
            />
            <Button
              disabled={email == ""}
              loading={loading}
              theme="CTA"
              style={{ marginTop: 32 }}
            >
              Send email
            </Button>
            <Button
              onClick={() => router.push("/auth/sign-in")}
              type="button"
              theme="SECONDARY"
              style={{ marginTop: 8 }}
            >
              <ArrowLeftOutlined /> Go back
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
