import Button from "@/bases/Button/Button";
import s from "./Navbar.module.scss";
import { Plus } from "react-feather";
import { Input } from "@/bases/input";

export type NavbarProps = {};

export default function Navbar(props: NavbarProps) {
  return (
    <nav className={s["ds-navbar"]}>
      <section className={s["ds-navbar__left"]}>
        <Input placeholder="Search in the EE24 dataset..." />
      </section>
      <section className={s["ds-navbar__right"]}>
        <Button theme="SECONDARY">
          <span>
            Create article <Plus size={14} />
          </span>
        </Button>
      </section>
    </nav>
  );
}
