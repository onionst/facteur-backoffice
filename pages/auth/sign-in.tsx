import Logo from "@/bases/logo";
import { Input } from "../../bases/input";
import Button from "@/bases/Button/Button";
import { FormEvent, useEffect, useState } from "react";
import { Credentials } from "@/dtos/credentials.dto";
import { useRouter } from "next/router";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/auth.context";
import { useModal } from "@/contexts/modal.context";

export default function SignIn(): JSX.Element {
  const router = useRouter();
  const modals = useModal();
  const { signInWithEmailAndPassword } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<Credentials>({
    email: "",
    password: "",
  });
  const { showTFAEmailSent } = modals.auth;

  useEffect(() => {
    if (router.query?.tfa === "pending") {
      showTFAEmailSent();
    }
  }, [router.query]);

  const handleSignInWithCredentials = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      await signInWithEmailAndPassword(form);
      setForm({
        email: "",
        password: "",
      });
      setLoading(false);
    } catch (err: any) {
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
              <Logo size="M" />
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
              required
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
              required
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
