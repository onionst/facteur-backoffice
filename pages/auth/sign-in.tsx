import Logo from "@/bases/logo";
import { Input } from "../../bases/input";
import Button from "@/bases/Button/Button";
import { useState } from "react";
import { Credentials } from "@/dtos/credentials.dto";
import { signInWithEmailAndPassword } from "@/services/auth.service";
import { notification } from "antd";
import { useRouter } from "next/router";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useModal } from "@/contexts/modal.context";

export default function SignIn(): JSX.Element {
  const router = useRouter();
  const modal = useModal();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<Credentials>({
    email: "",
    password: "",
  });

  const handleSignInWithCredentials = async (e: any) => {
    try {
      e?.preventDefault();
      const status = await signInWithEmailAndPassword(form);
      if (status === "2FA") {
        setForm({
          email: "",
          password: "",
        });
        modal.showTFAEmailSent();
        setLoading(false);
      } else {
        router.push("/app");
      }
      setLoading(true);
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
          description: "Invalid password or email",
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
            <h1>Sign in</h1>
            <p>Enter your email and password to continue</p>
          </div>
          <div className="ds-sign-in__left-g">
            <button>
              <span>
                <img src="/assets/icons/g-icon.png" width={18} height={18} />
                <span style={{ marginLeft: 12 }}>Continue with Google</span>
              </span>
            </button>
          </div>
          <div className="ds-sign-in__left-s">
            <div />
            <span>or</span>
            <div />
          </div>
          <form onSubmit={handleSignInWithCredentials}>
            <Input
              placeholder="username@organization.com"
              type="email"
              label="Email"
              value={form.email}
              onChange={(email) =>
                setForm((prev) => ({ ...prev, email: email.target.value }))
              }
              style={{ marginBottom: 16 }}
            />
            <Input
              value={form.password}
              onChange={(password) =>
                setForm((prev) => ({
                  ...prev,
                  password: password.target.value,
                }))
              }
              placeholder="********"
              type="password"
              label="Password"
            />
            <div className="ds-forget">
              <u>
                <span onClick={() => router.push("/auth/restore")}>
                  I forgot my password
                </span>
              </u>
            </div>
            <Button
              disabled={Object.values(form).includes("")}
              loading={loading}
              theme="CTA"
              style={{ marginTop: 32 }}
            >
              Sign in <ArrowRightOutlined />
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
