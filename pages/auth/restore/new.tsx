import Logo from "@/bases/logo";
import Button from "@/bases/Button/Button";
import { useEffect, useState } from "react";
import { restorePassword } from "@/services/auth.service";
import { notification } from "antd";
import { useRouter } from "next/router";
import { Input } from "@/bases/input";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Condition from "@/bases/Condition/Condition";

export default function CreateNewPassword(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<{
    newPassword: string;
    confirmPassword: string;
  }>({
    newPassword: "",
    confirmPassword: "",
  });
  const [conditions, setConditions] = useState<{
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    length: boolean;
  }>({
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    length: false,
  });

  useEffect(() => {
    const password = form.newPassword;

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const isLongEnough = password?.length >= 10;
    setConditions({
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      number: hasNumber,
      special: hasSpecialChar,
      length: isLongEnough,
    });
  }, [form.newPassword]);

  const handleSignInWithCredentials = async (e: any) => {
    try {
      e?.preventDefault();
      setLoading(true);
      const token: any = router?.query?.t;
      restorePassword(token, form.newPassword);
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
            <h1>Reset password</h1>
            <p>Please enter your new password to access your account</p>
          </div>

          <form
            style={{ marginTop: 32 }}
            onSubmit={handleSignInWithCredentials}
          >
            <Input
              placeholder="********"
              type="password"
              label="New password"
              value={form.newPassword}
              onChange={(password) =>
                setForm((prev) => ({
                  ...prev,
                  newPassword: password.target.value,
                }))
              }
              style={{ marginBottom: 16 }}
            />
            <Input
              placeholder="********"
              type="password"
              label="Confirm new password"
              value={form.confirmPassword}
              onChange={(password) =>
                setForm((prev) => ({
                  ...prev,
                  confirmPassword: password.target.value,
                }))
              }
              style={{ marginBottom: 16 }}
            />
            <div>
              <Condition
                style={{ marginBottom: 4 }}
                state={conditions.uppercase ? "OK" : "PENDING"}
              >
                One uppercase character
              </Condition>
              <Condition
                style={{ marginBottom: 4 }}
                state={conditions.lowercase ? "OK" : "PENDING"}
              >
                One lowercase character
              </Condition>
              <Condition
                style={{ marginBottom: 4 }}
                state={conditions.number ? "OK" : "PENDING"}
              >
                One number
              </Condition>
              <Condition
                style={{ marginBottom: 4 }}
                state={conditions.special ? "OK" : "PENDING"}
              >
                One special character{" "}
                <label style={{ color: "#78829d" }}>e.g: {".$?#![](){}"}</label>
              </Condition>
              <Condition
                style={{ marginBottom: 4 }}
                state={conditions.length ? "OK" : "PENDING"}
              >
                10 character minimum
              </Condition>
              <Condition
                state={
                  form.newPassword != "" &&
                  form.confirmPassword === form.newPassword
                    ? "OK"
                    : "PENDING"
                }
              >
                Both passwords matches
              </Condition>
            </div>
            <Button
              disabled={
                Object.values(conditions).includes(false) ||
                form.newPassword === "" ||
                form.confirmPassword != form.newPassword
              }
              loading={loading}
              theme="CTA"
              style={{ marginTop: 32 }}
            >
              Reset password
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
