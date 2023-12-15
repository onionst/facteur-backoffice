import Button from "@/bases/Button/Button";
import s from "./Navbar.module.scss";
import { Plus, User } from "react-feather";

export type NavbarProps = {};

export default function Navbar(props: NavbarProps) {
  return (
    <nav className={s["ds-navbar"]}>
      <section></section>
      {/* <section className={s["ds-navbar__right"]}>
        <span>Hello, Pablo</span>
        <button className="">
          <User color="#252f4a" size={18} />
        </button>
      </section> */}
      <Button theme="SECONDARY">
        <span>
          Create article <Plus size={14} />
        </span>
      </Button>
    </nav>
  );
}
